# Akce v sezóně (Track #5 fáze 2) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Na sezónní stránky `/sezona/[season]/` doplnit sekci „Akce v této sezóně" — nadcházející akce (Supabase `akce`) filtrované na měsíce sezóny, načítané klientsky z nového SSR JSON endpointu.

**Architecture:** Čistá filtrační funkce `akceInSeason` v `src/lib/sezona.ts` (unit-testovaná). SSR endpoint `/api/akce-sezona/[season].json` (`prerender=false`) načte `listUpcoming` + profiltruje + vrátí JSON. Sezónní stránka zůstává prerender; inline klientský script načte endpoint a vykreslí karty (progressive enhancement, fallback na `/akce/`).

**Tech Stack:** Astro 6 (`output:'server'`, `@astrojs/node`), TypeScript, vitest. Node 22 (`nvm use 22`). Supabase přes `listUpcoming` v `src/lib/akce-supabase.ts`.

**Prostředí:** Worktree `~/agro-svet-akce-sezona`, větev `feat/akce-sezona` (z `origin/master` `eaa890b` — obsahuje track #5 cluster `/sezona/`). `.env` zkopírovaný. Před každým build/test `nvm use 22`. Před smoke `pkill -f 'dist/server/entry'`.

**⚠️ Baseline:** `npx vitest run` má **3 pre-existing fail** v `tests/i18n/nav.test.ts` (bazar baseline). Cíl = 3 fail + zbytek pass.

**Ověřená fakta z codebase:**
- `listUpcoming(limit)` (`src/lib/akce-supabase.ts`) vrací `Promise<Akce[]>`, už dělá `.not('pristi_vyskyt','is',null).order('pristi_vyskyt', ascending)` → jen akce s naplněným `pristi_vyskyt`, setříděné.
- `Akce` typ je v `src/lib/akce.ts` (pole `slug, nazev, typ, druh, zacatek, konec, dny_v_tydnu, cas_od, cas_do, plati_od, plati_do, obec, kraj_slug, pristi_vyskyt: string|null, …`).
- `formatTermin(t: TerminInput)` z `src/lib/akce-recurrence.ts`; `Akce→TerminInput` mapping (z `/akce/index.astro`):
  ```ts
  const t: TerminInput = a.druh === 'jednorazova'
    ? { druh: 'jednorazova', zacatek: a.zacatek as string, konec: a.konec }
    : { druh: 'opakovana', dny_v_tydnu: a.dny_v_tydnu ?? [], cas_od: a.cas_od ?? '', cas_do: a.cas_do, plati_od: a.plati_od as string, plati_do: a.plati_do };
  ```
- `sezona.ts` už exportuje `SeasonSlug`, `SEASONS`, `getSeason`. Je čistá (žádný astro:content/async) — musí taková zůstat (`import type { Akce }` je type-only, erased → OK).
- Endpoint vzor: `import type { APIRoute } from 'astro'`; `export const GET: APIRoute = async ({ params }) => new Response(JSON.stringify(...), { status, headers })`.

---

## File Structure

**Nové:**
- `src/pages/api/akce-sezona/[season].json.ts` — SSR endpoint (dynamic, prerender=false): validace sezóny → listUpcoming → akceInSeason → JSON karet.

**Editované:**
- `src/lib/sezona.ts` — `+ import type { Akce }`, `+ export function akceInSeason(...)`.
- `tests/lib/sezona.test.ts` — `+ akceInSeason` testy.
- `src/pages/sezona/[season].astro` — `+` sekce „Akce v této sezóně" + inline klientský script.

---

## Task 1: `akceInSeason` čistá funkce (TDD)

**Files:**
- Modify: `src/lib/sezona.ts`
- Test: `tests/lib/sezona.test.ts`

- [ ] **Step 1: Přidat failing testy** — append to `tests/lib/sezona.test.ts`:

```ts
import { akceInSeason } from '../../src/lib/sezona';
import type { Akce } from '../../src/lib/akce';

// Minimální Akce fixture — akceInSeason čte jen pristi_vyskyt (+ vrací celý objekt).
function mkAkce(slug: string, pristi_vyskyt: string | null): Akce {
  return { slug, nazev: slug, pristi_vyskyt } as unknown as Akce;
}

describe('sezona — akceInSeason', () => {
  const now = new Date('2026-04-15T10:00:00Z'); // duben = jaro

  it('zahrne akci, jejíž pristi_vyskyt padá do měsíců sezóny a je v budoucnu', () => {
    const akce = [mkAkce('jarni-trh', '2026-05-10')]; // květen ∈ jaro
    expect(akceInSeason(akce, 'jaro', now).map((a) => a.slug)).toEqual(['jarni-trh']);
  });

  it('vynechá akci mimo měsíce sezóny', () => {
    const akce = [mkAkce('letni-akce', '2026-07-10')]; // červenec ∉ jaro
    expect(akceInSeason(akce, 'jaro', now)).toEqual([]);
  });

  it('vynechá akci v minulosti (pristi_vyskyt < now)', () => {
    const akce = [mkAkce('probehla', '2026-03-01')]; // březen ∈ jaro, ale < 15.4.
    expect(akceInSeason(akce, 'jaro', now)).toEqual([]);
  });

  it('vynechá akci s pristi_vyskyt null', () => {
    expect(akceInSeason([mkAkce('bez-data', null)], 'jaro', now)).toEqual([]);
  });

  it('seřadí výsledek vzestupně dle pristi_vyskyt', () => {
    const akce = [mkAkce('pozdejsi', '2026-05-20'), mkAkce('drivejsi', '2026-04-20')];
    expect(akceInSeason(akce, 'jaro', now).map((a) => a.slug)).toEqual(['drivejsi', 'pozdejsi']);
  });

  it('respektuje hranice sezóny (zima = 12,1,2)', () => {
    const winterNow = new Date('2026-01-10T10:00:00Z');
    const akce = [mkAkce('unor', '2026-02-05'), mkAkce('brezen', '2026-03-05')];
    expect(akceInSeason(akce, 'zima', winterNow).map((a) => a.slug)).toEqual(['unor']);
  });
});
```

- [ ] **Step 2: Spustit → fail.** Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`. Expected: FAIL (`akceInSeason` neexistuje).

- [ ] **Step 3: Implementovat.** V `src/lib/sezona.ts` přidej nahoru k importům:
```ts
import type { Akce } from './akce';
```
A na konec souboru:
```ts
/** Nadcházející akce (pristi_vyskyt >= dnešek), jejichž měsíc spadá do sezóny;
 *  seřazené vzestupně dle data. Čistá — bere `now` parametrem (testovatelnost). */
export function akceInSeason(akce: Akce[], seasonSlug: SeasonSlug, now: Date): Akce[] {
  const months = getSeason(seasonSlug)!.months;
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return akce
    .filter((a) => {
      if (!a.pristi_vyskyt) return false;
      const d = new Date(a.pristi_vyskyt);
      if (Number.isNaN(d.getTime())) return false;
      const dMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      if (dMs < todayMs) return false;
      return months.includes(d.getMonth() + 1);
    })
    .sort((a, b) => (a.pristi_vyskyt! < b.pristi_vyskyt! ? -1 : a.pristi_vyskyt! > b.pristi_vyskyt! ? 1 : 0));
}
```

- [ ] **Step 4: Spustit → pass.** Run: `nvm use 22 && npx vitest run tests/lib/sezona.test.ts`. Expected: PASS (vše vč. nových 6).

- [ ] **Step 5: Commit:**
```bash
git add src/lib/sezona.ts tests/lib/sezona.test.ts
git commit -m "feat(akce-sezona): akceInSeason filtr + testy"
```

---

## Task 2: SSR JSON endpoint `/api/akce-sezona/[season].json`

**Files:**
- Create: `src/pages/api/akce-sezona/[season].json.ts`

- [ ] **Step 1: Vytvořit endpoint.** Create `src/pages/api/akce-sezona/[season].json.ts`:

```ts
import type { APIRoute } from 'astro';
import { listUpcoming } from '../../../lib/akce-supabase';
import { akceInSeason, getSeason } from '../../../lib/sezona';
import { formatTermin, type TerminInput } from '../../../lib/akce-recurrence';
import type { Akce } from '../../../lib/akce';

export const prerender = false;

const MAX_ITEMS = 8;

function terminText(a: Akce): string {
  const t: TerminInput = a.druh === 'jednorazova'
    ? { druh: 'jednorazova', zacatek: a.zacatek as string, konec: a.konec }
    : { druh: 'opakovana', dny_v_tydnu: a.dny_v_tydnu ?? [], cas_od: a.cas_od ?? '', cas_do: a.cas_do, plati_od: a.plati_od as string, plati_do: a.plati_do };
  return formatTermin(t);
}

export const GET: APIRoute = async ({ params }) => {
  const season = params.season ?? '';
  if (!getSeason(season)) {
    return new Response(JSON.stringify({ error: 'unknown season' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  }

  const all = await listUpcoming(200);
  const filtered = akceInSeason(all, season as 'jaro' | 'leto' | 'podzim' | 'zima', new Date()).slice(0, MAX_ITEMS);
  const payload = filtered.map((a) => ({
    slug: a.slug,
    nazev: a.nazev,
    terminText: terminText(a),
    obec: a.obec,
    typ: a.typ,
  }));

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=600, s-maxage=1800, stale-while-revalidate=86400',
    },
  });
};
```

Pozn.: `new Date()` (bez argumentů) je zde OK — je to runtime SSR handler, ne build/test kód. `akceInSeason` je čistá a testovaná samostatně s injektovaným `now`.

- [ ] **Step 2: Ověřit build.** Run: `nvm use 22 && npm run build 2>&1 | grep -E "akce-sezona|error|Error" | head`. Expected: endpoint se zabuduje jako server route (NE prerendered HTML), žádná chyba. (Pokud build hlásí TS chybu na `TerminInput`/`Akce` polích, sjednoť s mappingem z `/akce/index.astro`.)

- [ ] **Step 3: Smoke endpointu (lokální server).**
```bash
pkill -f 'dist/server/entry' 2>/dev/null; sleep 1
PORT=4402 HOST=127.0.0.1 node --env-file=.env dist/server/entry.mjs > /tmp/akce-ep.log 2>&1 &
sleep 4
echo "jaro:";    curl -s -o /dev/null -w "%{http_code} %{content_type}\n" --max-time 15 "http://127.0.0.1:4402/api/akce-sezona/jaro.json"
echo "nesmysl:"; curl -s -o /dev/null -w "%{http_code}\n" --max-time 15 "http://127.0.0.1:4402/api/akce-sezona/nesmysl.json"
echo "payload (jaro):"; curl -s --max-time 15 "http://127.0.0.1:4402/api/akce-sezona/jaro.json" | head -c 400; echo
pkill -f 'dist/server/entry' 2>/dev/null
```
Expected: `jaro` → `200 application/json`; `nesmysl` → `404`; payload = JSON pole (možná `[]`, pokud pro jaro nejsou akce — to je validní).

- [ ] **Step 4: Commit:**
```bash
git add "src/pages/api/akce-sezona/[season].json.ts"
git commit -m "feat(akce-sezona): SSR endpoint /api/akce-sezona/[season].json"
```

---

## Task 3: Sekce „Akce v této sezóně" na sezónní stránce

**Files:**
- Modify: `src/pages/sezona/[season].astro`

- [ ] **Step 1: Přidat sekci + klientský script.** V `src/pages/sezona/[season].astro` vlož novou sekci **mezi** blok „Co se teď sklízí" (`{harvested.length > 0 && (...)}`) a sekci `<section class="faq">`. Vlož tento markup:

```astro
    <section class="block akce-block">
      <h2>Akce v této sezóně</h2>
      <div id="akce-sezona" data-season={def.slug} aria-live="polite">
        <p class="akce-fallback"><a href="/akce/">Zobrazit kalendář akcí →</a></p>
      </div>
    </section>
```

Pak před uzavírací `</Layout>` (vedle/za existující `<style>` nebo za poslední `</div>`) přidej tento klientský script (mimo `<style>`):

```astro
  <script is:inline define:vars={{ season: def.slug }}>
    (function () {
      var box = document.getElementById('akce-sezona');
      if (!box) return;
      fetch('/api/akce-sezona/' + season + '.json')
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (items) {
          if (!Array.isArray(items) || items.length === 0) {
            box.innerHTML = '<p class="akce-empty">Pro tuto sezónu zatím nejsou naplánované žádné akce. <a href="/akce/">Procházet celý kalendář akcí →</a></p>';
            return;
          }
          var html = '<ul class="akce-list">';
          for (var i = 0; i < items.length; i++) {
            var a = items[i];
            var nazev = (a.nazev || '').replace(/</g, '&lt;');
            var termin = (a.terminText || '').replace(/</g, '&lt;');
            var obec = (a.obec || '').replace(/</g, '&lt;');
            html += '<li><a href="/akce/' + encodeURIComponent(a.slug) + '/">' + nazev + '</a>'
              + '<span class="akce-meta"> — ' + termin + (obec ? ', ' + obec : '') + '</span></li>';
          }
          html += '</ul><p class="akce-all"><a href="/akce/">Všechny akce →</a></p>';
          box.innerHTML = html;
        })
        .catch(function () {
          box.innerHTML = '<p class="akce-empty"><a href="/akce/">Zobrazit kalendář akcí →</a></p>';
        });
    })();
  </script>
```

A do `<style>` bloku (za existující pravidla, před `</style>`) přidej:

```css
    .akce-block .akce-list { list-style: none; padding: 0; margin: 0; display: grid; gap: .5rem; }
    .akce-block .akce-list a { color: #15803d; text-decoration: none; font-weight: 600; }
    .akce-block .akce-meta { color: #6b7280; font-size: .85rem; font-weight: 400; }
    .akce-block .akce-empty, .akce-block .akce-fallback { color: #374151; }
    .akce-block .akce-all { margin-top: .8rem; font-size: .9rem; }
    .akce-block .akce-all a, .akce-block .akce-empty a, .akce-block .akce-fallback a { color: #15803d; }
```

Pozn.: `define:vars={{ season: def.slug }}` zpřístupní `season` v inline scriptu (Astro). XSS: hodnoty se escapují `<`→`&lt;` + `encodeURIComponent` na slug v URL.

- [ ] **Step 2: Ověřit build.** Run: `nvm use 22 && npm run build 2>&1 | grep -E "sezona/(jaro|leto|podzim|zima)|error|Error" | head`. Expected: 4 sezónní stránky se zabudují, žádná chyba.

- [ ] **Step 3: Smoke stránky.**
```bash
pkill -f 'dist/server/entry' 2>/dev/null; sleep 1
PORT=4402 HOST=127.0.0.1 node --env-file=.env dist/server/entry.mjs > /tmp/akce-page.log 2>&1 &
sleep 4
echo "stránka 200 + má kontejner:"
curl -s --max-time 15 "http://127.0.0.1:4402/sezona/jaro/" | grep -c 'id="akce-sezona"'
echo "fallback odkaz na /akce/ přítomen (no-JS):"
curl -s --max-time 15 "http://127.0.0.1:4402/sezona/jaro/" | grep -c 'akce-fallback'
pkill -f 'dist/server/entry' 2>/dev/null
```
Expected: oba grepy ≥ 1 (kontejner i no-JS fallback v server HTML).

- [ ] **Step 4: Commit:**
```bash
git add "src/pages/sezona/[season].astro"
git commit -m "feat(akce-sezona): sekce Akce v této sezóně na /sezona/[season]/ (klientský fetch)"
```

---

## Task 4: Finální verifikace

**Files:** žádné (jen ověření).

- [ ] **Step 1: Plné testy.** Run: `nvm use 22 && npx vitest run 2>&1 | tail -6`. Expected: nové `akceInSeason` testy PASS; celkem **3 fail** (pre-existing bazar baseline) + zbytek pass.

- [ ] **Step 2: Build.** Run: `nvm use 22 && npm run build 2>&1 | tail -4`. Expected: `[build] Complete!`.

- [ ] **Step 3: Integrační smoke.**
```bash
pkill -f 'dist/server/entry' 2>/dev/null; sleep 1
PORT=4402 HOST=127.0.0.1 node --env-file=.env dist/server/entry.mjs > /tmp/akce-final.log 2>&1 &
sleep 4
for s in jaro leto podzim zima; do
  echo "endpoint $s: $(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:4402/api/akce-sezona/$s.json")  | stránka: $(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:4402/sezona/$s/")"
done
echo "neznámá sezóna: $(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:4402/api/akce-sezona/xx.json")"
echo "locale guard /sk/sezona/jaro/: $(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "http://127.0.0.1:4402/sk/sezona/jaro/")"
pkill -f 'dist/server/entry' 2>/dev/null
```
Expected: 4× endpoint 200, 4× stránka 200, neznámá sezóna 404, `/sk/sezona/jaro/` 302.

- [ ] **Step 4: (žádný commit — hotovo, připraveno k review/PR via finishing-a-development-branch).**

---

## Self-Review (provedeno při psaní plánu)

- **Spec coverage:** SSR endpoint (T2), `akceInSeason` čistá funkce (T1), sekce na stránce + klientský fetch + empty/fallback (T3), testy (T1 + smoke T2/T3/T4), cs-only/jen sezónní stránky/SEO-neindexované (návrh dodržen — žádný hub, žádné server HTML akcí). ✔
- **Placeholdery:** žádné — reálný kód, hodnoty, příkazy.
- **Type consistency:** `akceInSeason(akce: Akce[], seasonSlug: SeasonSlug, now: Date): Akce[]` konzistentně T1↔T2; `Akce`/`TerminInput`/`formatTermin` dle ověřených signatur; endpoint `APIRoute` GET vzor odpovídá repu; payload pole (`slug,nazev,terminText,obec,typ`) konzumovaná klientským scriptem v T3.
