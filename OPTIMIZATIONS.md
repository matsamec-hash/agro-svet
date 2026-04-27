# Agro-svet performance optimization roadmap

Stav po incidentu 1102 (2026-04-27). Dnes hotovo:
- ✅ Phase 1 — CZSO data → build-time JSON, refresh přes `npm run commodities:refresh`
- ✅ Phase 2 — weather widgety přes cached `/api/weather/*` endpointy + client-side fetch

Níže priority-ranked seznam dalších optimalizací. Top 3 jsou nejvyšší pákový poměr.

---

## 🔴 Priority 1 — Stejný 1102 risk na jiných stránkách

### `/statistiky/` page má stejný anti-pattern
`src/pages/statistiky/index.astro` má `prerender = false` + nutně volá CZSO API v SSR (CEN0203BT02 + další selection codes). Jakmile traffic na /statistiky/ vzroste nebo CZSO zpomalí, stejný 1102.

**Fix:** rozšířit `scripts/fetch-commodities.mjs` o všechna potřebná pole (livestock, fuel, fertilizer, regional crop), generovat jeden `src/data/agro-stats.json` a /statistiky/ stránku přepsat na import + `prerender = true`. Refresh měsíčně přes GitHub Action.

**Bonus:** /statistiky/ se stane 100% staticky cached HTML, 0ms TTFB, žádný Worker CPU.

### `/puda/` page — stejně
Volá `fetchAgroWeather()` v SSR. Buď refactor na client-fetch (jako homepage HomeWeather), nebo použít CF Cache API přes `/api/weather/agro` endpoint (už existuje).

---

## 🟡 Priority 2 — Bundle a network

### Lazy-load CommodityChart (Chart.js)
Chart.js bundle je ~80KB gzipped. Aktuálně se načítá pro každého návštěvníka, i když pod fold. **Fix:** wrap do Intersection Observer + dynamic `import('chart.js')` až když user scrolluje k sekci. LCP/INP metriky se zlepší.

### Preconnect na image CDN
`<link rel="preconnect" href="https://cdn.samecdigital.com">` v `<head>`. Hero image fetchpriority=high už je nastaveno, ale TLS handshake stále stojí ~100ms při prvním requestu. Stejně tak `https://obhypfuzmknvmknskdwh.supabase.co` pro bazar fotky.

### CommodityChart serve sub-1y data inline
JSON s 1713 datapointy = 256KB. Homepage potřebuje jen 1y range jako default, zbytek lazy. Generovat dva soubory: `commodities-recent.json` (last 12 months) + `commodities-full.json` (lazy fetch při kliku na "5 let" / "Vše").

---

## 🟢 Priority 3 — Edge a runtime optimalizace

### Edge cache homepage HTML (60s)
Homepage články se mění jen při novém článku. Astro CF adapter může vrátit `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`. Většina requestů cache HIT na CF edge → 0 Worker invocations. Trade-off: ~1min stale po publikaci článku — akceptovatelné.

Ideální by bylo invalidovat cache při novém článku (admin endpoint volá CF Cache Purge API), ale 60s SWR je 90% výhody bez složitosti.

### GitHub Action — nightly commodity refresh
`.github/workflows/refresh-commodities.yml` cron `0 3 1 * *` (1. den v měsíci 3:00) → `npm run commodities:refresh` → commit + push. Bez ručního zásahu.

### CommodityChart inline data — proč ne fetch z `/api/commodities/`?
Pokud by se CZSO data v budoucnu měnila často, místo build-time JSON udělat `/api/commodities` endpoint s CF Cache API (24h TTL). Stejný pattern jako weather. Mírně horší než build-time (1 fetch v requestu) ale flexibilnější. Dnes není potřeba.

---

## 🔵 Priority 4 — Drobnosti

### `cf-purge.mjs` po každém deployi
Per memory: CF edge cache drží ~70min po deploy. `npm run deploy` to už řeší (`wrangler deploy && cf-purge`), ale CF Pages auto-deploy z GitHub push **nepurguje cache**. Po Phase 1+2 push může být potřeba ruční purge — zjistit jestli je v workflow.

### Self-hosted fonts už hotové (✓)
Memory zmiňuje commit `6dd9081 perf(fonts): self-host Chakra Petch + Roboto Condensed via Fontsource` — žádný external font fetch. Žádná akce potřeba.

### Hamburger menu inline JS — minor minify gain
`<script type="module">` v Layout.astro (hamburger, search toggle, user dropdown) by mohl být extracted do souboru a esbuild minified. Šetří jen pár KB ale připraví na strict CSP.

### Article hero images
`fetchpriority="high" decoding="async"` ✓ už nastaveno. Mohlo by být doplněno o `srcset` pro DPR responsive (`@1x`, `@2x`) — ale CDN samecdigital pravděpodobně už serve responsive variants.

### Bazar listing `getListingImage` query
Načítá `bazar_images` jako sub-query a pak v JS sortuje. Mohl by se sortovat v Postgresu (`ORDER BY position`) v ramci same query a vzít first image directly. Šetří malou kapku CPU, ale není kritické.

---

## Co NEDĚLAT

- **Service Worker** — komplexní, pro content site bez offline use case zbytečné. Skip.
- **HTTP/3 push** — deprecated, nedělat.
- **Astro view transitions** — pěkný UX ale ne perf win, scope creep.
- **Prerender homepage 100%** — Supabase live data (články, bazar listings) blokuje. Edge cache 60s je správná míra.
