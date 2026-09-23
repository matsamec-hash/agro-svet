#!/usr/bin/env node
/**
 * Zástupný obrázek z loga webu. Používá se tam, kde původní fotka odešla kvůli
 * nedoloženému oprávnění a cesta k souboru musí zůstat (hero článku v CMS).
 *
 *   node scripts/make-zastupny-obrazek.mjs <cesta> [šířka] [výška]
 */
import sharp from 'sharp';

const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <rect width="{W}" height="{H}" fill="#0B0B0B"/>
  <g transform="translate({LX} {LY}) scale({S})">
    <path fill="#FFFF00" d="M92,0 h328 a92,92 0 0 1 92,92 v328 a92,92 0 0 1 -92,92 h-328 a92,92 0 0 1 -92,-92 v-328 a92,92 0 0 1 92,-92"/>
    <path fill="#0B0B0B" d="M203.7 392L167.0 355.3L167.0 309.8L203.7 273.1L304.6 273.1L304.6 248.0L292.2 235.6L232.4 235.6L220.4 248.0L220.4 259.1L168.6 259.1L168.6 236.4L211.2 193.3L313.8 193.3L356.5 236.4L356.5 392L309.0 392L309.0 363.7L279.5 392L203.7 392ZM228.8 351.3L275.9 351.3L304.6 323.8L304.6 310.6L229.6 310.6L218.8 321.4L218.8 341.3L228.8 351.3Z"/>
  </g>
  <text x="{CX}" y="{TY}" text-anchor="middle" font-family="'DejaVu Sans', sans-serif" font-size="{FS}" font-weight="700" fill="#FFFFFF">agro-svet.cz</text>
  <text x="{CX}" y="{TY2}" text-anchor="middle" font-family="'DejaVu Sans', sans-serif" font-size="{FS2}" fill="#8A8A90">Fotografie zatím není k dispozici</text>
</svg>`;

export function placeholderSvg(w, h) {
  const s = Math.min(w, h) * 0.00055;
  const logoW = 512 * s, logoH = 512 * s;
  return LOGO
    .replaceAll('{W}', String(w)).replaceAll('{H}', String(h))
    .replaceAll('{LX}', String(Math.round((w - logoW) / 2)))
    .replaceAll('{LY}', String(Math.round(h / 2 - logoH * 0.85)))
    .replaceAll('{S}', s.toFixed(4))
    .replaceAll('{CX}', String(Math.round(w / 2)))
    .replaceAll('{TY}', String(Math.round(h / 2 + logoH * 0.35)))
    .replaceAll('{TY2}', String(Math.round(h / 2 + logoH * 0.35 + Math.min(w, h) * 0.055)))
    .replaceAll('{FS}', String(Math.round(Math.min(w, h) * 0.058)))
    .replaceAll('{FS2}', String(Math.round(Math.min(w, h) * 0.032)));
}

const [outArg, wArg, hArg] = process.argv.slice(2);
if (outArg) {
  const w = Number(wArg) || 1280;
  const h = Number(hArg) || 800;
  const buf = Buffer.from(placeholderSvg(w, h), 'utf8');
  let img = sharp(buf);
  if (/\.jpe?g$/i.test(outArg)) img = img.jpeg({ quality: 82 });
  else if (/\.webp$/i.test(outArg)) img = img.webp({ quality: 82 });
  else img = img.png();
  await img.toFile(outArg);
  console.log('✓', outArg, `${w}×${h}`);
}
