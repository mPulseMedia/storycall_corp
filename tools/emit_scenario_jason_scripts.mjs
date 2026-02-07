import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "temp_baked_jason.json");
const OUTPUT = path.join(ROOT, "temp_scenario_jason_scripts.html");

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

function main(){
  const raw = fs.readFileSync(INPUT, "utf8");
  const map = JSON.parse(raw);
  const ids = Object.keys(map);
  ids.sort((a, b) => {
    // Sort like 1A, 1B, ... 2A ...
    const ma = a.match(/^(\d+)([A-Z]+)$/i);
    const mb = b.match(/^(\d+)([A-Z]+)$/i);
    const na = ma ? parseInt(ma[1], 10) : 0;
    const nb = mb ? parseInt(mb[1], 10) : 0;
    if (na !== nb) return na - nb;
    const sa = ma ? ma[2].toUpperCase() : a;
    const sb = mb ? mb[2].toUpperCase() : b;
    return sa.localeCompare(sb);
  });

  const parts = [];
  for (const id of ids){
    const obj = map[id];
    const aligned = stringifyJasonAligned(obj, 0);
    parts.push(
      `<script type="application/json" id="storycall_scenario_jason_${id}">\n` +
      `${aligned}\n` +
      `</script>`
    );
  }
  fs.writeFileSync(OUTPUT, parts.join("\n\n") + "\n", "utf8");
}

main();

