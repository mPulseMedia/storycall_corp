{
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

(function(){
  // Naming convention migration:
  // Add aliases for existing `grid7_*` classes so CSS/JS can migrate away from
  // the `grid7_` prefix without breaking legacy markup.
  //
  // - `grid7_`   → `grid_`    (remove the "7")
  // - `grid7_`   → `diagram_` (preferred semantic name)
  function aliasPrefixedClasses(fromPrefix, toPrefix){
    const els = Array.from(document.querySelectorAll(`[class*="${fromPrefix}"]`));
    for (const el of els){
      for (const cls of Array.from(el.classList)){
        if (!cls.startsWith(fromPrefix)) continue;
        el.classList.add(toPrefix + cls.slice(fromPrefix.length));
      }
    }
  }
  aliasPrefixedClasses("grid7_", "grid_");
  aliasPrefixedClasses("grid7_", "diagram_");

  function parseClockToSeconds(s){
    const t = (s || "").trim();
    const m = t.match(/^(\d+):(\d{2})$/);
    if (!m) return null;
    return (parseInt(m[1], 10) * 60) + parseInt(m[2], 10);
  }

  function readTextWithParagraphs(el){
    // Preserve paragraph boundaries where possible.
    const ps = Array.from(el.querySelectorAll("p"));
    if (ps.length){
      return ps.map((p) => (p.textContent || "").trim()).filter(Boolean).join("\n\n");
    }
    return (el.textContent || "").trim();
  }

  function stringifyJasonAligned(value, indent){
    // Align `:` to ONE absolute column for the entire JSON block
    // (same `:` position on every line, regardless of nesting).
    const indentUnit = "  ";
    const pad = (n) => indentUnit.repeat(n);
    const start = Number.isFinite(indent) ? indent : 0;

    const indentUnitLen = indentUnit.length;
    let maxColonCol = 0;
    function noteKey(level, key){
      const keyJsonLen = JSON.stringify(key).length;
      // Keys render at indentation `level + 1`.
      const colonCol = ((level + 1) * indentUnitLen) + keyJsonLen;
      maxColonCol = Math.max(maxColonCol, colonCol);
    }
    function scan(v, level){
      if (v === null || typeof v !== "object") return;
      if (Array.isArray(v)){
        for (const item of v) scan(item, level);
        return;
      }
      for (const k of Object.keys(v)){
        noteKey(level, k);
        scan(v[k], level + 1);
      }
    }
    scan(value, start);
    const COLON_GUTTER = 2; // move `:` slightly right for readability
    const targetColonCol = maxColonCol + COLON_GUTTER;

    function str(v, level){
      if (v === null) return "null";
      if (typeof v !== "object") return JSON.stringify(v);

      if (Array.isArray(v)){
        if (!v.length) return "[]";
        const items = v.map((item) => pad(level + 1) + str(item, level + 1));
        return "[\n" + items.join(",\n") + "\n" + pad(level) + "]";
      }

      const keys = Object.keys(v);
      if (!keys.length) return "{}";
      const lines = keys.map((k) => {
        const keyJson = JSON.stringify(k);
        const colonCol = ((level + 1) * indentUnitLen) + keyJson.length;
        const spaces = " ".repeat(Math.max(0, targetColonCol - colonCol));
        return pad(level + 1) + keyJson + spaces + ": " + str(v[k], level + 1);
      });
      return "{\n" + lines.join(",\n") + "\n" + pad(level) + "}";
    }

    return str(value, start);
  }

  function buildScenarioJasonFromDiagram(diagram, meta){
    const stamps = Array.from(diagram.querySelectorAll(".grid7_timestamp[data-id]"));
    let items = [];
    const idMeta = new Map();
    for (const ts of stamps){
      const idRaw = (ts.getAttribute("data-id") || "").trim();
      const id = parseInt(idRaw, 10);
      if (!Number.isFinite(id)) continue;

      const row = parseInt(getComputedStyle(ts).gridRowStart, 10);
      if (!Number.isFinite(row)) continue;

      const phoneMsg = Array.from(diagram.querySelectorAll(".grid7_phone_msg.channel_phone"))
        .find((el) => parseInt(getComputedStyle(el).gridRowStart, 10) === row);
      const smsMsg = Array.from(diagram.querySelectorAll(
        ".grid7_block.channel_sms, .grid7_sms_block.channel_sms"
      )).find((el) => parseInt(getComputedStyle(el).gridRowStart, 10) === row);

      const el = phoneMsg || smsMsg;
      if (!el) continue;
      const isError = el.classList.contains("grid7_error");

      const channel = phoneMsg ? "telephone" : "sms";
      const format = el.classList.contains("format_voice") ? "voice" : "text";

      // Speaker attribution:
      // - Telephone: speaker is the participant.
      // - SMS: kid is kid; everything else is StoryCall (even if the content is a relay).
      let speaker = "storycall";
      const isSmsRelayFromGrandma = (!phoneMsg && el.classList.contains("participant_grandma"));
      if (channel === "telephone"){
        if (el.classList.contains("participant_grandma")) speaker = "grandma";
        else if (el.classList.contains("participant_kid")) speaker = "kid";
        else speaker = "storycall";
      }else{
        if (el.classList.contains("participant_kid")) speaker = "kid";
        else speaker = "storycall";
      }

      let text = "";
      let duration_s = null;
      if (format === "voice"){
        const tr = el.querySelector(".grid7_audio_transcript");
        text = tr ? (tr.textContent || "").trim() : readTextWithParagraphs(el);
        const durEl = el.querySelector(".grid7_audio_duration");
        duration_s = durEl ? parseClockToSeconds(durEl.textContent || "") : null;
      }else{
        text = readTextWithParagraphs(el);
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
        let msg = "user error";
        if (channel === "sms" && speaker === "kid" && format === "text" && compact){
          const needsQuotes = !/^[a-z0-9_-]+$/i.test(compact);
          msg = "kid texts " + (needsQuotes ? JSON.stringify(compact) : compact);
        }
        let category = "user_error";
        if (meta.scenario_id === "1B") category = "incorrect_keyword";
        if (meta.scenario_id === "1C") category = "phone_number_sent_as_text";
        step.mistakes = [{ kind: category, message: msg }];
      }
      items.push(step);

      idMeta.set(id, {
        row,
        channel,
        speaker,
        format,
        is_sms_relay_from_grandma: isSmsRelayFromGrandma,
      });
    }

    items.sort((a, b) => a.id - b.id);

    // Derived-from semantics (for app consumption):
    // - SMS relay bubbles (orange) are derived from the most recent Grandma telephone utterance.
    // - Telephone kid playback is derived from the most recent kid SMS voice utterance before the call.
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

    // Telephone call wrappers (StoryCall voice → kid playback → StoryCall voice).
    // Build wrappers per phone background block to correctly handle scenarios like 2.B (two calls).
    const phoneBlocks = Array.from(diagram.querySelectorAll(".grid7_phone_bg, .grid7_phone_block"));
    const blocks = [];
    for (const pb of phoneBlocks){
      const cs = getComputedStyle(pb);
      const c1 = parseInt(cs.gridColumnStart, 10);
      const c2 = parseInt(cs.gridColumnEnd, 10);
      const r1 = parseInt(cs.gridRowStart, 10);
      const r2 = parseInt(cs.gridRowEnd, 10);
      if (!Number.isFinite(r1) || !Number.isFinite(r2) || !Number.isFinite(c1) || !Number.isFinite(c2)) continue;
      blocks.push({ r1, r2, c1, c2 });
    }
    blocks.sort((a, b) => (a.r1 - b.r1) || (a.c1 - b.c1));

    // For linking kid playback to its source recording.
    const kidSmsVoiceIds = items
      .filter((it) => it.channel === "sms" && it.speaker === "kid" && it.format === "voice")
      .map((it) => it.id);

    for (let callIdx = 0; callIdx < blocks.length; callIdx++){
      const b = blocks[callIdx];
      const callIndex = callIdx + 1;

      // Find telephone step IDs that fall within this phone block by grid row.
      const telIds = items
        .filter((it) => it.channel === "telephone")
        .filter((it) => {
          const m = idMeta.get(it.id);
          return m && Number.isFinite(m.row) && m.row >= b.r1 && m.row < b.r2;
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

      // Attach derived-from to the kid playback part (telephone relay of the kid's SMS audio).
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

      // Remove the three utterances and insert the wrapper at the first one's position.
      const idx = items.findIndex((it) => it.id === a);
      if (idx === -1) continue;
      items = items.filter((it) => !([a, c, d].includes(it.id) && it.channel === "telephone"));
      items.splice(idx, 0, call_step);
    }

    // Timeline markers (for apps scanning this page).
    //
    // Represent time passing as an inline step inserted between utterances,
    // so apps don't have to look for a separate `events[]` list.
    const idRows = Array.from(idMeta.entries())
      .map(([id, m]) => ({ id, row: m.row }))
      .filter((x) => Number.isFinite(x.row))
      .sort((a, b) => a.row - b.row);

    function nearestUtterancesAroundRow(row){
      let prev = null;
      let next = null;
      for (const it of idRows){
        if (it.row < row) prev = it.id;
        else if (it.row > row){
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
    for (const el of Array.from(diagram.querySelectorAll(".grid7_notice"))){
      const row = parseInt(getComputedStyle(el).gridRowStart, 10);
      if (!Number.isFinite(row)) continue;

      const around = nearestUtterancesAroundRow(row);
      const label = (el.textContent || "").replace(/\s+/g, " ").trim();

      const seconds = parseTimePassSeconds(label);

      // Special-case: 2.B wants the "1 hour later" marker between 5 and 6.
      if (meta.scenario_id === "2B" && label.toLowerCase().includes("hour later")){
        around.after_utterance_id = 5;
        around.before_utterance_id = 6;
      }

      // Special-case: 2.D expects the "1 hour later" marker between 2 and 3.
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

    // Insert time markers into `steps[]` after the relevant utterance.
    // Insert later markers first so indices don't shift under us.
    timeMarkers.sort((a, b) => (b.after_utterance_id ?? -Infinity) - (a.after_utterance_id ?? -Infinity));
    for (const m of timeMarkers){
      if (m.after_utterance_id == null) continue;
      const idx = findStepIndexContainingUtteranceId(m.after_utterance_id);
      if (idx === -1) continue;
      items.splice(idx + 1, 0, m);
    }

    return {
      schema_version : "storycall_scenario_jason_v1",
      scenario_id    : meta.scenario_id,
      title          : meta.title,
      precursor_group: meta.precursor_group || "",
      precursor      : meta.precursor || "",
      participants   : ["kid", "storycall", "grandma"],
      steps          : items,
    };
  }

  function ensureScenarioJasonBlock(scenarioEl){
    const h3 = scenarioEl.querySelector("h3[id]");
    const diagram =
      scenarioEl.querySelector(".scenario_diagram") ||
      scenarioEl.querySelector(".grid7_diagram");
    if (!h3 || !diagram) return null;

    let block = scenarioEl.querySelector(`.scenario_jason_inline[data-scenario_id="${h3.id}"]`);
    if (!block){
      block = document.createElement("div");
      block.className = "scenario_jason_inline is_closed";
      block.setAttribute("data-scenario_id", h3.id);
      const payload = document.createElement("script");
      payload.type = "application/json";
      payload.className = "scenario_jason_payload";
      payload.setAttribute("data-scenario_id", h3.id);

      const pre = document.createElement("pre");
      pre.setAttribute("aria-label", `Jason (JSON) description of scenario ${h3.id}`);
      const code = document.createElement("code");
      pre.appendChild(code);

      block.appendChild(payload);
      block.appendChild(pre);
      scenarioEl.insertBefore(block, diagram);
    }
    return block;
  }

  function readScenarioTitle(h3){
    // Use the visible prefix up to the first nav arrow/button (best-effort, stable enough for apps).
    const raw = (h3.textContent || "").replace(/\s+/g, " ").trim();
    return raw
      .replace(/\s*[↓↑]\s*/g, " ")
      .replace(/\s*(?:jason|json)\s*/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function readScenarioJasonSourceText(scenario_id){
    const el = document.getElementById(`storycall_scenario_jason_${scenario_id}`);
    return el ? (el.textContent || "").trim() : "";
  }

  function renderScenarioJasonForScenario(scenarioEl){
    const h3 = scenarioEl.querySelector("h3[id]");
    const diagram =
      scenarioEl.querySelector(".scenario_diagram") ||
      scenarioEl.querySelector(".grid7_diagram");
    if (!h3 || !diagram) return;

    const block = ensureScenarioJasonBlock(scenarioEl);
    if (!block) return;

    const code = block.querySelector("code");
    if (!code) return;
    const payload = block.querySelector("script.scenario_jason_payload");

    const precursorEl = scenarioEl.querySelector(".scenario_precursor");
    const groupEl = scenarioEl.closest("section.group");
    const groupPrecursorEl = groupEl ? groupEl.querySelector(".group_precursor") : null;

    const meta = {
      scenario_id : h3.id,
      title       : readScenarioTitle(h3),
      precursor_group: groupPrecursorEl ? (groupPrecursorEl.textContent || "").trim() : "",
      precursor   : precursorEl ? (precursorEl.textContent || "").trim() : "",
    };
    const raw = readScenarioJasonSourceText(h3.id);
    if (!raw){
      const missing = {
        schema_version : "storycall_scenario_jason_missing_v1",
        scenario_id    : meta.scenario_id,
        title          : meta.title,
        precursor_group: meta.precursor_group,
        precursor      : meta.precursor,
        message        : `missing from #storycall_scenario_jason_${h3.id}`,
      };
      code.textContent = stringifyJasonAligned(missing, 0);
      if (payload) payload.textContent = JSON.stringify(missing, null, 2);
      return;
    }

    // Show the exact pre-rendered JSON bytes from view-source.
    code.textContent = raw;
    if (payload) payload.textContent = raw;
  }

  function renderScenarioJasonForOpenScenarios(){
    const openBlocks = Array.from(document.querySelectorAll(".scenario_jason_inline.is_open"));
    for (const block of openBlocks){
      const scenario = block.closest("section.scenario");
      if (scenario) renderScenarioJasonForScenario(scenario);
    }
  }

  // Move grid7 “ID column” numbers into the timestamp for the same row, and hide the ID column via CSS.
  // This keeps diagram markup stable (no renumbering of grid-column inline styles) while changing how IDs are displayed.
  function migrateGrid7IdsIntoTimestamps(){
    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      const ids = Array.from(diagram.querySelectorAll(".grid7_id"));
      if (!ids.length) continue;

      function readGridRowStart(el){
        // Prefer inline authoring (`style="grid-row: X"`) because computed placement can be `auto`
        // when elements are visually hidden or the ID column is collapsed.
        const inlineStart = (el.style.getPropertyValue("grid-row-start") || "").trim();
        if (inlineStart) return inlineStart;

        const inlineRow = (el.style.getPropertyValue("grid-row") || "").trim();
        if (inlineRow) return inlineRow.split("/")[0].trim();

        const csRow = (getComputedStyle(el).gridRowStart || "").trim();
        if (csRow && csRow !== "auto") return csRow;

        return "";
      }

      // Map grid-row-start -> idText
      const rowToId = new Map();
      for (const idEl of ids){
        const idText = (idEl.textContent || "").trim();
        if (!idText) continue;
        const row = readGridRowStart(idEl);
        if (!row) continue;
        rowToId.set(row, idText);
      }

      const ts = Array.from(diagram.querySelectorAll(".grid7_timestamp"));

      // Some diagrams (notably 2.B2 phone rows) do not include a timestamp element on every
      // utterance row. Create a placeholder timestamp element for any row that has an ID
      // but no existing timestamp, so the ID can still be displayed via CSS `data-id`.
      const tsRows = new Set(ts.map((el) => readGridRowStart(el)).filter(Boolean));
      for (const [row] of rowToId.entries()){
        if (tsRows.has(row)) continue;
        const holder = document.createElement("div");
        holder.className = "grid7_timestamp";
        // Put it somewhere visible; the placement decorator will move it to the proper lane.
        holder.style.gridColumn = "2";
        holder.style.gridRow = row;
        diagram.appendChild(holder);
        ts.push(holder);
        tsRows.add(row);
      }

      for (const tsEl of ts){
        const row = readGridRowStart(tsEl);
        if (!row) continue;
        const idText = rowToId.get(row);
        if (!idText) continue;
        tsEl.setAttribute("data-id", idText);
        // We no longer show timestamps; the timestamp slot now renders only the ID via CSS.
        tsEl.textContent = "";
      }
    }
  }

  // Run once at startup (diagram markup is static).
  migrateGrid7IdsIntoTimestamps();
  // Run again after first layout pass to ensure SMS timestamps reliably get data-id.
  requestAnimationFrame(migrateGrid7IdsIntoTimestamps);
  // Render any open Jason blocks after IDs have been migrated.
  requestAnimationFrame(renderScenarioJasonForOpenScenarios);

  // Labeling: SMS label belongs to the whole white SMS canvas (not each SMS message).
  // Reserve space by pushing down only the FIRST SMS row in each diagram.
  function decorateGrid7SmsCanvasSpacing(){
    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      const smsBlocks = Array.from(
        diagram.querySelectorAll(".grid7_block.channel_sms, .grid7_sms_block.channel_sms")
      );
      if (!smsBlocks.length) continue;

      let minRow = Infinity;
      for (const el of smsBlocks){
        const r = parseInt(getComputedStyle(el).gridRowStart, 10);
        if (Number.isFinite(r)) minRow = Math.min(minRow, r);
      }
      if (!Number.isFinite(minRow) || minRow === Infinity) continue;

      // Push down the first-row ID labels too (so "SMS" is on its own row).
      const smsRowTimestamps = Array.from(diagram.querySelectorAll(".grid7_timestamp[data-id]"))
        .filter((ts) => {
          if (ts.classList.contains("grid7_phone_id")) return false;
          const r = parseInt(getComputedStyle(ts).gridRowStart, 10);
          return r === minRow;
        });

      for (const el of smsBlocks){
        const r = parseInt(getComputedStyle(el).gridRowStart, 10);
        const mt = (el.style.marginTop || "").trim();

        if (r === minRow){
          // Create a "label row" above the first message by increasing its top inset.
          el.style.marginTop = "calc(var(--scenario_block_inset) + var(--sms_block_label_row_h))";
        }else{
          // Normalize vertical spacing: rely on grid row-gap, not per-bubble extra top/bottom margins.
          // Keep intentional negative margins (used to merge stacks).
          if (!mt.startsWith("calc(-1")) el.style.marginTop = "0";
        }

        if ((el.style.marginBottom || "").trim()){
          el.style.marginBottom = "0";
        }
      }

      for (const ts of smsRowTimestamps){
        ts.style.marginTop = "calc(var(--scenario_block_inset) + var(--sms_block_label_row_h))";
      }

      // Normalize phone utterance vertical spacing inside the phone lane too.
      // (Skip 2.B2, which has bespoke placements.)
      if ((diagram.getAttribute("aria-label") || "") !== "2.B2 seven-column diagram"){
        const phoneMsgs = Array.from(diagram.querySelectorAll(".grid7_phone_msg.channel_phone"));
        if (phoneMsgs.length){
          let minPhoneRow = Infinity;
          for (const el of phoneMsgs){
            const r = parseInt(getComputedStyle(el).gridRowStart, 10);
            if (Number.isFinite(r)) minPhoneRow = Math.min(minPhoneRow, r);
          }

          for (const el of phoneMsgs){
            const r = parseInt(getComputedStyle(el).gridRowStart, 10);
            const mt = (el.style.marginTop || "").trim();

            if (mt.startsWith("calc(-1")) continue; // preserve merged stacks
            if (Number.isFinite(minPhoneRow) && r === minPhoneRow){
              // Keep a consistent top inset on the first phone row.
              el.style.marginTop = "var(--scenario_block_inset)";
            }else{
              el.style.marginTop = "0";
            }

            if ((el.style.marginBottom || "").trim()){
              el.style.marginBottom = "0";
            }
          }

          // Ensure a consistent bottom inset inside EACH phone background block:
          // keep a little breathing room below Grandma’s last utterance (the call "ends" after Grandma),
          // without extending the phone background into unrelated rows (e.g. SMS relay rows).
          const phoneBgs = Array.from(diagram.querySelectorAll(".grid7_phone_bg, .grid7_phone_block"));
          for (const bg of phoneBgs){
            const bgCs = getComputedStyle(bg);
            const c1 = parseInt(bgCs.gridColumnStart, 10);
            const c2 = parseInt(bgCs.gridColumnEnd, 10);
            const r1 = parseInt(bgCs.gridRowStart, 10);
            const r2 = parseInt(bgCs.gridRowEnd, 10);
            if (!Number.isFinite(c1) || !Number.isFinite(c2) || !Number.isFinite(r1) || !Number.isFinite(r2)) continue;

            let lastGrandma = null;
            let lastAny     = null;
            let lastGrandmaRow = -Infinity;
            let lastAnyRow     = -Infinity;

            for (const msg of phoneMsgs){
              const cs = getComputedStyle(msg);
              const c = parseInt(cs.gridColumnStart, 10);
              const r = parseInt(cs.gridRowStart, 10);
              if (!Number.isFinite(c) || !Number.isFinite(r)) continue;
              if (c < c1 || c >= c2) continue;
              if (r < r1 || r >= r2) continue;

              if (r >= lastAnyRow){
                lastAnyRow = r;
                lastAny    = msg;
              }
              if (msg.classList.contains("participant_grandma") && r >= lastGrandmaRow){
                lastGrandmaRow = r;
                lastGrandma    = msg;
              }
            }

            const target = lastGrandma || lastAny;
            if (target) target.style.marginBottom = "var(--scenario_block_inset)";
          }
        }
      }
    }
  }
  decorateGrid7SmsCanvasSpacing();

  // Normalize the SMS canvas height so the bottom padding is consistent across scenarios.
  // This prevents some diagrams (e.g. 1.A vs 1.B) from having different "breathing room"
  // below the last SMS bubble.
  function decorateGrid7SmsCanvasExtents(){
    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      // 2.B2 uses bespoke layout rules.
      if ((diagram.getAttribute("aria-label") || "") === "2.B2 seven-column diagram") continue;

      const canvas = diagram.querySelector(".grid7_mobile_canvas");
      if (!canvas) continue;

      const smsItems = Array.from(diagram.querySelectorAll(
        ".grid7_block.channel_sms, .grid7_sms_block.channel_sms, .grid7_notice, .mistake"
      ));
      if (!smsItems.length) continue;

      let maxRow = -Infinity;
      for (const el of smsItems){
        const r = parseInt(getComputedStyle(el).gridRowStart, 10);
        if (!Number.isFinite(r)) continue;
        maxRow = Math.max(maxRow, r);
      }
      if (!Number.isFinite(maxRow) || maxRow === -Infinity) continue;

      // Extend one full extra row below the last SMS row.
      canvas.style.gridRowEnd = String(maxRow + 2);
    }
  }
  decorateGrid7SmsCanvasExtents();

  // Any SMS message that StoryCall sends to Kid should be prefixed with "StoryCall: ".
  function prefixStoryCallSmsToKid(){
    const blocks = Array.from(document.querySelectorAll(
      ".grid7_diagram .grid7_block.channel_sms.participant_storycall.format_text, " +
      ".grid7_diagram .grid7_sms_block.channel_sms.participant_storycall.format_text"
    ));
    for (const block of blocks){
      // Prefer prefixing the first paragraph so we preserve formatting.
      const firstP = block.querySelector("p");
      if (firstP){
        const t = (firstP.textContent || "").trim().toLowerCase();
        if (t.startsWith("storycall:")) continue;
        firstP.innerHTML = "StoryCall: " + firstP.innerHTML.trimStart();
        continue;
      }

      const t = (block.textContent || "").trim().toLowerCase();
      if (t.startsWith("storycall:")) continue;
      block.insertAdjacentText("afterbegin", "StoryCall: ");
    }

    // Voice attachments can carry "text" as the visible transcript; prefix those too.
    const transcripts = Array.from(document.querySelectorAll(
      ".grid7_diagram .grid7_block.channel_sms.participant_storycall.format_voice .grid7_audio_transcript, " +
      ".grid7_diagram .grid7_sms_block.channel_sms.participant_storycall.format_voice .grid7_audio_transcript"
    ));
    for (const el of transcripts){
      const t = (el.textContent || "").trim().toLowerCase();
      if (!t) continue;
      if (t.startsWith("storycall:")) continue;
      el.innerHTML = "StoryCall: " + el.innerHTML.trimStart();
    }
  }
  prefixStoryCallSmsToKid();

  // Phone-block IDs: mark which grid7 timestamps live inside a dark phone block so we can
  // align their vertical inset below the "telephone" label (same as the first phone message row).
  function decorateGrid7PhoneIds(){
    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      const phoneMsgs = Array.from(diagram.querySelectorAll(".grid7_phone_msg.channel_phone"));
      if (!phoneMsgs.length) continue;

      // Determine phone rows by the presence of an actual phone utterance.
      // This avoids accidentally tagging SMS IDs that share overlapping grid columns/rows.
      const phoneRows = new Set();
      for (const msg of phoneMsgs){
        const r = parseInt(getComputedStyle(msg).gridRowStart, 10);
        if (Number.isFinite(r)) phoneRows.add(r);
      }
      if (!phoneRows.size) continue;

      // Determine SMS rows too, so SMS IDs don't inherit phone-only styling.
      const smsMsgs = Array.from(diagram.querySelectorAll(
        ".grid7_block.channel_sms, .grid7_sms_block.channel_sms"
      ));
      const smsRows = new Set();
      for (const msg of smsMsgs){
        const r = parseInt(getComputedStyle(msg).gridRowStart, 10);
        if (Number.isFinite(r)) smsRows.add(r);
      }

      const stamps = Array.from(diagram.querySelectorAll(".grid7_timestamp[data-id]"));
      for (const ts of stamps){
        ts.classList.remove("grid7_phone_id");
        const r = parseInt(getComputedStyle(ts).gridRowStart, 10);
        if (!Number.isFinite(r)) continue;
        if (phoneRows.has(r) && !smsRows.has(r)) ts.classList.add("grid7_phone_id");
      }
    }
  }
  decorateGrid7PhoneIds();

  // Normalize the phone canvas height so the bottom padding is consistent across scenarios.
  // (Covers both single-phone-block diagrams and 2.B2, which has two phone blocks.)
  function decorateGrid7PhoneCanvasExtents(){
    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      const phoneBgs = Array.from(diagram.querySelectorAll(".grid7_phone_bg, .grid7_phone_block"));
      if (!phoneBgs.length) continue;

      const phoneMsgs = Array.from(diagram.querySelectorAll(".grid7_phone_msg.channel_phone"));
      if (!phoneMsgs.length) continue;

      for (const bg of phoneBgs){
        const bgCs = getComputedStyle(bg);
        const c1 = parseInt(bgCs.gridColumnStart, 10);
        const c2 = parseInt(bgCs.gridColumnEnd, 10);
        const r1 = parseInt(bgCs.gridRowStart, 10);
        const r2 = parseInt(bgCs.gridRowEnd, 10);
        if (!Number.isFinite(c1) || !Number.isFinite(c2) || !Number.isFinite(r1) || !Number.isFinite(r2)) continue;

        let maxGrandmaRow = -Infinity;
        let maxAnyRow     = -Infinity;
        for (const msg of phoneMsgs){
          const cs = getComputedStyle(msg);
          const c = parseInt(cs.gridColumnStart, 10);
          const r = parseInt(cs.gridRowStart, 10);
          if (!Number.isFinite(c) || !Number.isFinite(r)) continue;
          if (c < c1 || c >= c2) continue;
          // Keep each phone block scoped to its own exchange.
          if (r < r1 || r >= r2) continue;
          maxAnyRow = Math.max(maxAnyRow, r);
          if (msg.classList.contains("participant_grandma")){
            maxGrandmaRow = Math.max(maxGrandmaRow, r);
          }
        }
        const targetMaxRow = (Number.isFinite(maxGrandmaRow) && maxGrandmaRow !== -Infinity)
          ? maxGrandmaRow
          : maxAnyRow;
        if (!Number.isFinite(targetMaxRow) || targetMaxRow === -Infinity) continue;

        // End the phone background right after Grandma’s last utterance row
        // (i.e. 2A5, 2B5, 2B10), without extending into the next row (often SMS relay).
        bg.style.gridRowEnd = String(targetMaxRow + 1);
      }
    }
  }
  decorateGrid7PhoneCanvasExtents();

  // Utterance numbering (IDs): place next to the utterance, by lane + speaker.
  //
  // Visible columns (5) map to grid columns (because col 1 is collapsed ID track):
  // - visible col 1 => grid-column 2
  // - visible col 3 => grid-column 4
  // - visible col 5 => grid-column 6
  //
  // Rules:
  // - SMS kid         => visible col 3, right-justified
  // - SMS storycall   => visible col 5, left-justified
  // - phone storycall => visible col 1, right-justified
  // - phone grandma   => visible col 3, left-justified
  function decorateGrid7UtteranceNumberPlacement(){
    const GRID_COL_VISIBLE_1 = "2";
    const GRID_COL_VISIBLE_3 = "4";
    const GRID_COL_VISIBLE_5 = "6";

    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      const stamps = Array.from(diagram.querySelectorAll(".grid7_timestamp[data-id]"));
      for (const ts of stamps){
        const row = parseInt(getComputedStyle(ts).gridRowStart, 10);
        if (!Number.isFinite(row)) continue;

        // Identify the utterance element on this row.
        const phoneMsg = Array.from(diagram.querySelectorAll(".grid7_phone_msg.channel_phone"))
          .find((el) => parseInt(getComputedStyle(el).gridRowStart, 10) === row);
        const smsMsg = Array.from(diagram.querySelectorAll(
          ".grid7_block.channel_sms, .grid7_sms_block.channel_sms"
        )).find((el) => parseInt(getComputedStyle(el).gridRowStart, 10) === row);

        ts.style.marginInline = "0";

        if (phoneMsg){
          if (phoneMsg.classList.contains("participant_grandma")){
            ts.style.gridColumn  = GRID_COL_VISIBLE_3;
            ts.style.justifySelf = "start";
            ts.style.textAlign   = "left";
          }else{
            // StoryCall (and any other non-grandma phone utterance)
            ts.style.gridColumn  = GRID_COL_VISIBLE_1;
            ts.style.justifySelf = "end";
            ts.style.textAlign   = "right";
          }
          continue;
        }

        if (smsMsg){
          if (smsMsg.classList.contains("participant_kid")){
            // Kid → StoryCall (SMS): number in visible col 3, right aligned.
            ts.style.gridColumn  = GRID_COL_VISIBLE_3;
            ts.style.justifySelf = "end";
            ts.style.textAlign   = "right";
          }else{
            // StoryCall (and any non-kid SMS utterance)
            ts.style.gridColumn  = GRID_COL_VISIBLE_5;
            ts.style.justifySelf = "start";
            ts.style.textAlign   = "left";
          }
        }
      }
    }
  }
  decorateGrid7UtteranceNumberPlacement();

  // Column headers: render kid/grandma avatars and a centered StoryCall "S".
  function decorateGrid7ColumnHeaders(){
    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      const heads = Array.from(diagram.querySelectorAll(".grid7_head"));
      for (const el of heads){
        const label = (el.textContent || "").trim().toLowerCase();
        if (!label) continue;
        if (label === "kid"){
          el.classList.add("grid7_head_avatar", "grid7_head_kid");
        }else if (label === "grandma"){
          el.classList.add("grid7_head_avatar", "grid7_head_grandma");
        }
      }

      // Add a centered StoryCall icon in the header row (once per diagram).
      if (!diagram.querySelector(".grid7_head_storycall")){
        const sc = document.createElement("div");
        sc.className = "grid7_cell grid7_head grid7_head_avatar grid7_head_storycall";
        sc.setAttribute("aria-label", "StoryCall");
        sc.textContent = "storycall";
        diagram.appendChild(sc);
      }
    }
  }
  decorateGrid7ColumnHeaders();

  // Add small “speaker pointer” triangles on top of each utterance bubble,
  // aligned under the speaker's header circle.
  function decorateGrid7UtteranceTriangles(){
    const diagrams = Array.from(document.querySelectorAll(".scenario_diagram, .grid7_diagram"));
    for (const diagram of diagrams){
      const headKid = diagram.querySelector(".grid7_head_kid");
      const headSc  = diagram.querySelector(".grid7_head_storycall");
      const headGm  = diagram.querySelector(".grid7_head_grandma");
      if (!headKid || !headSc || !headGm) continue;

      const kidCx = headKid.getBoundingClientRect().left + headKid.getBoundingClientRect().width / 2;
      const scCx  = headSc.getBoundingClientRect().left  + headSc.getBoundingClientRect().width  / 2;
      const gmCx  = headGm.getBoundingClientRect().left  + headGm.getBoundingClientRect().width  / 2;

      const utterances = Array.from(diagram.querySelectorAll(
        ".grid7_block.channel_sms, .grid7_sms_block.channel_sms, .grid7_phone_msg.channel_phone"
      ));
      for (const el of utterances){
        el.classList.remove("grid7_tail_up");
        el.style.removeProperty("--grid7_tail_x");
        el.style.removeProperty("--grid7_tail_color");

        const isSms = el.classList.contains("channel_sms");

        // Attribution rules:
        // - SMS lane: kid bubbles => kid; all other bubbles => StoryCall (even if the content is Grandma's).
        // - Phone lane: use the explicit participant.
        let cx = null;
        if (isSms){
          if (el.classList.contains("participant_kid")){
            cx = kidCx;
          }else{
            cx = scCx;
            // Force StoryCall color for relayed SMS bubbles (keeps attribution consistent).
            el.style.setProperty("--grid7_tail_color", "var(--speaker_storycall_bg)");
          }
        }else{
          if (el.classList.contains("participant_kid")){
            // Phone lane: kid audio is being delivered by StoryCall (relay playback).
            // Keep kid fill via CSS, but attribute the tail to StoryCall.
            cx = scCx;
            el.style.setProperty("--grid7_tail_color", "var(--speaker_storycall_bg)");
          }
          else if (el.classList.contains("participant_storycall")) cx = scCx;
          else if (el.classList.contains("participant_grandma")) cx = gmCx;
        }
        if (!Number.isFinite(cx)) continue;

        const rect = el.getBoundingClientRect();
        if (!rect.width) continue;

        // Suppress tails on the generic phone prompt (“Please reply after the beep…”),
        // which appears as 2.A.4 and 2.B.4 in the examples.
        if (!isSms && el.classList.contains("participant_storycall")){
          const t = (el.textContent || "").trim().toLowerCase();
          if (t.includes("please reply after the beep")){
            continue;
          }
        }

        const rawX = cx - rect.left;
        const pad  = 10;
        const x    = Math.max(pad, Math.min(rect.width - pad, rawX));
        el.style.setProperty("--grid7_tail_x", x.toFixed(2) + "px");
        el.classList.add("grid7_tail_up");
      }
    }
  }
  decorateGrid7UtteranceTriangles();

  // Scenario title nav:
  // - ↓ jumps to the next scenario title
  // - ↑ jumps back to outline
  function decorateScenarioTitleNav(){
    const titles = Array.from(document.querySelectorAll("section.scenario h3[id]"));
    for (let i = 0; i < titles.length; i++){
      const h3 = titles[i];
      h3.classList.add("scenario_title_row");

      // Remove any existing arrow links so we can render a consistent pair.
      for (const a of Array.from(h3.querySelectorAll("a.back_to_outline, a.scenario_next"))){
        a.remove();
      }

      const nav = document.createElement("span");
      nav.className = "scenario_title_nav";

      // Add a "jason" toggle button for every scenario (to the left of the ↓ arrow).
      {
        const btn = document.createElement("button");
        btn.className = "scenario_jason_toggle";
        btn.type = "button";
        btn.textContent = "JSON";
        btn.setAttribute("aria-label", "Toggle JSON block");
        btn.setAttribute("aria-pressed", "false");

        btn.addEventListener("click", () => {
          const scenario = h3.closest("section.scenario");
          if (!scenario) return;

          const block = ensureScenarioJasonBlock(scenario);
          if (!block) return;

          const isOpen = block.classList.contains("is_open");
          block.classList.toggle("is_open", !isOpen);
          block.classList.toggle("is_closed", isOpen);
          btn.setAttribute("aria-pressed", String(!isOpen));

          if (!isOpen){
            // Ensure the JSON is populated before showing.
            renderScenarioJasonForScenario(scenario);
          }
        });

        nav.appendChild(btn);
      }

      if (i < titles.length - 1){
        const next = document.createElement("a");
        next.className = "scenario_next";
        next.href = "#" + titles[i + 1].id;
        next.setAttribute("aria-label", "Next scenario");
        next.textContent = "↓";
        nav.appendChild(next);
      }else{
        // Keep spacing consistent on the final scenario.
        const spacer = document.createElement("span");
        spacer.className = "scenario_next_spacer";
        spacer.textContent = "";
        nav.appendChild(spacer);
      }

      const up = document.createElement("a");
      up.className = "back_to_outline";
      up.href = "#outline";
      up.setAttribute("aria-label", "Back to outline");
      up.textContent = "↑";
      nav.appendChild(up);

      h3.appendChild(nav);
    }
  }
  decorateScenarioTitleNav();

  function setAnchorOffset(){
    const header = document.querySelector("header");
    if (!header) return;
    const h = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--scenario_anchor_offset", h + "px");
  }

  setAnchorOffset();
  window.addEventListener("resize", () => {
    setAnchorOffset();
    migrateGrid7IdsIntoTimestamps();
    renderScenarioJasonForOpenScenarios();
    decorateGrid7SmsCanvasSpacing();
    decorateGrid7SmsCanvasExtents();
    decorateGrid7PhoneIds();
    decorateGrid7PhoneCanvasExtents();
    decorateGrid7UtteranceNumberPlacement();
    decorateGrid7UtteranceTriangles();
  }, { passive: true });

  function getAnchorTop(target){
    if (!target) return window.scrollY;
    const rectTop = target.getBoundingClientRect().top + window.scrollY;
    // Compensate for top margins (important for h3 titles and inset message blocks).
    const mt = Number.parseFloat(getComputedStyle(target).marginTop || "0") || 0;
    return rectTop - mt;
  }

  function scrollToEl(target, opts){
    if (!target) return;

    const header = document.querySelector("header");
    const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    const gap = 2;
    const targetTop = getAnchorTop(target) - headerH - gap;
    const startY = window.scrollY;
    const endY = Math.max(0, targetTop);

    const duration = Math.max(0, opts?.duration_ms ?? 180);
    if (!opts?.animate || duration === 0){
      window.scrollTo(0, endY);
      return;
    }

    const startT = performance.now();
    function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
    function tick(now){
      const p = Math.min(1, (now - startT) / duration);
      const y = startY + (endY - startY) * easeOutCubic(p);
      window.scrollTo(0, y);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function scrollToHash(hash, opts){
    const raw = (hash || "").trim();
    if (!raw || raw === "#") return;
    let id = raw.startsWith("#") ? raw.slice(1) : raw;
    if (!id) return;
    try{ id = decodeURIComponent(id); }catch(_e){}

    const legacyToNew = {
      // Groups
      "v2_setup": "1",
      "v2_message_exchange": "2",
      "v2_text_help": "3",
      "v2_text_stop": "4",

      // Scenarios
      "v2_setup_1": "1A",
      "v2_setup_2": "1C",
      "v2_setup_3": "1D",
      "v2_setup_4": "1E",
      "v2_setup_5": "1B",

      "v2_message_exchange_1": "2A",
      "v2_message_exchange_2": "2B",
      "v2_message_exchange_3": "2C",
      "v2_message_exchange_4": "2D",

      "v2_text_help_1": "3A",
      "v2_text_help_2": "3B",
      "v2_text_help_3": "3C",

      "v2_text_stop_1": "4A",
      "v2_text_stop_2": "4B",
    };

    const mapped = legacyToNew[id] || id;
    if (mapped !== id){
      try{ history.replaceState(null, "", "#" + mapped); }catch(_e){}
      id = mapped;
    }

    const target = document.getElementById(id);
    if (!target) return;

    const header = document.querySelector("header");
    const headerH = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    const gap = 2;
    const targetTop = getAnchorTop(target) - headerH - gap;
    const startY = window.scrollY;
    const endY = Math.max(0, targetTop);

    const duration = Math.max(0, opts?.duration_ms ?? 180);
    if (!opts?.animate || duration === 0){
      window.scrollTo(0, endY);
      return;
    }

    const startT = performance.now();
    function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
    function tick(now){
      const p = Math.min(1, (now - startT) / duration);
      const y = startY + (endY - startY) * easeOutCubic(p);
      window.scrollTo(0, y);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href^='#']");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    e.preventDefault();
    // Normalize any legacy hashes to the new short-form ids.
    const raw = href.slice(1);
    const legacyToNew = {
      "v2_setup": "1",
      "v2_message_exchange": "2",
      "v2_text_help": "3",
      "v2_text_stop": "4",
      "v2_setup_1": "1A",
      "v2_setup_2": "1C",
      "v2_setup_3": "1D",
      "v2_setup_4": "1E",
      "v2_setup_5": "1B",
      "v2_message_exchange_1": "2A",
      "v2_message_exchange_2": "2B",
      "v2_message_exchange_3": "2C",
      "v2_message_exchange_4": "2D",
      "v2_text_help_1": "3A",
      "v2_text_help_2": "3B",
      "v2_text_help_3": "3C",
      "v2_text_stop_1": "4A",
      "v2_text_stop_2": "4B",
    };
    const normalized = "#" + (legacyToNew[raw] || raw);
    history.pushState(null, "", normalized);
    scrollToHash(normalized, { animate: true, duration_ms: 180 });
  });

  window.addEventListener("hashchange", () => scrollToHash(location.hash, { animate: false }));
  scrollToHash(location.hash, { animate: false });
})();

