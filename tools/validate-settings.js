// node tools/validate-settings.js — checks every value in templates/*.json, sections/*-group.json and config/settings_data.json
// against its schema (range min/max/step, select/radio options, block types), like Shopify does on upload.
const fs = require('fs'); const path = require('path');
const THEME = path.join(__dirname, '..', process.env.THEME_DIR || 'theme');
const load = f => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, '').replace(/^(\s*\/\*[\s\S]*?\*\/)+/, ''));
const schemaOf = type => { const f = path.join(THEME, 'sections', type + '.liquid'); if (!fs.existsSync(f)) return null; const m = fs.readFileSync(f, 'utf8').match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/); return m ? JSON.parse(m[1]) : {}; };
const errors = [];
function checkSettings(where, defs, values) {
  for (const [id, v] of Object.entries(values || {})) {
    const d = (defs || []).find(s => s.id === id); if (!d) continue; // unknown keys are dropped by Shopify, not rejected
    if (d.type === 'range' && typeof v === 'number') {
      if (v < d.min) errors.push(`${where} › ${id}: ${v} < min ${d.min}`);
      if (v > d.max) errors.push(`${where} › ${id}: ${v} > max ${d.max}`);
      if (d.step && Math.abs(((v - d.min) / d.step) - Math.round((v - d.min) / d.step)) > 1e-9) errors.push(`${where} › ${id}: ${v} not on step ${d.step} from ${d.min}`);
    }
    if ((d.type === 'select' || d.type === 'radio') && v !== '' && !(d.options || []).some(o => o.value === v)) errors.push(`${where} › ${id}: "${v}" not an option`);
  }
}
function checkSection(where, s) {
  const schema = schemaOf(s.type); if (!schema) { errors.push(`${where}: unknown section type ${s.type}`); return; }
  checkSettings(where, schema.settings, s.settings);
  for (const [k, b] of Object.entries(s.blocks || {})) {
    const bd = (schema.blocks || []).find(x => x.type === b.type);
    if (!bd && !(schema.blocks || []).some(x => x.type === '@app' || x.type === '@theme')) { errors.push(`${where} › block ${k}: type ${b.type} not in schema`); continue; }
    if (bd) checkSettings(`${where} › block ${k}`, bd.settings, b.settings);
  }
}
const files = [...fs.readdirSync(path.join(THEME, 'templates')).filter(f => f.endsWith('.json')).map(f => 'templates/' + f),
  ...fs.readdirSync(path.join(THEME, 'templates/customers')).filter(f => f.endsWith('.json')).map(f => 'templates/customers/' + f),
  ...fs.readdirSync(path.join(THEME, 'sections')).filter(f => f.endsWith('.json')).map(f => 'sections/' + f)];
for (const f of files) { const j = load(path.join(THEME, f)); for (const [k, s] of Object.entries(j.sections || {})) checkSection(`${f} › ${k}`, s); }
const schema = load(path.join(THEME, 'config/settings_schema.json')); const data = load(path.join(THEME, 'config/settings_data.json'));
const cur = typeof data.current === 'string' ? data.presets[data.current] : data.current;
checkSettings('config/settings_data.json', schema.flatMap(g => g.settings || []), cur);
console.log(errors.length ? errors.join('\n') : `OK: ${files.length + 1} files, all values within schema limits`);
process.exit(errors.length ? 1 : 0);
