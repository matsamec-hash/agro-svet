import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Regresní test k nálezu z 29. 8. 2026: Microsoft Clarity (nahrávání sezení,
 * cookies `_clck`/`_clsk`) se načítala natvrdo z `Layout.astro`, tedy i lidem,
 * kteří v liště klikli „Pouze nezbytné".
 *
 * Test schválně nehlídá jen ten jeden řádek, ale celou třídu chyby: ŽÁDNÝ
 * soubor kromě lišty souhlasu nesmí odkazovat na měřicí službu, která si
 * ukládá cookies. Kdo příště přidá GA nebo Clarity do layoutu, spadne tady.
 */
const SLUZBY_S_COOKIES = [
  { jmeno: 'Microsoft Clarity', vzor: /clarity\.ms/ },
  { jmeno: 'Google Analytics / GTM', vzor: /googletagmanager\.com|google-analytics\.com/ },
  { jmeno: 'Google AdSense', vzor: /pagead2\.googlesyndication\.com/ },
  { jmeno: 'Facebook Pixel', vzor: /connect\.facebook\.net/ },
  { jmeno: 'Hotjar', vzor: /static\.hotjar\.com/ },
];

/** Lišta je jediné místo, kde smí měřicí skript vzniknout. */
const POVOLENO = ['src/components/CookieConsent.astro'];

function projdi(adresar: string, nalezene: string[] = []): string[] {
  for (const polozka of readdirSync(adresar, { withFileTypes: true })) {
    const cesta = join(adresar, polozka.name);
    if (polozka.isDirectory()) projdi(cesta, nalezene);
    else if (/\.(astro|ts|tsx|js|mjs|svelte|html)$/.test(polozka.name)) nalezene.push(cesta);
  }
  return nalezene;
}

describe('lišta souhlasu — měření běží až po souhlasu', () => {
  const soubory = projdi('src').filter((f) => !POVOLENO.includes(f));

  for (const { jmeno, vzor } of SLUZBY_S_COOKIES) {
    it(`${jmeno} se nikde nenačítá mimo lištu souhlasu`, () => {
      const hrisnici = soubory.filter((f) => vzor.test(readFileSync(f, 'utf8')));
      expect(
        hrisnici,
        `${jmeno} se načítá mimo CookieConsent.astro: ${hrisnici.join(', ')}`,
      ).toEqual([]);
    });
  }

  const lista = readFileSync('src/components/CookieConsent.astro', 'utf8');

  it('měřicí skripty vznikají jen ve funkci spuštěné po souhlasu', () => {
    const telo = lista.slice(lista.indexOf('function spustMereni'));
    for (const { jmeno, vzor } of SLUZBY_S_COOKIES) {
      if (vzor.test(lista)) {
        expect(vzor.test(telo), `${jmeno} je v liště, ale mimo spustMereni()`).toBe(true);
      }
    }
  });

  it('nabízí odvolání souhlasu přes [data-cc-reopen]', () => {
    expect(lista).toMatch(/data-cc-reopen/);
    const footer = readFileSync('src/components/Footer.astro', 'utf8');
    expect(footer, 'v patičce chybí odkaz na nastavení cookies').toMatch(/data-cc-reopen/);
  });

  it('souhlas má omezenou platnost, ne navěky', () => {
    const shoda = /PLATNOST_DNI\s*=\s*(\d+)/.exec(lista);
    expect(shoda, 'lišta nemá nastavenou platnost souhlasu').not.toBeNull();
    const dni = Number(shoda![1]);
    expect(dni).toBeGreaterThan(0);
    expect(dni, 'delší platnost souhlasu než rok se nedoporučuje').toBeLessThanOrEqual(365);
  });

  it('odmítnutí je na první vrstvě, ne schované v nastavení', () => {
    const uvod = lista.slice(
      lista.indexOf('data-cc-vrstva="uvod"'),
      lista.indexOf('data-cc-vrstva="detail"'),
    );
    expect(uvod).toMatch(/id="cc-odmitnout"/);
    expect(uvod).toMatch(/id="cc-vse"/);
  });
});
