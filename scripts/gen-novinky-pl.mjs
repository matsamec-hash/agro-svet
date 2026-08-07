#!/usr/bin/env node
// Přeloží + PŘERÁMUJE obecné (technika + zemědělství) CZ články do polštiny
// a upsertne je do `article_translations` (locale='pl'). Vzor: SK i18n, ale
// s reframingem CZ→PL/obecné (user: „články, co nejsou spojené s CZ prostředím").
// Jurisdikční kategorie (dotace/legislativa/trh/novinky) se NEpřekládají.
//
// OpenAI klíč: ~/.army-svet-openai-key (model gpt-4.1-mini). Supabase z ./.env.
// Použití: node scripts/gen-novinky-pl.mjs [--dry] [--only <slug>]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.cwd();
const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
const g = (k) => { const m = env.match(new RegExp('^' + k + '=(.*)$', 'm')); return m ? m[1].trim() : null; };
const SUPABASE_URL = g('SUPABASE_URL');
const SUPABASE_KEY = g('SUPABASE_SERVICE_KEY');
const OPENAI_KEY = fs.readFileSync(path.join(os.homedir(), '.army-svet-openai-key'), 'utf8').trim();
const SITE_ID = 'cadc73fd-6bd9-4dc5-a0da-ea33725762e1';
const MODEL = 'gpt-4.1-mini';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const ONLY = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;

const SYSTEM = `Jesteś profesjonalnym tłumaczem i redaktorem SEO polskiego portalu rolniczego.
Dostajesz czeski artykuł (tytuł, lead, treść HTML) i tworzysz jego POLSKĄ wersję.

ZASADY:
- Pisz naturalną, poprawną polszczyzną jak native — NIE dosłownie, ale jak polski dziennikarz rolniczy.
- REFRAMING: artykuł ma brzmieć jak napisany dla polskiego/ogólnego czytelnika, NIE jako tekst o Czechach.
  * Ramy typu „české zemědělství / v Česku / čeští zemědělci / na českých polích" zamień na polski lub ogólny kontekst
    („polskie rolnictwo / w Polsce / polscy rolnicy / na polach", albo ogólnoeuropejski, jeśli tak brzmi naturalniej).
  * Twierdzenia o dostępności rynkowej związane z jednym krajem (np. „przyjeżdża do Czech") UOGÓLNIJ
    („wchodzi na rynek / trafia do Europy") — NIE twierdź konkretnie, że model debiutuje w Polsce, jeśli nie ma na to podstaw.
- NIE zmyślaj polskich faktów, liczb, dotacji ani nazw instytucji. Uniwersalne fakty techniczne (parametry maszyn,
  agronomia, dane producentów) zachowaj bez zmian. Liczby, jednostki, nazwy własne i modele maszyn NIE tłumacz.
- Strukturę HTML (<p>, <h2>, <h3>, <ul>, <li>, <strong>, <a href>, itd.) zachowaj 1:1 — te same tagi, ta sama kolejność.
- Zwróć WYŁĄCZNIE obiekt JSON z kluczami: title, perex, content, seo_title, seo_description.
  * title: krótki tytuł (bez sufiksu portalu)
  * perex: lead 1–2 zdania
  * content: pełna treść HTML
  * seo_title: tytuł SEO ~55–60 znaków
  * seo_description: opis SEO ~150–160 znaków`;

async function translate(a) {
  const user = `TYTUŁ (cz): ${a.title}\n\nLEAD (cz): ${a.perex || ''}\n\nTREŚĆ HTML (cz):\n${a.content || ''}`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + OPENAI_KEY },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      max_tokens: 8000,
      messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: user }],
    }),
  });
  if (!res.ok) throw new Error('OpenAI ' + res.status + ': ' + (await res.text()).slice(0, 300));
  const j = await res.json();
  return JSON.parse(j.choices[0].message.content);
}

async function upsert(row) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/article_translations?on_conflict=article_id,locale', {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text()).slice(0, 300));
}

(async () => {
  const url = SUPABASE_URL + '/rest/v1/articles?site_id=eq.' + SITE_ID +
    '&status=eq.published&select=id,title,slug,perex,content,category&order=published_at.desc';
  const rows = await (await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } })).json();
  let pool = rows.filter((x) => /technika|zeměd/i.test(x.category || ''));
  if (ONLY) pool = pool.filter((x) => x.slug === ONLY);
  console.log(`Obecných článků k překladu: ${pool.length}${DRY ? ' (DRY)' : ''}`);

  let ok = 0, fail = 0;
  for (const a of pool) {
    try {
      const tr = await translate(a);
      if (!tr.title || !tr.content) throw new Error('prázdný překlad');
      if (DRY) {
        console.log(`\n=== ${a.slug} ===\nPL title: ${tr.title}\nPL perex: ${(tr.perex || '').slice(0, 120)}`);
      } else {
        await upsert({
          article_id: a.id, locale: 'pl',
          title: tr.title, perex: tr.perex || '', content: tr.content,
          seo_title: tr.seo_title || '', seo_description: tr.seo_description || '',
          model: 'openai:' + MODEL,
        });
        console.log(`✓ ${a.slug} → ${tr.title}`);
      }
      ok++;
    } catch (e) {
      console.error(`✗ ${a.slug}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nHotovo: ${ok} ok, ${fail} chyb.`);
})().catch((e) => { console.error(e); process.exit(1); });
