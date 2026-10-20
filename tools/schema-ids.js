// node tools/schema-ids.js <section.liquid> — list settings + block types from a section schema
const fs = require('fs'); const src = fs.readFileSync(process.argv[2], 'utf8');
const m = src.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/); const s = JSON.parse(m[1]);
const fmt = x => x.id ? `${x.type} ${x.id}=${JSON.stringify(x.default)}${x.options ? ' [' + x.options.map(o => o.value).join('|') + ']' : ''}` : null;
console.log('NAME', s.name, 'max_blocks', s.max_blocks || '', 'class', s.class || '');
(s.settings || []).map(fmt).filter(Boolean).forEach(l => console.log('  ' + l));
(s.blocks || []).forEach(b => { console.log(' BLOCK', b.type, b.name, b.limit || ''); (b.settings || []).map(fmt).filter(Boolean).forEach(l => console.log('    ' + l)); });
if (s.presets) console.log('PRESETS', s.presets.map(p => p.name).join(', '));
