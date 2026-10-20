// RFC 4180 CSV parse/stringify (quoted fields, embedded commas/quotes/newlines, BOM)
function parse(text) {
  text = text.replace(/^﻿/, '');
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(f); rows.push(row); row = []; f = '';
    } else f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  return rows.filter(r => r.length > 1 || r[0] !== '');
}
function toObjects(text) {
  const [head, ...rows] = parse(text);
  return { head, rows: rows.map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? '']))) };
}
const esc = v => { v = v == null ? '' : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
function stringify(head, objs) {
  return '﻿' + [head.map(esc).join(','), ...objs.map(o => head.map(h => esc(o[h])).join(','))].join('\r\n') + '\r\n';
}
module.exports = { parse, toObjects, stringify };
