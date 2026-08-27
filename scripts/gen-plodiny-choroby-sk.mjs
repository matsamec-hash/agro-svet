// Vygeneruje slovenský overlay plodin (src/data/plodiny/sk/*.yaml) a chorob
// (src/data/choroby/sk/*.yaml) překladem cs YAML přes OpenAI.
//
// Sesterský skript ke gen-plodiny-choroby-pl.mjs (stejný overlay pattern:
// slug, skupina, hero_*, seti_mesice, sklizen_mesice, latinsky a wikipedia
// zůstávají BEZE ZMĚNY — jsou to klíče, ne zobrazovaná próza).
//
// ‼️ `choroby[]` u plodiny je pole CHIPŮ mapovaných na entitu choroby přes cs
// index → overlay drží pole ve STEJNÉM pořadí a délce.
//
// ‼️ Detekce zbytkové češtiny je u slovenštiny TĚŽŠÍ než u polštiny: sdílí
// skoro celou abecedu (rozdíl je jen ě/ř/ů, které sk nemá). Samotné ěřů proto
// nestačí — „pšenice" nebo „sklizeň" by prošly. Přidán slovník čistě českých
// tvarů z téhle domény (plodiny, choroby, agrotechnika, měsíce).
//
// Spuštění: node --env-file=.env scripts/gen-plodiny-choroby-sk.mjs
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí (spusť s --env-file)'); process.exit(1); }
const MODEL = process.env.SK_MODEL || 'gpt-4o-mini';
const CONCURRENCY = 4;
const MAX_FIX = 3;

// Písmena, která slovenština NEMÁ.
const CZ_LETTERS = /[ěřůĚŘŮ]/;
// Čistě české tvary, které se slovenským tvarem NEkolidují (sk ekvivalent v komentáři).
const CZ_WORDS = [
  'pšenice', 'ječmen', 'kukuřice', 'řepka', 'slunečnice', 'brambor', 'cukrovka', 'vojtěška',
  'jetel', 'žito', 'oves', 'hrách', 'luskovin', 'obilovin',
  'sklizeň', 'sklizni', 'sklizeň', 'sklizně', 'setí', 'výsevek', 'hnojení', 'osevní',
  'předplodin', 'porost', 'zrna/m', 'škůdc', 'choroba je', 'plíseň', 'padlí', 'sněť',
  'skvrnitost', 'hniloba řepky', 'listová', 'stéblo', 'stéblov', 'sloupkování',
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen',
  'září', 'říjen', 'listopad', 'prosinec',
  'České republice', 'v ČR', 'český', 'česká', 'české',
];
const CZ_WORD_RE = new RegExp(CZ_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
const hasCz = (s) => CZ_LETTERS.test(s) || CZ_WORD_RE.test(s);

const SYS = `Si expert na preklad poľnohospodárskej terminológie z češtiny do slovenčiny.
Prekladáš obsah agrárneho portálu pre slovenských farmárov.

PRAVIDLÁ:
- Prekladaj VÝLUČNE do spisovnej slovenčiny. Ani jedno české slovo, ani jeden český tvar.
- Čeština a slovenčina sú si blízke — nestačí "počeštený" text. Každé slovo musí byť
  slovenské (nie "pšenice" ale "pšenica", nie "sklizeň" ale "zber/žatva").
- Agronomická terminológia musí byť odborná a prirodzená pre slovenského farmára.
- Latinské názvy, jednotky, čísla, dátumy a rozsahy nechaj PRESNE tak, ako sú.
- Odkazy na Česko (ČR) preveď na slovenský kontext len tam, kde je to prirodzené
  (agrotechnické termíny sejby a zberu sú na Slovensku prakticky rovnaké).
  NEVYMÝŠĽAJ si slovenské štatistiky ani predpisy. Ak veta uvádza konkrétne české
  číslo (priemerný výnos v ČR), ponechaj číslo a napíš "v Česku".
- Zachovaj markdown formátovanie (**tučné**) a štruktúru.
- Odpovedaj VÝLUČNE korektným JSON-om s rovnakou štruktúrou ako vstup.

POVINNÝ SLOVNÍK (model sám od seba necháva české tvary — používaj VÝLUČNE tieto
slovenské ekvivalenty, aj v skloňovaní):
- pšenice → pšenica; ječmen → jačmeň; žito → raž; oves → ovos; kukuřice → kukurica
- řepka → repka; slunečnice → slnečnica; brambory → zemiaky; cukrovka → cukrová repa
- vojtěška → lucerna siata; jetel → ďatelina; hrách → hrach; luskoviny → strukoviny
- obiloviny → obilniny; olejniny → olejniny; okopaniny → okopaniny; pícniny → krmoviny
- sklizeň → zber (u obilnín aj "žatva"); setí → sejba; výsevek → výsevok
- hnojení → hnojenie; osevní postup → osevný postup; předplodina → predplodina
- seťové lůžko → sejbové lôžko; moření osiva → morenie osiva; poléhání → poliehanie
- porost → porast; zrno → zrno; klas → klas; stéblo → steblo
- sloupkování / stéblování → steblovanie; metání → klasenie; vzcházení → vzchádzanie
- škůdci → škodcovia; ochrana rostlin → ochrana rastlín; postřik → postrek
- padlí travní → múčnatka trávová
- braničnatka pšeničná / septorióza → septorióza listov pšenice (Zymoseptoria tritici)
- braničnatka → septorióza; fuzariózy klasu → fuzariózy klasu
- rzi (pšeničná, žlutá) → hrdze (pšeničná, žltá); rez → hrdza
- sněť zakrslá → sneť zakrpatená; prašná sněť → prašná sneť
- námel žitný → námeľ ražný; plíseň bramborová → pleseň zemiaková
- plíseň šedá → pleseň sivá; sklerotiniová hniloba → sklerotíniová hniloba
- cerkosporióza řepy → cerkosporióza repy; alternáriová skvrnitost → alternáriová škvrnitosť
- fomová hniloba řepky → fómová hniloba repky; háďátko → hlístovec
- MESIACE: leden→január, únor→február, březen→marec, duben→apríl, květen→máj,
  červen→jún, červenec→júl, srpen→august, září→september, říjen→október,
  listopad→november, prosinec→december`;

async function translate(obj, hint, extra = '') {
  const body = {
    model: MODEL,
    messages: [
      { role: 'system', content: SYS },
      { role: 'user', content: `Prelož hodnoty tohto JSON-u (${hint})${extra}. Kľúče nechaj bez zmeny:\n\n${JSON.stringify(obj, null, 1)}` },
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

async function translateFields(src, fields, hint) {
  const payload = {};
  for (const f of fields) if (src[f] !== undefined && src[f] !== null) payload[f] = src[f];
  let out = await translate(payload, hint);

  for (let pass = 0; pass < MAX_FIX; pass++) {
    const bad = Object.keys(payload).filter((f) => hasCz(JSON.stringify(out[f] ?? '')));
    if (bad.length === 0) break;
    const retry = {};
    for (const f of bad) retry[f] = payload[f];
    const fixed = await translate(retry, hint, ' — predchádzajúci preklad obsahoval české slová, oprav na čistú slovenčinu');
    for (const f of bad) out[f] = fixed[f] ?? out[f];
  }

  // Model občas klíč přejmenuje do slovenštiny. Klíče jsou API, ne text.
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
    const left = Object.keys(tr).filter((f) => hasCz(JSON.stringify(tr[f] ?? '')));
    console.log(`  ${left.length ? '⚠' : '✓'} ${it.slug}${left.length ? ` — zbytková čeština: ${left.join(', ')}` : ''}`);
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

const H_PLODINY = `# Slovenský overlay plodin. slug, skupina, hero_*, seti_mesice, sklizen_mesice
# a wikipedia zůstávají z cs (klíče, obrázky, kalendář). Pole choroby[] drží
# STEJNÉ pořadí i délku jako cs — mapování na entitu jde přes cs index.
`;
const H_CHOROBY = `# Slovenský overlay chorob. slug, latinsky, aliases a ucinne_latky zůstávají z cs
# (aliasy jsou mapovací klíče, účinné látky jsou mezinárodní názvy).
`;

await run('src/data/plodiny', 'src/data/plodiny/sk', PLODINA_FIELDS, H_PLODINY);
await run('src/data/choroby', 'src/data/choroby/sk', CHOROBA_FIELDS, H_CHOROBY);
console.log('\nHotovo.');
