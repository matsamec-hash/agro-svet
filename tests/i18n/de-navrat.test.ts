// tests/i18n/de-navrat.test.ts
// Návrat /de (2026-10-14). Audit vykreslených německých stránek našel češtinu
// na místech, kde ji testy překladů neviděly, a cizí obrázek načítaný bez
// kliknutí. Tohle hlídá, aby se to nevrátilo — v de i v ostatních jazycích.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SVET_LANGS, localizeUnit, REGION_NOTE } from '../../src/i18n/svet';
import { chartCaption } from '../../src/lib/svet/chart';
import { isWithdrawnPath } from '../../src/i18n/config';
import { isLaunchedPath } from '../../src/i18n/utils';

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
    expect(l).toContain("set:html={'<!--email_off-->'}");
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

describe('rizika mimo fotky (audit 2026-10-15)', () => {
  const ui = ['cs', 'sk', 'pl', 'uk', 'de'].map((l) => [l, read(`src/i18n/ui/${l}.ts`)] as const);
  const lisy = (src: string) => src.split('\n').filter((r) => /^\s*'cc\.(text|analyticsDesc)':/.test(r)).join('\n');

  it('měření se nevydává za anonymní — GA4 drží trvalé ID až 2 roky, Clarity nahrává návštěvy', () => {
    for (const [l, src] of ui) expect(lisy(src), l).not.toMatch(/anonym|анонім/i);
    const zasady = read('src/pages/zpracovani-osobnich-udaju.astro');
    // Řádky o IP v logu bazaru (anti-fraud) se měření netýkají.
    const mereni = zasady.split('\n').filter((r) => /Analytics|Clarity|Ahrefs/.test(r)).join('\n');
    expect(mereni).not.toMatch(/anonymi[sz]|anonymn|anonimow|анонім|anonyme Besuch/);
    expect(zasady.match(/<code>_clsk<\/code> 1 (Tag|den|deň|dzień|день)/g)?.length).toBe(5);
  });

  it('poznámka u videa říká, že YouTube dostane IP a může data poslat do USA', () => {
    for (const [l, src] of ui) {
      for (const k of ['enc.video.note', 'cat.s.d.videoNote']) {
        const row = src.split('\n').find((r) => r.includes(`'${k}':`)) ?? '';
        expect(row, `${l} ${k}`).toMatch(/IP/);
        expect(row, `${l} ${k}`).toMatch(/USA|США/);
      }
    }
  });

  it('„Anmelden“ se mimo češtinu nezobrazuje — vede na českou přihlášku, která stahuje esm.sh', () => {
    const h = read('src/components/Header.astro');
    expect(h).toMatch(/showLogin = locale === 'cs' \|\| isLaunchedPath\(locale, '\/bazar'\)/);
    expect(h).toMatch(/id="guest-link"[^>]*hidden=\{!showLogin\}/);
    expect(h).toMatch(/\.guest-link\[hidden\] \{ display: none; \}/);
  });
});

describe('právní texty po rešerši 2026-10-15', () => {
  it('DSA kontakt cituje správně: čl. 3 h) není tržiště, výjimky jsou čl. 19 odst. 1 a čl. 29 odst. 1', () => {
    const dsa = read('src/pages/dsa-kontakt.astro');
    expect(dsa).not.toMatch(/3 (Buchst|písm|lit|п)\.? ?h\)/);
    expect(dsa).not.toMatch(/19 (Abs|odst|ods|ust|ч)\. 2/);
    expect(dsa.match(/29 (Abs|odst|ods|ust|ч)\. 1/g)?.length).toBe(5);
    expect(dsa.match(/24 (Abs|odst|ods|ust|ч)\. 3/g)?.length).toBe(5);
  });

  it('de podmínky neposílají na rozhodčí orgány, které podnikatele z CZ neřeší', () => {
    const t = read('src/pages/podminky-pouziti.astro');
    expect(t).not.toMatch(/Universalschlichtungsstelle|verbraucherschlichtung\.at|nimmt daran nicht teil/);
    expect(t).toMatch(/evz\.de/);
    expect(t).toMatch(/europakonsument\.at/);
  });

  it('zásady: odpověď do měsíce (čl. 12 odst. 3) a samostatně právo námitky (čl. 21) ve všech jazycích', () => {
    const z = read('src/pages/zpracovani-osobnich-udaju.astro');
    expect(z).not.toMatch(/binnen 30 Tagen|do 30 dní\.|w ciągu 30 dni|протягом 30 днів/);
    expect(z.match(/12 (Abs|odst|ods|ust|ч)\. 3/g)?.length).toBe(5);
    expect(z.match(/<strong>[^<]*\((Art|čl|art|ст)\. 21 (DSGVO|GDPR|RODO)\):<\/strong>/g)?.length).toBe(5);
  });

  it('pod německými články není newsletter (potvrzení chodí česky)', () => {
    expect(read('src/pages/novinky/[slug].astro')).toMatch(/\{locale !== 'de' && <Newsletter \/>\}/);
  });
});

describe('sekce stažené z de kvůli licenci dat (2026-10-15)', () => {
  it('/akcie a /svet nejsou launchnuté a vracejí 410, ostatní mutace beze změny', () => {
    for (const p of ['/akcie', '/akcie/', '/akcie/DE/', '/svet', '/svet/nemecko/', '/svet/mapa/']) {
      expect(isWithdrawnPath('de', p), p).toBe(true);
    }
    expect(isWithdrawnPath('de', '/svetlo')).toBe(false);
    expect(isWithdrawnPath('de', '/stroje/')).toBe(false);
    expect(isWithdrawnPath('pl', '/akcie/DE/')).toBe(false);
    expect(isLaunchedPath('de', '/akcie')).toBe(false);
    expect(isLaunchedPath('de', '/svet')).toBe(false);
    const mw = read('src/middleware.ts');
    expect(mw).toMatch(/if \(isWithdrawnPath\(locale, strippedPath\)\) \{\n\s*return new Response\(WITHDRAWN_SECTION_BODY, \{\n\s*status: 410/);
  });

  it('popisek specifikací neslibuje jen „veřejné materiály výrobce“', () => {
    for (const l of ['cs', 'sk', 'pl', 'uk', 'de']) {
      const row = read(`src/i18n/ui/${l}.ts`).split('\n').find((r) => r.includes("'cat.s.d.ebSpec':")) ?? '';
      expect(row, l).not.toMatch(/veřejných|verejných|publicznych|публічних|öffentlicher/);
    }
  });
});

describe('homepage /de neukazuje mapu Evropy (stažený /svet)', () => {
  it('ImageAccordion přidává mapu jen tam, kde /svet existuje a není stažený', () => {
    const ia = read('src/components/ImageAccordion.astro');
    expect(ia).toMatch(/if \(locale === 'cs' \|\| \(isLaunchedPath\(locale, '\/svet'\) && !isWithdrawnPath\(locale, '\/svet'\)\)\) \{\n\s*items\.push\(\{/);
  });
});
