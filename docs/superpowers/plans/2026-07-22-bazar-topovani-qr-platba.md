# Bazar topování přes QR platbu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Samoobslužné topování inzerátů: uživatel koupí plán → QR platba na Fio → externí cron (à 3 min) napáruje platbu podle VS → aktivace TOP + PDF faktura e-mailem. Admin schválení zůstává jako záloha.

**Architecture:** Astro SSR na **@astrojs/node** (standalone, self-hosted VPS za Cloudflare→Traefik). Supabase = self-hosted `supabase.samecdigital.com` (prod). Cron = **externí pinger** (cron-job.org) na `GET /api/cron/bazar-reconcile` s `Authorization: Bearer ${CRON_SECRET}` (stejný vzor jako `saved-search-digest.ts`). Pure funkce testované vitestem.

**Tech Stack:** TypeScript, Vitest 4, Supabase (service role), Resend (e-mail), `qrcode` (QR), `pdf-lib` + `@pdf-lib/fontkit` (faktury), Fio REST API.

---

## Konvence (ověřené v repu)
- Env: `getEnvVar(key)` z `src/lib/env.ts` (process.env na Node, jinak import.meta.env). Secrety (`FIO_API_TOKEN`, `CRON_SECRET`, `TOPOVANI_IBAN`) → env na Node originu (Coolify/VPS). **NIKDY do chatu ani gitu.**
- Service client: `createServerClient()` z `src/lib/supabase.ts`.
- Ceník: `getPlanInfo(plan)` z `src/lib/bazar-featured-pricing.ts` → `{ plan, days, priceCzk, label, ... }`.
- Aktivace TOP: RPC `bazar_extend_featured({ p_listing_id, p_days, p_plan })` → vrací řádek s `featured_until`.
- E-mail: `new Resend(getEnvVar('RESEND_API_KEY'))`, `FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>'`.
- Feature flag: `BAZAR_TOPOVANI_ENABLED` v `src/lib/config.ts` (teď `false`).
- `bazar_featured_orders` UŽ MÁ: `paid_at`, `featured_until_after`, `admin_note`, stripe_* (nepoužité). Migrace 019 přidává jen chybějící sloupce.
- Testy `tests/…`, import ze `../src/…`. Spouštění: `npm run test`. Node ≥22 (`export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"`).
- Práce ve worktree z `origin/master`, deploy `git push HEAD:master` (sdílený checkout — paralelní session).

## File Structure
- Create: `supabase/migrations/019_bazar_topovani_payments.sql`
- Create: `src/lib/bazar-vs.ts` (+ test) — číselný VS, formát/validace
- Create: `src/lib/spayd.ts` (+ test) — SPAYD string builder
- Create: `src/lib/fio.ts` (+ test) — parser Fio transakcí (čistá fce nad JSON)
- Create: `src/lib/invoice-number.ts` (+ test) — formát čísla faktury
- Create: `src/lib/invoice-pdf.ts` (+ smoke test) — PDF přes pdf-lib
- Create: `src/lib/assets/font-dejavu.ts` — base64 DejaVuSans (diakritika)
- Create: `src/lib/qr.ts` — SPAYD → QR data-URI (wrapper nad `qrcode`)
- Modify: `src/pages/api/bazar/featured/request.ts` — přidělit VS + buyer snapshot, vrátit platební data
- Create: `src/pages/api/bazar/featured/status.ts` — poll stavu orderu
- Create: `src/pages/api/cron/bazar-reconcile.ts` — párování + aktivace + faktura + e-mail + expirace
- Create: `src/pages/bazar/moje/[id]/topovat/platba.astro` — platební stránka (QR/IBAN/VS + auto-refresh)
- Modify: `src/pages/bazar/moje/[id]/topovat.astro` — po `request` redirect na `/platba`
- Modify: `src/pages/bazar/topovani/index.astro` — oprava vadné VS copy
- Modify: `package.json` — deps `qrcode`, `pdf-lib`, `@pdf-lib/fontkit`, `@types/qrcode`

---

### Task 1: Závislosti + font asset

**Files:** Modify `package.json`; Create `src/lib/assets/font-dejavu.ts`

- [ ] **Step 1: Instalace deps** (Node ≥22)

Run:
```bash
export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"
npm install qrcode pdf-lib @pdf-lib/fontkit
npm install -D @types/qrcode
```
Expected: přidá se do package.json, `npm run test` pořád projde.

- [ ] **Step 2: Stáhnout DejaVuSans.ttf a vygenerovat base64 modul**

DejaVu Sans má plnou českou diakritiku a je volně licencovaný. Vygeneruj `src/lib/assets/font-dejavu.ts`:
```bash
curl -sL "https://github.com/dejavu-fonts/dejavu-fonts/raw/master/ttf/DejaVuSans.ttf" -o /tmp/DejaVuSans.ttf
node -e "const fs=require('fs');const b=fs.readFileSync('/tmp/DejaVuSans.ttf').toString('base64');fs.writeFileSync('src/lib/assets/font-dejavu.ts','// DejaVu Sans (Bitstream Vera license) — base64, pro pdf-lib faktury s českou diakritikou.\nexport const DEJAVU_SANS_B64 =\n  \"'+b+'\";\n')"
```
Ověř: `node -e "const {DEJAVU_SANS_B64}=require('./src/lib/assets/font-dejavu.ts')"` — pozn. je to TS, ověř raději po buildu; stačí že soubor existuje a začíná exportem.

- [ ] **Step 3: Commit**
```bash
git add package.json package-lock.json src/lib/assets/font-dejavu.ts
git commit -m "chore(topovani): deps qrcode/pdf-lib/fontkit + DejaVu font asset"
```

---

### Task 2: Migrace 019 — platební sloupce + VS sekvence + čísla faktur

**Files:** Create `supabase/migrations/019_bazar_topovani_payments.sql`

- [ ] **Step 1: Napsat migraci**

`supabase/migrations/019_bazar_topovani_payments.sql`:
```sql
-- Topování přes QR platbu: VS párování (Fio), čísla faktur, buyer snapshot.
-- Nasadit na self-hosted prod supabase.samecdigital.com (NE cloud).

-- 1) VS sekvence — číselný variabilní symbol (8-místný, nekoliduje).
CREATE SEQUENCE IF NOT EXISTS bazar_vs_seq START WITH 10000000;

-- 2) Rozšíření bazar_featured_orders (paid_at už existuje).
ALTER TABLE bazar_featured_orders
  ADD COLUMN IF NOT EXISTS vs bigint UNIQUE,
  ADD COLUMN IF NOT EXISTS fio_transaction_id bigint UNIQUE,
  ADD COLUMN IF NOT EXISTS invoice_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS invoice_pdf_path text,
  ADD COLUMN IF NOT EXISTS buyer_name text,
  ADD COLUMN IF NOT EXISTS buyer_ico text,
  ADD COLUMN IF NOT EXISTS buyer_address text;

CREATE INDEX IF NOT EXISTS idx_bazar_featured_orders_vs ON bazar_featured_orders(vs);
CREATE INDEX IF NOT EXISTS idx_bazar_featured_orders_status ON bazar_featured_orders(status);

-- 3) Čísla faktur bez děr: counter per rok + atomický RPC.
CREATE TABLE IF NOT EXISTS bazar_invoice_counters (
  year int PRIMARY KEY,
  last_seq int NOT NULL DEFAULT 0
);

CREATE OR REPLACE FUNCTION bazar_next_invoice_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  y int := EXTRACT(YEAR FROM NOW())::int;
  seq int;
BEGIN
  INSERT INTO bazar_invoice_counters (year, last_seq)
  VALUES (y, 1)
  ON CONFLICT (year) DO UPDATE SET last_seq = bazar_invoice_counters.last_seq + 1
  RETURNING last_seq INTO seq;
  RETURN y::text || '-' || lpad(seq::text, 4, '0');
END;
$$;

-- 4) RPC pro přidělení VS (atomicky ze sekvence).
CREATE OR REPLACE FUNCTION bazar_next_vs()
RETURNS bigint
LANGUAGE sql
AS $$ SELECT nextval('bazar_vs_seq'); $$;
```

- [ ] **Step 2: Ověřit SQL syntakticky** (lokálně proti dev DB, nebo aspoň `psql -f --dry`)

Pozn.: nasazení na prod dělá uživatel (self-hosted psql). V rámci tasku jen ověř, že SQL je validní (žádný běžící lokální Supabase se nepředpokládá — commituj a nech nasazení na uživateli, jako u ostatních migrací tohoto repa).

- [ ] **Step 3: Commit**
```bash
git add supabase/migrations/019_bazar_topovani_payments.sql
git commit -m "feat(topovani): migrace 019 — VS, fio_tx, invoice číslo/PDF, buyer snapshot"
```

---

### Task 3: `src/lib/invoice-number.ts` — formát čísla faktury (TDD)

**Files:** Create `src/lib/invoice-number.ts`, `tests/lib/invoice-number.test.ts`

- [ ] **Step 1: Failing test**

`tests/lib/invoice-number.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { formatInvoiceNumber } from '../../src/lib/invoice-number';

describe('formatInvoiceNumber', () => {
  it('skládá YYYY-NNNN s nulami', () => {
    expect(formatInvoiceNumber(2026, 1)).toBe('2026-0001');
    expect(formatInvoiceNumber(2026, 42)).toBe('2026-0042');
    expect(formatInvoiceNumber(2026, 1234)).toBe('2026-1234');
  });
  it('>9999 nechá bez ořezu', () => {
    expect(formatInvoiceNumber(2026, 10000)).toBe('2026-10000');
  });
});
```

- [ ] **Step 2: Run → FAIL** `npm run test -- invoice-number`

- [ ] **Step 3: Implement**

`src/lib/invoice-number.ts`:
```ts
// Formát čísla faktury YYYY-NNNN. Autoritativní zdroj sekvence je DB RPC
// bazar_next_invoice_number() — tahle fce jen formátuje (a používá se i pro test parity).
export function formatInvoiceNumber(year: number, seq: number): string {
  return `${year}-${String(seq).padStart(4, '0')}`;
}
```

- [ ] **Step 4: Run → PASS**; **Step 5: Commit** `git add src/lib/invoice-number.ts tests/lib/invoice-number.test.ts && git commit -m "feat(topovani): formatInvoiceNumber"`

---

### Task 4: `src/lib/bazar-vs.ts` — validace VS (TDD)

**Files:** Create `src/lib/bazar-vs.ts`, `tests/lib/bazar-vs.test.ts`

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from 'vitest';
import { isValidVs, vsToString } from '../../src/lib/bazar-vs';

describe('bazar-vs', () => {
  it('VS je číselný, 1–10 číslic', () => {
    expect(isValidVs(10000000)).toBe(true);
    expect(isValidVs(1)).toBe(true);
    expect(isValidVs(0)).toBe(false);
    expect(isValidVs(-5)).toBe(false);
    expect(isValidVs(12345678901)).toBe(false); // 11 číslic
  });
  it('vsToString bez mezer/písmen', () => {
    expect(vsToString(10000001)).toBe('10000001');
  });
});
```
- [ ] **Step 2: Run → FAIL**
- [ ] **Step 3: Implement** `src/lib/bazar-vs.ts`:
```ts
// Variabilní symbol pro párování Fio plateb. Číselný, max 10 číslic (limit VS v ČR).
// Přiděluje se z DB sekvence (RPC bazar_next_vs) — tady jen validace/formát.
export function isValidVs(vs: number): boolean {
  return Number.isInteger(vs) && vs >= 1 && vs <= 9_999_999_999;
}
export function vsToString(vs: number): string {
  return String(vs);
}
```
- [ ] **Step 4: Run → PASS**; **Step 5: Commit**

---

### Task 5: `src/lib/spayd.ts` — QR platba string (TDD)

**Files:** Create `src/lib/spayd.ts`, `tests/lib/spayd.test.ts`

- [ ] **Step 1: Failing test**
```ts
import { describe, it, expect } from 'vitest';
import { buildSpayd } from '../../src/lib/spayd';

describe('buildSpayd', () => {
  it('skládá validní SPD 1.0 string', () => {
    const s = buildSpayd({ iban: 'CZ6508000000192000145399', amountCzk: 249, vs: 10000001, message: 'Topovani inzeratu' });
    expect(s.startsWith('SPD*1.0*')).toBe(true);
    expect(s).toContain('ACC:CZ6508000000192000145399');
    expect(s).toContain('AM:249.00');
    expect(s).toContain('CC:CZK');
    expect(s).toContain('X-VS:10000001');
    expect(s).toContain('MSG:Topovani inzeratu');
  });
  it('odstraní diakritiku a hvězdičky z MSG (SPAYD delimiter)', () => {
    const s = buildSpayd({ iban: 'CZ65', amountCzk: 99, vs: 1, message: 'Topování*test' });
    expect(s).toContain('MSG:Topovani test');
    expect(s.split('*').length).toBe(6); // SPD,1.0,ACC,AM,CC,X-VS,MSG → segmenty bez rozbití
  });
});
```
- [ ] **Step 2: Run → FAIL**
- [ ] **Step 3: Implement** `src/lib/spayd.ts`:
```ts
// SPAYD (Short Payment Descriptor) v1.0 — český standard „QR Platba".
// Formát: SPD*1.0*ACC:<IBAN>*AM:<částka>*CC:CZK*X-VS:<vs>*MSG:<zpráva>
export interface SpaydInput {
  iban: string;
  amountCzk: number;
  vs: number;
  message: string;
}

// SPAYD hodnoty nesmí obsahovat '*' (delimiter). MSG držíme ASCII bez diakritiky,
// ať se korektně načte ve všech bankách.
function sanitize(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // odstranit diakritiku
    .replace(/\*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSpayd({ iban, amountCzk, vs, message }: SpaydInput): string {
  const parts = [
    'SPD', '1.0',
    `ACC:${iban.replace(/\s+/g, '')}`,
    `AM:${amountCzk.toFixed(2)}`,
    'CC:CZK',
    `X-VS:${vs}`,
    `MSG:${sanitize(message)}`,
  ];
  return parts.join('*');
}
```
- [ ] **Step 4: Run → PASS**; **Step 5: Commit**

---

### Task 6: `src/lib/fio.ts` — parser Fio transakcí (TDD s fixture)

**Files:** Create `src/lib/fio.ts`, `tests/lib/fio.test.ts`, `tests/fixtures/fio-sample.json`

Fio REST: `GET https://fioapi.fio.cz/v1/rest/periods/{token}/{from}/{to}/transactions.json`. Struktura: `accountStatement.transactionList.transaction[]`, sloupce: `column22.value`=ID pohybu (number), `column1.value`=částka (number, kladná=příchozí), `column5.value`=VS (string), `column14.value`=měna. Parser je čistá fce nad JSON (fetch se testuje zvlášť/integračně).

- [ ] **Step 1: Fixture** `tests/fixtures/fio-sample.json`:
```json
{
  "accountStatement": {
    "transactionList": {
      "transaction": [
        { "column22": { "value": 26000000001 }, "column1": { "value": 249.0 }, "column5": { "value": "10000001" }, "column14": { "value": "CZK" } },
        { "column22": { "value": 26000000002 }, "column1": { "value": -100.0 }, "column5": { "value": "99999" }, "column14": { "value": "CZK" } },
        { "column22": { "value": 26000000003 }, "column1": { "value": 99.0 }, "column5": { "value": null }, "column14": { "value": "CZK" } }
      ]
    }
  }
}
```
- [ ] **Step 2: Failing test** `tests/lib/fio.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { parseFioTransactions } from '../../src/lib/fio';
import sample from '../fixtures/fio-sample.json';

describe('parseFioTransactions', () => {
  it('mapuje jen příchozí CZK platby s VS', () => {
    const txs = parseFioTransactions(sample as any);
    // odchozí (-100) a bez VS se vynechají
    expect(txs).toHaveLength(1);
    expect(txs[0]).toEqual({ id: 26000000001, amountCzk: 249, vs: '10000001', currency: 'CZK' });
  });
  it('prázdný/rozbitý JSON → []', () => {
    expect(parseFioTransactions({} as any)).toEqual([]);
    expect(parseFioTransactions({ accountStatement: { transactionList: null } } as any)).toEqual([]);
  });
});
```
- [ ] **Step 3: Run → FAIL**
- [ ] **Step 4: Implement** `src/lib/fio.ts`:
```ts
// Fio banka — REST výpis transakcí. Čistý parser + tenký fetch klient.
// Bezstavově čteme okno posledních N dní (idempotence řeší fio_transaction_id v DB),
// NE stateful `last` kurzor.
import { getEnvVar } from './env';

export interface FioTx {
  id: number;        // column22 — unikátní ID pohybu
  amountCzk: number; // column1 — kladné = příchozí
  vs: string;        // column5 — variabilní symbol
  currency: string;  // column14
}

export function parseFioTransactions(json: any): FioTx[] {
  const list = json?.accountStatement?.transactionList?.transaction;
  if (!Array.isArray(list)) return [];
  const out: FioTx[] = [];
  for (const t of list) {
    const id = t?.column22?.value;
    const amount = t?.column1?.value;
    const vs = t?.column5?.value;
    const currency = t?.column14?.value ?? 'CZK';
    if (typeof id !== 'number') continue;
    if (typeof amount !== 'number' || amount <= 0) continue; // jen příchozí
    if (vs == null || String(vs).length === 0) continue;      // musí mít VS
    out.push({ id, amountCzk: Math.round(amount), vs: String(vs), currency });
  }
  return out;
}

export function fioDateRange(daysBack: number, now: Date): { from: string; to: string } {
  const to = now.toISOString().slice(0, 10);
  const fromD = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const from = fromD.toISOString().slice(0, 10);
  return { from, to };
}

// Live fetch — volá se jen z cron endpointu. Token z env.
export async function fetchFioTransactions(daysBack: number, now: Date): Promise<FioTx[]> {
  const token = getEnvVar('FIO_API_TOKEN');
  if (!token) throw new Error('Missing FIO_API_TOKEN');
  const { from, to } = fioDateRange(daysBack, now);
  const url = `https://fioapi.fio.cz/v1/rest/periods/${token}/${from}/${to}/transactions.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fio API ${res.status}`);
  const json = await res.json();
  return parseFioTransactions(json);
}
```
- [ ] **Step 5: Run → PASS** (`fioDateRange`/`fetchFioTransactions` netestujeme unit — jen `parseFioTransactions`); **Step 6: Commit**

---

### Task 7: `src/lib/qr.ts` + `src/lib/invoice-pdf.ts` (faktura)

**Files:** Create `src/lib/qr.ts`, `src/lib/invoice-pdf.ts`, `tests/lib/invoice-pdf.test.ts`

- [ ] **Step 1: QR wrapper** `src/lib/qr.ts`:
```ts
// SPAYD string → QR kód jako data-URI (PNG). Renderuje se do <img> na platební stránce.
import QRCode from 'qrcode';
export async function spaydToQrDataUri(spayd: string): Promise<string> {
  return QRCode.toDataURL(spayd, { errorCorrectionLevel: 'M', margin: 1, width: 320 });
}
```

- [ ] **Step 2: Faktura PDF** `src/lib/invoice-pdf.ts`:
```ts
// PDF faktura pro NEPLÁTCE DPH (Samec Digital s.r.o., IČO 29547539).
// pdf-lib + vložený DejaVu font (base64) kvůli české diakritice.
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { DEJAVU_SANS_B64 } from './assets/font-dejavu';

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: Date;       // datum vystavení = DUZP (platba)
  planLabel: string;     // „30 dní"
  days: number;
  amountCzk: number;
  vs: number;
  buyerName?: string | null;
  buyerIco?: string | null;
  buyerAddress?: string | null;
  buyerEmail: string;
}

const SELLER = {
  name: 'Samec Digital s.r.o.',
  ico: '29547539',
  note: 'Zapsáno v obchodním rejstříku. Nejsme plátci DPH.',
};

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function buildInvoicePdf(d: InvoiceData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const font = await doc.embedFont(b64ToBytes(DEJAVU_SANS_B64), { subset: true });
  const page = doc.addPage([595, 842]); // A4
  const black = rgb(0.1, 0.1, 0.1);
  let y = 800;
  const line = (text: string, size = 11, dy = 18) => {
    page.drawText(text, { x: 50, y, size, font, color: black });
    y -= dy;
  };
  const dateCz = (dt: Date) => dt.toLocaleDateString('cs-CZ');

  line(`Faktura č. ${d.invoiceNumber}`, 18, 30);
  line(`Dodavatel: ${SELLER.name}, IČO: ${SELLER.ico}`);
  line(SELLER.note, 9, 22);
  line('Odběratel:', 11, 16);
  line(d.buyerName || d.buyerEmail, 11, 16);
  if (d.buyerIco) line(`IČO: ${d.buyerIco}`, 11, 16);
  if (d.buyerAddress) line(d.buyerAddress, 11, 22);
  line(`Datum vystavení / DUZP: ${dateCz(d.issueDate)}`);
  line(`Variabilní symbol: ${d.vs}`, 11, 26);
  line(`Položka: Topování inzerátu – ${d.days} dní (${d.planLabel})`, 12, 20);
  line(`Cena celkem: ${d.amountCzk} Kč`, 14, 26);
  line('Nejsme plátci DPH.', 10, 16);

  return doc.save();
}
```

- [ ] **Step 3: Smoke test** `tests/lib/invoice-pdf.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { buildInvoicePdf } from '../../src/lib/invoice-pdf';

describe('buildInvoicePdf', () => {
  it('vygeneruje neprázdné PDF s diakritikou (font embedding nespadne)', async () => {
    const bytes = await buildInvoicePdf({
      invoiceNumber: '2026-0001', issueDate: new Date('2026-07-22'),
      planLabel: '30 dní', days: 30, amountCzk: 249, vs: 10000001,
      buyerName: 'Žluťoučký Kůň', buyerEmail: 'test@example.cz',
    });
    expect(bytes.length).toBeGreaterThan(1000);
    // PDF magic header %PDF
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe('%PDF');
  });
});
```
- [ ] **Step 4: Run → PASS** `npm run test -- invoice-pdf` (může trvat déle kvůli font embed)
- [ ] **Step 5: Commit** `git add src/lib/qr.ts src/lib/invoice-pdf.ts tests/lib/invoice-pdf.test.ts && git commit -m "feat(topovani): QR (spayd→dataUri) + PDF faktura (pdf-lib + DejaVu)"`

---

### Task 8: Rozšířit `request.ts` — přidělit VS, buyer snapshot, vrátit platební data

**Files:** Modify `src/pages/api/bazar/featured/request.ts`

Zachovat existující validace (flag, auth, throttle, ownership, active, duplicate-pending). Změny: (a) po `getPlanInfo` přidělit VS přes RPC `bazar_next_vs`; (b) přijmout volitelné `buyer` z body; (c) do insertu přidat `vs`, `buyer_*`; (d) místo dnešního admin e-mailu vracet platební data (IBAN/amount/VS/SPAYD). Admin e-mail zrušit (platba je teď samoobslužná).

- [ ] **Step 1: Upravit insert + response**

Nahradit blok od `const plenInfo = getPlanInfo(plan);` po `return json({... 202 })` tímto (zachovat duplicate-pending check mezi tím):
```ts
  const planInfo = getPlanInfo(plan);

  // duplicate-pending check — PONECHAT beze změny (viz stávající kód) …

  // Přidělit číselný VS ze sekvence.
  const { data: vsRow, error: vsErr } = await sb.rpc('bazar_next_vs');
  if (vsErr || vsRow == null) {
    console.error('[featured/request] vs alloc failed', vsErr);
    return json({ error: 'db_error' }, 500);
  }
  const vs = Number(vsRow);

  const buyer = body?.buyer ?? {};
  const { data: order, error: insertErr } = await sb
    .from('bazar_featured_orders')
    .insert({
      listing_id: listingId,
      user_id: user.id,
      plan,
      days: planInfo.days,
      price_czk: planInfo.priceCzk,
      status: 'pending',
      vs,
      buyer_name: typeof buyer.name === 'string' ? buyer.name.slice(0, 200) : null,
      buyer_ico: typeof buyer.ico === 'string' ? buyer.ico.slice(0, 20) : null,
      buyer_address: typeof buyer.address === 'string' ? buyer.address.slice(0, 300) : null,
    })
    .select('id, vs, created_at')
    .single();
  if (insertErr || !order) {
    console.error('[featured/request] insert failed', insertErr);
    return json({ error: 'db_error', message: insertErr?.message }, 500);
  }

  const iban = getEnvVar('TOPOVANI_IBAN') ?? '';
  const spayd = buildSpayd({ iban, amountCzk: planInfo.priceCzk, vs, message: `Topovani inzeratu ${planInfo.label}` });

  return json({
    ok: true,
    orderId: order.id,
    plan,
    priceCzk: planInfo.priceCzk,
    days: planInfo.days,
    vs,
    iban,
    spayd,
    payUrl: `/bazar/moje/${listingId}/topovat/platba/?order=${order.id}`,
  }, 201);
```
Přidat importy nahoře: `import { buildSpayd } from '../../../../lib/spayd';` (getEnvVar už je importované). Smazat Resend import + ADMIN e-mail blok + `const ADMIN_EMAIL/FROM` pokud je jinde nepoužité (jsou jen tady → smazat).

- [ ] **Step 2: Ověřit build** `npx astro build` → projde.
- [ ] **Step 3: Commit** `git add src/pages/api/bazar/featured/request.ts && git commit -m "feat(topovani): request přiděluje VS + vrací IBAN/SPAYD/payUrl"`

---

### Task 9: `status.ts` — poll stavu orderu

**Files:** Create `src/pages/api/bazar/featured/status.ts`

- [ ] **Step 1: Implement**
```ts
// GET /api/bazar/featured/status?order=<id> — vlastník orderu pollne stav.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export const GET: APIRoute = async ({ url, locals }) => {
  const user = (locals as any).user;
  if (!user) return json({ error: 'unauthenticated' }, 401);
  const orderId = url.searchParams.get('order') ?? '';
  if (!orderId) return json({ error: 'missing_order' }, 400);

  const sb = createServerClient();
  const { data: order } = await sb
    .from('bazar_featured_orders')
    .select('id, user_id, status, featured_until_after')
    .eq('id', orderId)
    .maybeSingle();
  if (!order) return json({ error: 'not_found' }, 404);
  if (order.user_id !== user.id) return json({ error: 'forbidden' }, 403);

  return json({ status: order.status, featuredUntil: order.featured_until_after ?? null });
};
```
- [ ] **Step 2: Build → OK**; **Step 3: Commit**

---

### Task 10: Cron endpoint `bazar-reconcile.ts` — párování + aktivace + faktura + e-mail

**Files:** Create `src/pages/api/cron/bazar-reconcile.ts`

Mirror auth vzoru `saved-search-digest.ts` (Bearer `CRON_SECRET`). Logika: načti Fio tx za 2 dny → pro každou najdi pending order se shodným `vs` a `price_czk == amountCzk`, ještě nespárovaný → aktivuj (RPC), přiděl fakturu (RPC číslo + PDF do bucketu `invoices`), pošli e-mail; expiruj pending > 14 dní.

- [ ] **Step 1: Implement**
```ts
// GET /api/cron/bazar-reconcile — externí cron à 3 min (cron-job.org) s
// Authorization: Bearer ${CRON_SECRET}. Napáruje Fio platby na pending ordery.
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { fetchFioTransactions } from '../../../lib/fio';
import { buildInvoicePdf } from '../../../lib/invoice-pdf';
import { getPlanInfo } from '../../../lib/bazar-featured-pricing';
import type { FeaturedPlan } from '../../../lib/bazar-featured';
import { Resend } from 'resend';

export const prerender = false;
const FROM = 'Agro-svět bazar <bazar@mail.agro-svet.cz>';
const ACCOUNTING_BCC = 'info@samecdigital.com';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}

export const GET: APIRoute = async ({ request }) => {
  const auth = request.headers.get('authorization') ?? '';
  const secret = getEnvVar('CRON_SECRET');
  if (!secret || auth !== `Bearer ${secret}`) return json({ error: 'unauthorized' }, 401);

  const sb = createServerClient();
  const now = new Date();

  // 1) Expirovat staré pending (> 14 dní).
  const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
  await sb.from('bazar_featured_orders').update({ status: 'failed', admin_note: 'auto-expired (14d)' })
    .eq('status', 'pending').lt('created_at', cutoff);

  // 2) Fio transakce za 2 dny.
  let txs;
  try { txs = await fetchFioTransactions(2, now); }
  catch (e: any) { console.error('[reconcile] fio fetch', e); return json({ error: 'fio_error', message: e.message }, 502); }

  const activated: string[] = [];
  const mismatched: string[] = [];

  for (const tx of txs) {
    // Idempotence: přeskoč, pokud už tato tx spárovaná.
    const { data: dup } = await sb.from('bazar_featured_orders').select('id').eq('fio_transaction_id', tx.id).limit(1).maybeSingle();
    if (dup) continue;

    const { data: order } = await sb.from('bazar_featured_orders')
      .select('id, listing_id, user_id, plan, days, price_czk, status, buyer_name, buyer_ico, buyer_address, vs')
      .eq('vs', Number(tx.vs)).eq('status', 'pending').maybeSingle();
    if (!order) continue;

    if (order.price_czk !== tx.amountCzk) {
      // Pod/přeplatek → nechat pending, upozornit admina (jen jednou zaznamenat).
      mismatched.push(order.id);
      await sb.from('bazar_featured_orders').update({ admin_note: `Částka nesouhlasí: přišlo ${tx.amountCzk}, čekáno ${order.price_czk} (fio tx ${tx.id})` }).eq('id', order.id);
      continue;
    }

    // 3) Aktivace TOP.
    const { data: rpcRows, error: rpcErr } = await sb.rpc('bazar_extend_featured', {
      p_listing_id: order.listing_id, p_days: order.days, p_plan: order.plan as FeaturedPlan,
    });
    if (rpcErr || !rpcRows?.length) { console.error('[reconcile] extend rpc', rpcErr); continue; }
    const featuredUntil: string = rpcRows[0].featured_until;

    // 4) Faktura: číslo + PDF + upload.
    const { data: invNo } = await sb.rpc('bazar_next_invoice_number');
    const invoiceNumber = String(invNo);
    const planInfo = getPlanInfo(order.plan as FeaturedPlan);
    // buyer e-mail = e-mail vlastníka (z bazar_users).
    const { data: owner } = await sb.from('bazar_users').select('email').eq('id', order.user_id).maybeSingle();
    const buyerEmail = owner?.email ?? '';
    const pdf = await buildInvoicePdf({
      invoiceNumber, issueDate: now, planLabel: planInfo.label, days: order.days,
      amountCzk: order.price_czk, vs: order.vs, buyerName: order.buyer_name,
      buyerIco: order.buyer_ico, buyerAddress: order.buyer_address, buyerEmail,
    });
    const pdfPath = `${order.user_id}/${invoiceNumber}.pdf`;
    await sb.storage.from('invoices').upload(pdfPath, pdf, { contentType: 'application/pdf', upsert: true });

    // 5) Zapsat paid + fakturu + fio tx.
    await sb.from('bazar_featured_orders').update({
      status: 'paid', paid_at: now.toISOString(), featured_until_after: featuredUntil,
      fio_transaction_id: tx.id, invoice_number: invoiceNumber, invoice_pdf_path: pdfPath,
    }).eq('id', order.id);

    // 6) E-mail s fakturou (best-effort).
    try {
      const resendKey = getEnvVar('RESEND_API_KEY');
      if (resendKey && buyerEmail) {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: FROM, to: buyerEmail, bcc: ACCOUNTING_BCC,
          subject: `Topování aktivováno + faktura ${invoiceNumber}`,
          text: `Děkujeme, platba dorazila. Topování inzerátu je aktivní do ${new Date(featuredUntil).toLocaleDateString('cs-CZ')}.\nV příloze faktura ${invoiceNumber}.`,
          attachments: [{ filename: `faktura-${invoiceNumber}.pdf`, content: Buffer.from(pdf).toString('base64') }],
        });
      }
    } catch (e) { console.error('[reconcile] email', e); }

    activated.push(order.id);
  }

  return json({ ok: true, activated: activated.length, mismatched: mismatched.length, scanned: txs.length });
};
```
- [ ] **Step 2: Build → OK** (`npx astro build`)
- [ ] **Step 3: Commit** `git add src/pages/api/cron/bazar-reconcile.ts && git commit -m "feat(topovani): cron reconcile — Fio párování → aktivace + faktura + e-mail"`

---

### Task 11: Platební stránka + napojení topovat.astro + oprava copy

**Files:** Create `src/pages/bazar/moje/[id]/topovat/platba.astro`; Modify `src/pages/bazar/moje/[id]/topovat.astro`, `src/pages/bazar/topovani/index.astro`

- [ ] **Step 1: Platební stránka** `src/pages/bazar/moje/[id]/topovat/platba.astro`:
```astro
---
export const prerender = false;
import Layout from '../../../../../layouts/Layout.astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { buildSpayd } from '../../../../../lib/spayd';
import { spaydToQrDataUri } from '../../../../../lib/qr';
import { getPlanInfo } from '../../../../../lib/bazar-featured-pricing';
import { BAZAR_TOPOVANI_ENABLED } from '../../../../../lib/config';

const { id } = Astro.params;
const orderId = Astro.url.searchParams.get('order') ?? '';
const user = (Astro.locals as any).user;
if (!BAZAR_TOPOVANI_ENABLED) return Astro.redirect(`/bazar/moje/${id}/`);
if (!user) return Astro.redirect('/bazar/prihlaseni/');

const sb = createServerClient();
const { data: order } = await sb.from('bazar_featured_orders')
  .select('id, user_id, plan, price_czk, vs, status').eq('id', orderId).maybeSingle();
if (!order || order.user_id !== user.id) return Astro.redirect(`/bazar/moje/${id}/`);

const iban = getEnvVar('TOPOVANI_IBAN') ?? '';
const planInfo = getPlanInfo(order.plan as any);
const spayd = buildSpayd({ iban, amountCzk: order.price_czk, vs: order.vs, message: `Topovani inzeratu ${planInfo.label}` });
const qr = await spaydToQrDataUri(spayd);
const alreadyPaid = order.status === 'paid' || order.status === 'free';
---
<Layout title="Platba za topování" noindex={true}>
  <main class="pay" style="max-width:520px;margin:0 auto;padding:32px 16px;">
    <h1>Zaplaťte topování</h1>
    {alreadyPaid ? (
      <p class="ok">Zaplaceno — topování je aktivní. <a href={`/bazar/moje/${id}/`}>Zpět na inzerát</a></p>
    ) : (
      <>
        <p>Naskenujte QR ve své bance, nebo zadejte platbu ručně. Po připsání (do ~3 min) topování aktivujeme a pošleme fakturu.</p>
        <img src={qr} alt="QR platba" width="280" height="280" style="display:block;margin:16px auto;" />
        <ul class="pay-details" style="list-style:none;padding:0;line-height:1.9;">
          <li><strong>Číslo účtu (IBAN):</strong> {iban}</li>
          <li><strong>Částka:</strong> {order.price_czk} Kč</li>
          <li><strong>Variabilní symbol:</strong> {order.vs}</li>
        </ul>
        <p id="pay-status" class="muted">Čekám na platbu…</p>
      </>
    )}
  </main>
  {!alreadyPaid && (
    <script type="application/json" id="pay-cfg" set:html={JSON.stringify({ orderId: order.id, backUrl: `/bazar/moje/${id}/` })} />
    <script is:inline>
      (function(){
        var cfg = JSON.parse(document.getElementById('pay-cfg').textContent);
        var el = document.getElementById('pay-status');
        var t = setInterval(async function(){
          try {
            var r = await fetch('/api/bazar/featured/status/?order=' + cfg.orderId, { headers: { 'accept': 'application/json' } });
            var d = await r.json();
            if (d.status === 'paid' || d.status === 'free') {
              clearInterval(t);
              el.textContent = 'Zaplaceno! Přesměrování…';
              location.href = cfg.backUrl;
            }
          } catch(e){}
        }, 10000);
      })();
    </script>
  )}
</Layout>
```

- [ ] **Step 2: Napojit topovat.astro** — najít klientský JS, který volá `POST /api/bazar/featured/request/`, a po úspěchu (`data.payUrl`) přesměrovat: `window.location.href = data.payUrl;` místo dnešní „žádost přijata" hlášky. (Přečti stávající `<script>` v `topovat.astro` a uprav handler; struktura fetch je obdobná jako v `admin/bazar/index.astro`.)

- [ ] **Step 3: Opravit vadnou copy** v `src/pages/bazar/topovani/index.astro` — najít text „prvních 8 znaků UUID" (nebo „VS") a nahradit popisem, že VS je číselný a přidělí se automaticky u konkrétní platby. (Grep `VS`/`UUID` v souboru.)

- [ ] **Step 4: Build → OK**; **Step 5: Commit** `git add src/pages/bazar/moje/[id]/topovat/platba.astro src/pages/bazar/moje/[id]/topovat.astro src/pages/bazar/topovani/index.astro && git commit -m "feat(topovani): platební stránka (QR/IBAN/VS + poll) + oprava VS copy"`

---

### Task 12: Storage bucket `invoices` + zapnutí + provozní kroky (dokumentace)

**Files:** Modify `src/lib/config.ts`; Create `docs/topovani-provoz.md`

- [ ] **Step 1: Dokument provozních kroků** `docs/topovani-provoz.md` — kroky, které dělá uživatel na prod:
  - V self-hosted Supabase (`supabase.samecdigital.com`) nasadit migraci `019`.
  - Vytvořit **privátní** storage bucket `invoices` (ne public).
  - Na Node originu (Coolify env) nastavit: `FIO_API_TOKEN`, `CRON_SECRET`, `TOPOVANI_IBAN`, (`RESEND_API_KEY` už je).
  - Založit externí cron (cron-job.org) à 3 min: `GET https://agro-svet.cz/api/cron/bazar-reconcile` s hlavičkou `Authorization: Bearer <CRON_SECRET>` (stejně jako saved-search-digest).
  - Otestovat malou reálnou platbou (99 Kč) → ověřit aktivaci + fakturu.

- [ ] **Step 2: Zapnout flag** v `src/lib/config.ts`: `export const BAZAR_TOPOVANI_ENABLED = true;`
  ⚠️ Zapnout AŽ po nasazení migrace + env + cron (jinak uživatelé vytvoří pending ordery bez možnosti platby). Poznámka do commitu.

- [ ] **Step 3: Full test + build** `npm run test && npx astro build` → vše zelené.
- [ ] **Step 4: Commit** `git add src/lib/config.ts docs/topovani-provoz.md && git commit -m "feat(topovani): zapnout flag + provozní dokumentace"`

---

## Self-Review (autor plánu)

**Spec coverage:** migrace 019 (VS/fio_tx/invoice/buyer + counter RPC) ✔ · SPAYD/QR ✔ · Fio parser (idempotence přes fio_transaction_id, 2denní okno) ✔ · PDF faktura (pdf-lib + vložený DejaVu font kvůli diakritice) ✔ · číslo faktury bez děr (RPC) ✔ · request rozšíření (VS + IBAN + SPAYD) ✔ · status poll ✔ · reconcile cron (externí Bearer, ne CF scheduled — dle reálné architektury) ✔ · platební stránka ✔ · exact-amount matching + pending>14d expirace ✔ · oprava vadné copy ✔ · flag + provozní kroky ✔.

**Odchylky od specu (opravené v plánu):** (1) `paid_at` už existuje (migrace 010) → 019 ho nepřidává. (2) Cron NENÍ CF Worker `scheduled()` — projekt běží na @astrojs/node adapteru, cron je externí pinger na `/api/cron/*` s Bearer (existující vzor). (3) Migrace = `019` (018 zabralo akce).

**Placeholder scan:** pure funkce mají plný kód + testy; endpointy plný kód. Font se stahuje reálně (Task 1). Žádné TBD.

**Type consistency:** `FioTx {id,amountCzk,vs,currency}` shodně v parseru, testu i reconcile. `buildSpayd(SpaydInput)` shodně v request/platba. RPC názvy `bazar_extend_featured`/`bazar_next_vs`/`bazar_next_invoice_number` konzistentní migrace↔kód. `getPlanInfo(plan).{days,priceCzk,label}` dle reálného lib.

**Secrety:** žádný secret v plánu ani kódu — vše přes `getEnvVar` z env. Bucket `invoices` privátní.
