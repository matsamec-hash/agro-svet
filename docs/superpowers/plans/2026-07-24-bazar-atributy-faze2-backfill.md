# Bazar atributy — Fáze 2: Backfill stávajících inzerátů — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or executing-plans. Steps use `- [ ]`.

**Goal:** Doplnit `attributes` u již existujících inzerátů — CLI skript, který nad každým inzerátem spustí extrakci z title+description a mergne výsledek do `attributes` (bez přepisu ručně zadaných, pokud není `--force`).

**Architecture:** Malá čistá funkce `mergeBackfillAttributes(existing, computed, force)` (unit-testovaná) + CLI wrapper `scripts/backfill-attributes.ts`, který stránkuje `bazar_listings`, volá `structureListing` (AI + fallback), a přes `addBackfillUpdate` zapisuje zpět. Idempotentní.

**Tech Stack:** TypeScript, Supabase REST/JS, Vitest, tsx, OpenAI (přes existující `structureListing`).

**Spec:** `docs/superpowers/specs/2026-07-24-bazar-atributy-vybava-design.md` (sekce „Backfill").

**⚠️ Gating:** Skript ZAPISUJE do sloupce `attributes` (migrace 022). Ostré spuštění proti prod až PO nasazení migrace 022. Fáze 2 dodává skript + testy; spuštění dělá člověk.

---

## Soubory

- Create: `src/lib/bazar-backfill.ts` — čistá logika merge
- Create: `src/lib/bazar-backfill.test.ts` — testy merge
- Create: `scripts/backfill-attributes.ts` — CLI wrapper

---

## Task 1: Čistá merge logika (TDD)

**Files:**
- Create: `src/lib/bazar-backfill.ts`
- Test: `src/lib/bazar-backfill.test.ts`

- [ ] **Step 1: Napsat failing testy**

```ts
// src/lib/bazar-backfill.test.ts
import { describe, it, expect } from 'vitest';
import { mergeBackfillAttributes } from './bazar-backfill';

describe('mergeBackfillAttributes', () => {
  it('doplní chybějící klíče, existující NEPŘEPÍŠE (default)', () => {
    const out = mergeBackfillAttributes({ klimatizace: true }, { klimatizace: false as any, pohon: '4x4' }, false);
    expect(out).toEqual({ klimatizace: true, pohon: '4x4' });
  });
  it('s force přepíše i existující', () => {
    const out = mergeBackfillAttributes({ pohon: '2x4' }, { pohon: '4x4' }, true);
    expect(out).toEqual({ pohon: '4x4' });
  });
  it('vrátí null když se nic nezměnilo (žádný zápis)', () => {
    expect(mergeBackfillAttributes({ pohon: '4x4' }, { pohon: '4x4' }, false)).toBeNull();
    expect(mergeBackfillAttributes({ klimatizace: true }, {}, false)).toBeNull();
  });
  it('funguje z prázdného výchozího stavu', () => {
    expect(mergeBackfillAttributes({}, { tp_spz: true }, false)).toEqual({ tp_spz: true });
    expect(mergeBackfillAttributes(null as any, { tp_spz: true }, false)).toEqual({ tp_spz: true });
  });
});
```

- [ ] **Step 2: Spustit — musí selhat**

Run: `npx vitest run src/lib/bazar-backfill.test.ts`
Expected: FAIL — modul neexistuje.

- [ ] **Step 3: Implementovat**

```ts
// src/lib/bazar-backfill.ts
/**
 * Sloučí spočítané atributy do stávajících. Default: doplní jen chybějící klíče
 * (ručně zadané nepřepisuje). force: spočítané vyhrávají. Vrací nový objekt
 * k zápisu, nebo null když by zápis byl no-op (nic nového).
 */
export function mergeBackfillAttributes(
  existing: Record<string, unknown> | null | undefined,
  computed: Record<string, unknown>,
  force: boolean,
): Record<string, unknown> | null {
  const base = existing && typeof existing === 'object' ? existing : {};
  const merged: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(computed)) {
    if (force || !(k in base)) merged[k] = v;
  }
  // no-op detekce (stejný počet klíčů i hodnot)
  const keys = new Set([...Object.keys(base), ...Object.keys(merged)]);
  let changed = false;
  for (const k of keys) if (base[k] !== merged[k]) { changed = true; break; }
  return changed ? merged : null;
}
```

- [ ] **Step 4: Spustit — musí projít**

Run: `npx vitest run src/lib/bazar-backfill.test.ts`
Expected: PASS (4 testy).

- [ ] **Step 5: Commit**

```bash
git add src/lib/bazar-backfill.ts src/lib/bazar-backfill.test.ts
git commit -m "feat(bazar): backfill merge logika (doplnit bez přepisu, no-op detekce)"
```

---

## Task 2: CLI backfill skript

**Files:**
- Create: `scripts/backfill-attributes.ts`

Kontext existujícího vzoru: `scripts/import-bazos-seller.ts` používá `createServerClient()` (čte `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` z env), `getEnvVar('OPENAI_API_KEY')`, a volá `structureListing`. Backfill jede STEJNÝM stylem.

- [ ] **Step 1: Napsat skript**

```ts
// scripts/backfill-attributes.ts
/**
 * Backfill `attributes` u existujících inzerátů. Nad každým spustí extrakci
 * z title+description (structureListing = AI + fallback) a mergne do attributes.
 *
 * ⚠️ Vyžaduje nasazenou migraci 022 (sloupec attributes) v cílové DB.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (cílová DB), OPENAI_API_KEY (volitelné; bez něj jen fallback).
 * Spuštění:
 *   node_modules/.bin/tsx scripts/backfill-attributes.ts [--dry-run] [--force] [--limit N] [--no-ai]
 */
import { createServerClient } from '../src/lib/supabase';
import { getEnvVar } from '../src/lib/env';
import { suggestCategory, matchBrand } from '../src/lib/bazar-import-category';
import { structureListing } from '../src/lib/bazar-import-structure';
import { attributesForCategory } from '../src/lib/bazar-attributes';
import { mergeBackfillAttributes } from '../src/lib/bazar-backfill';

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const force = args.has('--force');
  const noAi = args.has('--no-ai');
  const limArg = process.argv.find((a) => a.startsWith('--limit'));
  const limit = limArg ? parseInt(process.argv[process.argv.indexOf(limArg) + 1] ?? '0', 10) : 0;

  const supabase = createServerClient();
  const apiKey = noAi ? '' : (getEnvVar('OPENAI_API_KEY') ?? '');
  console.log(`Backfill atributů — AI: ${apiKey ? 'ANO' : 'NE (fallback)'}${dryRun ? ' · DRY-RUN' : ''}${force ? ' · FORCE' : ''}`);

  const PAGE = 200;
  let from = 0;
  let processed = 0, updated = 0, skipped = 0;
  for (;;) {
    const { data, error } = await supabase
      .from('bazar_listings')
      .select('id, title, description, category, attributes')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`select: ${error.message}`);
    if (!data || data.length === 0) break;

    for (const row of data as Array<{ id: string; title: string; description: string; category: string; attributes: Record<string, unknown> | null }>) {
      if (limit && processed >= limit) { console.log(`\nDosažen --limit ${limit}.`); printSummary(); return; }
      processed++;
      const cat = row.category || suggestCategory(row.title ?? '', row.description ?? '');
      const structured = await structureListing({
        title: row.title ?? '',
        description: row.description ?? '',
        apiKey,
        fallback: { brand: matchBrand(row.title ?? '', row.description ?? ''), category: cat, hours: null },
        categoryAttributes: attributesForCategory(cat),
      });
      const next = mergeBackfillAttributes(row.attributes, structured.attributes, force);
      if (!next) { skipped++; continue; }
      if (dryRun) {
        console.log(`  [dry] ${row.id} ${row.title?.slice(0, 40)} → ${JSON.stringify(next)}`);
        updated++;
        continue;
      }
      const { error: upErr } = await supabase.from('bazar_listings').update({ attributes: next }).eq('id', row.id);
      if (upErr) { console.log(`  ✗ ${row.id}: ${upErr.message}`); skipped++; continue; }
      updated++;
      console.log(`  ✓ ${row.id} ${row.title?.slice(0, 40)} → ${JSON.stringify(next)}`);
      if (apiKey) await new Promise((r) => setTimeout(r, 300)); // šetrně k OpenAI
    }
    from += PAGE;
  }
  printSummary();

  function printSummary() {
    console.log(`\nHotovo: zpracováno ${processed}, ${dryRun ? 'k zápisu' : 'zapsáno'} ${updated}, přeskočeno ${skipped}.`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Ověřit typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -E 'backfill-attributes|bazar-backfill' || echo "OK — žádné TS chyby v backfill souborech"`
Expected: `OK — žádné TS chyby v backfill souborech`.

- [ ] **Step 3: Commit**

```bash
git add scripts/backfill-attributes.ts
git commit -m "feat(bazar): CLI backfill skript pro attributes (dry-run/force/limit/no-ai)"
```

---

## Task 3: Dry-run smoke (manuální, gated na migraci)

**Files:** žádné

- [ ] **Step 1:** Pokud je migrace 022 nasazená v nějaké DB (jinak PŘESKOČIT a nechat na uživatele po deploji):
  Run (env cílové DB): `node_modules/.bin/tsx scripts/backfill-attributes.ts --dry-run --limit 3`
  Expected: vypíše max 3 inzeráty s navrhovanými atributy, `zapsáno 0` (dry-run), žádná chyba. Pokud sloupec `attributes` neexistuje → čitelná chyba z selectu → znamená, že migrace ještě není nasazená (očekávané před deployem).

---

## Self-Review (proti specu — sekce „Backfill")

- ✅ Merge bez přepisu ručních + `--force`: Task 1.
- ✅ Idempotentní (no-op detekce → žádný zbytečný zápis): Task 1 (`mergeBackfillAttributes` vrací null).
- ✅ Dávkově/stránkovaně, AI + fallback, dry-run: Task 2.
- ✅ Cílí libovolnou DB přes env (self-host prod jako u import skriptu): Task 2.
- ✅ Žádné tiché ořezání — `--limit` se loguje: Task 2.
