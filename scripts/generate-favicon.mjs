import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg, initWasm } from '@resvg/resvg-wasm';

const ROOT = resolve(process.cwd());
const FONT_PATH = resolve(ROOT, 'public/fonts/ChakraPetch-Bold.ttf');
const OUT_DIR = resolve(ROOT, 'public');

const YELLOW = '#FFFF00';
const BLACK = '#0B0B0B';

const fontData = await readFile(FONT_PATH);
const wasm = await readFile(resolve(ROOT, 'node_modules/@resvg/resvg-wasm/index_bg.wasm'));
await initWasm(wasm);

function node(size) {
  const radius = Math.round(size * 0.18);
  const fontSize = Math.round(size * 0.78);
  return {
    type: 'div',
    props: {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        background: YELLOW,
        borderRadius: `${radius}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: BLACK,
        fontFamily: 'Chakra Petch',
        fontWeight: 700,
        fontSize: `${fontSize}px`,
        lineHeight: 1,
        letterSpacing: '-0.04em',
      },
      children: 'a',
    },
  };
}

async function renderSvg(size) {
  return satori(node(size), {
    width: size,
    height: size,
    fonts: [{ name: 'Chakra Petch', data: fontData, weight: 700, style: 'normal' }],
  });
}

async function renderPng(size) {
  const svg = await renderSvg(size);
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: size } });
  return resvg.render().asPng();
}

// Build multi-size ICO (16, 32, 48) with PNG-embedded entries (supported by all modern browsers + Windows).
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);          // reserved
  header.writeUInt16LE(1, 2);          // type = 1 (icon)
  header.writeUInt16LE(pngs.length, 4);

  const dirEntries = [];
  const pngBuffers = [];
  let offset = 6 + pngs.length * 16;

  for (const { size, data } of pngs) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2);  // color palette
    entry.writeUInt8(0, 3);  // reserved
    entry.writeUInt16LE(1, 4);  // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    pngBuffers.push(data);
    offset += data.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

// 1. favicon.svg — main SVG (renders crisp at any size)
const mainSvg = await renderSvg(512);
await writeFile(resolve(OUT_DIR, 'favicon.svg'), mainSvg);
console.log('✓ favicon.svg');

// 2. PNGs for Apple + PWA
const sizes = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];
for (const { name, size } of sizes) {
  const png = await renderPng(size);
  await writeFile(resolve(OUT_DIR, name), png);
  console.log(`✓ ${name} (${png.length} B)`);
}

// 3. favicon.ico — multi-size (16, 32, 48)
const icoSizes = [16, 32, 48];
const icoPngs = [];
for (const size of icoSizes) {
  const data = await renderPng(size);
  icoPngs.push({ size, data });
}
const ico = buildIco(icoPngs);
await writeFile(resolve(OUT_DIR, 'favicon.ico'), ico);
console.log(`✓ favicon.ico (${ico.length} B, sizes: ${icoSizes.join('/')})`);

console.log('\nDone.');
