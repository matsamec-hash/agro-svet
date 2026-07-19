#!/usr/bin/env node
// Build-time generator pro Open Graph obrázky (1200×630) pro encyklopedie
// a HowTo články. Satori → SVG, @resvg/resvg-js → PNG. Žádný runtime na
// Cloudflare Workeru — předgenerujeme statické soubory do public/og/.
//
// Brainstorm cest, které byly odmítnuty (zaznamenáno v plánu Sprint 4):
//   - Runtime CF Worker generace pomocí Satori WASM: ~2 MB bundle WASM
//     překračuje limit Worker bundlu a režie startu při každém SSR požadavku
//     by zdražila edge cache miss.
//   - Sharp s text overlay: sharp neumí native text render → stejně by se
//     musel skládat SVG layer a rasterizovat. Stejná složitost jako Satori,
//     navíc další nativní dep do build pipeline.
//   - Pre-generation jen pro top-N: ROI špatný — buď je infra postavená a
//     pokrývá vše, nebo nic. Encyklopedie + HowTo má dohromady ~50 stránek,
//     PNG je každá ~50–80 KB, takže scale není problém.
//
// Zvolená cesta: build-time Satori + resvg, JSX přes satori-html (HTML
// string → JSX node tree). Fonty z Google Fonts gstatic (TTF), cache v
// .og-cache/ (gitignored).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { html } from 'satori-html';
import { parse as parseYaml } from 'yaml';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const FONT_CACHE = resolve(ROOT, '.og-cache', 'fonts');
const OUT_DIR = resolve(ROOT, 'public', 'og');

mkdirSync(OUT_DIR, { recursive: true });

// Fetch fonts on first run if not cached (script kept self-contained so it
// works on CI without manual setup). Google Fonts serves TTF when using a
// non-browser User-Agent.
const FONT_URLS = {
  'chakra-petch-400.ttf': 'https://fonts.gstatic.com/s/chakrapetch/v13/cIf6MapbsEk7TDLdtEz1BwkmmA.ttf',
  'chakra-petch-700.ttf': 'https://fonts.gstatic.com/s/chakrapetch/v13/cIflMapbsEk7TDLdtEz1BwkeJI9FQA.ttf',
};
async function ensureFonts() {
  mkdirSync(FONT_CACHE, { recursive: true });
  for (const [name, url] of Object.entries(FONT_URLS)) {
    const path = resolve(FONT_CACHE, name);
    if (existsSync(path) && readFileSync(path).byteLength > 1024) continue;
    console.log(`Downloading ${name}…`);
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(`Font download failed: ${name} (${r.status})`);
    const buf = Buffer.from(await r.arrayBuffer());
    writeFileSync(path, buf);
  }
}

// Brand barvy — vychází z oficiálních korporátních identit. Default = žlutý
// akcent webu.
const BRAND_COLORS = {
  'john-deere': '#367C2B',
  'case-ih': '#C8102E',
  'new-holland': '#003C81',
  'fendt': '#006837',
  'claas': '#3D8E1B',
  'massey-ferguson': '#C8102E',
  'kubota': '#FF6B00',
  'zetor': '#C8102E',
  'deutz-fahr': '#5A8F29',
  'valtra': '#C8102E',
  'kuhn': '#C8102E',
  'lemken': '#0F2D6B',
  'kverneland': '#C8102E',
  'amazone': '#0F2D6B',
  'horsch': '#000000',
  'manitou': '#E20613',
  'pottinger': '#5A8F29',
  'vaderstad': '#C8102E',
  'krone': '#003C81',
  'joskin': '#C8102E',
  'jcb': '#FFC72C',
  'bednar': '#003C81',
};
const DEFAULT_BRAND_COLOR = '#FFEA00';

const KATEG_LABELS = {
  traktor: 'Traktor',
  kombajn: 'Kombajn',
  stroj: 'Stroj',
  'puda-technika': 'Půdní technika',
};

function template({ kicker, title, subtitle, accentColor, footerLeft, footerRight }) {
  // Layout: dark background, brand-colored top stripe + chip, large title,
  // accent footer divider. Kept simple — too many decorations distract from
  // the title at small thumbnail sizes.
  return html(`
    <div style="display:flex; flex-direction:column; width:1200px; height:630px; background:#0A0A0B; color:#FFFFFF; font-family:'Chakra Petch'; padding:0; position:relative;">
      <div style="display:flex; height:14px; background:${accentColor};"></div>
      <div style="display:flex; flex-direction:column; padding:56px 64px 48px; flex:1; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:14px;">
          <span style="background:${accentColor}; color:#0A0A0B; font-weight:700; font-size:18px; padding:6px 14px; border-radius:6px; text-transform:uppercase; letter-spacing:.06em;">${kicker}</span>
          ${subtitle ? `<span style="font-size:18px; color:#A0A0A8; letter-spacing:.04em;">${subtitle}</span>` : ''}
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:${title.length > 32 ? 64 : 80}px; font-weight:700; line-height:1.05; letter-spacing:-1.5px; color:#FFFFFF;">${escapeHtml(title)}</div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:2px solid ${accentColor}; padding-top:20px;">
          <div style="display:flex; align-items:center; font-size:24px; font-weight:700; color:#FFFFFF; letter-spacing:-.5px;">agro-svět.cz</div>
          <div style="display:flex; align-items:center; font-size:18px; color:#A0A0A8;">${footerRight}</div>
        </div>
      </div>
    </div>
  `);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function render(jsx, fonts) {
  const svg = await satori(jsx, {
    width: 1200,
    height: 630,
    fonts,
  });
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  return resvg.render().asPng();
}

function parseMd(path) {
  const raw = readFileSync(path, 'utf8');
  return matter(raw).data;
}

async function main() {
  await ensureFonts();
  const font400 = readFileSync(resolve(FONT_CACHE, 'chakra-petch-400.ttf'));
  const font700 = readFileSync(resolve(FONT_CACHE, 'chakra-petch-700.ttf'));
  const fonts = [
    { name: 'Chakra Petch', data: font400, weight: 400, style: 'normal' },
    { name: 'Chakra Petch', data: font700, weight: 700, style: 'normal' },
  ];

  let count = 0;

  // Encyklopedie
  const encFiles = [];
  for await (const f of glob('src/content/encyklopedie/*.md', { cwd: ROOT })) {
    encFiles.push(f);
  }
  for (const file of encFiles) {
    const data = parseMd(resolve(ROOT, file));
    const slug = data.slug;
    const accent = BRAND_COLORS[data.znacka] ?? DEFAULT_BRAND_COLOR;
    const kicker = KATEG_LABELS[data.kategorie] ?? 'Encyklopedie';
    const footerRight = `${data.vykon ?? ''}${data.rok_uvedeni ? ` · ${data.rok_uvedeni}` : ''}`.trim();
    const subtitle = `${String(data.znacka).toUpperCase()} · Encyklopedie`;
    const jsx = template({
      kicker,
      title: data.name,
      subtitle,
      accentColor: accent,
      footerLeft: 'agro-svět.cz',
      footerRight,
    });
    const png = await render(jsx, fonts);
    writeFileSync(resolve(OUT_DIR, `encyklopedie-${slug}.png`), png);
    count++;
  }

  // HowTo
  const howFiles = [];
  for await (const f of glob('src/content/howto/*.md', { cwd: ROOT })) {
    howFiles.push(f);
  }
  for (const file of howFiles) {
    const data = parseMd(resolve(ROOT, file));
    const slug = data.slug;
    const stepCount = Array.isArray(data.steps) ? data.steps.length : 0;
    const jsx = template({
      kicker: 'Jak na to',
      title: data.title,
      subtitle: data.obtiznost ? `Návod · ${data.obtiznost}` : 'Praktický návod',
      accentColor: DEFAULT_BRAND_COLOR,
      footerLeft: 'agro-svět.cz',
      footerRight: stepCount > 0 ? `${stepCount} kroků` : '',
    });
    const png = await render(jsx, fonts);
    writeFileSync(resolve(OUT_DIR, `howto-${slug}.png`), png);
    count++;
  }

  // Znacky (brand hub pages)
  const znackyFiles = [];
  for await (const f of glob('src/content/znacky/*.md', { cwd: ROOT })) {
    znackyFiles.push(f);
  }
  for (const file of znackyFiles) {
    const data = parseMd(resolve(ROOT, file));
    const slug = data.slug;
    const accent = BRAND_COLORS[slug] ?? DEFAULT_BRAND_COLOR;
    const jsx = template({
      kicker: 'Značka',
      title: data.name,
      subtitle: `${data.zeme} · od ${data.zalozena}`,
      accentColor: accent,
      footerLeft: 'agro-svět.cz',
      footerRight: 'Stroje · Modely · Historie',
    });
    const png = await render(jsx, fonts);
    writeFileSync(resolve(OUT_DIR, `znacka-${slug}.png`), png);
    count++;
  }

  // Plodiny (crop pillar pages)
  const SKUPINA_LABELS_OG = {
    obiloviny: 'Obiloviny',
    olejniny: 'Olejniny',
    okopaniny: 'Okopaniny',
    luskoviny: 'Luskoviny',
    picniny: 'Pícniny',
  };
  const plodinaFiles = [];
  for await (const f of glob('src/data/plodiny/*.yaml', { cwd: ROOT })) {
    plodinaFiles.push(f);
  }
  for (const file of plodinaFiles) {
    const raw = readFileSync(resolve(ROOT, file), 'utf8');
    const data = parseYaml(raw);
    const slug = data.slug;
    const skupinaLabel = SKUPINA_LABELS_OG[data.skupina] ?? data.skupina ?? 'Plodina';
    // Count registered varieties from the companion JSON file
    const odrudyPath = resolve(ROOT, 'src/data/plodiny/odrudy', `${slug}.json`);
    let odrudyCount = 0;
    if (existsSync(odrudyPath)) {
      try {
        const arr = JSON.parse(readFileSync(odrudyPath, 'utf8'));
        odrudyCount = Array.isArray(arr) ? arr.length : 0;
      } catch { /* treat as 0 */ }
    }
    const footerRight = odrudyCount > 0 ? `${odrudyCount} registrovaných odrůd` : 'Pěstování · Agronomie';
    const jsx = template({
      kicker: skupinaLabel,
      title: data.name,
      subtitle: 'Plodina · Odrůdy · Pěstování',
      accentColor: '#3D8E1B', // agro green — matches site's --green accent
      footerLeft: 'agro-svět.cz',
      footerRight,
    });
    const png = await render(jsx, fonts);
    writeFileSync(resolve(OUT_DIR, `plodiny-${slug}.png`), png);
    count++;
  }

  // Default site OG + landing pages without a specific image
  const LANDINGS = [
    { slug: 'default', kicker: 'agro-svět', title: 'Zemědělství, technika a stroje', subtitle: 'Katalog · Magazín · Bazar', footerRight: 'agro-svet.cz' },
    { slug: 'stroje', kicker: 'Katalog', title: 'Traktory a kombajny', subtitle: '1300+ modelů · 22 značek', footerRight: 'Filtrovat podle značky' },
    { slug: 'encyklopedie', kicker: 'Encyklopedie', title: 'Encyklopedie strojů', subtitle: 'Hloubkové profily modelů', footerRight: 'Specifikace · FAQ · Historie' },
    { slug: 'jak-na-to', kicker: 'Jak na to', title: 'Praktické návody', subtitle: 'Krok-za-krokem pro hospodáře', footerRight: 'Návody · Tipy · Triky' },
    { slug: 'znacky', kicker: 'Značky', title: 'Značky a výrobci', subtitle: '22 světových výrobců', footerRight: 'Historie · Modely · Země' },
    { slug: 'plemena', kicker: 'Plemena', title: 'Plemena hospodářských zvířat', subtitle: 'Skot · prasata · drůbež · ovce', footerRight: 'Profily plemen' },
    { slug: 'dotace', kicker: 'Dotace', title: 'Zemědělské dotace', subtitle: 'SZIF · PRV · národní programy', footerRight: 'Termíny · Podmínky' },
    { slug: 'prodejci', kicker: 'Prodejci', title: 'Prodejci techniky', subtitle: 'Autorizovaní dealeři v ČR', footerRight: 'Mapa · Kontakty' },
    { slug: 'kalkulacka', kicker: 'Kalkulačka', title: 'Kalkulačky pro zemědělce', subtitle: 'Leasing · Náklady na hektar', footerRight: 'Spočítejte si' },
    { slug: 'srovnani', kicker: 'Srovnání', title: 'Srovnání traktorů', subtitle: '220+ párů head-to-head', footerRight: 'Specifikace vs specifikace' },
    { slug: 'bazar', kicker: 'Bazar', title: 'Agro bazar', subtitle: 'Inzerát zdarma · bez provize', footerRight: 'Traktory · Kombajny · Stroje' },
    { slug: 'puda', kicker: 'Půda', title: 'Péče o půdu', subtitle: 'Hnojení · zúrodnění · plodiny', footerRight: 'Praktické poradenství' },
  ];
  for (const l of LANDINGS) {
    const jsx = template({
      kicker: l.kicker,
      title: l.title,
      subtitle: l.subtitle,
      accentColor: DEFAULT_BRAND_COLOR,
      footerLeft: 'agro-svět.cz',
      footerRight: l.footerRight,
    });
    const png = await render(jsx, fonts);
    writeFileSync(resolve(OUT_DIR, `${l.slug === 'default' ? 'default' : `landing-${l.slug}`}.png`), png);
    count++;
  }

  // /svet — profily zemí (zelený akcent, jednotné pro všechny země)
  const svetIndex = JSON.parse(readFileSync(resolve(ROOT, 'src/data/svet/index.json'), 'utf8'));
  for (const c of svetIndex.countries.filter((c) => !c.reference)) {
    const jsx = template({
      kicker: 'Zemědělská data',
      title: c.nameCs,
      subtitle: 'Produkce · Půda · Ekonomika',
      accentColor: '#2f6b2f',
      footerLeft: 'agro-svět.cz',
      footerRight: 'Zdroj: Eurostat · World Bank',
    });
    const png = await render(jsx, fonts);
    writeFileSync(resolve(OUT_DIR, `svet-${c.slug}.png`), png);
    count++;
  }

  console.log(`\n✓ Generated ${count} OG images → public/og/`);
}

main().catch((e) => {
  console.error('OG image generation failed:', e);
  process.exit(1);
});
