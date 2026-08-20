// Vygeneruje polský overlay plodin (src/data/plodiny/pl/*.yaml) a chorob
// (src/data/choroby/pl/*.yaml) překladem cs YAML přes OpenAI.
//
// Overlay pattern jako vcelarstvi/pl a stroje/pl: slug, skupina, hero_*,
// seti_mesice, sklizen_mesice, latinsky a wikipedia zůstávají BEZE ZMĚNY —
// jsou to klíče (mapování, obrázky, kalendář), ne zobrazovaná próza.
//
// ‼️ `choroby[]` u plodiny je pole CHIPŮ, které se přes přesný alias mapují na
// entitu choroby. Překlad by mapování rozbil → overlay drží pole ve STEJNÉM
// pořadí a délce, mapování jde dál přes cs (index), zobrazuje se pl.
//
// Spuštění: node --env-file=<cesta>/.env scripts/gen-plodiny-choroby-pl.mjs
// Šetří Claude — bulk běží na OpenAI.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí (spusť s --env-file)'); process.exit(1); }
const MODEL = process.env.PL_MODEL || 'gpt-4o-mini';
const CONCURRENCY = 4;
const MAX_FIX = 3;
// Písmena, která polština NEMÁ → marker zbytkové češtiny.
// ‼️ Nestačí ěřů: polština nemá ani č š ž ď ť ň, ani á é í ú ý (má jen ą ę ó ć ł ń ś ź ż).
// S užší sadou prošlo „Padlí trawne" i „braničnatka pšeničná" jako hotový překlad.
const CZ_RE = /[ěřůčšžďťňáéíúýĚŘŮČŠŽĎŤŇÁÉÍÚÝ]/;

const SYS = `Jesteś ekspertem tłumaczem terminologii rolniczej z języka czeskiego na polski.
Tłumaczysz treści portalu rolniczego dla polskich rolników.

ZASADY:
- Tłumacz WYŁĄCZNIE na poprawny język polski. Ani jedno czeskie słowo.
- Terminologia agronomiczna musi być fachowa i naturalna dla polskiego rolnika
  (np. "výsevek" = "norma wysiewu", "osevní postup" = "zmianowanie",
  "hnojení" = "nawożenie", "sklizeň" = "zbiór", "porost" = "łan/plantacja").
- Nazwy łacińskie, jednostki, liczby, daty i zakresy zostaw DOKŁADNIE tak jak są.
- Odniesienia do Czech (ČR) przeliczaj na kontekst polski TYLKO tam, gdzie to
  naturalne; nie zmyślaj polskich danych ani przepisów. Jeśli zdanie mówi
  o czeskim terminie agrotechnicznym, zachowaj sens, ale napisz "w Czechach".
- Zachowaj formatowanie markdown (**pogrubienia**) i strukturę.
- Odpowiadaj WYŁĄCZNIE poprawnym JSON-em o tej samej strukturze co wejście.

OBOWIĄZKOWY SŁOWNIK CHORÓB (model sam z siebie zostawiał czeskie nazwy albo
tworzył hybrydy typu "Braničnatka pszeniczna" / "Námul żytni" — używaj WYŁĄCZNIE
tych polskich odpowiedników, także w odmianie przez przypadki):
- braničnatka pšeničná / septorióza → septorioza liści pszenicy (Zymoseptoria tritici)
- braničnatka → septorioza
- námel žitný / námel → sporysz żyta / sporysz (Claviceps purpurea)
- padlí travní → mączniak prawdziwy zbóż i traw
- rzi obilovin / rez → rdze zbóż / rdza
- fuzariózy klasu → fuzariozy kłosa
- plíseň bramborová → zaraza ziemniaka
- plíseň šedá → szara pleśń
- sklerotiniová hniloba → zgnilizna twardzikowa
- cerkosporióza řepy → chwościk buraka
- alternáriová skvrnitost → alternarioza (czerń krzyżowych)
- fomová hniloba řepky → sucha zgnilizna kapustnych
- sněť zakrslá → śnieć karłowa
- prašná sněť → głownia pyląca
- cizosprašný / cizosprašnost → obcopylny / obcopylność
- klas / stéblo / pochva listová → kłos / źdźbło / pochwa liściowa`;

async function translate(obj, hint) {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYS },
      { role: 'user', content: `Przetłumacz wartości tego JSON-a (${hint}). Klucze zostaw bez zmian:\n\n${JSON.stringify(obj, null, 1)}` },
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
    const j = await r.json();
    return JSON.parse(j.choices[0].message.content);
  }
  throw new Error('OpenAI nedostupné po 4 pokusech');
}

// Přeloží jen vyjmenovaná pole; zbytek se z cs kopíruje beze změny.
async function translateFields(src, fields, hint) {
  const payload = {};
  for (const f of fields) if (src[f] !== undefined && src[f] !== null) payload[f] = src[f];
  let out = await translate(payload, hint);

  for (let pass = 0; pass < MAX_FIX; pass++) {
    const bad = Object.keys(payload).filter((f) => CZ_RE.test(JSON.stringify(out[f] ?? '')));
    if (bad.length === 0) break;
    const retry = {};
    for (const f of bad) retry[f] = payload[f];
    const fixed = await translate(retry, `${hint} — poprzednie tłumaczenie zawierało czeskie słowa, popraw na czysty polski`);
    for (const f of bad) out[f] = fixed[f] ?? out[f];
  }
  // Model občas klíč přejmenuje do polštiny (viděno: vysevek → vyselek).
  // Klíče jsou API, ne text — namapuj zpátky podle pořadí, ať se to nerozjede.
  const missing = Object.keys(payload).filter((f) => out[f] === undefined);
  if (missing.length) {
    const extra = Object.keys(out).filter((k) => payload[k] === undefined);
    for (let i = 0; i < missing.length && i < extra.length; i++) {
      console.warn(`  ⚠ ${hint}: klíč "${extra[i]}" → "${missing[i]}" (model přejmenoval)`);
      out[missing[i]] = out[extra[i]];
      delete out[extra[i]];
    }
  }

  // Pole musí mít stejnou délku jako cs (chipy chorob se mapují dle indexu).
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
    console.log(`  ✓ ${it.slug}`);
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

const H_PLODINY = `# Polský overlay plodin. slug, skupina, hero_*, seti_mesice, sklizen_mesice
# a wikipedia zůstávají z cs (klíče, obrázky, kalendář). Pole choroby[] drží
# STEJNÉ pořadí i délku jako cs — mapování na entitu jde přes cs index.
`;
const H_CHOROBY = `# Polský overlay chorob. slug, latinsky, aliases a ucinne_latky zůstávají z cs
# (aliasy jsou mapovací klíče, účinné látky jsou mezinárodní názvy).
`;

await run('src/data/plodiny', 'src/data/plodiny/pl', PLODINA_FIELDS, H_PLODINY);
await run('src/data/choroby', 'src/data/choroby/pl', CHOROBA_FIELDS, H_CHOROBY);
console.log('\nHotovo.');
