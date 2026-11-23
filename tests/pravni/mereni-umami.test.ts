import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { UMAMI_ZNACKA, UMAMI_WEB_ID, UMAMI_SKRIPT, UMAMI_DOMENY } from '../../src/lib/mereni';

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
    expect(layout).toContain("import { UMAMI_ZNACKA } from '../lib/mereni'");
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
