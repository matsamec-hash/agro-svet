// Přeloží set otázek kvízu „historie značek" do ukrajinštiny (src/lib/kviz.uk.ts).
//
// ‼️ Jurisdikčně vázané otázky (q10 VCS sazby, q11 BISS v Kč, q13 LPIS/SZIF)
// se NEPŘEKLÁDAJÍ — BISS je navíc nástroj EU, jehož ukrajinský ekvivalent
// neexistuje. Skript je přeskočí a nechá je dopsat ručně, aby model nevymýšlel
// ukrajinská čísla. Stejný princip jako u pl a sk.
//
// Spuštění: npx tsx --env-file=.env scripts/gen-kviz-uk.mts
import fs from 'node:fs';
import { KVIZ_HISTORIE } from '../src/lib/kviz';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí'); process.exit(1); }
const MODEL = process.env.UK_MODEL || 'gpt-4.1';
const JURISDICTION = new Set(['q10', 'q11', 'q13']);

const SYS = `Ти експерт-перекладач з чеської на українську для аграрного порталу.
Перекладаєш питання вікторини про техніку та бренди.

ПРАВИЛА:
- Перекладай ВИКЛЮЧНО українською літературною мовою. Жодного чеського слова.
- НЕ перекладай власні назви (John Deere, Fendt, Zetor, Kubota, ISOBUS, AdBlue,
  Quadtrac, Stage V, RTK GPS), числа, роки, одиниці й технічні скорочення.
- Потужність у "koní" перекладай як "к. с.".
- Збережи ПОРЯДОК і КІЛЬКІСТЬ варіантів — індекс правильної відповіді на них спирається.
- Відповідай ВИКЛЮЧНО коректним JSON з тією самою структурою, що на вході.`;

async function translate(obj: unknown, hint: string, extra = ''): Promise<any> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: `Prelož hodnoty (${hint})${extra}. Kľúče nechaj bez zmeny:\n\n${JSON.stringify(obj, null, 1)}` },
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

/** Bez jediného cyrilického znaku = neproběhl překlad. */
const CZ = /^[^\u0400-\u04FF]*$/;
const out: any[] = [];
for (const q of KVIZ_HISTORIE) {
  if (JURISDICTION.has(q.id)) { console.log(`  ⏭ ${q.id} — jurisdikční, dopiš ručně`); continue; }
  const payload = { question: q.question, options: q.options.map((o) => o.text), explanation: q.explanation, sourceLabel: q.sourceLabel };
  let tr = await translate(payload, q.id);
  for (let pass = 0; pass < 3; pass++) {
    if (!CZ.test(JSON.stringify(tr))) break;
    tr = await translate(payload, q.id, ' — попередній переклад не був українською, виправ');
  }
  if (!Array.isArray(tr.options) || tr.options.length !== q.options.length) {
    console.warn(`  ⚠ ${q.id}: jiný počet možností → ponechávám cs`);
    tr.options = q.options.map((o) => o.text);
  }
  out.push({ ...q, question: tr.question, options: q.options.map((o, i) => ({ ...o, text: tr.options[i] })), explanation: tr.explanation, sourceLabel: tr.sourceLabel ?? q.sourceLabel });
  console.log(`  ✓ ${q.id}`);
}

fs.writeFileSync('.kviz-uk.json', JSON.stringify(out, null, 2), 'utf-8');
console.log(`\n→ .kviz-uk.json (${out.length} přeložených otázek, ${JURISDICTION.size} k ručnímu dopsání)`);
