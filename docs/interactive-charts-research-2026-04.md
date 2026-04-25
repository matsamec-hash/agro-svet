# Interactive charts research for `/puda/` — agro-svet.cz

Datum: 2026-04-25
Stack: Astro 6 SSR + Cloudflare Workers, žádný React, existing dep: Chart.js přes CDN (statistiky)
Cíl: udělat 4 statické inline-SVG grafy interaktivní (hover tooltips, on-scroll animace, smooth transitions, klikatelné segmenty)

---

## TL;DR — top 3 doporučení

### 1) **Hybrid: pure CSS/JS + Chart.js už načtená** (DOPORUČENO)
- **Donut, ohrožení bar, plodiny bar** → ponechat současné SVG/HTML, přidat ~80 řádků vanilla JS:
  - `IntersectionObserver` → trigger CSS animace (existující `transition:.8s` je už připravená pro bary)
  - SVG `stroke-dasharray` draw-on-scroll pro line chart
  - `mouseenter`/`mouseleave` na elementech + 1 sdílený `<div class="tooltip">` (delegated)
- **Line chart cena půdy** → ponechat SVG, přidat tooltip + animace draw + volitelně reuse Chart.js z `/statistiky/` (CDN cache hit pro vracející uživatele)
- **Pros**: 0 nových deps, 0 KB JS navíc (Chart.js jen kdyby user chtěl pokročilejší interakci), plná kontrola CSS, perfektní s Astro SSR
- **Cons**: víc vlastního kódu (~150 řádků), méně out-of-the-box features

### 2) **Chart.js 4 (tree-shaken bundled)** — pokud chceš konzistenci s `/statistiky/`
- Importovat selektivně: `LineController, BarController, DoughnutController, LinearScale, CategoryScale, ArcElement, BarElement, PointElement, LineElement, Tooltip, Legend` → ~40 KB gzip
- Zatím loaded přes CDN UMD (~80 KB gzip cca, plný build); pro `/puda/` by stačil tree-shaken modul přes `npm install chart.js` + ESM import (Astro 6 to umí)
- **Pros**: známé API, robustní tooltips/animace zdarma, accessibility OK, on-scroll trigger snadný
- **Cons**: +40 KB JS na stránce, dependency na 3rd party, default vzhled neladí s minimalistickým 1-2-3 designem agro-svět (nutno styling)

### 3) **uPlot** — pokud bys chtěl ultra-lightweight a future-proof
- 47 KB min (cca 17 KB gzipped), zaměřeno na time-series → ideál pro line chart cena půdy
- Excelentní performance (10 % CPU vs 40 % Chart.js u 3600 bodů)
- **Cons**: nesedí na donut/bar — pro ně by bylo nutné #1 (CSS/JS) anyway → mix dvou přístupů; menší ekosystém v Astro

---

## Per-option detail

### A) Pure CSS/JS (vanilla, no lib)

| Atribut | Hodnota |
|---|---|
| Bundle | 0 KB (jen vlastní inline `<script>`) |
| Astro SSR | ✅ perfekt — Astro to miluje |
| Tooltips | manuální, 1 globální `<div>` + delegated event |
| On-scroll animace | `IntersectionObserver` + CSS `transition` / `@keyframes` |
| Czech locale | manuální (`Intl.NumberFormat('cs-CZ')`) |
| A11y | ✅ pokud děláš ruční ARIA |
| Mobile touch | ✅ `touchstart` event, ale tooltip pinning trochu fiddly |
| Risk | žádné dependency |

**Příklad on-scroll trigger pro line chart**:
```html
<svg class="line-chart" data-animate>
  <path class="line-path" d="..." style="--len:1234" />
</svg>
<style>
  .line-path { stroke-dasharray: var(--len); stroke-dashoffset: var(--len); }
  .animated .line-path { transition: stroke-dashoffset 1.4s ease-out; stroke-dashoffset: 0; }
</style>
<script>
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('animated'));
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));
</script>
```

**Pros**: minimalistic, žádný cold-start payload, plně customizable (svg už drží barvy `#FFD700` a `#FFFF00` agro brandu)
**Cons**: zoom/pan je pain (musí se ručně), pro 100+ datapoints ne; ale `/puda/` má max 10 bodů → není problém

---

### B) Chart.js 4 (existing dep via CDN)

| Atribut | Hodnota |
|---|---|
| Bundle | ~80 KB gzip (UMD plný), ~40 KB tree-shaken ESM |
| Astro SSR | ✅ — render na klientovi přes `<script>`, viz CommodityChart.astro |
| Tooltips | ✅ vestavěné, hover/touch |
| On-scroll | ne native, ale `IntersectionObserver` + `chart.update('show')` |
| Czech locale | ✅ skrze `chart.defaults.locale = 'cs-CZ'` |
| A11y | částečně (ARIA na canvas chybí, screen readers neuvidí data) |
| Mobile | ✅ touch ready |
| Risk | velmi nízký, ~70k stars |

**Pros**: stejné API co `statistiky/` strana, browser cache CDN URL (uživatel přicházející z `/statistiky/` má cache hit), minimum custom CSS
**Cons**: canvas-based → nemá CSS animace, custom theming víc práce, "default Chart.js look" je generický

**Code shape** pro donut na `/puda/`:
```js
new Chart(document.getElementById('struktura'), {
  type: 'doughnut',
  data: { labels: ['Orná','TTP','Sady'], datasets: [{
    data: [71,27,2], backgroundColor: ['#FFD700','#7CB342','#FF7043']
  }]},
  options: {
    cutout: '60%',
    animation: { duration: 1200 },
    plugins: { tooltip: { callbacks: { label: ctx => `${ctx.raw} %` }}}
  }
});
```

---

### C) Apache ECharts

| Atribut | Hodnota |
|---|---|
| Bundle | ~1 MB plný, ~150–200 KB gzip tree-shaken (line+bar+pie+tooltip) |
| Astro SSR | ✅ |
| Tooltips | ✅ luxusní, multi-axis, formatter |
| On-scroll | částečně přes `setOption` |
| Czech locale | ✅ |
| A11y | OK, ARIA |
| Mobile | ✅ |
| Risk | nízký, Apache Foundation, Baidu |

**Verdict pro `/puda/`**: overkill. ECharts má smysl pokud bys chtěl **2D mapy ČR s heat overlay** nebo komplexní vícevrstvé grafy. 4 jednoduché grafy = nesouměrné.

---

### D) Visx, Recharts, Victory, Nivo

Všechny **React-only**. agro-svet je Astro bez React renderer → vyžadovalo by `@astrojs/react` integraci, hydratace island, +React runtime (~45 KB). **Skip**.

---

### E) D3.js v7

| Atribut | Hodnota |
|---|---|
| Bundle | full ~240 KB, modular ~13–60 KB |
| Use case | low-level primitives — sám si škáluješ, kreslíš osy |
| Tooltips | manuální |
| Verdict | overkill pro 4 grafy, učící křivka, ale dává plnou kontrolu |

**Skip pro tento use case** — pokud bys chtěl D3 kvůli mapě ČR (puda/topojson), to je jiný discussion.

---

### F) uPlot

| Atribut | Hodnota |
|---|---|
| Bundle | 47 KB min, ~17 KB gzip |
| Astro SSR | ✅ |
| Use case | **TIME-SERIES OPTIMIZED** — line, area, bar |
| Tooltips | crosshair + custom hook |
| Performance | 34 ms render vs 38 ms Chart.js, **10 % CPU** vs 40 % Chart.js u 3600 bodů |
| Donut | ❌ nepodporuje pie/donut |
| Czech locale | manuální formatter |

**Verdict**: skvělý pro line chart cena půdy, ale pro donut/bar musel bys mít druhou knihovnu nebo CSS/JS → **složitější mix než #1**.

---

### G) Frappe Charts

| Atribut | Hodnota |
|---|---|
| Bundle | **18 KB gzip** ✅ |
| Astro SSR | ✅ (zero dep, vanilla JS) |
| Chart types | line, bar, pie, percentage, heatmap |
| Tooltips | ✅ vestavěné |
| Animace | ✅ on-load, smooth transitions |
| A11y | částečné |
| Mobile | OK |
| Risk | středný — méně populární než Chart.js, ale aktivní |

**Pros**: nejmenší "full-featured" lib, podporuje všech 4 typy grafů co potřebuješ, default vzhled blízký minimalistickému stylu agro-svět (ploché barvy, čisté linky)
**Cons**: méně customizable, menší community, donut není přímo (jen pie + percentage bar)

**Verdict**: solidní 4. místo, doporučil bych jako alternativu k #2 pokud chceš menší bundle.

---

### H) Charts.css (pure CSS)

| Atribut | Hodnota |
|---|---|
| Bundle | <10 KB gzip |
| Tooltips | ❌ ne (jen `:hover` enlarge) |
| Interakce | minimální |
| Datapointy | doporučeno <15 |

**Verdict pro `/puda/`**: 4. graf (plodiny bar) by se hodil, ale pro line/donut/threats je to limitní. **Skip — #1 je flexibilnější**.

---

### I) ApexCharts

| Atribut | Hodnota |
|---|---|
| Bundle | ~400 KB plný, ~120 KB gzip |
| Astro SSR | ✅ (od 2025 plná podpora) |
| Tooltips | ✅ velmi pěkné |
| Animace | ✅ vestavěné |
| Donut/pie | ✅ |
| Czech locale | ✅ |
| Risk | nízký |

**Verdict**: pěkné defaultní vizualy, ale **bundle 3× větší než Chart.js tree-shaken**. Skip.

---

## Konkrétní doporučení pro 4 grafy

### 1. Line chart cena půdy 2000–2025 (10 datapoints)
- **Volba: Pure SVG + IntersectionObserver draw animace + delegated tooltip**
- Důvod: jen 10 bodů, SVG už hotové, `stroke-dasharray` draw je elegantní, tooltip je 30 řádků JS
- Fallback: pokud bys chtěl zoom/pan a víc historie → uPlot

### 2. Donut struktura ZPF (3 segmenty)
- **Volba: Pure SVG + hover slice scale + tooltip s `ha` hodnotou**
- Důvod: 3 segmenty, paths už spočítány v Astro frontmatter, hover = `transform: scale(1.05)` + `transform-origin` na centru
- Bonus: highlight legend item při hover na slice (a obráceně) přes shared `data-id`

### 3. Bar ohrožení půdy (4 položky)
- **Volba: Pure CSS — už máš `transition: width .8s ease`**
- Důvod: stačí přidat `IntersectionObserver` který přepne `--w:0%` → `--w:60%` (atd) když bar vstoupí do viewportu. **5 řádků kódu**.
- Tooltip: u barů je hodnota přímo na baru (60 %), tooltip nepotřebuješ — možná jen hover s detailem zdroje

### 4. Bar plodiny (5 položek)
- **Volba: Pure CSS, stejný pattern jako #3**
- Důvod: stejný princip, hover = subtle background highlight celé řady, klik = scroll na sourcing footnote (případně)

---

## Jednotná doporučená lib pro vše: **Pure CSS/JS hybrid**

**Proč**: 4 grafy jsou jednoduché, datapoint counts <20, vše už máš v SVG/HTML. Přidání ~80 řádků vanilla JS dá:
- ✅ on-scroll animace přes IntersectionObserver (bary fly-in, line draw-on-scroll, donut radial reveal)
- ✅ tooltips (1 sdílený `<div>` + delegated mouseenter/leave)
- ✅ klikatelné donut segmenty (highlight + legend sync)
- ✅ smooth CSS transitions (už máš `transition` na barech)
- ✅ 0 KB nový JS, 0 cold-start cost
- ✅ Astro SSR nativně, žádná hydratace island není potřeba (vanilla `<script>` na konci souboru)
- ✅ a11y zdarma — SVG drží `<title>`/`<desc>`, čísla jsou v DOM už server-side

**Kdy přejít na Chart.js**: pokud byste přidali další 5+ interaktivních grafů (hot reload, zoom, pan, multi-series), tehdy refactor na lib se vyplatí.

---

## Implementace — kostra

```astro
<!-- v src/pages/puda/index.astro, na konci před </Layout> -->
<div id="chart-tooltip" class="chart-tooltip" role="tooltip" aria-hidden="true"></div>

<script is:inline>
  // 1) IntersectionObserver — animace on-scroll
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('[data-chart-animate]').forEach(el => io.observe(el));

  // 2) Tooltip delegated
  const tt = document.getElementById('chart-tooltip');
  document.querySelectorAll('[data-tt]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      tt.textContent = el.dataset.tt;
      tt.setAttribute('aria-hidden', 'false');
    });
    el.addEventListener('mousemove', (ev) => {
      tt.style.left = ev.clientX + 12 + 'px';
      tt.style.top  = ev.clientY + 12 + 'px';
    });
    el.addEventListener('mouseleave', () => tt.setAttribute('aria-hidden', 'true'));
  });
</script>

<style>
  .chart-tooltip {
    position: fixed; pointer-events: none; z-index: 99;
    background: #1a1a1a; color: #fff; padding: 6px 10px; border-radius: 6px;
    font: 500 12px 'Chakra Petch', sans-serif; opacity: 0; transition: opacity .15s;
  }
  .chart-tooltip[aria-hidden="false"] { opacity: 1; }

  /* Line chart draw-on-scroll */
  .line-path { stroke-dasharray: 2000; stroke-dashoffset: 2000; }
  .in-view .line-path { transition: stroke-dashoffset 1.6s cubic-bezier(.6,.05,.3,1); stroke-dashoffset: 0; }
  .line-points circle { opacity: 0; transition: opacity .3s ease; transition-delay: 1.4s; }
  .in-view .line-points circle { opacity: 1; }
  .line-points circle:hover { r: 6; cursor: pointer; }

  /* Donut hover */
  .donut-svg path { transition: transform .25s ease; transform-origin: 100px 100px; cursor: pointer; }
  .donut-svg path:hover { transform: scale(1.04); }

  /* Threat bars - already animated, just gate on .in-view parent */
  .threat-bar { width: 0 !important; }
  .in-view .threat-bar { width: var(--w) !important; }
  .crop-bar { width: 0 !important; transition: width 1.2s cubic-bezier(.6,.05,.3,1); }
  .in-view .crop-bar { /* width set inline via style attr */ }
</style>
```

Pak v markup:
```astro
<svg viewBox={...} data-chart-animate>
  <path class="line-path" d={cenaPath} />
  <g class="line-points">
    {cenaPoints.map(p => (
      <circle cx={p.x} cy={p.y} r="4"
        data-tt={`${p.rok}: ${p.cena} tis. Kč/ha`} />
    ))}
  </g>
</svg>
```

---

## Proof-of-concept

Hotový standalone HTML POC s donut grafem (hover scale + tooltip + legend sync + on-scroll animation):
**`/Users/matejsamec/agro-svet/docs/poc-donut-interactive.html`**

Otestováno: hover funguje, tooltip kopíruje kurzor, klik na segment → highlight i v legendě, on-scroll IntersectionObserver triggeruje radial reveal animaci.

---

## Sources

- [JS chart libraries comparison 2026 — pkgpulse](https://www.pkgpulse.com/blog/best-javascript-charting-libraries-2026)
- [uPlot vs Chart.js — SciChart benchmark](https://www.scichart.com/blog/chart-bench-compare-javascript-chart-libraries/)
- [Chart.js tree shaking guide](https://www.chartjs.org/docs/latest/getting-started/integration.html)
- [ApexCharts SSR](https://apexcharts.com/)
- [Frappe Charts npm](https://github.com/frappe/charts)
- [Charts.css limitations](https://chartscss.org/)
- [Adding Interactive Charts to Astro — David Teather](https://dteather.com/blogs/astro-interactive-charts/)
- [SVG path drawing animation — CSS Tricks](https://css-tricks.com/svg-line-animation-works/)
- [Astro Reveal — zero JS scroll animations](https://github.com/polgubau/astro-reveal)
- [D3.js modular bundle — Bundlephobia](https://bundlephobia.com/package/d3)
