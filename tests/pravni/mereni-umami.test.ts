import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  UMAMI_ZNACKA,
  UMAMI_WEB_ID,
  UMAMI_SKRIPT,
  UMAMI_DOMENY,
  UMAMI_OCISTI_NAZEV,
  UMAMI_OCISTI_FUNKCE,
  meritCestu,
} from '../../src/lib/mereni';

/**
 * Vlastní Umami běží i bez souhlasu v liště, protože nic neukládá do prohlížeče.
 * Tenhle test hlídá obě strany té úvahy: značka opravdu nesahá do cookies ani
 * úložiště, a zásady o ní říkají pravdu ve všech pěti jazycích.
 */
describe('měření Umami — běží bez souhlasu, proto nesmí nic ukládat', () => {
  it('značka nesahá do cookies ani do úložiště prohlížeče', () => {
    expect(UMAMI_ZNACKA).not.toMatch(/cookie|localStorage|sessionStorage|indexedDB/i);
  });

  it('míří na vlastní sběrač a na web agro-svet.cz', () => {
    expect(UMAMI_SKRIPT).toBe('https://analytika.samecdigital.com/script.js');
    expect(UMAMI_WEB_ID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(UMAMI_ZNACKA).toContain(UMAMI_WEB_ID);
    expect(UMAMI_DOMENY.split(',')).toContain('agro-svet.cz');
  });

  it('layout značku opravdu vkládá', () => {
    const layout = readFileSync('src/layouts/Layout.astro', 'utf8');
    expect(layout).toContain("import { UMAMI_ZNACKA, meritCestu } from '../lib/mereni'");
    expect(layout).toContain('set:html={UMAMI_ZNACKA}');
  });

  it('zásady zpracování údajů zmiňují Umami v pěti jazycích (řádek tabulky, zpracovatel, cookies)', () => {
    const zasady = readFileSync('src/pages/zpracovani-osobnich-udaju.astro', 'utf8');
    const vyskyty = zasady.match(/Umami/g) ?? [];
    // 5 jazyků × (řádek v tabulce + odrážka zpracovatele + odstavec o cookies)
    expect(vyskyty.length).toBeGreaterThanOrEqual(15);
    expect((zasady.match(/analytika\.samecdigital\.com/g) ?? []).length).toBe(5);
  });
});

/**
 * Externí audit 26. 11. 2026 (bod 3): Umami dostávalo `location.href` celé,
 * tedy i `?code=…` z OAuth návratu a `#…`, a běželo i na přihlášení. Tyhle
 * testy hlídají obě opravy — ořezání adresy a neměření citlivých stránek.
 */
describe('měření Umami — žádná tajemství v adrese', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('značka zapíná exclude-search, exclude-hash a before-send', () => {
    expect(UMAMI_ZNACKA).toContain('s.dataset.excludeSearch="true"');
    expect(UMAMI_ZNACKA).toContain('s.dataset.excludeHash="true"');
    expect(UMAMI_ZNACKA).toContain(`s.dataset.beforeSend="${UMAMI_OCISTI_NAZEV}"`);
    expect(UMAMI_ZNACKA).toContain(`window.${UMAMI_OCISTI_NAZEV}=${UMAMI_OCISTI_FUNKCE}`);
  });

  it('čisticí funkce z url i referreru odstraní query a hash', () => {
    vi.stubGlobal('location', { href: 'https://agro-svet.cz/bazar/' });
    const ocisti = new Function(`return ${UMAMI_OCISTI_FUNKCE}`)() as (t: string, p: Record<string, string>) => Record<string, string>;
    const out = ocisti('event', {
      url: '/bazar/?code=TAJNE&state=x#access_token=TAJNE2',
      referrer: 'https://agro-svet.cz/bazar/auth/callback/?code=TAJNE3#frag',
      hostname: 'agro-svet.cz',
    });
    expect(out.url).toBe('/bazar/');
    expect(out.referrer).toBe('https://agro-svet.cz/bazar/auth/callback/');
    expect(out.hostname).toBe('agro-svet.cz');
    expect(JSON.stringify(out)).not.toMatch(/TAJNE|access_token|code=/);
  });

  it('prázdný referrer nechá být a nečitelnou adresu vymaže', () => {
    vi.stubGlobal('location', { href: 'https://agro-svet.cz/' });
    const ocisti = new Function(`return ${UMAMI_OCISTI_FUNKCE}`)() as (t: string, p: Record<string, string>) => Record<string, string>;
    expect(ocisti('event', { url: '/', referrer: '' }).referrer).toBe('');
    expect(ocisti('event', { url: 'http://[bad', referrer: '' }).url).toBe('');
  });
});

describe('měření Umami — citlivé stránky se neměří vůbec', () => {
  it.each([
    '/bazar/prihlaseni/',
    '/bazar/registrace/',
    '/bazar/auth/callback/',
    '/bazar/auth/odkaz/',
    '/bazar/odhlaseni/',
    '/bazar/prevzit/abc123token/',
    '/bazar/novy/',
    '/bazar/moje/',
    '/bazar/moje/5/topovat/platba/',
    '/bazar/profil/',
    '/fotosoutez/nahrat/',
    '/fotosoutez/moje/',
    '/admin/',
    '/admin/bazar/reports/',
    '/sk/bazar/prihlaseni/',
    '/pl/bazar/auth/callback/',
    '/uk/bazar/moje/',
  ])('%s se neměří', (cesta) => {
    expect(meritCestu(cesta)).toBe(false);
  });

  it.each([
    '/',
    '/novinky/',
    '/novinky/nejaky-clanek/',
    '/bazar/',
    '/bazar/inzerat/zetor-7245/',
    '/stroje/traktory/',
    '/sk/',
    '/pl/bazar/',
    // shoda je po celých segmentech, ne po předponě textu
    '/bazar/profilace/',
    '/bazar/novy-traktor/',
    '/administrativa/',
  ])('%s se měří', (cesta) => {
    expect(meritCestu(cesta)).toBe(true);
  });

  it('layout vkládá značku jen když se cesta měří', () => {
    const layout = readFileSync('src/layouts/Layout.astro', 'utf8');
    expect(layout).toContain("import { UMAMI_ZNACKA, meritCestu } from '../lib/mereni'");
    expect(layout).toMatch(/meritCestu\(Astro\.url\.pathname\)/);
    expect(layout).toMatch(/\{meritNavstevu && <script is:inline set:html=\{UMAMI_ZNACKA\} \/>\}/);
  });
});

describe('security.txt (RFC 9116)', () => {
  const txt = readFileSync('public/.well-known/security.txt', 'utf8');

  it('má kontakt, platnost v budoucnu a canonical', () => {
    expect(txt).toMatch(/^Contact: mailto:info@samecdigital\.com$/m);
    expect(txt).toMatch(/^Canonical: https:\/\/agro-svet\.cz\/\.well-known\/security\.txt$/m);
    const expires = txt.match(/^Expires: (\S+)$/m)?.[1];
    expect(expires).toBeTruthy();
    // záměrně NEhlídáme, že Expires už nevypršel — jinak by vypršení zastavilo deploy
    expect(Number.isNaN(Date.parse(expires!))).toBe(false);
  });
});
