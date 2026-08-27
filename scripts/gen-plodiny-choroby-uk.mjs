// Vygeneruje ukrajinský overlay plodin (src/data/plodiny/uk/*.yaml) a chorob
// (src/data/choroby/uk/*.yaml) překladem cs YAML přes OpenAI.
//
// Sesterský skript ke gen-plodiny-choroby-{pl,sk}.mjs — stejný overlay pattern:
// slug, skupina, hero_*, seti_mesice, sklizen_mesice, latinsky a wikipedia
// zůstávají BEZE ZMĚNY (klíče, ne zobrazovaná próza), choroby[] drží stejné
// pořadí i délku (chipy se mapují přes cs index).
//
// ‼️ Termíny setí a sklizně ve zdrojových textech jsou ČESKÉ. Pro ukrajinské
// podmínky neplatí, takže se NEPŘEPISUJÍ na ukrajinská data (ta bychom museli
// vymyslet) — prompt trvá na formulaci „у Чехії", ať je zdroj údaje jasný.
//
// ‼️ Registr přípravků: cs text odkazuje na ÚKZÚZ, ukrajinský ekvivalent je
// Державний реєстр пестицидів і агрохімікатів.
//
// Detekce zbytkové češtiny je u ukrajinštiny snadná (jiné písmo): hlídáme
// PŘÍTOMNOST azbuky, latinka smí zůstat jen v latinských názvech a značkách.
//
// Spuštění: node --env-file=.env scripts/gen-plodiny-choroby-uk.mjs
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí (spusť s --env-file)'); process.exit(1); }
const MODEL = process.env.UK_MODEL || 'gpt-4.1';
const CONCURRENCY = 4;
const MAX_FIX = 3;

const CYR = /[Ѐ-ӿ]/;
/** Pole bez jediného cyrilického znaku = neproběhl překlad. */
const missingUk = (v) => {
  const s = JSON.stringify(v ?? '');
  return /[A-Za-zÁ-ž]{3,}/.test(s) && !CYR.test(s);
};

const SYS = `Ти експерт-перекладач сільськогосподарської термінології з чеської на українську.
Перекладаєш контент аграрного порталу для українських фермерів.

ПРАВИЛА:
- Перекладай ВИКЛЮЧНО українською літературною мовою. Жодного чеського слова.
- Агрономічна термінологія має бути фаховою і природною для українського фермера
  ("výsevek" = "норма висіву", "osevní postup" = "сівозміна", "hnojení" =
  "удобрення", "sklizeň" = "збирання врожаю", "porost" = "посів/травостій",
  "podmítka" = "лущення стерні", "moření osiva" = "протруєння насіння").
- Латинські назви, одиниці, числа, дати й діапазони залиш ТОЧНО як є.
- ‼️ Строки сівби та збирання у джерелі — ЧЕСЬКІ. НЕ переписуй їх на українські
  умови й не вигадуй українських дат. Якщо речення називає конкретний строк
  або врожайність, додай уточнення "у Чехії" (напр. "оптимальний строк сівби
  у Чехії: 1.–20. жовтня").
- Реєстр засобів захисту рослин: чеський ÚKZÚZ заміни на
  "Державний реєстр пестицидів і агрохімікатів України".
- Зберігай форматування markdown (**жирний**) і структуру.
- Відповідай ВИКЛЮЧНО коректним JSON з тією самою структурою, що на вході.`;

async function translate(obj, hint, extra = '') {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYS },
      { role: 'user', content: `Переклади значення цього JSON (${hint})${extra}. Ключі залиш без змін:\n\n${JSON.stringify(obj, null, 1)}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.2,
  };
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(body),
    });
    if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 1500 * attempt)); continue; }
    if (!r.ok) throw new Error(`OpenAI ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return JSON.parse((await r.json()).choices[0].message.content);
  }
  throw new Error('OpenAI nedostupné po 4 pokusech');
}

async function translateFields(src, fields, hint) {
  const payload = {};
  for (const f of fields) if (src[f] !== undefined && src[f] !== null) payload[f] = src[f];
  let out = await translate(payload, hint);

  for (let pass = 0; pass < MAX_FIX; pass++) {
    const bad = Object.keys(payload).filter((f) => missingUk(out[f]));
    if (bad.length === 0) break;
    const retry = {};
    for (const f of bad) retry[f] = payload[f];
    const fixed = await translate(retry, hint, ' — попередній переклад не був українською, виправ');
    for (const f of bad) out[f] = fixed[f] ?? out[f];
  }

  const missing = Object.keys(payload).filter((f) => out[f] === undefined);
  if (missing.length) {
    const extra = Object.keys(out).filter((k) => payload[k] === undefined);
    for (let i = 0; i < missing.length && i < extra.length; i++) {
      console.warn(`  ⚠ ${hint}: klíč "${extra[i]}" → "${missing[i]}" (model přejmenoval)`);
      out[missing[i]] = out[extra[i]];
      delete out[extra[i]];
    }
  }

  for (const f of fields) {
    if (Array.isArray(payload[f]) && (!Array.isArray(out[f]) || out[f].length !== payload[f].length)) {
      console.warn(`  ⚠ ${hint}: pole ${f} má jinou délku (${out[f]?.length} vs ${payload[f].length}) → ponechávám cs`);
      out[f] = payload[f];
    }
  }
  return out;
}

async function pool(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await fn(items[idx], idx); }
      catch (e) { console.error(`  ✗ ${items[idx].slug}: ${e.message}`); out[idx] = null; }
    }
  }));
  return out;
}

const PLODINA_FIELDS = ['name', 'name_plural', 'description', 'vysevek', 'hnojeni', 'vynos_t_ha', 'sklizen', 'vyuziti', 'choroby', 'osevni_postup', 'faq'];
const CHOROBA_FIELDS = ['name', 'puvodce', 'popis', 'priznaky', 'hostitele', 'sireni', 'skodlivost', 'cyklus', 'ochrana', 'faq'];

async function run(srcDir, outDir, fields, header) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.yaml'));
  console.log(`\n${srcDir} → ${outDir}  (${files.length} souborů)`);
  const items = files.map((f) => ({ file: f, ...yaml.load(fs.readFileSync(path.join(srcDir, f), 'utf-8')) }));
  const res = await pool(items, async (it) => {
    const tr = await translateFields(it, fields, `${it.slug}`);
    const left = Object.keys(tr).filter((f) => missingUk(tr[f]));
    console.log(`  ${left.length ? '⚠' : '✓'} ${it.slug}${left.length ? ` — bez azbuky: ${left.join(', ')}` : ''}`);
    return { file: it.file, slug: it.slug, ...tr };
  });
  let ok = 0;
  for (const r of res) {
    if (!r) continue;
    const { file, ...data } = r;
    fs.writeFileSync(path.join(outDir, file), header + yaml.dump(data, { lineWidth: 100, noRefs: true }), 'utf-8');
    ok++;
  }
  console.log(`  → zapsáno ${ok}/${files.length}`);
}

const H_PLODINY = `# Ukrajinský overlay plodin. slug, skupina, hero_*, seti_mesice, sklizen_mesice
# a wikipedia zůstávají z cs (klíče, obrázky, kalendář). Pole choroby[] drží
# STEJNÉ pořadí i délku jako cs — mapování na entitu jde přes cs index.
# Termíny setí a sklizně jsou ČESKÉ a text to říká nahlas („у Чехії").
`;
const H_CHOROBY = `# Ukrajinský overlay chorob. slug, latinsky, aliases a ucinne_latky zůstávají z cs
# (aliasy jsou mapovací klíče, účinné látky jsou mezinárodní názvy).
`;

await run('src/data/plodiny', 'src/data/plodiny/uk', PLODINA_FIELDS, H_PLODINY);
await run('src/data/choroby', 'src/data/choroby/uk', CHOROBA_FIELDS, H_CHOROBY);
console.log('\nHotovo.');
