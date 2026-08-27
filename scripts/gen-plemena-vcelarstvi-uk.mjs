// Vygeneruje ukrajinský overlay plemen (src/data/plemena-uk/*.yaml) a včelařství
// (src/data/vcelarstvi/uk/*.yaml) překladem cs YAML přes OpenAI.
//
// Adresáře záměrně nesedí na stejný vzorec — plemena mají sourozenecký adresář
// `plemena-<locale>/`, včelařství podadresář `vcelarstvi/<locale>/`. Kopíruje se
// tím rozložení, které už mají sk a pl; sjednocovat to teď by znamenalo sáhnout
// do dvou funkčních knihoven kvůli kosmetice.
//
// ‼️ Překládají se JEN pole, která přeložila i sk verze. Názvy plemen zůstávají
// v původním zápisu (Charolais, Suffolk) — stejně jako u sk a pl, a slug, obrázky
// i wiki odkazy se na ně vážou.
//
// ‼️ `vhodnost_cr` u včel a `orientacni_cena` u vybavení jsou české údaje
// (podmínky ČR, ceny v Kč). Nepřepisují se na ukrajinské — prompt trvá na tom,
// aby text řekl „у Чехії".
//
// Spuštění: node --env-file=.env scripts/gen-plemena-vcelarstvi-uk.mjs
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí (spusť s --env-file)'); process.exit(1); }
const MODEL = process.env.UK_MODEL || 'gpt-4.1';
const CONCURRENCY = 4;

const CYR = /[Ѐ-ӿ]/;
const missingUk = (v) => {
  const s = JSON.stringify(v ?? '');
  return /[A-Za-zÁ-ž]{3,}/.test(s) && !CYR.test(s);
};

const SYS = `Ти експерт-перекладач з чеської на українську для аграрного порталу.
Перекладаєш описи порід сільськогосподарських тварин, бджіл, пасічницького
обладнання та сортів меду.

ПРАВИЛА:
- Перекладай ВИКЛЮЧНО українською літературною мовою. Жодного чеського слова.
- НЕ перекладай назви порід і брендів (Charolais, Suffolk, Landrace, Carnica) —
  вони лишаються в оригінальному написанні.
- Латинські назви, числа, роки, ваги, одиниці й посилання залиш ТОЧНО як є.
- Назви країн перекладай українською (Francie → Франція, Německo → Німеччина,
  Velká Británie → Велика Британія, Rakousko → Австрія).
- ‼️ Якщо текст говорить про придатність для чеських умов або про ціни в чеських
  кронах, НЕ переписуй це на Україну — залиш дані як є й додай „у Чехії".
- Якщо значення містить HTML (<h2>, <p>, <ul>), збережи розмітку без змін
  і переклади лише текст усередині тегів.
- Відповідай ВИКЛЮЧНО коректним JSON з тією самою структурою, що на вході.`;

async function translate(obj, hint, extra = '') {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: `Переклади значення (${hint})${extra}. Ключі залиш без змін:\n\n${JSON.stringify(obj, null, 1)}` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });
    if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 1500 * attempt)); continue; }
    if (!r.ok) throw new Error(`OpenAI ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return JSON.parse((await r.json()).choices[0].message.content);
  }
  throw new Error('OpenAI nedostupné po 4 pokusech');
}

/** Přeloží vyjmenovaná pole jednoho objektu; ostatní se kopírují z cs. */
async function translateItem(item, fields, hint) {
  const payload = {};
  for (const f of fields) if (item[f] !== undefined && item[f] !== null) payload[f] = item[f];
  if (!Object.keys(payload).length) return { ...item };
  let out = await translate(payload, hint);
  for (let pass = 0; pass < 3; pass++) {
    const bad = Object.keys(payload).filter((f) => missingUk(out[f]));
    if (!bad.length) break;
    const retry = {};
    for (const f of bad) retry[f] = payload[f];
    const fixed = await translate(retry, hint, ' — попередній переклад не був українською, виправ');
    for (const f of bad) out[f] = fixed[f] ?? out[f];
  }
  const merged = { ...item };
  for (const f of fields) {
    if (payload[f] === undefined) continue;
    // Pole musí mít stejnou délku jako cs (faq se páruje podle pořadí).
    if (Array.isArray(payload[f]) && (!Array.isArray(out[f]) || out[f].length !== payload[f].length)) {
      console.warn(`  ⚠ ${hint}: pole ${f} má jinou délku → ponechávám cs`);
      continue;
    }
    if (out[f] !== undefined) merged[f] = out[f];
  }
  return merged;
}

async function pool(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await fn(items[idx], idx); }
      catch (e) { console.error(`  ✗ ${items[idx]?.slug}: ${e.message}`); out[idx] = items[idx]; }
    }
  }));
  return out;
}

const DRUH_FIELDS = ['name', 'name_plural', 'description'];
const PLEMENO_FIELDS = ['origin_country', 'color', 'description', 'body', 'faq'];
// `name` sk verze nechala česky („Včela kraňská"), pl ho přeložila správně.
// Pro uk je čeština v latince uprostřed azbuky obzvlášť vidět → překládá se.
const VCELY_FIELDS = ['name', 'puvod', 'vhodnost_cr', 'barva', 'description'];
const VYBAVENI_FIELDS = ['name', 'popis_kratky', 'description', 'orientacni_cena'];
const MED_FIELDS = ['name', 'zdroj_snusky', 'barva', 'chut', 'popis_kratky', 'description'];

const H_PLEMENA = `# Ukrajinský overlay katalogu plemen. slug, názvy plemen, čísla, obrázky
# a wiki odkazy zůstávají z cs — vážou se na ně slugy i fotky.
`;
const H_VCELARSTVI = `# Ukrajinský overlay včelařství. slug, latinské názvy, obrázky a odkazy
# zůstávají z cs. Údaje o vhodnosti pro ČR a ceny v Kč text označuje „у Чехії".
`;

// ── plemena: soubor = druh { name, description, plemena[] } ──────────────────
fs.mkdirSync('src/data/plemena-uk', { recursive: true });
const druhFiles = fs.readdirSync('src/data/plemena').filter((f) => f.endsWith('.yaml'));
console.log(`\nsrc/data/plemena → src/data/plemena-uk  (${druhFiles.length} souborů)`);
for (const file of druhFiles) {
  const druh = yaml.load(fs.readFileSync(path.join('src/data/plemena', file), 'utf-8'));
  const top = await translateItem(druh, DRUH_FIELDS, `druh ${druh.slug}`);
  const plemena = await pool(druh.plemena ?? [], (p) => translateItem(p, PLEMENO_FIELDS, `${druh.slug}/${p.slug}`));
  const out = { ...top, plemena };
  fs.writeFileSync(path.join('src/data/plemena-uk', file), H_PLEMENA + yaml.dump(out, { lineWidth: 100, noRefs: true }), 'utf-8');
  console.log(`  ✓ ${file} (${plemena.length} plemen)`);
}

// ── včelařství: soubor = pole položek ───────────────────────────────────────
fs.mkdirSync('src/data/vcelarstvi/uk', { recursive: true });
const VCEL = [['vcely.yaml', VCELY_FIELDS], ['vybaveni.yaml', VYBAVENI_FIELDS], ['med.yaml', MED_FIELDS]];
console.log(`\nsrc/data/vcelarstvi → src/data/vcelarstvi/uk  (${VCEL.length} souborů)`);
for (const [file, fields] of VCEL) {
  const items = yaml.load(fs.readFileSync(path.join('src/data/vcelarstvi', file), 'utf-8'));
  const out = await pool(items, (it) => translateItem(it, fields, `${file}/${it.slug}`));
  fs.writeFileSync(path.join('src/data/vcelarstvi/uk', file), H_VCELARSTVI + yaml.dump(out, { lineWidth: 100, noRefs: true }), 'utf-8');
  console.log(`  ✓ ${file} (${out.length} položek)`);
}
console.log('\nHotovo.');
