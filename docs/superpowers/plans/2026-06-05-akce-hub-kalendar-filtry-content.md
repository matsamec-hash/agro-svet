# Kalendář akcí — hub (kalendář + časová osa + filtry + obsah) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Z plochého seznamu na `/akce/` udělat použitelný kalendářový hub (mini-kalendář + časová osa + klientské filtry), opravit neviditelná políčka formuláře, doplnit ~30–50 ověřených akcí 2026 a dotáhnout cron údržby.

**Architecture:** SSR Astro hub renderuje časovou osu jako reálné HTML (SEO + no-JS), klientský vanilla `<script type="module">` přidává filtry a mini-kalendář (progresivní vylepšení). Čistá logika (seskupení/filtr/mřížka) je v `src/lib/akce-hub.ts` s vitest testy. Cron údržby = chráněný endpoint + GitHub Action ping.

**Tech Stack:** Astro 6 SSR, Cloudflare Worker, Supabase (`@supabase/supabase-js`), TypeScript, vitest. Node 22 (`nvm use 22`). Worktree `~/agro-svet-kalendar-akci`, větev `feat/kalendar-akci`.

---

## Předpoklady pro každý git commit

V tomto repu (`~/agro-svet`) **NIKDY `git add -A`** (vtáhne `.env.save` se secrets → push protection). Vždy `git add <konkrétní cesty>`. Commity zatím jen lokálně (push až po dokončení a schválení).

---

## Task 1: Oprava neviditelných políček formuláře (bugfix)

Inputy v `/akce/pridat/` nemají rámeček/pozadí → splývají s bílou. CSS oprava je už rozpracovaná (necommitnutá) v `pridat.astro`; tento task ji jen ověří jako kompletní a commitne.

**Files:**
- Modify: `src/pages/akce/pridat.astro` (sekce `<style>`, ~ř. 126–155)

- [ ] **Step 1: Ověřit, že `<style>` blok obsahuje rámeček + pozadí + focus**

Zkontroluj, že pravidlo pro text-inputy/select/textarea vypadá takto (už by mělo být v rozpracovaném diffu):

```css
.pridat input:not([type="radio"]):not([type="checkbox"]),
.pridat select,
.pridat textarea {
  display: block; width: 100%; padding: 10px 12px; margin-top: 4px;
  font-weight: 400; box-sizing: border-box;
  font: inherit; font-size: 1rem; color: #1a1a1a;
  background: #fff; border: 1px solid #c4c4c4; border-radius: 8px;
  transition: border-color .15s, box-shadow .15s;
}
.pridat input:not([type="radio"]):not([type="checkbox"]):focus,
.pridat select:focus,
.pridat textarea:focus {
  outline: none; border-color: #3a7d34;
  box-shadow: 0 0 0 3px rgba(58, 125, 52, .18);
}
.pridat input::placeholder,
.pridat textarea::placeholder { color: #8a8a8a; }
.pridat textarea { resize: vertical; min-height: 110px; }
```

Pokud něco z toho chybí, doplň přesně podle bloku výše.

- [ ] **Step 2: Build ověří, že stránka projde**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npx astro build 2>&1 | tail -5`
Expected: build proběhne bez chyby (žádné `Error`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/akce/pridat.astro
git commit -m "fix(akce): viditelné rámečky/pozadí políček ve formuláři pridat"
```

---

## Task 2: Čistá logika hubu — `src/lib/akce-hub.ts` (TDD)

Testovatelné funkce: seskupení po měsících, filtr-predikát, měsíční mřížka, seznam nadcházejících měsíců.

**Files:**
- Create: `src/lib/akce-hub.ts`
- Test: `tests/akce-hub.test.ts`

- [ ] **Step 1: Napsat failing testy**

Create `tests/akce-hub.test.ts`:

```ts
// tests/akce-hub.test.ts
import { describe, it, expect } from 'vitest';
import {
  groupByMonth, matchesFilter, buildMonthGrid, upcomingMonths,
  type AkceFilter,
} from '../src/lib/akce-hub';
import type { Akce } from '../src/lib/akce';

const NOW = new Date('2026-06-05T08:00:00.000Z'); // pátek

function mk(over: Partial<Akce>): Akce {
  return {
    id: over.id ?? 'x', slug: 'x', nazev: 'X', typ: 'polni-dny', druh: 'jednorazova',
    obec: 'Obec', kraj_slug: 'jihomoravsky', okres_slug: 'brno-venkov', email: '', popis: '',
    stav: 'zverejneno', zdroj: 'kurator', lat: null, lng: null,
    pristi_vyskyt: '2026-08-20T09:00:00+02:00', created_at: '', zverejneno_at: null,
    ...over,
  } as Akce;
}

describe('groupByMonth', () => {
  it('seskupí podle měsíce pristi_vyskyt a seřadí chronologicky', () => {
    const g = groupByMonth([
      mk({ id: 'a', pristi_vyskyt: '2026-09-13T09:00:00+02:00' }),
      mk({ id: 'b', pristi_vyskyt: '2026-08-20T09:00:00+02:00' }),
      mk({ id: 'c', pristi_vyskyt: '2026-08-07T09:00:00+02:00' }),
    ]);
    expect(g.map((x) => x.mesic)).toEqual(['2026-08', '2026-09']);
    expect(g[0].label).toBe('Srpen 2026');
    expect(g[0].akce.map((a) => a.id)).toEqual(['c', 'b']);
  });
  it('vynechá akce bez pristi_vyskyt', () => {
    expect(groupByMonth([mk({ pristi_vyskyt: null })])).toEqual([]);
  });
});

describe('matchesFilter', () => {
  const a = mk({ kraj_slug: 'jihocesky', okres_slug: 'ceske-budejovice', typ: 'vystavy-veletrhy', pristi_vyskyt: '2026-08-20T09:00:00+02:00' });
  it('prázdný filtr propustí vše', () => {
    expect(matchesFilter(a, {}, NOW)).toBe(true);
  });
  it('filtr kraje', () => {
    expect(matchesFilter(a, { kraj: 'jihocesky' }, NOW)).toBe(true);
    expect(matchesFilter(a, { kraj: 'praha' }, NOW)).toBe(false);
  });
  it('filtr okresu a typu', () => {
    expect(matchesFilter(a, { okres: 'ceske-budejovice', typ: 'vystavy-veletrhy' }, NOW)).toBe(true);
    expect(matchesFilter(a, { typ: 'polni-dny' }, NOW)).toBe(false);
  });
  it('období 7d zahrne jen příštích 7 dní', () => {
    const blizko = mk({ pristi_vyskyt: '2026-06-10T09:00:00+02:00' });
    expect(matchesFilter(blizko, { obdobi: '7d' }, NOW)).toBe(true);
    expect(matchesFilter(a, { obdobi: '7d' }, NOW)).toBe(false); // srpen
  });
  it('období 30d', () => {
    expect(matchesFilter(mk({ pristi_vyskyt: '2026-06-25T09:00:00+02:00' }), { obdobi: '30d' }, NOW)).toBe(true);
    expect(matchesFilter(a, { obdobi: '30d' }, NOW)).toBe(false);
  });
});

describe('buildMonthGrid', () => {
  it('červen 2026 začíná pondělím, 42 buněk, konec dopadá na null', () => {
    const grid = buildMonthGrid(2026, 6);
    expect(grid.length).toBe(42);
    expect(grid[0]?.getUTCDate()).toBe(1);
    expect(grid[0]?.getUTCMonth()).toBe(5); // červen = index 5
    expect(grid[29]?.getUTCDate()).toBe(30);
    expect(grid[30]).toBeNull();
  });
  it('únor 2026 má vedoucí null (1.2.2026 je neděle)', () => {
    const grid = buildMonthGrid(2026, 2);
    // 1.2.2026 = neděle → pondělím-první mřížka má 6 vedoucích null
    expect(grid.slice(0, 6).every((d) => d === null)).toBe(true);
    expect(grid[6]?.getUTCDate()).toBe(1);
  });
});

describe('upcomingMonths', () => {
  it('vrátí unikátní měsíce od aktuálního dál, seřazené', () => {
    const m = upcomingMonths([
      mk({ pristi_vyskyt: '2026-09-13T09:00:00+02:00' }),
      mk({ pristi_vyskyt: '2026-08-20T09:00:00+02:00' }),
      mk({ pristi_vyskyt: '2026-08-07T09:00:00+02:00' }),
    ], NOW);
    expect(m).toEqual(['2026-08', '2026-09']);
  });
});
```

- [ ] **Step 2: Spustit testy — musí selhat**

Run: `npx vitest run tests/akce-hub.test.ts`
Expected: FAIL — `Cannot find module '../src/lib/akce-hub'`.

- [ ] **Step 3: Implementovat `src/lib/akce-hub.ts`**

Create `src/lib/akce-hub.ts`:

```ts
// src/lib/akce-hub.ts
// Čistá logika pro hub /akce/: seskupení po měsících, filtr-predikát,
// měsíční mřížka kalendáře, seznam nadcházejících měsíců.
import type { Akce } from './akce';

const MESICE = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec',
];

export interface MonthGroup {
  mesic: string; // "2026-08"
  label: string; // "Srpen 2026"
  akce: Akce[];
}

/** YYYY-MM z ISO řetězce (wall-clock dle uloženého offsetu). */
function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

function monthLabel(key: string): string {
  const idx = parseInt(key.slice(5, 7), 10) - 1;
  return `${MESICE[idx]} ${key.slice(0, 4)}`;
}

/** Seskupí akce podle měsíce pristi_vyskyt, chronologicky vzestupně. Akce bez pristi_vyskyt vynechá. */
export function groupByMonth(akce: Akce[]): MonthGroup[] {
  const map = new Map<string, Akce[]>();
  for (const a of akce) {
    if (!a.pristi_vyskyt) continue;
    const key = monthKey(a.pristi_vyskyt);
    (map.get(key) ?? map.set(key, []).get(key)!).push(a);
  }
  return [...map.keys()].sort().map((key) => ({
    mesic: key,
    label: monthLabel(key),
    akce: map.get(key)!.slice().sort((x, y) => (x.pristi_vyskyt! < y.pristi_vyskyt! ? -1 : 1)),
  }));
}

export interface AkceFilter {
  kraj?: string;
  okres?: string;
  typ?: string;
  obdobi?: '7d' | '30d' | 'vse';
}

const DEN = 86_400_000;

/** True, když akce vyhovuje filtru. now potřebné pro období. */
export function matchesFilter(a: Akce, filter: AkceFilter, now: Date): boolean {
  if (filter.kraj && a.kraj_slug !== filter.kraj) return false;
  if (filter.okres && a.okres_slug !== filter.okres) return false;
  if (filter.typ && a.typ !== filter.typ) return false;
  if (filter.obdobi && filter.obdobi !== 'vse') {
    if (!a.pristi_vyskyt) return false;
    const dny = filter.obdobi === '7d' ? 7 : 30;
    const t = new Date(a.pristi_vyskyt).getTime();
    if (t < now.getTime() || t > now.getTime() + dny * DEN) return false;
  }
  return true;
}

/** Mřížka 6×7 (42 buněk) pro daný měsíc (month 1-12). null = buňka mimo měsíc. Týden začíná pondělím. */
export function buildMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Po=0 … Ne=6
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - offset + 1;
    cells.push(dayNum >= 1 && dayNum <= daysInMonth ? new Date(Date.UTC(year, month - 1, dayNum)) : null);
  }
  return cells;
}

/** Unikátní YYYY-MM od aktuálního měsíce dál, které mají alespoň 1 akci, seřazené. */
export function upcomingMonths(akce: Akce[], now: Date): string[] {
  const nowKey = now.toISOString().slice(0, 7);
  const set = new Set<string>();
  for (const a of akce) {
    if (!a.pristi_vyskyt) continue;
    const key = monthKey(a.pristi_vyskyt);
    if (key >= nowKey) set.add(key);
  }
  return [...set].sort();
}
```

- [ ] **Step 4: Spustit testy — musí projít**

Run: `npx vitest run tests/akce-hub.test.ts`
Expected: PASS (všech ~10 testů zelených).

- [ ] **Step 5: Commit**

```bash
git add src/lib/akce-hub.ts tests/akce-hub.test.ts
git commit -m "feat(akce): čistá logika hubu — groupByMonth/matchesFilter/buildMonthGrid/upcomingMonths"
```

---

## Task 3: Přestavba hubu `/akce/index.astro`

SSR časová osa + filtr-bar + mini-kalendář + klientský script.

**Files:**
- Modify (rewrite): `src/pages/akce/index.astro`

- [ ] **Step 1: Přepsat `index.astro`**

Replace celý obsah `src/pages/akce/index.astro`:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { listUpcoming } from '../../lib/akce-supabase';
import { formatTermin, type TerminInput } from '../../lib/akce-recurrence';
import { akceTypLabel, AKCE_TYPES, type AkceTyp } from '../../lib/akce-constants';
import { groupByMonth } from '../../lib/akce-hub';
import { getKraje } from '../../lib/lokality';

export const prerender = false;
const akce = await listUpcoming(200);
const groups = groupByMonth(akce);
const kraje = getKraje();

function termin(a: typeof akce[number]): string {
  const t: TerminInput = a.druh === 'jednorazova'
    ? { druh: 'jednorazova', zacatek: a.zacatek as string, konec: a.konec }
    : { druh: 'opakovana', dny_v_tydnu: a.dny_v_tydnu ?? [], cas_od: a.cas_od ?? '', cas_do: a.cas_do, plati_od: a.plati_od as string, plati_do: a.plati_do };
  return formatTermin(t);
}

// minimální data pro klientský filtr + kalendář
const akceData = akce.map((a) => ({
  id: a.id, typ: a.typ, kraj_slug: a.kraj_slug, okres_slug: a.okres_slug, pristi_vyskyt: a.pristi_vyskyt,
}));
---
<Layout title="Kalendář zemědělských akcí" description="Přehled nadcházejících zemědělských akcí v ČR — farmářské trhy, polní dny, výstavy, prodej ze dvora. Přidejte i svou akci zdarma.">
  <main class="akce-hub">
    <header class="hub-head">
      <h1>Kalendář zemědělských akcí</h1>
      <p>Nadcházející farmářské trhy, polní dny, výstavy a prodej ze dvora po celé ČR.</p>
      <a href="/akce/pridat/" class="btn-add">+ Přidat akci</a>
    </header>

    <div class="filtr-bar" id="filtr-bar" hidden>
      <select id="f-kraj" aria-label="Kraj">
        <option value="">Všechny kraje</option>
        {kraje.map((k) => <option value={k.slug}>{k.name}</option>)}
      </select>
      <select id="f-okres" aria-label="Okres"><option value="">Všechny okresy</option></select>
      <select id="f-typ" aria-label="Typ akce">
        <option value="">Všechny typy</option>
        {Object.entries(AKCE_TYPES).map(([slug, label]) => <option value={slug}>{label}</option>)}
      </select>
      <select id="f-obdobi" aria-label="Období">
        <option value="vse">Vše</option>
        <option value="7d">Příštích 7 dní</option>
        <option value="30d">Příštích 30 dní</option>
      </select>
      <button type="button" id="f-reset" class="f-reset">Zrušit filtry</button>
      <span class="f-count" id="f-count"></span>
    </div>

    <div class="mini-cal" id="mini-cal" hidden>
      <div class="mc-head">
        <button type="button" id="mc-prev" aria-label="Předchozí měsíc">◀</button>
        <strong id="mc-label"></strong>
        <button type="button" id="mc-next" aria-label="Další měsíc">▶</button>
      </div>
      <div class="mc-grid" id="mc-grid"></div>
    </div>

    {groups.length === 0 && (
      <p class="empty">Zatím tu nejsou žádné nadcházející akce. <a href="/akce/pridat/">Přidejte první.</a></p>
    )}

    <div id="osa">
      {groups.map((g) => (
        <section class="mesic" data-mesic={g.mesic}>
          <h2 class="mesic-nadpis">{g.label}</h2>
          <ul class="akce-list">
            {g.akce.map((a) => (
              <li class="akce-item" data-id={a.id} data-kraj={a.kraj_slug} data-okres={a.okres_slug} data-typ={a.typ} data-date={a.pristi_vyskyt}>
                <span class="akce-typ">{akceTypLabel(a.typ as AkceTyp)}</span>
                <h3 class="akce-nazev">{a.nazev}</h3>
                <p class="akce-meta">{termin(a)} · {a.obec}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    <p class="empty" id="empty-filtr" hidden>Žádná akce neodpovídá filtru. <button type="button" id="empty-reset" class="linklike">Zrušit filtry</button></p>
  </main>

  <script type="application/json" id="akce-data" set:html={JSON.stringify(akceData)}></script>
  <script type="application/json" id="kraje-data" set:html={JSON.stringify(kraje)}></script>

  <script type="module">
    import { matchesFilter, buildMonthGrid, upcomingMonths } from '../../lib/akce-hub';

    const akce = JSON.parse(document.getElementById('akce-data').textContent);
    const kraje = JSON.parse(document.getElementById('kraje-data').textContent);
    const now = new Date();

    const bar = document.getElementById('filtr-bar');
    const cal = document.getElementById('mini-cal');
    bar.hidden = false;
    cal.hidden = false;

    const fKraj = document.getElementById('f-kraj');
    const fOkres = document.getElementById('f-okres');
    const fTyp = document.getElementById('f-typ');
    const fObdobi = document.getElementById('f-obdobi');
    const fCount = document.getElementById('f-count');

    function currentFilter() {
      return { kraj: fKraj.value, okres: fOkres.value, typ: fTyp.value, obdobi: fObdobi.value };
    }

    // závislý okres
    fKraj.addEventListener('change', () => {
      const k = kraje.find((x) => x.slug === fKraj.value);
      fOkres.innerHTML = '<option value="">Všechny okresy</option>' +
        (k ? k.okresy.map((o) => `<option value="${o.slug}">${o.name}</option>`).join('') : '');
      apply();
    });
    [fOkres, fTyp, fObdobi].forEach((el) => el.addEventListener('change', apply));

    function reset() {
      fKraj.value = ''; fOkres.innerHTML = '<option value="">Všechny okresy</option>';
      fTyp.value = ''; fObdobi.value = 'vse'; apply();
    }
    document.getElementById('f-reset').addEventListener('click', reset);
    document.getElementById('empty-reset')?.addEventListener('click', reset);

    // mini-kalendář
    const months = upcomingMonths(akce, now);
    let monthIdx = 0;
    const MESICE = ['Leden','Únor','Březen','Duben','Květen','Červen','Červenec','Srpen','Září','Říjen','Listopad','Prosinec'];

    function visibleAkce() {
      const f = currentFilter();
      return akce.filter((a) => matchesFilter(a, f, now));
    }

    function renderCal() {
      const grid = document.getElementById('mc-grid');
      const label = document.getElementById('mc-label');
      if (months.length === 0) { cal.hidden = true; return; }
      const key = months[monthIdx];
      const [y, m] = key.split('-').map(Number);
      label.textContent = `${MESICE[m - 1]} ${y}`;
      const daysWithAkce = new Set(
        visibleAkce().filter((a) => a.pristi_vyskyt && a.pristi_vyskyt.slice(0, 7) === key)
          .map((a) => parseInt(a.pristi_vyskyt.slice(8, 10), 10)),
      );
      const cells = buildMonthGrid(y, m);
      const hlavicka = ['Po','Út','St','Čt','Pá','So','Ne'].map((d) => `<span class="mc-dow">${d}</span>`).join('');
      const body = cells.map((d) => {
        if (!d) return '<span class="mc-cell mc-empty"></span>';
        const den = d.getUTCDate();
        const has = daysWithAkce.has(den);
        return `<span class="mc-cell${has ? ' mc-has' : ''}" ${has ? `data-day="${den}"` : ''}>${den}</span>`;
      }).join('');
      grid.innerHTML = hlavicka + body;
      grid.querySelectorAll('[data-day]').forEach((el) => el.addEventListener('click', () => {
        const den = el.getAttribute('data-day').padStart(2, '0');
        const target = document.querySelector(`.akce-item[data-date^="${key}-${den}"]`);
        if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); target.classList.add('zvyrazni'); setTimeout(() => target.classList.remove('zvyrazni'), 1600); }
      }));
      document.getElementById('mc-prev').disabled = monthIdx === 0;
      document.getElementById('mc-next').disabled = monthIdx >= months.length - 1;
    }
    document.getElementById('mc-prev').addEventListener('click', () => { if (monthIdx > 0) { monthIdx--; renderCal(); } });
    document.getElementById('mc-next').addEventListener('click', () => { if (monthIdx < months.length - 1) { monthIdx++; renderCal(); } });

    function apply() {
      const f = currentFilter();
      let visible = 0;
      document.querySelectorAll('.akce-item').forEach((li) => {
        const a = { typ: li.dataset.typ, kraj_slug: li.dataset.kraj, okres_slug: li.dataset.okres, pristi_vyskyt: li.dataset.date };
        const ok = matchesFilter(a, f, now);
        li.hidden = !ok;
        if (ok) visible++;
      });
      document.querySelectorAll('.mesic').forEach((sec) => {
        const any = [...sec.querySelectorAll('.akce-item')].some((li) => !li.hidden);
        sec.hidden = !any;
      });
      fCount.textContent = visible === akce.length ? `${visible} akcí` : `${visible} z ${akce.length} akcí`;
      document.getElementById('empty-filtr').hidden = visible !== 0 || akce.length === 0;
      renderCal();
    }

    apply();
  </script>

  <style>
    .akce-hub { max-width: 860px; margin: 0 auto; padding: 32px 20px 80px; }
    .hub-head h1 { margin: 0 0 8px; }
    .hub-head p { color: #555; margin: 0 0 16px; }
    .btn-add { display: inline-block; padding: 10px 20px; background: #FFFF00; color: #111; font-weight: 700; border-radius: 8px; text-decoration: none; }
    .btn-add:hover { filter: brightness(0.95); }

    .filtr-bar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 24px 0 12px; padding: 12px; background: #f6f7f2; border: 1px solid #e2e6d6; border-radius: 12px; }
    .filtr-bar select { padding: 8px 10px; border: 1px solid #c4c4c4; border-radius: 8px; background: #fff; font: inherit; }
    .f-reset { padding: 8px 14px; border: 1px solid #c4c4c4; border-radius: 8px; background: #fff; cursor: pointer; font: inherit; }
    .f-count { margin-left: auto; color: #555; font-size: .9rem; }

    .mini-cal { max-width: 320px; margin: 0 0 24px; padding: 12px; border: 1px solid #e8e8e8; border-radius: 12px; }
    .mc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .mc-head button { border: 0; background: none; font-size: 1.1rem; cursor: pointer; padding: 2px 8px; }
    .mc-head button:disabled { opacity: .3; cursor: default; }
    .mc-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; text-align: center; }
    .mc-dow { font-size: .72rem; color: #888; padding: 2px 0; }
    .mc-cell { padding: 5px 0; font-size: .85rem; border-radius: 6px; }
    .mc-empty { visibility: hidden; }
    .mc-has { background: #e8f0e3; color: #2f6a2a; font-weight: 700; cursor: pointer; }
    .mc-has:hover { background: #d6e6cf; }

    .mesic { margin: 28px 0 0; }
    .mesic-nadpis { font-size: 1rem; text-transform: uppercase; letter-spacing: .04em; color: #6b7a1e; border-bottom: 2px solid #eef0e4; padding-bottom: 6px; }
    .akce-list { list-style: none; padding: 0; margin: 14px 0 0; display: grid; gap: 12px; }
    .akce-item { border: 1px solid #e8e8e8; border-radius: 12px; padding: 14px 18px; }
    .akce-item.zvyrazni { border-color: #3a7d34; box-shadow: 0 0 0 3px rgba(58,125,52,.18); }
    .akce-typ { display: inline-block; font-size: .78rem; text-transform: uppercase; letter-spacing: .03em; color: #6b7a1e; font-weight: 700; }
    .akce-nazev { margin: 4px 0 6px; font-size: 1.15rem; }
    .akce-meta { margin: 0; color: #555; font-size: .92rem; }
    .empty { color: #555; margin: 24px 0; }
    .linklike { background: none; border: 0; color: #3a7d34; text-decoration: underline; cursor: pointer; font: inherit; padding: 0; }
  </style>
</Layout>
```

- [ ] **Step 2: Build ověří kompilaci + import client scriptu**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npx astro build 2>&1 | tail -8`
Expected: build proběhne bez chyby. (Astro zabundluje import `akce-hub` v client `<script type="module">`.)

- [ ] **Step 3: Vizuální smoke v preview**

Run: `npm run preview &` poté `curl -s http://localhost:4321/akce/ | grep -c 'mesic-nadpis'`
Expected: počet > 0 (časová osa se renderuje server-side). Zastav preview (`kill %1`).

- [ ] **Step 4: Commit**

```bash
git add src/pages/akce/index.astro
git commit -m "feat(akce): hub s časovou osou, mini-kalendářem a klientskými filtry"
```

---

## Task 4: Cron endpoint `/api/cron/akce-maintenance`

Chráněný endpoint, který přepočte výskyty a expiruje proběhlé jednorázové akce.

**Files:**
- Create: `src/pages/api/cron/akce-maintenance.ts`

- [ ] **Step 1: Vytvořit endpoint**

Create `src/pages/api/cron/akce-maintenance.ts`:

```ts
// GET /api/cron/akce-maintenance — přepočte pristi_vyskyt zveřejněných akcí;
// jednorázové po termínu → stav='probehla'. Autentizace: Authorization: Bearer ${CRON_SECRET}.
// Volá denně GitHub Action (cron-akce-maintenance.yml). Logika = scripts/akce-maintenance.mjs.
import type { APIRoute } from 'astro';
import { listPublishedForMaintenance, applyMaintenance } from '../../../lib/akce-supabase';
import { getEnvVar } from '../../../lib/env';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const expected = getEnvVar('CRON_SECRET');
  if (!expected) return new Response('CRON_SECRET env not set', { status: 503 });
  const auth = request.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${expected}`) return new Response('Unauthorized', { status: 401 });

  const now = new Date();
  const akce = await listPublishedForMaintenance();
  for (const a of akce) {
    await applyMaintenance(a, now);
  }
  return new Response(JSON.stringify({ ok: true, processed: akce.length }), {
    status: 200, headers: { 'content-type': 'application/json' },
  });
};
```

**Pozn.:** `applyMaintenance(a, now)` vrací `Promise<void>` a sama rozhodne (přes `computeNextOccurrence`), zda jednorázovou akci po termínu nastaví na `probehla`, nebo jen přepočte `pristi_vyskyt`. Endpoint proto hlásí jen `processed` (počet zpracovaných) — přesný rozpad updated/expired by vyžadoval re-implementaci privátní `terminOf`, což není potřeba.

- [ ] **Step 2: Build ověří endpoint**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npx astro build 2>&1 | tail -5`
Expected: build OK.

- [ ] **Step 3: Lokální smoke — 401 bez tokenu**

Run: `npm run preview &` poté `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/api/cron/akce-maintenance`
Expected: `401` (bez Authorization). Zastav preview.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/cron/akce-maintenance.ts
git commit -m "feat(akce): cron endpoint /api/cron/akce-maintenance (Bearer CRON_SECRET)"
```

---

## Task 5: GitHub Action — denní ping cronu

**Files:**
- Create: `.github/workflows/cron-akce-maintenance.yml`

- [ ] **Step 1: Vytvořit workflow**

Create `.github/workflows/cron-akce-maintenance.yml`:

```yaml
name: Daily akce maintenance

on:
  schedule:
    # 04:00 UTC denně. Expirace proběhlých akcí + přepočet výskytů.
    - cron: '0 4 * * *'
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Ping /api/cron/akce-maintenance
        env:
          CRON_SECRET: ${{ secrets.CRON_SECRET }}
        run: |
          if [ -z "$CRON_SECRET" ]; then
            echo "::error::CRON_SECRET secret not configured in repo settings"
            exit 1
          fi
          response=$(curl -sw "\n%{http_code}" \
            "https://agro-svet.cz/api/cron/akce-maintenance/" \
            -H "Authorization: Bearer $CRON_SECRET" \
            --max-time 120)
          status=$(echo "$response" | tail -n1)
          body=$(echo "$response" | sed '$d')
          echo "HTTP $status"
          echo "Body: $body"
          if [ "$status" != "200" ]; then
            echo "::error::Cron endpoint returned HTTP $status (expected 200)"
            exit 1
          fi
          echo "::notice::akce maintenance pinged successfully"
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/cron-akce-maintenance.yml
git commit -m "ci(akce): denní GitHub Action ping na akce-maintenance endpoint"
```

---

## Task 6: Obsah — rozšířit seed na ~30–50 ověřených akcí 2026

Web researchem doplnit reálné akce; rozšířit `akce_kurator_2026.sql` ve stávajícím formátu (idempotentní `ON CONFLICT (slug) DO NOTHING`, zdrojové URL v komentáři).

**Files:**
- Modify: `supabase/seeds/akce_kurator_2026.sql`

- [ ] **Step 1: Web research — sestavit seznam akcí**

Použij WebSearch/WebFetch a ověř pro každou: oficiální **název, termín 2026 (datum), místo (obec)**. Zaměř se na druhou polovinu 2026 (od června dál) + pravidelné akce. Cílové kategorie a kandidáti (ověř, nepřebírej naslepo):
- **Výstavy/veletrhy** (`vystavy-veletrhy`): Země živitelka (ČB, srpen), Flora Olomouc (jarní/letní/podzimní), Floria (Kroměříž), Národní výstava hospodářských zvířat, Náš chov / živočišná výroba, zahradnické/ovocnářské výstavy.
- **Polní dny** (`polni-dny`): Naše pole (Nabočany), Den zemědělce (Kámen), polní dny osivářských/šlechtitelských firem (Selgen, Limagrain, VP Agro), bramborářské/řepařské dny.
- **Chovatelské přehlídky** (`chovatelske-prehlidky`): regionální výstavy hospodářských a drobných zvířat.
- **Farmářské trhy** (`farmarske-trhy`): velké pravidelné trhy — pokud opakované, použij `druh='opakovana'` (viz Step 3).
- **Kurzy/školení, dny otevřených dveří, prodej ze dvora**: dle dostupnosti.

Cíl: **~30–50 řádků celkem** (včetně stávajících 10). Rozprostři po krajích (slugy z `src/data/lokality.yaml`).

**Anti-halucinace (tvrdé pravidlo):** pokud termín 2026 nelze z oficiálního zdroje ověřit, akci buď **vynech**, nebo vlož s komentářem `-- POZOR: termín 2026 neověřen` a v `popis` uveď „Přesný termín 2026 bude upřesněn." Nikdy nevymýšlej konkrétní datum jako fakt.

- [ ] **Step 2: Přidat INSERT bloky do seedu**

Pro jednorázovou akci (většina) přidej na konec `supabase/seeds/akce_kurator_2026.sql` blok přesně v tomto tvaru (nahraď hodnoty; `okres_slug`/`kraj_slug` musí existovat v `lokality.yaml`; `lat`/`lng` přibližné nebo `NULL`):

```sql
-- zdroj: <oficiální URL>
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'unikatni-slug-2026', 'Název akce 2026',
  'Popis akce 2–3 věty.',
  'polni-dny', 'jednorazova', '2026-09-13T09:00:00+02:00', '2026-09-13T16:00:00+02:00',
  '2026-09-13T09:00:00+02:00', 'Obec', 'okres-slug', 'kraj-slug',
  NULL, NULL, 'Pořadatel', 'https://...', 'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;
```

- [ ] **Step 3: Pravidelné akce (farmářské trhy) jako opakované**

Pro pravidelnou akci použij `druh='opakovana'` (NE zacatek/konec). `pristi_vyskyt` dopočítá cron/moderace, ale pro seed nastav rozumný příští termín ručně:

```sql
-- zdroj: <URL>
INSERT INTO akce (slug, nazev, popis, typ, druh, dny_v_tydnu, cas_od, cas_do, plati_od, plati_do, pristi_vyskyt,
  obec, okres_slug, kraj_slug, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'farmarske-trhy-mesto-2026', 'Farmářské trhy <Město>',
  'Pravidelné farmářské trhy každou sobotu.',
  'farmarske-trhy', 'opakovana', ARRAY[6]::smallint[], '08:00', '12:00', '2026-06-06', '2026-12-19',
  '2026-06-06T08:00:00+02:00',
  'Město', 'okres-slug', 'kraj-slug', 'Pořadatel', 'https://...', 'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;
```

- [ ] **Step 4: Validace SQL lokálně (syntaxe + slugy)**

Run: `grep -c "INSERT INTO akce" supabase/seeds/akce_kurator_2026.sql`
Expected: ~30–50.
Run: `grep -oP "'[a-z-]+', '[a-z-]+',$" supabase/seeds/akce_kurator_2026.sql | head` — vizuálně zkontroluj, že `okres_slug, kraj_slug` páry odpovídají `src/data/lokality.yaml` (žádný překlep).

- [ ] **Step 5: Commit**

```bash
git add supabase/seeds/akce_kurator_2026.sql
git commit -m "content(akce): rozšířit kurátorský seed na ~30-50 ověřených akcí 2026"
```

- [ ] **Step 6: Aplikovat na živou DB (ruční krok)**

Supabase MCP nemá přístup k projektu `obhypfuzmknvmknskdwh`. Otevři SQL editor `https://supabase.com/dashboard/project/obhypfuzmknvmknskdwh/sql/new`, vlož **jen nové INSERT bloky** (nebo celý soubor — je idempotentní díky `ON CONFLICT`), spusť. Ověř: `select count(*) from akce where zdroj='kurator';`.

---

## Task 7: Finální brána + deploy

**Files:** žádné nové.

- [ ] **Step 1: Plná testová brána**

Run: `source ~/.nvm/nvm.sh && nvm use 22 && npx vitest run`
Expected: všechny testy PASS (včetně nových `akce-hub`).

- [ ] **Step 2: Plný build**

Run: `npm run build 2>&1 | tail -10`
Expected: build OK, žádný `Error`.

- [ ] **Step 3: Deploy z worktree**

Run: `npm run deploy`
Expected: `wrangler deploy` nahraje Worker `agro-svet-web` + cf-purge. (`npm run deploy` NEdělá build → build už proběhl v kroku 2.)

- [ ] **Step 4: Živý smoke**

```bash
curl -s https://agro-svet.cz/akce/ | grep -c 'mesic-nadpis'          # > 0 (časová osa)
curl -s https://agro-svet.cz/akce/pridat/ | grep -c 'border: 1px'    # políčka mají rámeček (přes <style>)
curl -s -o /dev/null -w "%{http_code}\n" https://agro-svet.cz/api/cron/akce-maintenance   # 401 bez tokenu
```
Expected: osa > 0; cron endpoint vrací 401.
(Sandbox neresolvuje .cz → případně `--resolve agro-svet.cz:443:<origin-ip>` nebo přes workers.dev URL.)

- [ ] **Step 5: Spustit cron endpoint jednou ručně (volitelné)**

Z Actions UI spusť `Daily akce maintenance` (workflow_dispatch) → ověř HTTP 200 a JSON `{processed, ...}`.

---

## Self-Review (provedeno při psaní)

- **Pokrytí spec:** Task 1 = oprava formuláře; Task 2+3 = kalendář/osa/filtry; Task 4+5 = cron; Task 6 = obsah; Task 7 = brána/deploy. Všechny sekce specu pokryty.
- **Typy:** `AkceFilter` používá `obdobi: '7d'|'30d'|'vse'` konzistentně v `akce-hub.ts`, testech i client scriptu. `groupByMonth`/`buildMonthGrid`/`upcomingMonths`/`matchesFilter` signatury shodné napříč tasky.
- **Placeholdery:** žádné — kód je kompletní. Jediná „ověř signaturu" poznámka v Tasku 4 je záměrná (závisí na reálné návratové hodnotě `applyMaintenance`), s jasným fallbackem.
- **Mimo rozsah:** detail `/akce/[slug]/`, programatické SEO stránky, JSON-LD, sitemap akcí = fáze 1b (nezahrnuto).
