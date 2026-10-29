#!/usr/bin/env node
// Generates every icon and logo file in public/ from one icon SVG.
//
//   node scripts/icons.mjs [icon.svg] [--out public] [--text "VICTOR PASS"] [--font file.ttf]
//
// Favicons/icons: the icon is trimmed to its drawn bounds and centered on a
// transparent square. Logo: the icon above the name, centered on a white
// square, following the LOGO template below.

import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import opentype from "opentype.js";

const require = createRequire(import.meta.url);

const { values: opts, positionals } = parseArgs({
    allowPositionals: true,
    options: {
        out: { type: "string", default: "public" },
        text: { type: "string", default: "VICTOR PASS" },
        font: { type: "string" },
    },
});
const src = positionals[0] ?? "public/icon.svg";

// Square PNG icons: file name -> pixel size.
const ICONS = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "favicon-96x96.png": 96,
    "icon.48.png": 48,
    "icon.64.png": 64,
    "icon.large.png": 1024,
};
const ICO = { file: "favicon.ico", sizes: [16, 32, 48] };
const SVG_COPIES = ["favicon.svg", "icon.svg"];

// Logo template, in pixels on the final canvas. Matches the original
// VictorPass.logo.png layout.
const LOGO = {
    file: "VictorPass.logo.png",
    size: 1254,
    background: "#ffffff",
    color: "#12211e",
    // .ttf, .otf or .woff (not .woff2): a file path, or a path inside an
    // installed package, e.g. "@fontsource/montserrat/files/montserrat-latin-700-normal.woff".
    // --font overrides this.
    font: "@fontsource/inter/files/inter-latin-800-normal.woff",
    // Icon is scaled to fit this box, centered, and sits on iconBottom.
    iconMaxWidth: 950,
    iconMaxHeight: 600,
    iconBottom: 780,
    textCapHeight: 98, // height of the capital letters
    textBaseline: 970,
    textTracking: 0.08, // extra space between letters, as a fraction of font size
};

const svg = await readFile(src);
const out = (file) => path.join(opts.out, file);
await mkdir(opts.out, { recursive: true });

// Render big once, trim to the drawn pixels, and scale down from that.
// The root width/height are replaced with plain pixels sized from the
// viewBox, so declared size and units (pt, mm, ...) don't matter.
const MASTER_SIZE = 3000;
const sized = (() => {
    const text = svg.toString("utf8");
    const root = text.match(/<svg\b[^>]*>/)[0];
    const viewBox = root.match(/viewBox\s*=\s*["']([^"']+)["']/);
    if (!viewBox) throw new Error(`${src}: root <svg> needs a viewBox`);
    const [, , vbWidth, vbHeight] = viewBox[1].trim().split(/[\s,]+/).map(Number);
    const scale = MASTER_SIZE / Math.max(vbWidth, vbHeight);
    const newRoot = root
        .replace(/\s(width|height)\s*=\s*["'][^"']*["']/g, "")
        .replace(/^<svg/, `<svg width="${Math.round(vbWidth * scale)}" height="${Math.round(vbHeight * scale)}"`);
    return Buffer.from(text.replace(root, newRoot));
})();
const master = await sharp(sized)
    .png()
    .trim()
    .toBuffer();

const square = (size, padding = 0) => {
    const inner = Math.max(1, Math.round(size * (1 - 2 * padding)));
    return sharp(master)
        .resize(inner, inner, { fit: "contain", background: "#0000" })
        .extend({
            top: Math.floor((size - inner) / 2),
            bottom: Math.ceil((size - inner) / 2),
            left: Math.floor((size - inner) / 2),
            right: Math.ceil((size - inner) / 2),
            background: "#0000",
        })
        .png()
        .toBuffer();
};

for (const [file, size] of Object.entries(ICONS)) {
    await writeFile(out(file), await square(size));
    console.log(`${file}  ${size}x${size}`);
}

// ICO with embedded PNGs (supported by every current browser).
const pngs = await Promise.all(ICO.sizes.map((s) => square(s)));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
    const s = ICO.sizes[i];
    const e = 6 + 16 * i;
    header.writeUInt8(s >= 256 ? 0 : s, e);
    header.writeUInt8(s >= 256 ? 0 : s, e + 1);
    header.writeUInt16LE(1, e + 4); // color planes
    header.writeUInt16LE(32, e + 6); // bits per pixel
    header.writeUInt32LE(png.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += png.length;
});
await writeFile(out(ICO.file), Buffer.concat([header, ...pngs]));
console.log(`${ICO.file}  ${ICO.sizes.join(",")}`);

for (const file of SVG_COPIES) {
    if (path.resolve(out(file)) === path.resolve(src)) continue;
    await writeFile(out(file), svg);
    console.log(file);
}

// Logo: text is converted to outlines so rendering doesn't depend on
// installed fonts.
const fontSpec = opts.font ?? LOGO.font;
const fontFile = existsSync(fontSpec) ? fontSpec : require.resolve(fontSpec);
const font = opentype.parse((await readFile(fontFile)).buffer);
const capHeight = font.tables.os2?.sCapHeight || font.charToGlyph("H").getBoundingBox().y2;
const fontSize = (LOGO.textCapHeight / capHeight) * font.unitsPerEm;
const tracking = LOGO.textTracking * fontSize;

// Plain char -> glyph mapping; opentype.js's full shaping chokes on some fonts.
const glyphs = [...opts.text].map((ch) => font.charToGlyph(ch));
let x = 0;
const textPath = new opentype.Path();
glyphs.forEach((glyph, i) => {
    textPath.extend(glyph.getPath(x, 0, fontSize));
    const kern = i < glyphs.length - 1 ? font.getKerningValue(glyph, glyphs[i + 1]) : 0;
    x += ((glyph.advanceWidth + kern) / font.unitsPerEm) * fontSize;
    if (i < glyphs.length - 1) x += tracking;
});
const box = textPath.getBoundingBox();
const dx = (LOGO.size - (box.x2 - box.x1)) / 2 - box.x1;
const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${LOGO.size}" height="${LOGO.size}">
  <path transform="translate(${dx} ${LOGO.textBaseline})" fill="${LOGO.color}" d="${textPath.toPathData(2)}"/>
</svg>`;

const { data: logoIcon, info: iconInfo } = await sharp(master)
    .resize(LOGO.iconMaxWidth, LOGO.iconMaxHeight, { fit: "inside" })
    .png()
    .toBuffer({ resolveWithObject: true });
await sharp({
    create: { width: LOGO.size, height: LOGO.size, channels: 4, background: LOGO.background },
})
    .composite([
        {
            input: logoIcon,
            left: Math.round((LOGO.size - iconInfo.width) / 2),
            top: LOGO.iconBottom - iconInfo.height,
        },
        { input: Buffer.from(textSvg), left: 0, top: 0 },
    ])
    .png()
    .toFile(out(LOGO.file));
console.log(`${LOGO.file}  ${LOGO.size}x${LOGO.size}`);
