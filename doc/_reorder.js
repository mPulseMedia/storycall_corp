const fs = require('fs');
const src = fs.readFileSync('scenarios.js','utf8');
const json = src.replace(/^\/\*.*?\*\/\n/,'').replace(/^var SCENARIOS_DATA = /,'').replace(/;\s*$/,'');
const data = JSON.parse(json);

// Reorder: id, text/label first, then rest
function reorderStep(step) {
  const out = {};
  if (step.type === 'event') {
    for (const k of ['type','id','label']) { if (step[k] != null) out[k] = step[k]; }
  } else if (step.telephone_parts) {
    for (const k of ['channel','from','to','speaker','telephone_index','outcome']) {
      if (step[k] != null) out[k] = step[k];
    }
    out.telephone_parts = step.telephone_parts.map(reorderPart);
    return out;
  } else {
    if (step.id != null) out.id = step.id;
    if (step.text != null) out.text = step.text;
  }
  for (const k of Object.keys(step)) {
    if (!(k in out)) out[k] = step[k];
  }
  return out;
}

function reorderPart(p) {
  const out = {};
  if (p.id != null) out.id = p.id;
  if (p.text != null) out.text = p.text;
  for (const k of Object.keys(p)) { if (!(k in out)) out[k] = p[k]; }
  return out;
}

// Apply reorder
for (const g of data.groups) {
  for (const sc of g.group_scenarios) {
    sc.scenario_steps = sc.scenario_steps.map(reorderStep);
  }
}

// --- Formatter ---
function pad(indent, key, colonCol) {
  const needed = colonCol - indent - key.length - 2;
  return ' '.repeat(Math.max(needed, 1));
}

function textVal(v, contCol) {
  if (!Array.isArray(v)) return JSON.stringify(v);
  if (v.length === 1) return '[' + JSON.stringify(v[0]) + ']';
  let s = '[' + JSON.stringify(v[0]) + ',\n';
  for (let i = 1; i < v.length; i++) {
    s += ' '.repeat(contCol) + JSON.stringify(v[i]);
    s += i < v.length - 1 ? ',\n' : ']';
  }
  return s;
}

function fmtStep(step, indent, colonCol, contCol) {
  const sp = ' '.repeat(indent);
  const lines = [];
  const keys = Object.keys(step);
  for (let ki = 0; ki < keys.length; ki++) {
    const k = keys[ki];
    const v = step[k];
    const comma = ki < keys.length - 1 ? ',' : '';
    const p = pad(indent, k, colonCol);

    if (k === 'telephone_parts') {
      let s = sp + '"' + k + '"' + p + ': [\n';
      for (let pi = 0; pi < v.length; pi++) {
        s += sp + '    {\n';
        s += fmtStep(v[pi], indent + 6, indent + 6 + 18, contCol);
        s += '\n' + sp + '    }';
        s += pi < v.length - 1 ? ',\n' : '\n';
      }
      s += sp + ']' + comma;
      lines.push(s);
    } else if (k === 'mistakes') {
      let s = sp + '"' + k + '"' + p + ': [\n';
      for (let mi = 0; mi < v.length; mi++) {
        s += sp + '  {\n';
        s += fmtStep(v[mi], indent + 2, colonCol, contCol);
        s += '\n' + sp + '  }';
        s += mi < v.length - 1 ? ',\n' : '\n';
      }
      s += sp + ']' + comma;
      lines.push(s);
    } else if (k === 'derived_from') {
      let s = sp + '"' + k + '"' + p + ': {\n';
      s += fmtStep(v, indent + 2, colonCol, contCol);
      s += '\n' + sp + '}' + comma;
      lines.push(s);
    } else if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') {
      lines.push(sp + '"' + k + '"' + p + ': ' + textVal(v, contCol) + comma);
    } else {
      lines.push(sp + '"' + k + '"' + p + ': ' + JSON.stringify(v) + comma);
    }
  }
  return lines.join('\n');
}

let out = '/* scenarios.js — edit directly */\nvar SCENARIOS_DATA = {\n';
out += '  "purpose"                        : ' + textVal(data.purpose, 38) + ',\n';
out += '  "groups"                         : [\n';

for (let gi = 0; gi < data.groups.length; gi++) {
  const g = data.groups[gi];
  out += '    {\n';
  out += '      "group_title"                : ' + JSON.stringify(g.group_title) + ',\n';
  out += '      "group_scenarios"            : [\n';

  for (let si = 0; si < g.group_scenarios.length; si++) {
    const sc = g.group_scenarios[si];
    out += '        {\n';
    out += '          "scenario_title"         : ' + JSON.stringify(sc.scenario_title) + ',\n';
    const prec = sc.scenario_precursor;
    if (Array.isArray(prec) && prec.length > 0) {
      out += '          "scenario_precursor"     : ' + textVal(prec, 38) + ',\n';
    } else {
      out += '          "scenario_precursor"     : ' + JSON.stringify(prec || "") + ',\n';
    }
    out += '          "scenario_steps"         : [\n';

    for (let sti = 0; sti < sc.scenario_steps.length; sti++) {
      const step = sc.scenario_steps[sti];
      out += '            {\n';
      out += fmtStep(step, 14, 35, 38);
      out += '\n            }';
      out += sti < sc.scenario_steps.length - 1 ? ',\n' : '\n';
    }

    out += '          ]\n';
    out += '        }';
    out += si < g.group_scenarios.length - 1 ? ',\n' : '\n';
  }

  out += '      ]\n';
  out += '    }';
  out += gi < data.groups.length - 1 ? ',\n' : '\n';
}

out += '  ]\n};\n';

// Validate before writing
const testJson = out.replace(/^\/\*.*?\*\/\n/,'').replace(/^var SCENARIOS_DATA = /,'').replace(/;\s*$/,'');
const parsed = JSON.parse(testJson);
console.log('Valid JSON');
parsed.groups.forEach(g => {
  g.group_scenarios.forEach(s => {
    const first = s.scenario_steps[0];
    const keys = Object.keys(first);
    console.log('  ' + s.scenario_title + ' — first step keys: ' + keys.join(', '));
  });
});

fs.writeFileSync('scenarios.js', out);
console.log('Done');
