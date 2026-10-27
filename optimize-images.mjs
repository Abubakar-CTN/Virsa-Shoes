import sharp from "sharp";
import fs from "fs";
import path from "path";
const root = "public/images/shoes";
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) { if (f.name !== "optimized") walk(p); }
    else if (/\.(jpe?g|png)$/i.test(f.name)) files.push(p);
  }
})(root);
let before = 0, after = 0;
for (const file of files) {
  const out = file.replace(/\.(jpe?g|png)$/i, ".webp");
  await sharp(file).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 74 }).toFile(out);
  before += fs.statSync(file).size;
  after += fs.statSync(out).size;
}
console.log("Images:", files.length, " Pehle:", Math.round(before / 1024), "KB  Ab:", Math.round(after / 1024), "KB");
