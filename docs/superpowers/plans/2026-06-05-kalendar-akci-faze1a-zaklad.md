# Kalendář akcí — Fáze 1a (Základ a příjem akcí) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Postavit datový základ kalendáře akcí — tabulku `akce` v Supabase, čistou testovanou knihovnu (opakování, slugy, formátování termínu), veřejný formulář pro přidání akce s moderací před zveřejněním, on-site moderační rozhraní v `/admin/akce/`, Resend notifikace, kurátorský seed velkých akcí a údržbový skript proti zastarávání.

**Architecture:** Anonymní příspěvek → server-side API endpoint (`/api/akce/submit`) vloží řádek se `stav='ceka'` (service-role Supabase klient, anti-spam honeypot + rate-limit, geokódování přes existující `geocode()`). Moderátor v `/admin/akce/` (gated `bazar_users.is_admin`, vzor fotosoutěže) schválí/upraví/zamítne; schválení nastaví `stav='zverejneno'` a přepočítá `pristi_vyskyt`. Pure-logic helpery (opakování → příští výskyt, slug, formát termínu) jsou v samostatných modulech a kryté unit testy. Veřejné stránky řeší plán 1b.

**Tech Stack:** Astro 6 (SSR, `output: 'server'`, Cloudflare adapter), Supabase (`@supabase/supabase-js`, service/anon klient z `src/lib/supabase.ts`), Resend (transakční e-maily), vitest, TypeScript. Číselník kraj→okres z `src/lib/lokality.ts`. Geokódování z `src/lib/geocode.ts`.

---

## File Structure

**Vytvořit:**
- `supabase/migrations/016_akce_schema.sql` — tabulka `akce` + `akce_reports` + indexy + RLS
- `src/lib/akce-constants.ts` — číselník typů akcí (`AKCE_TYPES`, `AkceTyp`)
- `src/lib/akce-recurrence.ts` — čisté funkce: `computeNextOccurrence`, `expandOccurrences`, `formatTermin`
- `src/lib/akce.ts` — typy domény (`Akce`, `AkceStav`, `AkceDruh`, `AkceInput`) + `slugifyAkce`, validace `validateAkceInput`
- `src/lib/akce-supabase.ts` — datový přístup (`insertSubmission`, `listPending`, `getById`, `moderate`, `listPublishedForMaintenance`, `markPast`)
- `src/lib/akce-email.ts` — Resend: potvrzení odesílateli, notifikace moderátorovi, schváleno, zamítnuto
- `src/pages/akce/pridat.astro` — veřejný formulář
- `src/pages/api/akce/submit.ts` — příjem příspěvku (anti-spam, geocode, insert `ceka`)
- `src/pages/admin/akce/index.astro` — moderační fronta
- `src/pages/admin/akce/api/moderate.ts` — schválit/upravit/zamítnout
- `supabase/seeds/akce_kurator_2026.sql` — kurátorský seed velkých akcí
- `scripts/akce-maintenance.mjs` — přepnutí proběhlých akcí + přepočet `pristi_vyskyt`
- `tests/akce-recurrence.test.ts`, `tests/akce.test.ts` — unit testy

**Modifikovat:**
- `src/pages/admin/index.astro` — přidat dlaždici „Kalendář akcí — moderace"
- `package.json` — npm skript `akce:maintenance`

---

## Task 1: Číselník typů akcí

**Files:**
- Create: `src/lib/akce-constants.ts`

- [ ] **Step 1: Vytvořit číselník typů**

Vzor `FARM_TYPES` z `src/lib/farmy.ts` (pevný objekt slug→label + odvozený typ).

```typescript
// src/lib/akce-constants.ts
// Pevný číselník typů zemědělských akcí. Slug = URL segment v /akce/typ/[typ]/.
// Rozšiřitelný: přidej klíč + label + popis.

export const AKCE_TYPES = {
  'farmarske-trhy': 'Farmářské trhy',
  'polni-dny': 'Polní dny',
  'prodej-ze-dvora': 'Prodej ze dvora',
  'vystavy-veletrhy': 'Výstavy a veletrhy',
  'kurzy-skoleni': 'Kurzy a školení',
  'chovatelske-prehlidky': 'Chovatelské přehlídky',
  'dny-otevrenych-dveri': 'Dny otevřených dveří',
} as const;

export type AkceTyp = keyof typeof AKCE_TYPES;

export const AKCE_TYP_SLUGS = Object.keys(AKCE_TYPES) as AkceTyp[];

export function isAkceTyp(value: string): value is AkceTyp {
  return value in AKCE_TYPES;
}

export function akceTypLabel(typ: AkceTyp): string {
  return AKCE_TYPES[typ];
}
```

- [ ] **Step 2: Ověřit kompilaci**

Run: `cd ~/agro-svet && npx tsc --noEmit src/lib/akce-constants.ts 2>&1 | head`
Expected: žádná chyba vztahující se k tomuto souboru (pre-existing šum v jiných souborech ignoruj).

- [ ] **Step 3: Commit**

```bash
git add src/lib/akce-constants.ts
git commit -m "feat(akce): číselník typů akcí"
```

---

## Task 2: Opakování a formát termínu (čisté funkce + testy)

**Files:**
- Create: `src/lib/akce-recurrence.ts`
- Test: `tests/akce-recurrence.test.ts`

Model opakování (shoda se schématem v Tasku 4):
- jednorázová: `zacatek` (ISO datetime), volitelně `konec`
- opakovaná: `dny_v_tydnu` (pole 0–6, kde 1=pondělí … 7=neděle dle ISO; použijeme 1–7), `cas_od`, `cas_do`, `plati_od` (ISO date), `plati_do` (ISO date | null)

`computeNextOccurrence(input, now)` vrací ISO datetime příštího výskytu (nebo `null`, když akce skončila). `now` je vždy parametr (testovatelnost; v repu je zakázané `Date.now()` v některých kontextech, ale tady běží v Node/Workers — přesto předáváme `now` kvůli determinismu testů).

- [ ] **Step 1: Napsat failující testy**

```typescript
// tests/akce-recurrence.test.ts
import { describe, it, expect } from 'vitest';
import {
  computeNextOccurrence,
  formatTermin,
  type TerminInput,
} from '../src/lib/akce-recurrence';

const NOW = new Date('2026-06-05T10:00:00.000Z'); // pátek

describe('computeNextOccurrence — jednorázová', () => {
  it('vrací začátek, když je v budoucnu', () => {
    const t: TerminInput = { druh: 'jednorazova', zacatek: '2026-08-28T09:00:00.000Z' };
    expect(computeNextOccurrence(t, NOW)).toBe('2026-08-28T09:00:00.000Z');
  });
  it('vrací null, když už proběhla', () => {
    const t: TerminInput = { druh: 'jednorazova', zacatek: '2026-05-01T09:00:00.000Z' };
    expect(computeNextOccurrence(t, NOW)).toBeNull();
  });
  it('počítá vícedenní akci jako probíhající dokud neskončí', () => {
    const t: TerminInput = {
      druh: 'jednorazova',
      zacatek: '2026-06-03T09:00:00.000Z',
      konec: '2026-06-07T18:00:00.000Z',
    };
    // probíhá → příští výskyt je její začátek (řadí se mezi „aktuální")
    expect(computeNextOccurrence(t, NOW)).toBe('2026-06-03T09:00:00.000Z');
  });
});

describe('computeNextOccurrence — opakovaná', () => {
  it('najde nejbližší sobotu pro „každou sobotu 8–12"', () => {
    const t: TerminInput = {
      druh: 'opakovana',
      dny_v_tydnu: [6], // sobota (1=po … 7=ne)
      cas_od: '08:00',
      cas_do: '12:00',
      plati_od: '2026-01-01',
      plati_do: null,
    };
    // 2026-06-05 je pátek → nejbližší sobota 2026-06-06 08:00
    expect(computeNextOccurrence(t, NOW)).toBe('2026-06-06T08:00:00.000+02:00');
  });
  it('respektuje plati_do (po konci platnosti vrací null)', () => {
    const t: TerminInput = {
      druh: 'opakovana',
      dny_v_tydnu: [2],
      cas_od: '09:00',
      cas_do: '11:00',
      plati_od: '2026-01-01',
      plati_do: '2026-05-31',
    };
    expect(computeNextOccurrence(t, NOW)).toBeNull();
  });
  it('vybírá nejbližší z více dnů v týdnu (úterý a pátek)', () => {
    const t: TerminInput = {
      druh: 'opakovana',
      dny_v_tydnu: [2, 5], // út, pá
      cas_od: '15:00',
      cas_do: '18:00',
      plati_od: '2026-01-01',
      plati_do: null,
    };
    // pátek 2026-06-05, 10:00 < 15:00 → dnešní pátek ještě platí
    expect(computeNextOccurrence(t, NOW)).toBe('2026-06-05T15:00:00.000+02:00');
  });
});

describe('formatTermin', () => {
  it('jednorázová: čitelné datum', () => {
    const t: TerminInput = { druh: 'jednorazova', zacatek: '2026-08-28T09:00:00.000Z' };
    expect(formatTermin(t)).toContain('28.');
  });
  it('opakovaná: dny + čas', () => {
    const t: TerminInput = {
      druh: 'opakovana', dny_v_tydnu: [6], cas_od: '08:00', cas_do: '12:00',
      plati_od: '2026-01-01', plati_do: null,
    };
    expect(formatTermin(t)).toContain('sobot');
    expect(formatTermin(t)).toContain('8:00');
  });
});
```

- [ ] **Step 2: Spustit testy — musí selhat**

Run: `cd ~/agro-svet && npx vitest run tests/akce-recurrence.test.ts`
Expected: FAIL — „Cannot find module '../src/lib/akce-recurrence'".

- [ ] **Step 3: Implementovat modul**

Pozn.: časové pásmo CZ je `+02:00` v létě (CEST) / `+01:00` v zimě. Pro opakované akce skládáme lokální čas a připojíme aktuální CZ offset. Jednoduchá funkce `czOffset(date)` zjistí offset přes `Intl`. Pro stabilitu testů používáme `Europe/Prague`.

```typescript
// src/lib/akce-recurrence.ts
// Čisté funkce pro práci s termínem akce. Žádný I/O, žádný globální čas —
// `now` se vždy předává parametrem (determinismus testů).

export type TerminInput =
  | { druh: 'jednorazova'; zacatek: string; konec?: string | null }
  | {
      druh: 'opakovana';
      dny_v_tydnu: number[]; // 1=po … 7=ne (ISO)
      cas_od: string;        // "HH:MM"
      cas_do?: string | null;
      plati_od: string;      // "YYYY-MM-DD"
      plati_do?: string | null;
    };

const DEN_NAZEV = ['', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobotu', 'neděli'];

/** CZ UTC offset ("+02:00"/"+01:00") pro dané datum dle Europe/Prague. */
function czOffset(date: Date): string {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Prague',
    timeZoneName: 'longOffset',
  });
  const part = fmt.formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+02:00';
  // "GMT+02:00" → "+02:00"
  const m = part.match(/GMT([+-]\d{2}:\d{2})/);
  return m ? m[1] : '+02:00';
}

/** ISO date "YYYY-MM-DD" + "HH:MM" + CZ offset → ISO datetime s offsetem. */
function isoLocal(dateYmd: string, hhmm: string): string {
  const base = new Date(`${dateYmd}T${hhmm}:00`);
  const off = czOffset(base);
  return `${dateYmd}T${hhmm}:00.000${off}`;
}

/** ISO weekday 1..7 (po..ne) z Date. */
function isoWeekday(d: Date): number {
  const js = d.getUTCDay(); // 0=ne … 6=so — ale počítáme v CZ čase níže
  return js === 0 ? 7 : js;
}

export function computeNextOccurrence(t: TerminInput, now: Date): string | null {
  if (t.druh === 'jednorazova') {
    const end = t.konec ? new Date(t.konec) : new Date(t.zacatek);
    // probíhá nebo v budoucnu → vrať začátek; jinak null
    return end.getTime() >= now.getTime() ? t.zacatek : null;
  }
  // opakovaná: projdi následujících 14 dní (CZ čas), najdi nejbližší platný den
  const platiOd = new Date(`${t.plati_od}T00:00:00${czOffset(now)}`);
  const platiDo = t.plati_do ? new Date(`${t.plati_do}T23:59:59${czOffset(now)}`) : null;
  for (let i = 0; i < 14; i++) {
    const day = new Date(now.getTime() + i * 86400000);
    // lokalizuj na CZ datum
    const ymd = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(day); // "YYYY-MM-DD"
    const wd = czWeekday(day);
    if (!t.dny_v_tydnu.includes(wd)) continue;
    const candidate = isoLocal(ymd, t.cas_od);
    const candDate = new Date(candidate);
    if (candDate.getTime() < now.getTime()) continue; // dnešní čas už prošel
    if (candDate.getTime() < platiOd.getTime()) continue;
    if (platiDo && candDate.getTime() > platiDo.getTime()) return null;
    return candidate;
  }
  // za 14 dní nic platného → buď mimo platnost, nebo (nереálně) prázdné dny
  return null;
}

/** ISO weekday 1..7 v Europe/Prague. */
function czWeekday(d: Date): number {
  const name = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Prague', weekday: 'short' }).format(d);
  const map: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return map[name] ?? 1;
}

export function formatTermin(t: TerminInput): string {
  if (t.druh === 'jednorazova') {
    const d = new Date(t.zacatek);
    const datum = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague', day: 'numeric', month: 'numeric', year: 'numeric',
    }).format(d);
    const cas = new Intl.DateTimeFormat('cs-CZ', {
      timeZone: 'Europe/Prague', hour: 'numeric', minute: '2-digit',
    }).format(d);
    return `${datum} od ${cas}`;
  }
  const dny = t.dny_v_tydnu.map((w) => DEN_NAZEV[w]).join(', ');
  const cas = t.cas_do ? `${stripLeadingZero(t.cas_od)}–${stripLeadingZero(t.cas_do)}` : `od ${stripLeadingZero(t.cas_od)}`;
  return `každou ${dny} ${cas}`;
}

function stripLeadingZero(hhmm: string): string {
  return hhmm.replace(/^0/, '');
}

/** Pro kalendářové zobrazení: nejbližších N výskytů opakované akce. */
export function expandOccurrences(t: TerminInput, now: Date, count = 5): string[] {
  if (t.druh === 'jednorazova') {
    const next = computeNextOccurrence(t, now);
    return next ? [next] : [];
  }
  const out: string[] = [];
  let cursor = now;
  for (let guard = 0; guard < 400 && out.length < count; guard++) {
    const next = computeNextOccurrence(t, cursor);
    if (!next) break;
    out.push(next);
    cursor = new Date(new Date(next).getTime() + 60000); // posuň za nalezený výskyt
  }
  return out;
}
```

- [ ] **Step 4: Spustit testy — musí projít**

Run: `cd ~/agro-svet && npx vitest run tests/akce-recurrence.test.ts`
Expected: PASS (všech 8 testů). Pokud selže offset assertions, ověř, že běžíš s TZ-agnostic `Intl` (Node ≥22 má plnou ICU — repo vyžaduje Node ≥22.12).

- [ ] **Step 5: Commit**

```bash
git add src/lib/akce-recurrence.ts tests/akce-recurrence.test.ts
git commit -m "feat(akce): opakování a formát termínu (čisté funkce + testy)"
```

---

## Task 3: Doménové typy, slug, validace (čisté funkce + testy)

**Files:**
- Create: `src/lib/akce.ts`
- Test: `tests/akce.test.ts`

- [ ] **Step 1: Napsat failující testy**

```typescript
// tests/akce.test.ts
import { describe, it, expect } from 'vitest';
import { slugifyAkce, validateAkceInput, type AkceInput } from '../src/lib/akce';

describe('slugifyAkce', () => {
  it('diakritika → ASCII, mezery → pomlčky', () => {
    expect(slugifyAkce('Prodej kachen', 'Teplýšovice')).toBe('prodej-kachen-teplysovice');
  });
  it('přidá krátký suffix pro unikátnost', () => {
    const s = slugifyAkce('Polní den', 'Žatec', 'a1b2');
    expect(s).toBe('polni-den-zatec-a1b2');
  });
  it('ořízne přebytečné pomlčky', () => {
    expect(slugifyAkce('  Trh  ', '—Brno—')).toBe('trh-brno');
  });
});

describe('validateAkceInput', () => {
  const base: AkceInput = {
    nazev: 'Farmářské trhy',
    typ: 'farmarske-trhy',
    druh: 'jednorazova',
    zacatek: '2026-08-01T09:00:00.000Z',
    obec: 'Benešov',
    kraj_slug: 'stredocesky',
    okres_slug: 'benesov',
    email: 'a@b.cz',
    popis: 'Pravidelné trhy na náměstí.',
  };
  it('validní jednorázová projde', () => {
    expect(validateAkceInput(base).ok).toBe(true);
  });
  it('chybí název → chyba', () => {
    expect(validateAkceInput({ ...base, nazev: '' }).ok).toBe(false);
  });
  it('neznámý typ → chyba', () => {
    expect(validateAkceInput({ ...base, typ: 'xxx' as AkceInput['typ'] }).ok).toBe(false);
  });
  it('špatný e-mail → chyba', () => {
    expect(validateAkceInput({ ...base, email: 'neni-email' }).ok).toBe(false);
  });
  it('opakovaná bez dnů v týdnu → chyba', () => {
    const r = validateAkceInput({
      ...base, druh: 'opakovana', zacatek: undefined,
      dny_v_tydnu: [], cas_od: '08:00', plati_od: '2026-01-01',
    });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `cd ~/agro-svet && npx vitest run tests/akce.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementovat**

```typescript
// src/lib/akce.ts
import { isAkceTyp, type AkceTyp } from './akce-constants';

export type AkceStav = 'ceka' | 'zverejneno' | 'zamitnuto' | 'probehla';
export type AkceDruh = 'jednorazova' | 'opakovana';

export interface AkceInput {
  nazev: string;
  typ: AkceTyp;
  druh: AkceDruh;
  // jednorázová
  zacatek?: string;
  konec?: string | null;
  // opakovaná
  dny_v_tydnu?: number[];
  cas_od?: string;
  cas_do?: string | null;
  plati_od?: string;
  plati_do?: string | null;
  // místo
  misto_nazev?: string | null;
  adresa?: string | null;
  obec: string;
  kraj_slug: string;
  okres_slug: string;
  // pořadatel / kontakt
  poradatel?: string | null;
  web?: string | null;
  telefon?: string | null;
  email: string;
  popis: string;
}

/** Plný řádek tak, jak ho čteme z DB. */
export interface Akce extends AkceInput {
  id: string;
  slug: string;
  stav: AkceStav;
  zdroj: 'uzivatel' | 'kurator' | 'feed';
  lat: number | null;
  lng: number | null;
  pristi_vyskyt: string | null;
  created_at: string;
  zverejneno_at: string | null;
}

const DIACRITICS: Record<string, string> = {
  á: 'a', č: 'c', ď: 'd', é: 'e', ě: 'e', í: 'i', ň: 'n', ó: 'o', ř: 'r',
  š: 's', ť: 't', ú: 'u', ů: 'u', ý: 'y', ž: 'z',
};

function asciiFold(s: string): string {
  return s.toLowerCase().replace(/[áčďéěíňóřšťúůýž]/g, (c) => DIACRITICS[c] ?? c);
}

export function slugifyAkce(nazev: string, obec: string, suffix?: string): string {
  const raw = [nazev, obec, suffix].filter(Boolean).join(' ');
  const slug = asciiFold(raw)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateAkceInput(input: AkceInput): ValidationResult {
  const errors: string[] = [];
  if (!input.nazev?.trim()) errors.push('Vyplňte název akce.');
  if (!isAkceTyp(input.typ)) errors.push('Neplatný typ akce.');
  if (!input.obec?.trim()) errors.push('Vyplňte obec.');
  if (!input.kraj_slug?.trim()) errors.push('Vyberte kraj.');
  if (!input.okres_slug?.trim()) errors.push('Vyberte okres.');
  if (!EMAIL_RE.test(input.email ?? '')) errors.push('Zadejte platný e-mail.');
  if (!input.popis?.trim() || input.popis.trim().length < 10)
    errors.push('Popis musí mít aspoň 10 znaků.');

  if (input.druh === 'jednorazova') {
    if (!input.zacatek) errors.push('Vyplňte datum a čas konání.');
  } else if (input.druh === 'opakovana') {
    if (!input.dny_v_tydnu || input.dny_v_tydnu.length === 0)
      errors.push('Vyberte aspoň jeden den v týdnu.');
    if (!input.cas_od) errors.push('Vyplňte čas od.');
    if (!input.plati_od) errors.push('Vyplňte platnost od.');
  } else {
    errors.push('Neplatný druh akce.');
  }
  return { ok: errors.length === 0, errors };
}
```

- [ ] **Step 4: Spustit — musí projít**

Run: `cd ~/agro-svet && npx vitest run tests/akce.test.ts`
Expected: PASS (9 testů).

- [ ] **Step 5: Commit**

```bash
git add src/lib/akce.ts tests/akce.test.ts
git commit -m "feat(akce): doménové typy, slug, validace + testy"
```

---

## Task 4: Migrace schématu

**Files:**
- Create: `supabase/migrations/016_akce_schema.sql`

Pozn.: čísla migrací jdou po `015_bazar_reports.sql`. Schéma využívá `bazar_users` (FK pro moderátora). Příspěvky jsou anonymní → `user_id` je NULL u `zdroj='uzivatel'`. Service-role klient (server) zapisuje/čte; RLS jen jako obrana do hloubky (public SELECT pouze `zverejneno`).

- [ ] **Step 1: Napsat migraci**

```sql
-- supabase/migrations/016_akce_schema.sql
-- Kalendář zemědělských akcí. Anonymní příspěvky s moderací před zveřejněním.

CREATE TABLE IF NOT EXISTS akce (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  nazev text NOT NULL,
  popis text NOT NULL DEFAULT '',
  typ text NOT NULL,

  -- termín
  druh text NOT NULL CHECK (druh IN ('jednorazova', 'opakovana')),
  zacatek timestamptz,
  konec timestamptz,
  dny_v_tydnu smallint[],            -- 1=po … 7=ne
  cas_od text,                       -- "HH:MM"
  cas_do text,
  plati_od date,
  plati_do date,
  pristi_vyskyt timestamptz,         -- přepočítáváno JS (moderace + cron)

  -- místo
  misto_nazev text,
  adresa text,
  obec text NOT NULL,
  okres_slug text NOT NULL,
  kraj_slug text NOT NULL,
  lat double precision,
  lng double precision,

  -- pořadatel / kontakt
  poradatel text,
  web text,
  telefon text,
  email text NOT NULL DEFAULT '',

  -- původ a stav
  zdroj text NOT NULL DEFAULT 'uzivatel' CHECK (zdroj IN ('uzivatel', 'kurator', 'feed')),
  feed_id text,
  feed_uid text,
  stav text NOT NULL DEFAULT 'ceka' CHECK (stav IN ('ceka', 'zverejneno', 'zamitnuto', 'probehla')),
  zamitnuti_duvod text,
  moderoval uuid REFERENCES bazar_users(id),
  moderovano_at timestamptz,

  -- monetizace (připraveno, zatím nevyužité)
  zvyrazneno boolean NOT NULL DEFAULT false,
  zvyrazneno_do timestamptz,

  og_image text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  zverejneno_at timestamptz
);

-- Nahlašování (vzor bazar_reports)
CREATE TABLE IF NOT EXISTS akce_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  akce_id uuid NOT NULL REFERENCES akce(id) ON DELETE CASCADE,
  duvod text NOT NULL,
  poznamka text,
  created_at timestamptz NOT NULL DEFAULT now(),
  vyrizeno boolean NOT NULL DEFAULT false
);

-- Indexy pro řazení/filtr veřejných stránek (plán 1b)
CREATE INDEX IF NOT EXISTS idx_akce_stav ON akce(stav);
CREATE INDEX IF NOT EXISTS idx_akce_pristi ON akce(pristi_vyskyt) WHERE stav = 'zverejneno';
CREATE INDEX IF NOT EXISTS idx_akce_typ ON akce(typ) WHERE stav = 'zverejneno';
CREATE INDEX IF NOT EXISTS idx_akce_okres ON akce(okres_slug) WHERE stav = 'zverejneno';
CREATE INDEX IF NOT EXISTS idx_akce_kraj ON akce(kraj_slug) WHERE stav = 'zverejneno';
CREATE UNIQUE INDEX IF NOT EXISTS idx_akce_feed_uid ON akce(feed_id, feed_uid) WHERE feed_uid IS NOT NULL;

-- RLS: obrana do hloubky. Server (service role) RLS obchází.
ALTER TABLE akce ENABLE ROW LEVEL SECURITY;
ALTER TABLE akce_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "akce_public_select_published" ON akce
  FOR SELECT USING (stav = 'zverejneno');
CREATE POLICY "akce_reports_insert_any" ON akce_reports
  FOR INSERT WITH CHECK (true);

COMMENT ON COLUMN akce.pristi_vyskyt IS
  'Příští výskyt (ISO). Počítá JS při moderaci a v scripts/akce-maintenance.mjs.';
```

- [ ] **Step 2: Aplikovat migraci**

Migrace se aplikuje přes Supabase (MCP `apply_migration` nebo `supabase db push`). Pokud nemáš přístup, požádej uživatele o aplikaci a pokračuj — zbytek 1a jde psát i bez živé DB (gate = `npm run build` + vitest).

Run (varianta MCP): aplikuj obsah souboru jako migraci `akce_schema`.
Expected: tabulky `akce` a `akce_reports` existují (`list_tables`).

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/016_akce_schema.sql
git commit -m "feat(akce): migrace schématu akce + akce_reports"
```

---

## Task 5: Datová vrstva (Supabase přístup)

**Files:**
- Create: `src/lib/akce-supabase.ts`

Vzor: `src/lib/contest-supabase.ts` + `moderate.ts` (service klient). Žádné unit testy (I/O vrstva); kryje ji build + ruční smoke. `pristi_vyskyt` se počítá přes `computeNextOccurrence` z Tasku 2.

- [ ] **Step 1: Implementovat**

```typescript
// src/lib/akce-supabase.ts
import { createServerClient } from './supabase';
import { computeNextOccurrence, type TerminInput } from './akce-recurrence';
import type { Akce, AkceInput, AkceStav } from './akce';

/** Sestaví TerminInput z řádku/inputu pro výpočet příštího výskytu. */
function terminOf(a: {
  druh: 'jednorazova' | 'opakovana';
  zacatek?: string | null;
  konec?: string | null;
  dny_v_tydnu?: number[] | null;
  cas_od?: string | null;
  cas_do?: string | null;
  plati_od?: string | null;
  plati_do?: string | null;
}): TerminInput {
  if (a.druh === 'jednorazova') {
    return { druh: 'jednorazova', zacatek: a.zacatek!, konec: a.konec ?? null };
  }
  return {
    druh: 'opakovana',
    dny_v_tydnu: a.dny_v_tydnu ?? [],
    cas_od: a.cas_od ?? '00:00',
    cas_do: a.cas_do ?? null,
    plati_od: a.plati_od!,
    plati_do: a.plati_do ?? null,
  };
}

/** Vloží anonymní příspěvek se stavem 'ceka'. Vrací id+slug. */
export async function insertSubmission(
  input: AkceInput & { slug: string; lat: number | null; lng: number | null },
): Promise<{ id: string; slug: string }> {
  const sb = createServerClient();
  const now = new Date();
  const pristi = computeNextOccurrence(terminOf(input), now);
  const { data, error } = await sb
    .from('akce')
    .insert({
      slug: input.slug,
      nazev: input.nazev,
      popis: input.popis,
      typ: input.typ,
      druh: input.druh,
      zacatek: input.zacatek ?? null,
      konec: input.konec ?? null,
      dny_v_tydnu: input.dny_v_tydnu ?? null,
      cas_od: input.cas_od ?? null,
      cas_do: input.cas_do ?? null,
      plati_od: input.plati_od ?? null,
      plati_do: input.plati_do ?? null,
      pristi_vyskyt: pristi,
      misto_nazev: input.misto_nazev ?? null,
      adresa: input.adresa ?? null,
      obec: input.obec,
      okres_slug: input.okres_slug,
      kraj_slug: input.kraj_slug,
      lat: input.lat,
      lng: input.lng,
      poradatel: input.poradatel ?? null,
      web: input.web ?? null,
      telefon: input.telefon ?? null,
      email: input.email,
      zdroj: 'uzivatel',
      stav: 'ceka',
    })
    .select('id, slug')
    .single();
  if (error) throw error;
  return data as { id: string; slug: string };
}

export async function listPending(): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('stav', 'ceka')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Akce[];
}

export async function getById(id: string): Promise<Akce | null> {
  const sb = createServerClient();
  const { data } = await sb.from('akce').select('*').eq('id', id).maybeSingle();
  return (data as Akce) ?? null;
}

/** Schválí / zamítne. Při schválení přepočítá pristi_vyskyt + nastaví stav. */
export async function moderate(args: {
  id: string;
  action: 'approve' | 'reject';
  reason?: string;
  moderatorId: string;
  patch?: Partial<AkceInput>; // „upravit a schválit"
}): Promise<Akce | null> {
  const sb = createServerClient();
  const current = await getById(args.id);
  if (!current) return null;

  if (args.action === 'reject') {
    await sb.from('akce').update({
      stav: 'zamitnuto' as AkceStav,
      zamitnuti_duvod: args.reason ?? null,
      moderoval: args.moderatorId,
      moderovano_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', args.id);
    return getById(args.id);
  }

  const merged = { ...current, ...(args.patch ?? {}) };
  const pristi = computeNextOccurrence(terminOf(merged), new Date());
  await sb.from('akce').update({
    ...(args.patch ?? {}),
    pristi_vyskyt: pristi,
    stav: 'zverejneno' as AkceStav,
    moderoval: args.moderatorId,
    moderovano_at: new Date().toISOString(),
    zverejneno_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', args.id);
  return getById(args.id);
}

/** Pro údržbový skript: všechny zveřejněné akce. */
export async function listPublishedForMaintenance(): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb.from('akce').select('*').eq('stav', 'zverejneno');
  if (error) throw error;
  return (data ?? []) as Akce[];
}

/** Aktualizuje pristi_vyskyt; jednorázové po termínu → 'probehla'. */
export async function applyMaintenance(a: Akce, now: Date): Promise<void> {
  const sb = createServerClient();
  const pristi = computeNextOccurrence(terminOf(a), now);
  if (a.druh === 'jednorazova' && pristi === null) {
    await sb.from('akce').update({ stav: 'probehla', pristi_vyskyt: null, updated_at: now.toISOString() }).eq('id', a.id);
  } else {
    await sb.from('akce').update({ pristi_vyskyt: pristi, updated_at: now.toISOString() }).eq('id', a.id);
  }
}
```

- [ ] **Step 2: Ověřit build typů**

Run: `cd ~/agro-svet && npm run build 2>&1 | tail -20`
Expected: build projde (Astro zkompiluje; nové moduly se zatím nikde neimportují, ale syntaktické/typové chyby by build shodily přes Vite). Pokud build padá na něčem nesouvisejícím pre-existing, ověř `git stash` baseline.

- [ ] **Step 3: Commit**

```bash
git add src/lib/akce-supabase.ts
git commit -m "feat(akce): datová vrstva (insert/list/moderate/maintenance)"
```

---

## Task 6: Resend e-maily

**Files:**
- Create: `src/lib/akce-email.ts`

Vzor: `src/lib/bazar-report-email.ts` (`new Resend(apiKey)`, `resend.emails.send`). Odesílatel a styl převezmi z existujícího e-mailu (zkontroluj `from:` v `bazar-report-email.ts` a použij stejnou doménu).

- [ ] **Step 1: Implementovat**

```typescript
// src/lib/akce-email.ts
import { Resend } from 'resend';
import { SITE_URL } from './config';

const FROM = 'agro-svět.cz <info@samecdigital.com>'; // sjednoť s bazar-report-email.ts
const MODERATOR_TO = 'info@samecdigital.com';

export async function sendSubmissionConfirmation(apiKey: string, to: string, nazev: string): Promise<void> {
  if (!apiKey || !to) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Děkujeme — vaše akce čeká na schválení',
    html: `<p>Děkujeme za přidání akce <strong>${escapeHtml(nazev)}</strong>.</p>
      <p>Akci zkontrolujeme a po schválení se objeví v kalendáři na agro-svet.cz.</p>`,
  });
}

export async function notifyModerator(apiKey: string, nazev: string, obec: string): Promise<void> {
  if (!apiKey) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to: MODERATOR_TO,
    subject: `Nová akce ke schválení: ${nazev}`,
    html: `<p>Čeká nová akce: <strong>${escapeHtml(nazev)}</strong> (${escapeHtml(obec)}).</p>
      <p><a href="${SITE_URL}/admin/akce/">Otevřít moderaci</a></p>`,
  });
}

export async function sendApproved(apiKey: string, to: string, nazev: string, slug: string): Promise<void> {
  if (!apiKey || !to) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Vaše akce byla schválena',
    html: `<p>Akce <strong>${escapeHtml(nazev)}</strong> je zveřejněná:</p>
      <p><a href="${SITE_URL}/akce/${slug}/">${SITE_URL}/akce/${slug}/</a></p>`,
  });
}

export async function sendRejected(apiKey: string, to: string, nazev: string, reason: string): Promise<void> {
  if (!apiKey || !to) return;
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Vaše akce nebyla schválena',
    html: `<p>Akci <strong>${escapeHtml(nazev)}</strong> jsme bohužel nezveřejnili.</p>
      ${reason ? `<p>Důvod: ${escapeHtml(reason)}</p>` : ''}`,
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
```

- [ ] **Step 2: Sjednotit `FROM`**

Run: `cd ~/agro-svet && grep -n "from:" src/lib/bazar-report-email.ts`
Uprav konstantu `FROM` v `akce-email.ts`, ať odpovídá ověřené Resend doméně použité jinde.

- [ ] **Step 3: Commit**

```bash
git add src/lib/akce-email.ts
git commit -m "feat(akce): Resend e-maily (potvrzení/notifikace/schváleno/zamítnuto)"
```

---

## Task 7: API endpoint pro příjem akce

**Files:**
- Create: `src/pages/api/akce/submit.ts`

Anti-spam: honeypot pole `web_url` (skryté; když vyplněné → tiše „ok"), jednoduchý rate-limit přes existující `src/lib/edge-throttle.ts` (zkontroluj jeho API; pokud nesedí, použij in-memory map per IP s krátkým oknem). Geokódování přes `geocode()` z obce.

- [ ] **Step 1: Zkontrolovat throttle API**

Run: `cd ~/agro-svet && grep -nE "export (async )?function|export const" src/lib/edge-throttle.ts`
Použij dostupnou funkci; pokud žádná nesedí, vynech rate-limit v této iteraci (honeypot + moderace stačí jako první obrana) a poznamenej TODO do PR popisu.

- [ ] **Step 2: Implementovat endpoint**

```typescript
// src/pages/api/akce/submit.ts
import type { APIRoute } from 'astro';
import { validateAkceInput, slugifyAkce, type AkceInput } from '../../../lib/akce';
import { insertSubmission } from '../../../lib/akce-supabase';
import { geocode } from '../../../lib/geocode';
import { sendSubmissionConfirmation, notifyModerator } from '../../../lib/akce-email';
import { getEnvVar } from '../../../lib/env';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();

  // Honeypot — boti vyplní; lidé ne (pole je skryté CSS).
  if (String(form.get('web_url') ?? '').trim() !== '') {
    return json({ ok: true }); // tiše spolkni
  }

  const druh = String(form.get('druh') ?? 'jednorazova') as AkceInput['druh'];
  const dny = form.getAll('dny_v_tydnu').map((d) => Number(d)).filter((n) => n >= 1 && n <= 7);

  const input: AkceInput = {
    nazev: String(form.get('nazev') ?? '').trim(),
    typ: String(form.get('typ') ?? '') as AkceInput['typ'],
    druh,
    zacatek: druh === 'jednorazova' ? toIso(form.get('zacatek')) : undefined,
    konec: druh === 'jednorazova' ? toIso(form.get('konec')) : undefined,
    dny_v_tydnu: druh === 'opakovana' ? dny : undefined,
    cas_od: druh === 'opakovana' ? str(form.get('cas_od')) : undefined,
    cas_do: druh === 'opakovana' ? str(form.get('cas_do')) : undefined,
    plati_od: druh === 'opakovana' ? str(form.get('plati_od')) : undefined,
    plati_do: druh === 'opakovana' ? str(form.get('plati_do')) : undefined,
    misto_nazev: str(form.get('misto_nazev')),
    adresa: str(form.get('adresa')),
    obec: String(form.get('obec') ?? '').trim(),
    kraj_slug: String(form.get('kraj_slug') ?? '').trim(),
    okres_slug: String(form.get('okres_slug') ?? '').trim(),
    poradatel: str(form.get('poradatel')),
    web: str(form.get('web')),
    telefon: str(form.get('telefon')),
    email: String(form.get('email') ?? '').trim(),
    popis: String(form.get('popis') ?? '').trim(),
  };

  const v = validateAkceInput(input);
  if (!v.ok) return json({ ok: false, errors: v.errors }, 400);

  // Geokódování (obec → lat/lng); selhání není fatální.
  let lat: number | null = null, lng: number | null = null;
  try {
    const geo = await geocode({ location: input.obec });
    if (geo) { lat = geo.lat; lng = geo.lng; }
  } catch (e) { console.error('[akce/submit] geocode failed', e); }

  // Slug s krátkým náhodným suffixem kvůli kolizím (stejné názvy v různých obcích).
  const suffix = cryptoSuffix();
  const slug = slugifyAkce(input.nazev, input.obec, suffix);

  let id: string;
  try {
    const res = await insertSubmission({ ...input, slug, lat, lng });
    id = res.id;
  } catch (e) {
    console.error('[akce/submit] insert failed', e);
    return json({ ok: false, errors: ['Uložení se nezdařilo, zkuste to prosím znovu.'] }, 500);
  }

  const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
  sendSubmissionConfirmation(apiKey, input.email, input.nazev).catch((e) => console.error('[akce/submit] mail', e));
  notifyModerator(apiKey, input.nazev, input.obec).catch((e) => console.error('[akce/submit] mail', e));

  return json({ ok: true, id });
};

function str(v: FormDataEntryValue | null): string | undefined {
  const s = String(v ?? '').trim();
  return s === '' ? undefined : s;
}
function toIso(v: FormDataEntryValue | null): string | undefined {
  const s = String(v ?? '').trim();
  if (!s) return undefined;
  const d = new Date(s); // <input type="datetime-local"> → "YYYY-MM-DDTHH:MM"
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}
function cryptoSuffix(): string {
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
```

- [ ] **Step 3: Build**

Run: `cd ~/agro-svet && npm run build 2>&1 | tail -20`
Expected: build projde.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/akce/submit.ts
git commit -m "feat(akce): API endpoint pro příjem akce (honeypot + geocode + e-maily)"
```

---

## Task 8: Veřejný formulář /akce/pridat/

**Files:**
- Create: `src/pages/akce/pridat.astro`

Forma: progresivní — funguje i bez JS (POST na `/api/akce/submit`), s JS přepíná pole jednorázová/opakovaná a plní okres dle kraje (data z `getKraje()`). Honeypot `web_url` skrytý CSS. Použij `Layout.astro` (zkontroluj jeho props: `title`, `description`).

- [ ] **Step 1: Zjistit props Layoutu a kraj/okres data**

Run: `cd ~/agro-svet && grep -nE "Astro.props|interface Props|const \{" src/layouts/Layout.astro | head`
Run: `cd ~/agro-svet && grep -nE "export function getKraje" src/lib/lokality.ts`

- [ ] **Step 2: Implementovat stránku**

```astro
---
// src/pages/akce/pridat.astro
import Layout from '../../layouts/Layout.astro';
import { AKCE_TYPES } from '../../lib/akce-constants';
import { getKraje } from '../../lib/lokality';

export const prerender = false;
const kraje = getKraje();
---
<Layout title="Přidat akci — Kalendář akcí | agro-svet.cz" description="Přidejte svou zemědělskou akci — farmářské trhy, polní den, prodej ze dvora. Po schválení se zobrazí v kalendáři.">
  <main class="pridat">
    <h1>Přidat akci do kalendáře</h1>
    <p>Akci po odeslání zkontrolujeme a poté zveřejníme. Vyplnění zabere minutu.</p>

    <form id="akce-form" method="POST" action="/api/akce/submit">
      <!-- honeypot: skryté, boti vyplní -->
      <input type="text" name="web_url" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true" />

      <label>Název akce*
        <input type="text" name="nazev" required maxlength="120" />
      </label>

      <label>Typ akce*
        <select name="typ" required>
          {Object.entries(AKCE_TYPES).map(([slug, label]) => <option value={slug}>{label}</option>)}
        </select>
      </label>

      <fieldset>
        <legend>Termín*</legend>
        <label><input type="radio" name="druh" value="jednorazova" checked /> Jednorázová</label>
        <label><input type="radio" name="druh" value="opakovana" /> Opakovaná</label>

        <div data-druh="jednorazova">
          <label>Začátek <input type="datetime-local" name="zacatek" /></label>
          <label>Konec (volitelné) <input type="datetime-local" name="konec" /></label>
        </div>

        <div data-druh="opakovana" hidden>
          <fieldset class="dny">
            <legend>Dny v týdnu</legend>
            {['Po','Út','St','Čt','Pá','So','Ne'].map((d, i) => (
              <label><input type="checkbox" name="dny_v_tydnu" value={i + 1} /> {d}</label>
            ))}
          </fieldset>
          <label>Čas od <input type="time" name="cas_od" /></label>
          <label>Čas do <input type="time" name="cas_do" /></label>
          <label>Platí od <input type="date" name="plati_od" /></label>
          <label>Platí do (volitelné) <input type="date" name="plati_do" /></label>
        </div>
      </fieldset>

      <fieldset>
        <legend>Místo</legend>
        <label>Kraj*
          <select name="kraj_slug" id="kraj" required>
            <option value="">— vyberte —</option>
            {kraje.map((k) => <option value={k.slug}>{k.name}</option>)}
          </select>
        </label>
        <label>Okres*
          <select name="okres_slug" id="okres" required><option value="">— nejdřív vyberte kraj —</option></select>
        </label>
        <label>Obec*
          <input type="text" name="obec" required maxlength="80" placeholder="Např. Teplýšovice" />
        </label>
        <label>Místo / adresa (volitelné)
          <input type="text" name="misto_nazev" maxlength="120" placeholder="Náměstí, areál farmy…" />
        </label>
      </fieldset>

      <fieldset>
        <legend>Pořadatel a kontakt</legend>
        <label>Pořadatel (volitelné) <input type="text" name="poradatel" maxlength="120" /></label>
        <label>Web (volitelné) <input type="url" name="web" /></label>
        <label>Telefon (volitelné) <input type="tel" name="telefon" /></label>
        <label>Váš e-mail* <input type="email" name="email" required /></label>
      </fieldset>

      <label>Popis akce*
        <textarea name="popis" required minlength="10" maxlength="2000" rows="5"></textarea>
      </label>

      <button type="submit">Odeslat ke schválení</button>
      <p id="form-msg" role="status" aria-live="polite"></p>
    </form>
  </main>

  <script type="module">
    const kraje = JSON.parse(document.getElementById('kraje-data').textContent);
    const krajSel = document.getElementById('kraj');
    const okresSel = document.getElementById('okres');
    krajSel.addEventListener('change', () => {
      const k = kraje.find((x) => x.slug === krajSel.value);
      okresSel.innerHTML = '<option value="">— vyberte —</option>' +
        (k ? k.okresy.map((o) => `<option value="${o.slug}">${o.name}</option>`).join('') : '');
    });

    const form = document.getElementById('akce-form');
    for (const el of form.querySelectorAll('input[name="druh"]')) {
      el.addEventListener('change', () => {
        const v = form.querySelector('input[name="druh"]:checked').value;
        form.querySelector('[data-druh="jednorazova"]').hidden = v !== 'jednorazova';
        form.querySelector('[data-druh="opakovana"]').hidden = v !== 'opakovana';
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = document.getElementById('form-msg');
      msg.textContent = 'Odesílám…';
      const res = await fetch('/api/akce/submit', { method: 'POST', body: new FormData(form) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        form.reset();
        msg.textContent = '✅ Děkujeme! Akce čeká na schválení.';
      } else {
        msg.textContent = '⚠️ ' + ((data.errors || ['Něco se pokazilo.']).join(' '));
      }
    });
  </script>
  <script id="kraje-data" type="application/json" set:html={JSON.stringify(kraje)}></script>

  <style>
    .pridat { max-width: 680px; margin: 0 auto; padding: 32px 20px 80px; }
    .pridat label { display: block; margin: 12px 0; }
    .pridat input, .pridat select, .pridat textarea { width: 100%; padding: 8px; }
    .pridat fieldset { margin: 16px 0; border: 1px solid #e8e8e8; border-radius: 10px; padding: 12px 16px; }
    .pridat .dny label { display: inline-block; width: auto; margin-right: 10px; }
    .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
    .pridat button { margin-top: 20px; padding: 12px 24px; font-weight: 600; cursor: pointer; }
  </style>
</Layout>
```

- [ ] **Step 3: Build + ruční smoke**

Run: `cd ~/agro-svet && npm run build 2>&1 | tail -20`
Expected: build projde, stránka `/akce/pridat/` je v outputu.
Ruční (volitelné, vyžaduje běžící DB): `npm run dev`, otevři `/akce/pridat/`, odešli testovací akci → očekávej „✅ Děkujeme".

- [ ] **Step 4: Commit**

```bash
git add src/pages/akce/pridat.astro
git commit -m "feat(akce): veřejný formulář /akce/pridat/"
```

---

## Task 9: Moderační API

**Files:**
- Create: `src/pages/admin/akce/api/moderate.ts`

Vzor 1:1 dle `src/pages/admin/fotosoutez/api/moderate.ts` (gate `is_admin`, service klient, Resend). Podporuje `approve` / `reject` / `approve_edit` (s patchem polí).

- [ ] **Step 1: Implementovat**

```typescript
// src/pages/admin/akce/api/moderate.ts
import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../lib/supabase';
import { moderate, getById } from '../../../../lib/akce-supabase';
import { sendApproved, sendRejected } from '../../../../lib/akce-email';
import { getEnvVar } from '../../../../lib/env';
import type { AkceInput } from '../../../../lib/akce';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const sb = createServerClient();
  const { data: profile } = await sb.from('bazar_users').select('is_admin').eq('id', user.id).maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const form = await request.formData();
  const id = String(form.get('akce_id') ?? '');
  const action = String(form.get('action') ?? '');
  const reason = String(form.get('reason') ?? '');
  if (!id || !['approve', 'reject', 'approve_edit'].includes(action)) return json({ error: 'bad_request' }, 400);

  // „Upravit a schválit" — vezmi editovatelná pole z formuláře.
  let patch: Partial<AkceInput> | undefined;
  if (action === 'approve_edit') {
    patch = {
      nazev: optional(form.get('nazev')),
      popis: optional(form.get('popis')),
      obec: optional(form.get('obec')),
    } as Partial<AkceInput>;
  }

  const before = await getById(id);
  if (!before) return json({ error: 'not_found' }, 404);

  const updated = await moderate({
    id,
    action: action === 'reject' ? 'reject' : 'approve',
    reason,
    moderatorId: user.id,
    patch,
  });

  const apiKey = getEnvVar('RESEND_API_KEY') ?? '';
  if (before.email) {
    if (action === 'reject') {
      sendRejected(apiKey, before.email, before.nazev, reason).catch((e) => console.error('[akce/moderate] mail', e));
    } else if (updated) {
      sendApproved(apiKey, before.email, updated.nazev, updated.slug).catch((e) => console.error('[akce/moderate] mail', e));
    }
  }
  return json({ ok: true });
};

function optional(v: FormDataEntryValue | null): string | undefined {
  const s = String(v ?? '').trim();
  return s === '' ? undefined : s;
}
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
```

- [ ] **Step 2: Build**

Run: `cd ~/agro-svet && npm run build 2>&1 | tail -20`
Expected: build projde.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/akce/api/moderate.ts
git commit -m "feat(akce): moderační API (approve/reject/approve_edit)"
```

---

## Task 10: Moderační fronta /admin/akce/

**Files:**
- Create: `src/pages/admin/akce/index.astro`

Vzor `src/pages/admin/fotosoutez/moderace.astro` (zkontroluj jeho strukturu pro konzistentní UI). Stránka je gated middlewarem (`/admin/`). Načte `listPending()`, vykreslí karty s tlačítky Schválit / Upravit a schválit / Zamítnout (fetch na moderační API, pak reload).

- [ ] **Step 1: Prohlédnout vzor**

Run: `cd ~/agro-svet && sed -n '1,60p' src/pages/admin/fotosoutez/moderace.astro`

- [ ] **Step 2: Implementovat**

```astro
---
// src/pages/admin/akce/index.astro
import Layout from '../../../layouts/Layout.astro';
import { listPending } from '../../../lib/akce-supabase';
import { formatTermin, type TerminInput } from '../../../lib/akce-recurrence';
import { akceTypLabel } from '../../../lib/akce-constants';

export const prerender = false;
const pending = await listPending();

function termin(a: typeof pending[number]): string {
  const t: TerminInput = a.druh === 'jednorazova'
    ? { druh: 'jednorazova', zacatek: a.zacatek as string, konec: a.konec }
    : { druh: 'opakovana', dny_v_tydnu: a.dny_v_tydnu ?? [], cas_od: a.cas_od ?? '', cas_do: a.cas_do, plati_od: a.plati_od as string, plati_do: a.plati_do };
  return formatTermin(t);
}
---
<Layout title="Moderace akcí — admin" description="Schvalování akcí v kalendáři">
  <main class="mod">
    <h1>Moderace akcí <span>({pending.length} čeká)</span></h1>
    {pending.length === 0 && <p>Žádné akce nečekají na schválení. 🎉</p>}
    {pending.map((a) => (
      <article class="card" data-id={a.id}>
        <h2>{a.nazev}</h2>
        <p class="meta">{akceTypLabel(a.typ as any)} · {a.obec} ({a.okres_slug}) · {termin(a)}</p>
        <p>{a.popis}</p>
        <p class="contact">{a.poradatel} · {a.email} · {a.web}</p>
        <div class="actions">
          <button data-action="approve">Schválit</button>
          <button data-action="reject">Zamítnout</button>
        </div>
      </article>
    ))}
  </main>

  <script type="module">
    for (const card of document.querySelectorAll('.card')) {
      const id = card.dataset.id;
      card.querySelector('[data-action="approve"]').addEventListener('click', () => act(id, 'approve'));
      card.querySelector('[data-action="reject"]').addEventListener('click', () => {
        const reason = prompt('Důvod zamítnutí (volitelné):') ?? '';
        act(id, 'reject', reason);
      });
    }
    async function act(id, action, reason = '') {
      const fd = new FormData();
      fd.set('akce_id', id); fd.set('action', action); fd.set('reason', reason);
      const res = await fetch('/admin/akce/api/moderate', { method: 'POST', body: fd });
      if (res.ok) location.reload();
      else alert('Chyba moderace: ' + res.status);
    }
  </script>

  <style>
    .mod { max-width: 820px; margin: 0 auto; padding: 32px 20px 80px; }
    .mod h1 span { font-weight: 400; color: #666; font-size: .7em; }
    .card { border: 1px solid #e8e8e8; border-radius: 12px; padding: 16px 20px; margin: 16px 0; }
    .card .meta { color: #555; font-size: .9rem; }
    .card .contact { color: #888; font-size: .85rem; }
    .actions { display: flex; gap: 10px; margin-top: 12px; }
    .actions button { padding: 8px 18px; cursor: pointer; }
  </style>
</Layout>
```

Pozn.: „Upravit a schválit" (akce `approve_edit`) je rozšíření UI — v této iteraci stačí Schválit/Zamítnout; editaci řeš přímo úpravou v Supabase nebo přidej inline formulář v navazujícím commitu (API už `approve_edit` podporuje).

- [ ] **Step 3: Build**

Run: `cd ~/agro-svet && npm run build 2>&1 | tail -20`
Expected: build projde.

- [ ] **Step 4: Commit**

```bash
git add src/pages/admin/akce/index.astro
git commit -m "feat(akce): moderační fronta /admin/akce/"
```

---

## Task 11: Dlaždice v admin rozcestníku

**Files:**
- Modify: `src/pages/admin/index.astro`

- [ ] **Step 1: Přidat dlaždici**

Najdi blok `<div class="tiles">` v `src/pages/admin/index.astro` a přidej za poslední `<a class="tile">`:

```astro
      <a href="/admin/akce/" class="tile">
        <h2>Kalendář akcí</h2>
        <p>Moderace akcí čekajících na schválení</p>
      </a>
```

- [ ] **Step 2: Build**

Run: `cd ~/agro-svet && npm run build 2>&1 | tail -20`
Expected: build projde.

- [ ] **Step 3: Commit**

```bash
git add src/pages/admin/index.astro
git commit -m "feat(akce): dlaždice kalendáře v admin rozcestníku"
```

---

## Task 12: Kurátorský seed velkých akcí 2026

**Files:**
- Create: `supabase/seeds/akce_kurator_2026.sql`

Cíl: aby kalendář nebyl po spuštění prázdný. Vlož ~8–12 velkých celostátních akcí (`zdroj='kurator'`, `stav='zverejneno'`). `pristi_vyskyt` = `zacatek` (jednorázové). Slugy ručně, unikátní. Datumy ověř proti oficiálním webům pořadatelů; pokud termín 2026 ještě není znám, použij orientační dle minulých ročníků a označ v `popis`.

- [ ] **Step 1: Napsat seed**

```sql
-- supabase/seeds/akce_kurator_2026.sql
-- Kurátorský seed velkých zemědělských akcí. zdroj='kurator', rovnou zveřejněné.
-- Termíny ověřit proti oficiálním webům před importem.

INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES
  ('zeme-zivitelka-2026', 'Země živitelka 2026',
   'Největší zemědělský veletrh v ČR na výstavišti v Českých Budějovicích.',
   'vystavy-veletrhy', 'jednorazova', '2026-08-27T09:00:00+02:00', '2026-09-01T18:00:00+02:00',
   '2026-08-27T09:00:00+02:00', 'České Budějovice', 'ceske-budejovice', 'jihocesky',
   48.97658, 14.44476, 'Výstaviště České Budějovice', 'https://www.zemezivitelka.cz/',
   'info@samecdigital.com', 'kurator', 'zverejneno', now())
ON CONFLICT (slug) DO NOTHING;
-- … přidej dalších ~8–12 akcí stejným vzorem (agrosalony, hlavní polní dny,
-- Náš chov / chovatelské přehlídky, Techagro v daný rok apod.).
```

- [ ] **Step 2: Aplikovat seed**

Aplikuj přes Supabase MCP `execute_sql` nebo `psql`. Pokud nemáš přístup, předej uživateli k aplikaci.
Expected: `SELECT count(*) FROM akce WHERE zdroj='kurator';` ≥ 1.

- [ ] **Step 3: Commit**

```bash
git add supabase/seeds/akce_kurator_2026.sql
git commit -m "feat(akce): kurátorský seed velkých akcí 2026"
```

---

## Task 13: Údržbový skript (proti zastarávání)

**Files:**
- Create: `scripts/akce-maintenance.mjs`
- Modify: `package.json` (skript `akce:maintenance`)

Vzor: ostatní `scripts/*.mjs` (Node, čte env z `--env-file=.env`). Použij `@supabase/supabase-js` přímo (skript běží v Node, ne ve Workeru — nemá `cloudflare:workers`). Logiku příštího výskytu zopakuj minimálně, NEBO importuj z `akce-recurrence.ts` přes `tsx`. Nejjednodušší: skript volá Supabase přímo a používá vestavěnou kopii `computeNextOccurrence` přes dynamický import zkompilované TS? Pro jednoduchost a DRY použij `tsx` runner.

- [ ] **Step 1: Implementovat skript (tsx, importuje sdílenou logiku)**

```javascript
// scripts/akce-maintenance.mjs
// Přepočítá pristi_vyskyt u zveřejněných akcí; jednorázové po termínu → 'probehla'.
// Spouštět cronem (CF Cron Trigger nebo GitHub Actions). Lokálně:
//   node --env-file=.env scripts/akce-maintenance.mjs
import { createClient } from '@supabase/supabase-js';
import { computeNextOccurrence } from '../src/lib/akce-recurrence.ts';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;
if (!url || !key) { console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_KEY'); process.exit(1); }
const sb = createClient(url, key);

const now = new Date();
const { data, error } = await sb.from('akce').select('*').eq('stav', 'zverejneno');
if (error) { console.error(error); process.exit(1); }

let updated = 0, expired = 0;
for (const a of data ?? []) {
  const t = a.druh === 'jednorazova'
    ? { druh: 'jednorazova', zacatek: a.zacatek, konec: a.konec }
    : { druh: 'opakovana', dny_v_tydnu: a.dny_v_tydnu ?? [], cas_od: a.cas_od ?? '00:00', cas_do: a.cas_do, plati_od: a.plati_od, plati_do: a.plati_do };
  const pristi = computeNextOccurrence(t, now);
  if (a.druh === 'jednorazova' && pristi === null) {
    await sb.from('akce').update({ stav: 'probehla', pristi_vyskyt: null, updated_at: now.toISOString() }).eq('id', a.id);
    expired++;
  } else {
    await sb.from('akce').update({ pristi_vyskyt: pristi, updated_at: now.toISOString() }).eq('id', a.id);
    updated++;
  }
}
console.log(`akce-maintenance: ${updated} přepočítáno, ${expired} → probehla`);
```

- [ ] **Step 2: Přidat npm skript**

V `package.json` do `scripts` přidej:

```json
    "akce:maintenance": "tsx --env-file=.env scripts/akce-maintenance.mjs",
```

Pozn.: ověř, že `tsx` je dostupné (jinde v repu se používá? `grep -n "tsx" package.json`). Pokud ne, přidej `tsx` do devDependencies (`npm i -D tsx`) — repo už `tsx` používalo při i18n QA dle poznámek; ověř.

- [ ] **Step 3: Ověřit běh (s živou DB)**

Run: `cd ~/agro-svet && npm run akce:maintenance`
Expected: `akce-maintenance: N přepočítáno, M → probehla`. Bez DB přeskoč a ověř jen `node --check` syntaxi.

- [ ] **Step 4: Commit**

```bash
git add scripts/akce-maintenance.mjs package.json
git commit -m "feat(akce): údržbový skript (přepočet výskytů + expirace)"
```

Pozn.: Napojení na **Cloudflare Cron Trigger** (denní běh) je drobná konfigurace ve `wrangler.toml` + scheduled handler. Pokud chceš, řeš v navazujícím commitu; alternativa = GitHub Actions cron volající `npm run akce:maintenance`. Mimo rozsah TDD tasků (infrastrukturní).

---

## Task 14: Finální ověření 1a

- [ ] **Step 1: Plná testovací sada**

Run: `cd ~/agro-svet && npx vitest run`
Expected: PASS, žádné regrese (nové soubory `tests/akce-recurrence.test.ts`, `tests/akce.test.ts` zelené).

- [ ] **Step 2: Build**

Run: `cd ~/agro-svet && npm run build 2>&1 | tail -25`
Expected: build projde, v outputu jsou `/akce/pridat/`, `/admin/akce/`, `/api/akce/submit`, `/admin/akce/api/moderate`.

- [ ] **Step 3: Ruční smoke (volitelné, vyžaduje DB + dev server)**

Run: `cd ~/agro-svet && npm run dev`
1. `/akce/pridat/` → odešli jednorázovou i opakovanou akci → „✅ Děkujeme".
2. Přihlas se jako admin (`bazar_users.is_admin=true`), otevři `/admin/akce/` → vidíš čekající → Schválit → zmizí z fronty.
3. Ověř v Supabase: `stav='zverejneno'`, `pristi_vyskyt` vyplněn.

- [ ] **Step 4: Commit (pokud zbylé změny)**

```bash
git add -A && git commit -m "test(akce): finální ověření fáze 1a" || echo "nic k commitu"
```

---

## Mimo rozsah 1a (řeší 1b nebo později)

- Veřejné výpisové a programatické stránky (`/akce/`, `/akce/[slug]/`, okres/typ/měsíc/obec/kombinace), próza, FAQ, JSON-LD, sitemap, OG obrázky, AdSense, prolinkování, nav odkaz — **plán 1b**.
- Feedy (ICS/RSS/JSON-LD) a Workers AI parsování — **fáze 2**.
- „Upravit a schválit" inline formulář v moderaci (API už podporuje) — drobné rozšíření.
- Topování/placené profily — později.
- Cloudflare Cron Trigger pro `akce:maintenance` — infrastrukturní follow-up.

## Self-Review (vyplněno autorem plánu)

- **Pokrytí specu (fáze 1 backend část):** schéma ✓ (T4), formulář ✓ (T8), API příjem ✓ (T7), moderace on-site ✓ (T9/T10/T11), Resend ✓ (T6), opakování strukturované ✓ (T2/T4), kurátorský seed ✓ (T12), údržba/expirace ✓ (T13), anti-spam honeypot ✓ (T7). Veřejné SEO stránky záměrně v 1b.
- **Placeholdery:** kód je kompletní; jediná „doplň dle vzoru" místa (T12 další akce, T1 sjednocení `FROM`) jsou explicitní rozšiřovací body, ne chybějící logika.
- **Konzistence typů:** `TerminInput`, `AkceInput`, `Akce`, `AkceStav`, `computeNextOccurrence`, `formatTermin`, `slugifyAkce`, `validateAkceInput`, `insertSubmission`, `moderate` — názvy konzistentní napříč T2/T3/T5/T7/T9/T10/T13.
- **Závislosti:** využívá existující `createServerClient`, `geocode`, `getKraje`, `getEnvVar`, `Resend`, `Layout.astro`, `bazar_users.is_admin` — vše ověřeno v repu.
