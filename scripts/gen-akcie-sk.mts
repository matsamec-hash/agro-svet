// Vygeneruje slovenský overlay sekce /akcie: kurátorské texty firem
// (src/data/akcie-agro-sk.ts) a UI copy (vytiskne blok pro src/i18n/akcie.ts).
//
// Sesterský skript ke gen-plodiny-choroby-sk.mjs. Overlay, ne druhá databáze —
// faktická data (ticker, burza, měna, CEO, rok založení) jsou jazykově
// neutrální a zůstávají v akcie-agro.ts.
//
// Spuštění: npx tsx --env-file=.env scripts/gen-akcie-sk.mts
import fs from 'node:fs';
import { AKCIE } from '../src/data/akcie-agro';
import { content } from '../src/i18n/akcie';

const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error('✗ OPENAI_API_KEY chybí (spusť s --env-file)'); process.exit(1); }
const MODEL = process.env.SK_MODEL || 'gpt-4.1';

const SYS = `Si expert prekladateľ z češtiny do slovenčiny pre finančno-poľnohospodársky portál.

PRAVIDLÁ:
- Prekladaj VÝLUČNE do spisovnej slovenčiny. Ani jedno české slovo ani český tvar.
- NEPREKLADAJ vlastné mená: názvy firiem, značiek, produktov, tickery, burzy
  (John Deere, AGCO, Bayer, NYSE, Xetra…), mená osôb.
- Čísla, meny, roky, percentá a jednotky nechaj PRESNE tak, ako sú.
- Skratky rádov: "mld." → "mld.", "bil." → "bil." (slovenčina ich píše rovnako).
- Názvy krajín a miest prelož do slovenčiny (Německo → Nemecko, Japonsko →
  Japonsko, Nizozemsko → Holandsko, Spojené státy → Spojené štáty).
- Zachovaj štruktúru aj počet položiek v poliach.
- Odpovedaj VÝLUČNE korektným JSON-om s rovnakou štruktúrou ako vstup.`;

async function translate(obj: unknown, hint: string, extra = ''): Promise<any> {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYS },
          { role: 'user', content: `Prelož hodnoty tohto JSON-u (${hint})${extra}. Kľúče nechaj bez zmeny:\n\n${JSON.stringify(obj, null, 1)}` },
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

const CZ = /[ěřůĚŘŮ]|zemědělsk|společnost|největší|výrobce|sídlo|obchodní|tržby|obrat je|český|česká/i;

const OVERLAY_FIELDS = ['profil', 'popis', 'uspechy', 'sidlo', 'obrat'] as const;

// ── 1) kurátorské texty firem ────────────────────────────────────────────────
const out: Record<string, Record<string, unknown>> = {};
for (const a of AKCIE as any[]) {
  const payload: Record<string, unknown> = {};
  for (const f of OVERLAY_FIELDS) if (a[f] !== undefined && a[f] !== null) payload[f] = a[f];
  let tr = await translate(payload, `firma ${a.ticker} (${a.name})`);
  for (let pass = 0; pass < 3; pass++) {
    const bad = Object.keys(payload).filter((f) => CZ.test(JSON.stringify(tr[f] ?? '')));
    if (!bad.length) break;
    const retry: Record<string, unknown> = {};
    for (const f of bad) retry[f] = payload[f];
    const fixed = await translate(retry, `firma ${a.ticker}`, ' — predchádzajúci preklad obsahoval české slová, oprav na čistú slovenčinu');
    for (const f of bad) tr[f] = fixed[f] ?? tr[f];
  }
  for (const f of OVERLAY_FIELDS) {
    if (Array.isArray(payload[f]) && (!Array.isArray(tr[f]) || tr[f].length !== (payload[f] as unknown[]).length)) {
      console.warn(`  ⚠ ${a.ticker}: pole ${f} má jinou délku → ponechávám cs`);
      tr[f] = payload[f];
    }
  }
  out[a.ticker] = Object.fromEntries(OVERLAY_FIELDS.filter((f) => tr[f] !== undefined).map((f) => [f, tr[f]]));
  console.log(`  ✓ ${a.ticker}`);
}

const header = `// Slovenský overlay kurátorských textů k akciím agro firem (src/data/akcie-agro.ts).
//
// Overlay, ne druhá databáze — vzor akcie-agro-sk. Klíčem je ticker, doplňují se
// JEN textová pole. Faktická data (ticker, burza, měna, kategorie, CEO, rok
// založení, web) jsou jazykově neutrální a zůstávají v jediném zdroji.
//
// \`sidlo\` a \`obrat\` tu jsou proto, že obsahují česká slova: názvy zemí
// a zkratky řádů. Vlastní město a číslo se nemění.
//
// Chybějící ticker není chyba — akcieText() spadne zpět na češtinu. Kompletnost
// hlídá tests/i18n/akcie-sk-overlay.test.ts.
import type { AkcieTextOverlay } from './akcie-agro-pl';

export const AKCIE_SK: Record<string, AkcieTextOverlay> = `;

fs.writeFileSync('src/data/akcie-agro-sk.ts', header + JSON.stringify(out, null, 2).replace(/"([a-z]+)":/g, '$1:') + ';\n', 'utf-8');
console.log(`\n→ src/data/akcie-agro-sk.ts (${Object.keys(out).length} firem)`);

// ── 2) UI copy sekce ─────────────────────────────────────────────────────────
const copy = await translate({ ...content.cs, numberLocale: undefined, bln: undefined }, 'UI texty sekce /akcie');
copy.numberLocale = 'sk-SK';
copy.bln = 'mld.';
fs.writeFileSync('.akcie-copy-sk.json', JSON.stringify(copy, null, 2), 'utf-8');
console.log('→ .akcie-copy-sk.json (blok pro src/i18n/akcie.ts)');
