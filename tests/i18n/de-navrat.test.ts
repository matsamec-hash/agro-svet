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
  it('Ahrefs Web Analytics se nenačítá vůbec (2026-10-17: IP do Singapuru bez DPA se SCC)', () => {
    expect(read('src/layouts/Layout.astro')).not.toContain('analytics.ahrefs.com');
    const cc = read('src/components/CookieConsent.astro');
    expect(cc).toContain('function spustMereni()');
    expect(cc).not.toContain('analytics.ahrefs.com');
  });

  it('patička odkazuje na zásady zpracování osobních údajů', () => {
    expect(read('src/components/Footer.astro')).toContain("navHref(locale, '/zpracovani-osobnich-udaju/')");
  });

  it('zásady uvádějí skutečné zpracovatele (Hostinger, YouTube), ne Supabase, Inc. jako hostitele', () => {
    const z = read('src/pages/zpracovani-osobnich-udaju.astro');
    expect(z.match(/Hostinger International Ltd\./g)?.length).toBe(5);
    expect(z).not.toMatch(/Ahrefs|esm\.sh/);
    expect(z.match(/<h3>2\.6 /g)?.length).toBe(5); // kontaktní formulář
    expect(z.match(/DSA (čl\.|art\.|Art\.|ст\.) 16/g)?.length).toBe(5); // oznámení v bazaru
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
  it('/svet je pod de stažený (410); /akcie se vrátilo bez kurzů', () => {
    for (const p of ['/svet', '/svet/nemecko/', '/svet/mapa/']) {
      expect(isWithdrawnPath('de', p), p).toBe(true);
    }
    expect(isWithdrawnPath('de', '/svetlo')).toBe(false);
    expect(isWithdrawnPath('de', '/stroje/')).toBe(false);
    expect(isWithdrawnPath('de', '/akcie/DE/')).toBe(false);
    expect(isLaunchedPath('de', '/akcie')).toBe(true);
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

describe('označení AI textů (AI Act čl. 50 odst. 4)', () => {
  it('Layout vkládá štítek na začátek každé stránky a má ho každý jazyk', () => {
    expect(read('src/layouts/Layout.astro')).toMatch(/<main id="main-content" tabindex="-1">\n\s*<AiNotice \/>\n\s*<slot \/>/);
    for (const l of ['cs', 'sk', 'pl', 'uk', 'de']) {
      const src = read(`src/i18n/ui/${l}.ts`);
      expect(src, l).toMatch(/'ai\.notice': '[^']{20,}'/);
      expect(src, l).toMatch(/'ai\.noticeLink': '[^']+'/);
    }
  });
});

describe('akcie bez kurzů (Yahoo/Finnhub zakazují komerční použití)', () => {
  it('žádná stránka ani API nebere kurzy z Yahoo ani data z Finnhubu', () => {
    for (const f of ['src/pages/akcie/index.astro', 'src/pages/akcie/[ticker]/index.astro']) {
      const s = read(f);
      expect(s, f).not.toMatch(/api\/akcie|query1\.finance\.yahoo|finnhub\.io/);
    }
    for (const f of ['src/pages/api/akcie/kurzy.json.ts', 'src/pages/api/akcie/sparkliny.json.ts', 'src/pages/api/akcie/[ticker].json.ts', 'src/lib/yahoo-finance.ts']) {
      expect(fs.existsSync(path.join(process.cwd(), f)), f).toBe(false);
    }
    expect(read('src/i18n/akcie.ts')).not.toMatch(/Yahoo|Finnhub|Živé denní kurzy|Tagesaktuelle Kurse/);
  });
});

describe('de srovnání: noindex, mimo sitemapu, bez hreflang (2026-10-16)', () => {
  it('jednotlivá srovnání pod de nejsou k indexaci, hub ano, ostatní jazyky beze změny', async () => {
    const { isNoindexPath } = await import('../../src/i18n/utils');
    expect(isNoindexPath('de', '/srovnani/claas-lexion-8900-new-vs-new-holland-cr11/')).toBe(true);
    expect(isNoindexPath('de', '/srovnani/')).toBe(false);
    expect(isNoindexPath('de', '/stroje/claas/')).toBe(false);
    expect(isNoindexPath('cs', '/srovnani/claas-lexion-8900-new-vs-new-holland-cr11/')).toBe(false);
    expect(isNoindexPath('pl', '/srovnani/claas-lexion-8900-new-vs-new-holland-cr11/')).toBe(false);
    const { allowInMirror } = await import('../../src/lib/sitemap-mirror');
    expect(read('src/lib/sitemap-mirror.ts')).toMatch(/if \(isNoindexPath\(locale, p\)\) return false;/);
    expect(typeof allowInMirror).toBe('function');
    const layout = read('src/layouts/Layout.astro');
    expect(layout).toMatch(/const effectiveNoindex = noindex \|\| pathNoindex \|\|/);
    expect(layout).toMatch(/!isNoindexPath\(l, csRootPath\)/);
    expect(layout).toMatch(/noHreflang \|\| !csHasContent \|\| pathNoindex \? null/);
  });
});

describe('„ukázkový web" — nikomu nedat záminku (2026-10-17)', () => {
  const LOCALES = ['cs', 'sk', 'pl', 'uk', 'de'] as const;
  const ui = Object.fromEntries(LOCALES.map((l) => [l, read(`src/i18n/ui/${l}.ts`)]));
  const val = (l: string, k: string) => {
    const m = ui[l].match(new RegExp(`'${k.replace(/\./g, '\\.')}':\\s*'([^'\\n]*)'`));
    return m ? m[1] : null;
  };

  it('Impressum plní § 5 DDG, § 18 MStV, § 25 MedienG a čl. 6 EMFA najednou', () => {
    const imp = read('src/pages/impressum/index.astro');
    expect(imp).toContain("lp('/kontakt/')"); // druhá rychlá kontaktní cesta (C-298/07)
    expect(imp).toContain('§ 18 Abs. 2 MStV');
    expect(imp).toContain('§ 25 des österreichischen Mediengesetzes');
    expect(imp).toContain('Verordnung (EU) 2024/1083');
    expect(imp).toMatch(/100 % der Anteile/);
    expect(imp).toContain('Grundlegende Richtung');
    expect(imp).toContain('keine Umsatzsteuer-Identifikationsnummer');
  });

  it('cookie lišta: odmítnutí vypadá stejně jako souhlas', () => {
    const cc = read('src/components/CookieConsent.astro');
    expect(cc).toContain('id="cc-odmitnout" class="cc-btn cc-btn--hlavni"');
    expect(cc).toContain('id="cc-vse" class="cc-btn cc-btn--hlavni"');
    expect(cc).toContain('id="cc-odmitnout-vse" class="cc-btn cc-btn--hlavni"');
    expect(cc).not.toContain('cc-btn--obrys');
  });

  it('YouTube: upozornění je uvnitř panelu, encyklopedie používá stejný facade', () => {
    const mv = read('src/components/MachineVideo.astro');
    expect(mv).toMatch(/<span class="yt-consent">\{note\}<\/span>\}\s*\n\s*<\/div>/);
    expect(mv).not.toContain('i.ytimg.com/vi');
    const enc = read('src/pages/encyklopedie/[slug].astro');
    expect(enc).toContain('<MachineVideo');
    expect(enc).not.toContain('youtube-nocookie.com/embed');
    for (const l of LOCALES) {
      expect(val(l, 'enc.video.play')).toMatch(/YouTube/);
      expect(val(l, 'cat.s.d.videoPlay')).toMatch(/YouTube/);
    }
  });

  it('podpis u článků přiznává AI a netvrdí, že text někdo ověřil', () => {
    const AI = { cs: /AI/, sk: /AI/, pl: /AI/, uk: /ШІ/, de: /KI/ } as const;
    for (const l of LOCALES) {
      for (const k of ['nov.byline', 'enc.byline.pre', 'cat.s.d.ebProcessed']) {
        expect(val(l, k), `${l} ${k}`).toMatch(AI[l]);
      }
      for (const k of ['enc.byline.verified', 'enc.trust.verified', 'cat.zn.d.updated']) {
        expect(val(l, k), `${l} ${k}`).not.toMatch(/ověřen|overen|zweryfikowan|перевірено|geprüft/i);
      }
    }
  });

  it('podmínky: žádný souhlas mlčky se změnou, užší nárok na práva, DSA čl. 16 odst. 2', () => {
    const t = read('src/pages/podminky-pouziti.astro');
    expect(t).not.toMatch(/weiter nutzen, erklären Sie Ihr Einverständnis/);
    expect(t).not.toMatch(/Pokračováním v užívání webu po změně/);
    expect(t).not.toMatch(/Pokračovaním v používaní webu po zmene/);
    expect(t).not.toMatch(/Kontynuując korzystanie z serwisu po zmianie/);
    expect(t).not.toMatch(/Продовжуючи використання сайту після зміни/);
    expect(t).toMatch(/wesentlichen Pflicht/);
    expect(t).toMatch(/Keine Rechte beanspruchen wir an Fakten/);
    expect(t).not.toMatch(/Mit der Nutzung der Website\s+erklären Sie Ihr Einverständnis/);
    expect((t.match(/2011\/93\//g) ?? []).length).toBe(5);
    expect((t.match(/lp\('\/kontakt\/'\)/g) ?? []).length).toBe(5);
  });

  it('atlas chorob: povinná věta čl. 66 nařízení 1107/2009 ve všech jazycích', () => {
    expect(val('de', 'chor.d.latkyNote')).toContain('Pflanzenschutzmittel vorsichtig verwenden. Vor Verwendung stets Etikett und Produktinformationen lesen.');
    expect(val('cs', 'chor.d.latkyNote')).toContain('Používejte přípravky na ochranu rostlin bezpečně.');
    expect(val('sk', 'chor.d.latkyNote')).toContain('bezpečným spôsobom');
    expect(val('pl', 'chor.d.latkyNote')).toContain('z zachowaniem bezpieczeństwa');
    expect(val('uk', 'chor.d.latkyNote')).toContain('безпечно');
    expect(val('sk', 'chor.d.latkyNote')).toContain('ÚKSÚP');
  });

  it('žádné knihovny z cizích CDN (jsDelivr, unpkg, esm.sh) — IP návštěvníka by šla ven bez souhlasu', () => {
    const walk = (dir: string): string[] => fs.readdirSync(path.join(process.cwd(), dir), { withFileTypes: true })
      .flatMap((e) => e.isDirectory() ? walk(`${dir}/${e.name}`) : /\.(astro|ts)$/.test(e.name) ? [`${dir}/${e.name}`] : []);
    const offenders = [...walk('src/pages'), ...walk('src/components'), ...walk('src/layouts')]
      .filter((f) => /https:\/\/(cdn\.jsdelivr\.net|unpkg\.com|esm\.sh)\//.test(read(f)));
    expect(offenders).toEqual([]);
    for (const f of ['vendor/chartjs/chart-4.5.1.umd.min.js', 'vendor/chartjs/chartjs-plugin-annotation-3.1.0.min.js', 'vendor/leaflet/leaflet.js', 'vendor/leaflet/leaflet.css', 'vendor/leaflet/images/marker-icon.png', 'vendor/leaflet-markercluster/leaflet.markercluster.js']) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', f)), f).toBe(true);
    }
  });

  it('JSON-LD značky nemá jako url naši stránku a Supabase preconnect není všude', () => {
    expect(read('src/pages/znacky/[slug].astro')).not.toMatch(/description: znacka\.data\.popis,\n\s*url: canonical/);
    expect(read('src/pages/stroje/[brand]/index.astro')).not.toMatch(/name: brand\.name,\n\s*url: brandUrl,/);
    expect(read('src/layouts/Layout.astro')).toMatch(/\{needsSupabase && <link rel="preconnect"/);
  });
});
