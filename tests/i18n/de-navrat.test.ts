// tests/i18n/de-navrat.test.ts
// Návrat /de (2026-10-14). Audit vykreslených německých stránek našel češtinu
// na místech, kde ji testy překladů neviděly, a cizí obrázek načítaný bez
// kliknutí. Tohle hlídá, aby se to nevrátilo — v de i v ostatních jazycích.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SVET_LANGS, localizeUnit, REGION_NOTE } from '../../src/i18n/svet';
import { chartCaption } from '../../src/lib/svet/chart';

const SVET_DIR = path.join(process.cwd(), 'src/data/svet');
const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

function unitsInData(): Set<string> {
  const out = new Set<string>();
  const walk = (x: unknown) => {
    if (Array.isArray(x)) return x.forEach(walk);
    if (x && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      if (typeof o.unit === 'string') out.add(o.unit);
      Object.values(o).forEach(walk);
    }
  };
  for (const dir of [SVET_DIR, path.join(SVET_DIR, 'regions')]) {
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json') || f.endsWith('-geo.json')) continue;
      walk(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
    }
  }
  // Jednotky přepočtů, které skládá normalizeValue (lib/svet/render.ts).
  for (const u of ['ks / 1000 obyv.', 'ks / ha', 'farem / 1000 obyv.', 'ha / 1000 obyv.', '€ / ha']) out.add(u);
  return out;
}

describe('/svet — jednotky v jazyce stránky', () => {
  const CZ_WORDS = /(?<![\p{L}])(ks|farem|obyv|mil|mld|tis|rok)(?![\p{L}])/u;

  it('pod de nezůstane v žádné jednotce české slovo', () => {
    const bad = [...unitsInData()].map((u) => [u, localizeUnit(u, 'de')]).filter(([, d]) => CZ_WORDS.test(d));
    expect(bad).toEqual([]);
  });

  it('uk a pl taky ne (dřív tam zůstávalo „1000 ks", „mil. ha")', () => {
    for (const l of ['uk', 'pl'] as const) {
      const bad = [...unitsInData()].map((u) => [u, localizeUnit(u, l)]).filter(([, d]) => /(?<![\p{L}])(ks|farem|obyv|mil|tis)(?![\p{L}])/u.test(d));
      expect(bad, l).toEqual([]);
    }
  });

  it('cs zůstává beze změny', () => {
    for (const u of unitsInData()) expect(localizeUnit(u, 'cs')).toBe(u);
  });

  it('konkrétní německé tvary', () => {
    expect(localizeUnit('mil. ha', 'de')).toBe('Mio. ha');
    expect(localizeUnit('1000 farem', 'de')).toBe('1000 Betriebe');
    expect(localizeUnit('mld €', 'de')).toBe('Mrd. €');
    expect(localizeUnit('ks/ha', 'de')).toBe('Stück/ha');
    expect(localizeUnit('€/ha·rok', 'de')).toBe('€/ha·Jahr');
    expect(localizeUnit('t/ha', 'uk')).toBe('т/га');
  });

  it('česká poznámka k regionální mapě má překlad do všech jazyků', () => {
    const dir = path.join(SVET_DIR, 'regions');
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.json') || f.endsWith('-geo.json')) continue;
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      if (!d.regionNote) continue;
      for (const l of SVET_LANGS) expect(REGION_NOTE[d.slug]?.[l], `${d.slug} ${l}`).toBeTruthy();
    }
  });

  it('věta pod grafem je v de a uk v jejich jazyce, ne česky', () => {
    const s = [{ period: '2015', value: 6 }, { period: '2025', value: 8 }] as any;
    const r = [{ period: '2025', value: 7 }] as any;
    expect(chartCaption(s, r, 't/ha', 'Deutschland', 'de')).toMatch(/^Im Zeitraum 2015–2025 zwischen/);
    expect(chartCaption(s, r, 'т/га', 'Україна', 'uk')).toMatch(/^За період 2015–2025/);
  });
});

describe('převodníky předávají jazyk komponentě (kredity fotek byly česky)', () => {
  it('prevody-jednotek → AreaConverter locale', () => {
    expect(read('src/pages/kalkulacka/prevody-jednotek/index.astro')).toMatch(/<AreaConverter\s+locale=\{locale\}/);
  });
  it('prevody-hmotnost → WeightConverter locale', () => {
    expect(read('src/pages/kalkulacka/prevody-hmotnost/index.astro')).toMatch(/<WeightConverter\s+locale=\{locale\}/);
  });
});

describe('YouTube se nenačítá bez kliknutí', () => {
  // Náhled z i.ytimg.com se stahoval hned při načtení stránky: IP návštěvníka
  // šla Googlu dřív, než na video klikl, a stránka ukazovala cizí snímek mimo
  // přehrávač. JSON-LD (structured-data.ts) ho smí jen uvádět jako URL.
  it('žádná šablona nevykresluje obrázek ani preconnect z i.ytimg.com', () => {
    for (const f of ['src/components/MachineVideo.astro', 'src/pages/encyklopedie/[slug].astro', 'src/layouts/Layout.astro']) {
      expect(read(f), f).not.toMatch(/src=\{?[`'"]https:\/\/i\.ytimg\.com/);
      expect(read(f), f).not.toMatch(/preconnect" href="https:\/\/(i\.ytimg|www\.youtube)/);
    }
  });
});

describe('právní audit 2026-10-14', () => {
  it('Ahrefs Web Analytics se načítá až po souhlasu, ne natvrdo v Layoutu', () => {
    expect(read('src/layouts/Layout.astro')).not.toMatch(/<script[^>]*analytics\.ahrefs\.com/);
    const cc = read('src/components/CookieConsent.astro');
    const start = cc.indexOf('function spustMereni()');
    expect(start).toBeGreaterThan(-1);
    expect(cc.indexOf('analytics.ahrefs.com', start)).toBeGreaterThan(start);
  });

  it('patička odkazuje na zásady zpracování osobních údajů', () => {
    expect(read('src/components/Footer.astro')).toContain("navHref(locale, '/zpracovani-osobnich-udaju/')");
  });

  it('zásady uvádějí skutečné zpracovatele (Hostinger, Ahrefs, YouTube), ne Supabase, Inc. jako hostitele', () => {
    const z = read('src/pages/zpracovani-osobnich-udaju.astro');
    expect(z.match(/Hostinger International Ltd\./g)?.length).toBe(5);
    expect(z.match(/Ahrefs Pte\. Ltd\./g)?.length).toBe(5);
    expect(z.match(/youtube-nocookie\.com/g)?.length).toBe(5);
    expect(z).not.toMatch(/<strong>Supabase, Inc\.<\/strong>/);
  });

  it('podmínky vyjímají fotky pod cizí licencí ze zákazu kopírování (všech 5 jazyků)', () => {
    expect(read('src/pages/podminky-pouziti.astro').match(/Pexels, Unsplash (a|i|und|і) Pixabay/g)?.length).toBe(5);
  });

  it('Cloudflare neschovává e-maily za JavaScript', () => {
    const l = read('src/layouts/Layout.astro');
    expect(l).toContain('<!--email_off-->');
    expect(l).toContain('<!--/email_off-->');
  });
});

describe('Impressum (/de)', () => {
  it('existuje jen pod /de a patička na něj pod /de odkazuje', async () => {
    const { isLaunchedPath, LOCALE_ONLY_SECTIONS } = await import('../../src/i18n/utils');
    expect(isLaunchedPath('de', '/impressum')).toBe(true);
    expect(LOCALE_ONLY_SECTIONS.impressum).toBe('de');
    expect(read('src/components/Footer.astro')).toContain('href="/de/impressum/"');
  });

  it('údaje o provozovateli sedí s ostatními právními stránkami', () => {
    const imp = read('src/pages/impressum/index.astro');
    for (const fakt of ['Samec Digital s.r.o.', 'Na Břehu 378', '387 11 Katovice', '29547539', 'Abteilung C, Einlage 36598', 'info@samecdigital.com']) {
      expect(imp, fakt).toContain(fakt);
      expect(read('src/pages/dsa-kontakt.astro'), fakt).toContain(fakt);
    }
  });
});
