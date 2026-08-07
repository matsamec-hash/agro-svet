#!/usr/bin/env node
// Přeloží OBECNÉ (nejurisdikční) CZ články do sk/pl a upsertne do
// `article_translations`. Jurisdikční kategorie (dotace/legislativa/trh) se
// NEPŘEKLÁDAJÍ (YMYL + pro non-cs skryté). Ve výchozím stavu jen chybějící.
//
//   --locale sk|pl   cílový jazyk (povinné)
//   --selfhost       zapiš na PROD (self-hosted supabase.samecdigital.com)
//   --dry            neukládej, jen vypiš
//   --only <slug>    jen jeden článek (ignoruje jurisdikční filtr)
//   --force          přegeneruj i už přeložené
//
// ‼️ SPLIT-BRAIN: prod čte self-hosted (.env.selfhost / SH_*), cloud (.env) je
// dev mirror → pro prod VŽDY --selfhost. OpenAI klíč: ~/.army-svet-openai-key.
//
// SK vs PL strategie:
//  - PL = REFRAMING (CZ rámování → PL/obecné) — PL homepage má být polská.
//  - SK = nativní slovenština, DRŽÍ české rámování (portál je český; konzistence
//    s 23 existujícími SK články, viz scripts/i18n-translate.py glosář).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const LOCALE = args.includes('--locale') ? args[args.indexOf('--locale') + 1] : null;
if (!['sk', 'pl'].includes(LOCALE)) { console.error('Použij --locale sk|pl'); process.exit(1); }
const SELFHOST = args.includes('--selfhost');
const DRY = args.includes('--dry');
const FORCE = args.includes('--force');
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

const env = fs.readFileSync(path.join(ROOT, SELFHOST ? '.env.selfhost' : '.env'), 'utf8');
const g = (k) => { const m = env.match(new RegExp('^' + k + '=(.*)$', 'm')); return m ? m[1].trim() : null; };
const SUPABASE_URL = SELFHOST ? g('SH_SUPABASE_URL') : g('SUPABASE_URL');
const SUPABASE_KEY = SELFHOST ? g('SH_SUPABASE_KEY') : g('SUPABASE_SERVICE_KEY');
const OPENAI_KEY = fs.readFileSync(path.join(os.homedir(), '.army-svet-openai-key'), 'utf8').trim();
const SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';
const MODEL = 'gpt-4.1-mini';
const H = { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY };

// Jurisdikční = české sazby/legislativa/trh → NIKDY nepřekládat (YMYL).
const isJurisdictional = (cat) => /dotace|legislativa|trh/i.test(cat || '');

const PROMPTS = {
  pl: `Jesteś profesjonalnym tłumaczem i redaktorem SEO polskiego portalu rolniczego.
Dostajesz czeski artykuł (tytuł, lead, treść HTML) i tworzysz jego POLSKĄ wersję.

ZASADY:
- Pisz naturalną, poprawną polszczyzną jak native — NIE dosłownie, ale jak polski dziennikarz rolniczy.
- REFRAMING: artykuł ma brzmieć jak napisany dla polskiego/ogólnego czytelnika, NIE jako tekst o Czechach.
  * Ramy typu „české zemědělství / v Česku / čeští zemědělci / na českých polích" zamień na polski lub ogólny kontekst.
  * Twierdzenia o dostępności rynkowej związane z jednym krajem UOGÓLNIJ („wchodzi na rynek / trafia do Europy").
- NIE zmyślaj polskich faktów, liczb, dotacji ani nazw instytucji. Uniwersalne fakty techniczne zachowaj bez zmian.
  Liczby, jednostki, nazwy własne i modele maszyn NIE tłumacz.
- Strukturę HTML (<p>, <h2>, <h3>, <ul>, <li>, <strong>, <a href>) zachowaj 1:1.
- Zwróć WYŁĄCZNIE obiekt JSON: title, perex, content, seo_title, seo_description.`,
  sk: `Si profesionálny prekladateľ a SEO copywriter slovenského poľnohospodárskeho portálu.
Dostaneš český článok (titulok, perex, HTML telo) a vytvoríš jeho SLOVENSKÚ verziu.

PRAVIDLÁ:
- Píš prirodzenou spisovnou slovenčinou ako rodený Slovák — NIE doslovne, ale plynulo ako slovenský novinár.
- GEOGRAFIA TRHU (DÔLEŽITÉ): portál je ČESKÝ. Konkrétne trhové/geografické tvrdenia viazané na Česko PONECHAJ
  viazané na pôvodnú krajinu — len prelož: „v Česku / v České republice" → „v Českej republike",
  „české pole / české zemědělství" → „české polia / české poľnohospodárstvo", „čeští zemědělci" → „českí poľnohospodári".
  NEMEŇ Česko na Slovensko a NEVYMÝŠĽAJ slovenské reálie.
- NEVYMÝŠĽAJ fakty, čísla ani inštitúcie. Čísla, jednotky, vlastné mená a modely strojov NEPREKLADAJ.
- HTML štruktúru (<p>, <h2>, <h3>, <ul>, <li>, <strong>, <a href>) zachovaj 1:1.
- Vráť VÝLUČNE JSON objekt: title, perex, content, seo_title, seo_description (title bez sufixu portálu).`,
};
const SYSTEM = PROMPTS[LOCALE];

async function translate(a) {
  const user = `TITULOK (cz): ${a.title}\n\nPEREX (cz): ${a.perex || ''}\n\nTELO HTML (cz):\n${a.content || ''}`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + OPENAI_KEY },
    body: JSON.stringify({
      model: MODEL, temperature: 0.4, response_format: { type: 'json_object' }, max_tokens: 8000,
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error('OpenAI ' + res.status + ': ' + (await res.text()).slice(0, 300));
  return JSON.parse((await res.json()).choices[0].message.content);
}

async function upsert(row) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/article_translations?on_conflict=article_id,locale', {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text()).slice(0, 300));
}

(async () => {
  const rows = await (await fetch(SUPABASE_URL + '/rest/v1/articles?site_id=eq.' + SITE_ID +
    '&status=eq.published&select=id,title,slug,perex,content,category&order=published_at.desc', { headers: H })).json();
  const existing = await (await fetch(SUPABASE_URL + '/rest/v1/article_translations?locale=eq.' + LOCALE +
    '&select=article_id,title', { headers: H })).json();
  const has = new Set((existing || []).filter((x) => x.title && x.title.trim()).map((x) => x.article_id));

  let pool;
  if (ONLY) pool = rows.filter((x) => x.slug === ONLY);
  else pool = rows.filter((x) => !isJurisdictional(x.category) && (FORCE || !has.has(x.id)));

  console.log(`[${LOCALE}${SELFHOST ? '/PROD' : '/dev'}] k překladu: ${pool.length}${DRY ? ' (DRY)' : ''}` +
    ` (vynecháno jurisdikčních: ${rows.filter((x) => isJurisdictional(x.category)).length})`);

  let ok = 0, fail = 0;
  for (const a of pool) {
    try {
      const tr = await translate(a);
      if (!tr.title || !tr.content) throw new Error('prázdný překlad');
      if (DRY) { console.log(`\n=== ${a.slug} ===\n${tr.title}\n${(tr.perex || '').slice(0, 120)}`); }
      else {
        await upsert({
          article_id: a.id, locale: LOCALE, title: tr.title, perex: tr.perex || '', content: tr.content,
          seo_title: tr.seo_title || '', seo_description: tr.seo_description || '', model: 'openai:' + MODEL,
        });
        console.log(`✓ ${a.slug} → ${tr.title}`);
      }
      ok++;
    } catch (e) { console.error(`✗ ${a.slug}: ${e.message}`); fail++; }
  }
  console.log(`\nHotovo [${LOCALE}]: ${ok} ok, ${fail} chyb.`);
})().catch((e) => { console.error(e); process.exit(1); });
