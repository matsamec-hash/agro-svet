// Vygeneruje ukrajinské texty žebříčků (blok pro src/lib/tier-lists.i18n.ts).
//
// Žebříčky jsou odvozené z katalogu strojů, takže nejsou jurisdikčně vázané —
// překládá se jen próza (title/description/methodology/callToAction), filtry
// a řazení zůstávají v tier-lists.ts.
//
// ‼️ Odkazy na ČR ve zdrojových textech („běžné polní práce v ČR", „na českém
// trhu") se pro uk NEPŘEPISUJÍ na Ukrajinu — sortiment i značky na ukrajinském
// trhu jsou jiné a tvrdit opak by znamenalo vymýšlet. Zůstávají neutrální.
//
// Spuštění: npx tsx --env-file=.env scripts/gen-zebricky-uk.mts
import fs from 'node:fs';

// tier-lists.ts nejde naimportovat mimo Vite (přes stroje.ts táhne
// import.meta.glob), takže cs texty čteme ze zdrojáku. Formát je stabilní:
// jeden řádek na pole, jednoduché uvozovky.
const SRC = fs.readFileSync('src/lib/tier-lists.ts', 'utf-8');
const field = (block: string, name: string) => {
  const m = block.match(new RegExp(`^    ${name}: '((?:[^'\\\\]|\\\\.)*)',$`, 'm'));
  if (!m) throw new Error(`${name} nenalezeno v bloku:\n${block.slice(0, 120)}`);
  return m[1].replace(/\\'/g, "'");
};
const TIER_LISTS = SRC.split(/\n  \{\n/).slice(1)
  .filter((b) => /^    slug: '/.test(b))
  .map((b) => ({
    slug: field(b, 'slug'), title: field(b, 'title'), description: field(b, 'description'),
    methodology: field(b, 'methodology'), callToAction: field(b, 'callToAction'),
  }));
if (TIER_LISTS.length !== 17) throw new Error(`čekal jsem 17 žebříčků, načetl ${TIER_LISTS.length}`);

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí'); process.exit(1); }
const MODEL = process.env.UK_MODEL || 'gpt-4.1';

const SYS = `Ти експерт-перекладач сільськогосподарської термінології з чеської на українську.
Перекладаєш тексти рейтингів техніки для аграрного порталу.

ПРАВИЛА:
- Перекладай ВИКЛЮЧНО українською літературною мовою. Жодного чеського слова.
- НЕ перекладай власні назви: марки й моделі техніки (John Deere, Fendt, Claas
  Lexion, Case Axial-Flow, New Holland, Zetor, Kubota, Väderstad, Pöttinger,
  Amazone, Bednar, Horsch, Krone, Massey Ferguson, Deutz), позначення серій
  (6M/6R, T7, Puma), скорочення (CVT, PTO, GPS).
- Числа, одиниці, роки й діапазони залиш ТОЧНО як є (150–250, 74 kW, 18 m).
- Потужність у "коní" перекладай як "к. с." (кінських сил).
- Згадки про Чехію ("v ČR", "na českém trhu", "průměrná česká farma") НЕ заміняй
  на Україну — переформулюй нейтрально ("для середнього господарства",
  "на європейському ринку"). Не вигадуй українських даних.
- Відповідай ВИКЛЮЧНО коректним JSON з тією самою структурою, що на вході.`;

const CZ = /[a-záčďéěíňóřšťúůýž]{4,}/i;
const CYR = /[Ѐ-ӿ]/;

async function translate(obj: unknown, hint: string, extra = ''): Promise<any> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: `Переклади значення цього JSON (${hint})${extra}. Ключі залиш без змін:\n\n${JSON.stringify(obj, null, 1)}` },
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

const FIELDS = ['title', 'description', 'methodology', 'callToAction'] as const;
const out: Record<string, Record<string, string>> = {};

for (const d of TIER_LISTS) {
  const payload = Object.fromEntries(FIELDS.map((f) => [f, (d as Record<string, string>)[f]]));
  let tr = await translate(payload, d.slug);
  // Každé pole musí být v azbuce; latinka smí zůstat jen v názvech značek,
  // takže kontrolujeme PŘÍTOMNOST azbuky, ne nepřítomnost latinky.
  for (let pass = 0; pass < 3; pass++) {
    const bad = FIELDS.filter((f) => !CYR.test(String(tr[f] ?? '')));
    if (!bad.length) break;
    const retry = Object.fromEntries(bad.map((f) => [f, payload[f]]));
    const fixed = await translate(retry, d.slug, ' — попередній переклад не був українською, виправ');
    for (const f of bad) tr[f] = fixed[f] ?? tr[f];
  }
  out[d.slug] = Object.fromEntries(FIELDS.map((f) => [f, tr[f]]));
  const suspicious = FIELDS.filter((f) => (String(tr[f]).match(new RegExp(CZ, 'g')) ?? []).length > 6);
  console.log(`  ${suspicious.length ? '⚠' : '✓'} ${d.slug}${suspicious.length ? ` — hodně latinky v: ${suspicious.join(', ')}` : ''}`);
}

const esc = (s: string) => '`' + s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
const lines = ['  uk: {'];
for (const d of TIER_LISTS) {
  lines.push(`    '${d.slug}': {`);
  for (const f of FIELDS) lines.push(`      ${f}: ${esc(out[d.slug][f])},`);
  lines.push('    },');
}
lines.push('  },');
fs.writeFileSync('.zebricky-uk-block.ts', lines.join('\n') + '\n');
console.log(`\n→ .zebricky-uk-block.ts (${TIER_LISTS.length} žebříčků)`);
