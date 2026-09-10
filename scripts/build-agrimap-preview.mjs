#!/usr/bin/env node
// Build-time generator dekorativní mapy Evropy pro ImageAccordion na homepage.
//
// ‼️ PROČ: mapa se dřív rendrovala jako inline <svg> přímo v komponentě, takže
// ~70 kB cest putovalo v KAŽDÉ odpovědi homepage (cs, sk, uk, pl, de) — a znovu
// při každém prokliku, protože inline markup se nedá nacachovat zvlášť. Je to
// přitom statický obrázek: aria-hidden, pointer-events: none, pevná metrika.
// Jako soubor si ho prohlížeč stáhne jednou a dál ho má z cache.
//
// Běží PŘED `astro build` (viz npm run build), aby se vygenerovaný soubor stihl
// zkopírovat z public/ do dist/. Data jsou tatáž jako u velké mapy v /svet/mapa/,
// takže po změně map-metrics.json se náhled přegeneruje sám.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import europe from '../src/data/svet/geo/europe.json' with { type: 'json' };
import mapData from '../src/data/svet/map-metrics.json' with { type: 'json' };
import { colorFor, extent } from '../src/lib/svet/mapcolor.ts';

const METRIC = 'wheat_yield';

// ‼️ europe.json deklaruje viewBox "0 0 1000 1165", jenže geometrie z něj TEČE VEN:
// Island má zápornou x (-254), sever a jižní ostrovy přesahují nahoře i dole.
// Inline <svg> to nevadilo (přetok se jen vykreslil mimo element), ale <img> se
// ořízne podle viewBoxu — a Island by zmizel. Rozsah níž je změřený render celé
// sady cest, ne odhad. Kdyby se podklad změnil, guard pod tím to zastaví, aby se
// přeměřilo znovu místo tichého uříznutí kusu Evropy.
const SOURCE_VIEWBOX = '0 0 1000 1165';
const INK_VIEWBOX = '-254 -86 1237 1416';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'agrimap-wheat-yield.svg');

if (europe.viewBox !== SOURCE_VIEWBOX) {
  throw new Error(
    `[agrimap] europe.json má jiný viewBox (${europe.viewBox}) než změřený (${SOURCE_VIEWBOX}). ` +
    'Přeměř skutečný rozsah cest a uprav INK_VIEWBOX — jinak se z mapy uřízne kus.'
  );
}

const countries = mapData.countries;
const e = extent(europe.regions.map((r) => countries[r.code]?.values?.[METRIC] ?? null));

const paths = europe.regions
  .map((r) => {
    const v = countries[r.code]?.values?.[METRIC] ?? null;
    return `<path d="${r.path}" fill="${colorFor(v, e.min, e.max)}" stroke="rgba(255,255,255,0.5)" stroke-width="0.7"/>`;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${INK_VIEWBOX}" preserveAspectRatio="xMidYMid meet">${paths}</svg>`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
if (prev === svg) {
  console.log(`[agrimap] beze změny (${(svg.length / 1024).toFixed(1)} kB)`);
} else {
  fs.writeFileSync(OUT, svg);
  console.log(`[agrimap] zapsáno ${path.relative(process.cwd(), OUT)} (${(svg.length / 1024).toFixed(1)} kB)`);
}
