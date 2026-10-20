// node tools/pdf2svg.mjs <in.pdf> <out.svg> [out.png] — vector page → SVG (text as paths) and optional PNG @3x
import * as mupdf from 'mupdf'; import fs from 'fs';
const [inp, out, png] = process.argv.slice(2);
const doc = mupdf.Document.openDocument(fs.readFileSync(inp), 'application/pdf');
const page = doc.loadPage(0);
const buf = new mupdf.Buffer(); const w = new mupdf.DocumentWriter(buf, 'svg', 'text=path');
const dev = w.beginPage(page.getBounds()); page.run(dev, mupdf.Matrix.identity); w.endPage(); w.close();
fs.writeFileSync(out, buf.asUint8Array()); console.log(out, page.getBounds());
if (png) { const pm = page.toPixmap(mupdf.Matrix.scale(+(process.argv[5]||3), +(process.argv[5]||3)), mupdf.ColorSpace.DeviceRGB, false); fs.writeFileSync(png, pm.asPNG()); console.log(png); }
