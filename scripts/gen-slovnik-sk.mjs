// Vygeneruje slovenskou variantu slovníku (src/lib/slovnik.sk.ts) překladem
// českého SLOVNIK přes OpenAI (gpt-4o-mini). Overlay pattern jako pl/uk:
// slug/kategorie/related/externalUrl/čísla identické s cs, přeloží se jen
// text (term, alias, shortDef, longDef, externalLabel).
//
// Spuštění: node --import tsx --env-file=<cesta>/.env scripts/gen-slovnik-sk.mjs
// Vyžaduje OPENAI_API_KEY v env. Šetří Claude — bulk běží na OpenAI.
import { SLOVNIK } from '../src/lib/slovnik.ts';
import fs from 'node:fs';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí. Spusť s node --env-file=.env'); process.exit(1); }

const MODEL = process.env.SLOVNIK_MODEL || 'gpt-4o-mini';
const BATCH = 3;            // menší dávka → žádné truncation dlouhých longDef
const CONCURRENCY = 5;
const MAX_FIX_PASSES = 3;   // opakuj re-překlad hesel se zbytkovou češtinou
const OUT = new URL('../src/lib/slovnik.sk.ts', import.meta.url);
const CZ_RE = /[řěů]/;
const hasCz = (t) => CZ_RE.test(`${t.term} ${t.shortDef} ${t.longDef} ${(t.alias || []).join(' ')}`);

// Kategorie labely (14) — ručně, malé.
const KATEGORIE_LABELS_SK = {
  technologie: 'Technológie',
  pohon: 'Pohon a motor',
  hnojivo: 'Hnojivá',
  dotace: 'Dotácie a podpory',
  agrotechnika: 'Agrotechnika',
  regulace: 'Regulácie a normy',
  'precise-farming': 'Presné poľnohospodárstvo',
  jednotky: 'Jednotky a meranie',
  historie: 'História a archaické pojmy',
  chov: 'Chov a živočíšna výroba',
  slang: 'Hovorové výrazy a slang',
  ochrana: 'Ochrana rastlín a postreky',
  plodiny: 'Plodiny a komodity',
  vcelarstvi: 'Včelárstvo',
};

const SYS = `Si expert prekladateľ poľnohospodárskej terminológie z češtiny do slovenčiny.
Prekladáš heslá zo slovníka poľnohospodárskych pojmov. Pravidlá:
- Prelož polia: term, alias (pole reťazcov), shortDef, longDef, externalLabel.
- ZACHOVAJ markdown, zalomenia riadkov (\\n\\n), číslované zoznamy, čísla, jednotky, ceny (napr. "100 000 Kč" nechaj) a vlastné mená značiek/noriem/skratiek (AdBlue, DPF, SCR, Stage V, ISO, SZIF a pod.).
- Preklad musí byť prirodzená spisovná slovenčina, NIE čeština. Nesmú zostať české znaky ř/ě/ů ani české tvary.
- Zachovaj odborný, vecný tón. Neskracuj obsah.
- Ak je pojem viazaný na české reálie (napr. SZIF), prelož jazyk, fakt ponechaj.
Vráť PRESNE JSON: {"terms":[{"slug","term","alias","shortDef","longDef","externalLabel"}, ...]} v rovnakom poradí a počte ako vstup. externalLabel vynechaj ak vo vstupe nie je.`;

function batches(arr, n) { const o = []; for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n)); return o; }

async function translateBatch(items, attempt = 1) {
  const input = items.map((t) => ({
    slug: t.slug, term: t.term, alias: t.alias ?? [],
    shortDef: t.shortDef ?? '', longDef: t.longDef ?? '',
    ...(t.externalLabel ? { externalLabel: t.externalLabel } : {}),
  }));
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL, temperature: 0.2, max_tokens: 12000,
        response_format: { type: 'json_object' },
        messages: [{ role: 'system', content: SYS }, { role: 'user', content: JSON.stringify({ terms: input }) }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const out = parsed.terms;
    if (!Array.isArray(out) || out.length !== items.length) throw new Error(`počet ${out?.length} != ${items.length}`);
    return items.map((cs, i) => ({ ...cs, ...pickTx(out[i]) }));
  } catch (e) {
    if (attempt < 4) { await new Promise((r) => setTimeout(r, 800 * attempt)); return translateBatch(items, attempt + 1); }
    console.error(`  ✗ batch selhal (${items[0].slug}…): ${e.message}`);
    return items.map((cs) => ({ ...cs })); // fallback = cs (označí se v QA)
  }
}

// Ponech jen přeložitelná pole z odpovědi (zbytek bereme z cs originálu).
function pickTx(o) {
  const r = {};
  if (typeof o.term === 'string') r.term = o.term;
  if (Array.isArray(o.alias)) r.alias = o.alias;
  if (typeof o.shortDef === 'string') r.shortDef = o.shortDef;
  if (typeof o.longDef === 'string') r.longDef = o.longDef;
  if (typeof o.externalLabel === 'string') r.externalLabel = o.externalLabel;
  return r;
}

async function pool(tasks, n) {
  const results = new Array(tasks.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < tasks.length) { const idx = i++; results[idx] = await tasks[idx](); process.stdout.write(`\r  ${results.filter(Boolean).length}/${tasks.length} dávek`); }
  }));
  return results;
}

// Načti dřívější sk výstup (pro idempotentní fix-passy). Čistá hesla zachováme,
// jen ta se zbytkovou češtinou (nebo == cs originál) se přeloží znovu.
function loadExisting() {
  try {
    const src = fs.readFileSync(OUT, 'utf8');
    const m = src.match(/SLOVNIK_SK: SlovnikTerm\[\] = (\[[\s\S]*?\]);\s*\n\nexport const KATEGORIE/);
    if (!m) return {};
    return Object.fromEntries(JSON.parse(m[1]).map((t) => [t.slug, t]));
  } catch { return {}; }
}

const main = async () => {
  const existing = loadExisting();
  // start: čistý sk zachovej, jinak cs originál (ten se přeloží)
  const result = new Map(SLOVNIK.map((cs) => {
    const ex = existing[cs.slug];
    return [cs.slug, ex && !hasCz(ex) ? ex : cs];
  }));
  const cleanStart = SLOVNIK.filter((cs) => { const r = result.get(cs.slug); return r !== cs && !hasCz(r); }).length;
  console.log(`Start: ${cleanStart}/${SLOVNIK.length} hesel už čistě přeloženo; dopřekládám zbytek (dávky po ${BATCH}).`);

  for (let pass = 1; pass <= MAX_FIX_PASSES; pass++) {
    const todo = SLOVNIK.filter((cs) => hasCz(result.get(cs.slug)));
    if (!todo.length) break;
    console.log(`\nPass ${pass}: překládám ${todo.length} hesel…`);
    const tasks = batches(todo, BATCH).map((c) => () => translateBatch(c));
    const done = (await pool(tasks, CONCURRENCY)).flat();
    for (const t of done) result.set(t.slug, t);
    const still = SLOVNIK.filter((cs) => hasCz(result.get(cs.slug))).length;
    console.log(`\n  po pass ${pass}: ${still} hesel se zbytkovou češtinou`);
    if (!still) break;
  }

  const SK = SLOVNIK.map((cs) => result.get(cs.slug));
  const leaks = SK.filter(hasCz);
  if (leaks.length) console.warn(`⚠ ZBÝVÁ ${leaks.length} hesel s češtinou: ${leaks.map((t) => t.slug).join(', ')}`);
  else console.log(`✓ QA: 0 zbytkové češtiny (${SK.length} hesel)`);

  const header = `// Slovenská (sk) varianta slovníku — překlad CS hesel přes OpenAI (${MODEL}).
// ${SK.length} hesel; slug/kategorie/related/externalUrl/čísla identické s CS (SLOVNIK).
// Generováno scripts/gen-slovnik-sk.mjs. Overlay pattern jako slovnik.pl/uk.ts.
import type { SlovnikTerm, SlovnikKategorie } from './slovnik';

export const SLOVNIK_SK: SlovnikTerm[] = ${JSON.stringify(SK, null, 2)};

export const KATEGORIE_LABELS_SK: Record<SlovnikKategorie, string> = ${JSON.stringify(KATEGORIE_LABELS_SK, null, 2)};
`;
  fs.writeFileSync(OUT, header);
  console.log(`✓ zapsáno ${OUT.pathname}`);
};

main();
