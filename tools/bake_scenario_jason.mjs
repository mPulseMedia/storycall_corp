import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SCENARIOS_PATH = path.join(ROOT, "scenarios.html");

function decodeEntities(s){
  return (s || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#8203;/g, "")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#8230;/g, "…");
}

function stripTagsPreserveParagraphs(html){
  let s = html || "";
  // Normalize common block separators to paragraph breaks.
  s = s.replace(/<\s*br\s*\/?>/gi, "\n");
  s = s.replace(/<\/\s*p\s*>\s*<\s*p\s*>/gi, "\n\n");
  s = s.replace(/<\/\s*div\s*>\s*<\s*div\b/gi, "\n\n<div");
  // Drop all tags.
  s = s.replace(/<[^>]*>/g, "");
  s = decodeEntities(s);
  // Collapse whitespace but keep paragraph breaks.
  s = s.replace(/[ \t\r]+/g, " ");
  s = s.replace(/\n[ \t]+/g, "\n");
  s = s.replace(/[ \t]+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  return s.trim();
}

function parseClockToSeconds(text){
  const t = (text || "").trim();
  const m = t.match(/^(\d+):(\d\d)$/);
  if (!m) return null;
  return (parseInt(m[1], 10) * 60) + parseInt(m[2], 10);
}

function parseStyleProp(style, prop){
  const re = new RegExp(`${prop}\\s*:\\s*([^;]+)`, "i");
  const m = (style || "").match(re);
  return m ? m[1].trim() : null;
}

function parseGridRowStart(style){
  const v = parseStyleProp(style, "grid-row");
  if (!v) return null;
  // Accept: "7" or "7 / 9"
  const m = v.match(/^(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function parseGridRowRange(style){
  const v = parseStyleProp(style, "grid-row");
  if (!v) return null;
  const m = v.match(/^(\d+)\s*\/\s*(\d+)/);
  if (!m) return null;
  return { r1: parseInt(m[1], 10), r2: parseInt(m[2], 10) };
}

function hasClass(attr, cls){
  const s = (attr || "");
  const m = s.match(/class\s*=\s*"([^"]*)"/i);
  if (!m) return false;
  const classes = m[1].split(/\s+/g).filter(Boolean);
  return classes.includes(cls);
}

function readClassList(attr){
  const m = (attr || "").match(/class\s*=\s*"([^"]*)"/i);
  if (!m) return [];
  return m[1].split(/\s+/g).filter(Boolean);
}

function readAttr(attr, name){
  const re = new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i");
  const m = (attr || "").match(re);
  return m ? m[1] : "";
}

function matchAllBlocks(html, re){
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null){
    out.push(m);
  }
  return out;
}

function extractNestedBlocks(html, openNeedle, tagName){
  const blocks = [];
  let i = 0;
  const openRe = new RegExp(`<${tagName}\\b`, "ig");
  const closeRe = new RegExp(`</${tagName}\\b`, "ig");

  while (i < html.length){
    const start = html.indexOf(openNeedle, i);
    if (start === -1) break;

    // Find the actual "<tag" start for this block.
    const tagStart = html.lastIndexOf(`<${tagName}`, start);
    const realStart = tagStart !== -1 ? tagStart : start;

    let depth = 0;
    let cursor = realStart;
    while (cursor < html.length){
      openRe.lastIndex = cursor;
      closeRe.lastIndex = cursor;
      const mo = openRe.exec(html);
      const mc = closeRe.exec(html);
      const next = (!mc || (mo && mo.index < mc.index)) ? mo : mc;
      if (!next) break;

      cursor = next.index;
      const isClose = html.startsWith(`</${tagName}`, cursor);
      if (!isClose) depth += 1;
      else depth -= 1;

      const tagEnd = html.indexOf(">", cursor);
      if (tagEnd === -1) break;
      cursor = tagEnd + 1;

      if (depth === 0){
        const block = html.slice(realStart, cursor);
        blocks.push(block);
        i = cursor;
        break;
      }
    }
    if (depth !== 0){
      // Give up on this occurrence to avoid infinite loops.
      i = start + openNeedle.length;
    }
  }
  return blocks;
}

function splitGroups(html){
  return extractNestedBlocks(html, '<section class="group"', "section");
}

function readGroupMeta(groupHtml){
  const titleM = groupHtml.match(/<h2[^>]*class="group_title"[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/i);
  const precursorM = groupHtml.match(/<p[^>]*class="group_precursor"[^>]*>([\s\S]*?)<\/p>/i);
  return {
    group_id: titleM ? titleM[1].trim() : "",
    group_title: titleM ? stripTagsPreserveParagraphs(titleM[2]) : "",
    precursor_group: precursorM ? stripTagsPreserveParagraphs(precursorM[1]) : "",
  };
}

function splitScenarios(groupHtml){
  return extractNestedBlocks(groupHtml, '<section class="scenario"', "section");
}

function readScenarioMeta(scenarioHtml, groupMeta){
  const h3 = scenarioHtml.match(/<h3[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h3>/i);
  const precursorM = scenarioHtml.match(/<p[^>]*class="scenario_precursor"[^>]*>([\s\S]*?)<\/p>/i);

  // Title: remove nav arrows/buttons ("↑", "↓", and "jason" text).
  let title = h3 ? stripTagsPreserveParagraphs(h3[2]) : "";
  title = title
    .replace(/\s*[↓↑]\s*/g, " ")
    .replace(/\s*jason\s*/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    scenario_id: h3 ? h3[1].trim() : "",
    title,
    precursor_group: groupMeta.precursor_group || "",
    precursor: precursorM ? stripTagsPreserveParagraphs(precursorM[1]) : "",
  };
}

function extractDiagramHtml(scenarioHtml){
  const blocks = extractNestedBlocks(scenarioHtml, '<div class="grid7_diagram"', "div");
  if (!blocks.length) return "";
  // Return the inner HTML of the diagram div (strip outer tag).
  const full = blocks[0];
  const openEnd = full.indexOf(">");
  const closeStart = full.lastIndexOf("</div");
  if (openEnd === -1 || closeStart === -1 || closeStart <= openEnd) return "";
  return full.slice(openEnd + 1, closeStart);
}

function extractStepsFromDiagram(diagramHtml, meta){
  // Build flat utterance steps in DOCUMENT ORDER, keyed by each visible ID cell.
  // This avoids relying on CSS positioning (e.g. 2.B uses class-based grid placement).
  const idCells = matchAllBlocks(
    diagramHtml,
    /<div\s+([^>]*class="[^"]*\bgrid7_id\b[^"]*"[^>]*)>([\s\S]*?)<\/div>/gi
  ).map((m) => {
    const id = parseInt(stripTagsPreserveParagraphs(m[2]), 10);
    if (!Number.isFinite(id)) return null;
    return { id, index: m.index, openAttrs: m[1], closeIndex: m.index + m[0].length };
  }).filter(Boolean);

  const idMeta = new Map(); // id -> meta (speaker/channel/format + indices)
  let items = [];

  function findNextMessageBlock(diagram, fromIdx, toIdx){
    const region = diagram.slice(fromIdx, toIdx);
    const needles = [
      '<div class="grid7_phone_msg',
      '<div class="grid7_block',
      '<div class="grid7_sms_block',
    ];
    let best = null;
    for (const needle of needles){
      const j = region.indexOf(needle);
      if (j === -1) continue;
      const abs = fromIdx + j;
      if (best == null || abs < best) best = abs;
    }
    if (best == null) return null;
    const blocks = extractNestedBlocks(diagram, diagram.slice(best, best + 30), "div");
    // `extractNestedBlocks` needs an openNeedle; use the exact substring starting at the tag.
    // But that substring includes attributes, so we re-run with a shorter stable prefix.
    const openNeedle = diagram.slice(best, best + 20); // "<div class="grid7_"
    const b2 = extractNestedBlocks(diagram.slice(best), openNeedle, "div");
    if (!b2.length) return null;
    const full = b2[0];
    const openEnd = full.indexOf(">");
    const closeStart = full.lastIndexOf("</div");
    if (openEnd === -1 || closeStart === -1 || closeStart <= openEnd) return null;
    const openTag = full.slice(0, openEnd + 1);
    const attrs = openTag.replace(/^<div\s*/i, "").replace(/>$/i, "");
    const inner = full.slice(openEnd + 1, closeStart);
    const absStart = best;
    const absEnd = best + full.length;
    return { attrs, inner, absStart, absEnd };
  }

  for (let i = 0; i < idCells.length; i++){
    const { id, closeIndex } = idCells[i];
    const nextIdStart = (i + 1 < idCells.length) ? idCells[i + 1].index : diagramHtml.length;

    const msg = findNextMessageBlock(diagramHtml, closeIndex, nextIdStart);
    if (!msg) continue;

    const cls = readClassList(msg.attrs);
    const isPhone = cls.includes("grid7_phone_msg") || cls.includes("channel_phone");
    const channel = isPhone ? "telephone" : "sms";
    const isError = cls.includes("grid7_error");
    const format = cls.includes("format_voice") ? "voice" : "text";

    let speaker = "storycall";
    const isSmsRelayFromGrandma = (!isPhone && cls.includes("participant_grandma"));
    if (channel === "telephone"){
      if (cls.includes("participant_grandma")) speaker = "grandma";
      else if (cls.includes("participant_kid")) speaker = "kid";
      else speaker = "storycall";
    }else{
      if (cls.includes("participant_kid")) speaker = "kid";
      else speaker = "storycall";
    }

    let text = "";
    let duration_s = null;
    if (format === "voice"){
      const tr = msg.inner.match(/<div[^>]*class="[^"]*\bgrid7_audio_transcript\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (tr) text = stripTagsPreserveParagraphs(tr[1]);
      else text = stripTagsPreserveParagraphs(msg.inner);

      const dur = msg.inner.match(/<div[^>]*class="[^"]*\bgrid7_audio_duration\b[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      duration_s = dur ? parseClockToSeconds(stripTagsPreserveParagraphs(dur[1])) : null;
    }else{
      text = stripTagsPreserveParagraphs(msg.inner);
    }

    const step = {
      id,
      channel,
      speaker,
      format,
      ...(duration_s != null ? { duration_s } : {}),
      text,
    };

    if (isError){
      const compact = (text || "").replace(/\s+/g, " ").trim();
      let msgText = "user error";
      if (channel === "sms" && speaker === "kid" && format === "text" && compact){
        const needsQuotes = !/^[a-z0-9_-]+$/i.test(compact);
        msgText = "kid texts " + (needsQuotes ? JSON.stringify(compact) : compact);
      }
      let category = "user_error";
      if (meta.scenario_id === "1B") category = "incorrect_keyword";
      if (meta.scenario_id === "1C") category = "phone_number_sent_as_text";
      step.mistakes = [{ kind: category, message: msgText }];
    }

    items.push(step);
    idMeta.set(id, {
      index: idCells[i].index,
      msg_index: msg.absStart,
      channel,
      speaker,
      format,
      is_sms_relay_from_grandma: isSmsRelayFromGrandma,
    });
  }

  // Items are already in document order, but keep stable ascending ID for consistency with page JS.
  items.sort((a, b) => a.id - b.id);

  // Derived-from semantics.
  const grandmaTelephoneIds = items
    .filter((it) => it.channel === "telephone" && it.speaker === "grandma")
    .map((it) => it.id);

  function latestBefore(list, id){
    let best = null;
    for (const v of list){
      if (v < id) best = v;
      else break;
    }
    return best;
  }

  for (const it of items){
    const m = idMeta.get(it.id);
    if (!m) continue;
    if (it.channel !== "sms") continue;
    if (!m.is_sms_relay_from_grandma) continue;

    const src = latestBefore(grandmaTelephoneIds, it.id);
    if (!src) continue;

    if (it.format === "voice"){
      it.derived_from = { utterance_id: src, kind: "relay", via: "sms_audio_relay" };
    }else{
      it.derived_from = { utterance_id: src, kind: "transcript", via: "sms_text_transcript" };
    }
  }

  // Telephone call wrappers (per phone background block).
  const phoneBlocks = matchAllBlocks(
    diagramHtml,
    /<div\s+([^>]*class="[^"]*\bgrid7_(?:phone_bg|phone_block)\b[^"]*"[^>]*)>/gi
  ).map((m) => ({ index: m.index })).sort((a, b) => a.index - b.index);

  const kidSmsVoiceIds = items
    .filter((it) => it.channel === "sms" && it.speaker === "kid" && it.format === "voice")
    .map((it) => it.id);

  for (let callIdx = 0; callIdx < phoneBlocks.length; callIdx++){
    const b = phoneBlocks[callIdx];
    const callIndex = callIdx + 1;

    const segStart = b.index;
    const segEnd = (callIdx + 1 < phoneBlocks.length) ? phoneBlocks[callIdx + 1].index : diagramHtml.length;
    const telIds = items
      .filter((it) => it.channel === "telephone")
      .filter((it) => {
        const m = idMeta.get(it.id);
        return m && Number.isFinite(m.index) && m.index > segStart && m.index < segEnd;
      })
      .map((it) => it.id)
      .sort((a, b) => a - b);

    if (telIds.length < 3) continue;
    const a = telIds[0], c = telIds[1], d = telIds[2];
    const ia = items.find((x) => x.id === a);
    const ic = items.find((x) => x.id === c);
    const id = items.find((x) => x.id === d);
    if (!ia || !ic || !id) continue;

    const isWrapper =
      ia.speaker === "storycall" && ia.format === "voice" &&
      ic.speaker === "kid"      && ic.format === "voice" &&
      id.speaker === "storycall" && id.format === "voice";
    if (!isWrapper) continue;

    const srcKid = latestBefore(kidSmsVoiceIds, a);
    const parts = [ia, ic, id].map((it) => ({
      id      : it.id,
      format  : it.format,
      speaker : it.speaker,
      ...(it.duration_s != null ? { duration_s: it.duration_s } : {}),
      ...(it.derived_from ? { derived_from: it.derived_from } : {}),
      text    : it.text,
    }));

    if (srcKid){
      const kidPart = parts.find((p) => p.speaker === "kid");
      if (kidPart){
        kidPart.derived_from = { utterance_id: srcKid, kind: "relay", via: "telephone_playback" };
      }
    }

    const call_step = {
      channel             : "telephone",
      from                : "storycall",
      to                  : "grandma",
      speaker             : "storycall",
      telephone_call_index: callIndex,
      utterance_ids       : [a, c, d],
      parts,
    };

    const idx = items.findIndex((it) => it.id === a);
    if (idx === -1) continue;
    items = items.filter((it) => !([a, c, d].includes(it.id) && it.channel === "telephone"));
    items.splice(idx, 0, call_step);
  }

  // Time markers.
  const idOrder = Array.from(idMeta.entries())
    .map(([id, m]) => ({ id, index: m.index }))
    .filter((x) => Number.isFinite(x.index))
    .sort((a, b) => a.index - b.index);

  function nearestUtterancesAroundIndex(idx){
    let prev = null;
    let next = null;
    for (const it of idOrder){
      if (it.index < idx) prev = it.id;
      else if (it.index > idx){
        next = it.id;
        break;
      }
    }
    return { after_utterance_id: prev, before_utterance_id: next };
  }

  function parseTimePassSeconds(label){
    const t = (label || "").trim().toLowerCase();
    let m = t.match(/^(\d+)\s*hour(s)?\s*later$/);
    if (m) return parseInt(m[1], 10) * 3600;
    m = t.match(/^(\d+)\s*minute(s)?\s*later$/);
    if (m) return parseInt(m[1], 10) * 60;
    m = t.match(/^(\d+)\s*second(s)?\s*later$/);
    if (m) return parseInt(m[1], 10);
    return null;
  }

  const timeMarkers = [];
  for (const m of matchAllBlocks(
    diagramHtml,
    /<div\s+([^>]*class="[^"]*\bgrid7_notice\b[^"]*"[^>]*)>([\s\S]*?)<\/div>/gi
  )){
    const around = nearestUtterancesAroundIndex(m.index);
    const label = stripTagsPreserveParagraphs(m[2]).replace(/\s+/g, " ").trim();
    const seconds = parseTimePassSeconds(label);

    if (meta.scenario_id === "2B" && label.toLowerCase().includes("hour later")){
      around.after_utterance_id = 5;
      around.before_utterance_id = 6;
    }
    if (meta.scenario_id === "2D" && label.toLowerCase().includes("hour later")){
      around.after_utterance_id = 2;
      around.before_utterance_id = 3;
    }

    timeMarkers.push({
      type                 : "time_passes",
      label,
      ...(seconds != null ? { seconds } : {}),
      ...around,
    });
  }

  function findStepIndexContainingUtteranceId(utterance_id){
    for (let i = 0; i < items.length; i++){
      const it = items[i];
      if (!it || typeof it !== "object") continue;
      if (it.id === utterance_id) return i;
      if (Array.isArray(it.utterance_ids) && it.utterance_ids.includes(utterance_id)) return i;
    }
    return -1;
  }

  timeMarkers.sort((a, b) => (b.after_utterance_id ?? -Infinity) - (a.after_utterance_id ?? -Infinity));
  for (const tm of timeMarkers){
    if (tm.after_utterance_id == null) continue;
    const idx = findStepIndexContainingUtteranceId(tm.after_utterance_id);
    if (idx === -1) continue;
    items.splice(idx + 1, 0, tm);
  }

  return items;
}

function buildScenarioObjectFromHtml(diagramHtml, meta){
  const steps = extractStepsFromDiagram(diagramHtml, meta);
  return {
    schema_version : "storycall_scenario_jason_v1",
    scenario_id    : meta.scenario_id,
    title          : meta.title,
    precursor_group: meta.precursor_group || "",
    precursor      : meta.precursor || "",
    participants   : ["kid", "storycall", "grandma"],
    steps,
  };
}

function main(){
  const html = fs.readFileSync(SCENARIOS_PATH, "utf8");
  const groups = splitGroups(html);

  const out = [];
  for (const groupHtml of groups){
    const groupMeta = readGroupMeta(groupHtml);
    const scenarios = splitScenarios(groupHtml);
    for (const scenarioHtml of scenarios){
      const meta = readScenarioMeta(scenarioHtml, groupMeta);
      const diagramHtml = extractDiagramHtml(scenarioHtml);
      if (!meta.scenario_id || !diagramHtml) continue;
      const obj = buildScenarioObjectFromHtml(diagramHtml, meta);
      out.push({ scenario_id: meta.scenario_id, obj });
    }
  }

  // Output as a simple JSON map for easy patching.
  const map = {};
  for (const it of out){
    map[it.scenario_id] = it.obj;
  }
  process.stdout.write(JSON.stringify(map, null, 2) + "\n");
}

main();

