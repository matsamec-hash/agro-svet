import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ui } from '../../src/i18n/ui';
import { locales } from '../../src/i18n/config';
import { HIDDEN_SECTIONS } from '../../src/i18n/nav';
import { t, useTranslations } from '../../src/i18n/utils';

describe('UI dictionaries', () => {
  it('cs/sk/uk slovníky existují', () => {
    expect(ui.cs['nav.home']).toBe('Domů');
    expect(ui.sk['nav.home']).toBe('Domov');
    expect(ui.uk['nav.home']).toBe('Головна');
  });

  it('t() vrátí překlad pro locale', () => {
    expect(t('sk', 'nav.machines')).toBe('Stroje');
    expect(t('uk', 'nav.machines')).toBe('Техніка');
  });

  it('uk má vlastní překlad footer.rights (plná parita, žádný cs fallback)', () => {
    expect(ui.uk['footer.rights']).toBe('Усі права захищені');
    expect(t('uk', 'footer.rights')).not.toBe(ui.cs['footer.rights']);
  });

  it('t() spadne na cs když klíč v locale chybí', () => {
    // Mechanismus locale→cs: simulujeme klíč přítomný jen v cs.
    const csOnly = '__test.cs.only__';
    const orig = ui.cs[csOnly];
    ui.cs[csOnly] = 'jen cs';
    try {
      expect(t('uk', csOnly)).toBe('jen cs');
      expect(t('sk', csOnly)).toBe('jen cs');
    } finally {
      if (orig === undefined) delete ui.cs[csOnly];
      else ui.cs[csOnly] = orig;
    }
  });

  it('t() vrátí klíč když chybí všude', () => {
    expect(t('sk', 'nonexistent.key')).toBe('nonexistent.key');
  });

  it('useTranslations vrací funkci vázanou na locale', () => {
    const tr = useTranslations('sk');
    expect(tr('nav.home')).toBe('Domov');
  });
});

describe('štítek novinek se nesmí rozejít sám se sebou', () => {
  // ‼️ Nad hlavním článkem hera stojí vedle sebe štítek SEKCE a štítek
  // KATEGORIE. Když článek spadá do kategorie `novinky`, jsou to tytéž dva
  // popisky — komponenta druhý skrývá porovnáním řetězců. Polština to
  // obešla tím, že pro totéž měla dvě slova: sekce „Nowości“, kategorie
  // „Aktualności“ — a na homepage svítily obě.
  it('každý jazyk má pro novinky JEDEN termín napříč klíči', () => {
    for (const loc of locales) {
      expect(ui[loc]['search.g.novinky'], `${loc}: vyhledávání říká novinkám jinak než výpis`)
        .toBe(ui[loc]['nov.cat.novinky']);
    }
  });

  it('rozcestníky neberou štítek z literálu, ale z localizedCategory', () => {
    for (const f of ['HomeSk', 'HomePl', 'HomeDe', 'HomeUk']) {
      const src = fs.readFileSync(path.join(process.cwd(), `src/components/home/${f}.astro`), 'utf8');
      expect(src, `${f}: štítek sekce musí vycházet z localizedCategory`).toContain("const NEWS_TAG = localizedCategory(LOCALE, 'novinky');");
      expect(src, `${f}: v šabloně zůstal natvrdo psaný štítek`).toContain('class="hero-tag">{NEWS_TAG}</a>');
    }
  });
});

describe('popisek modelu neslibuje, co web nemá', () => {
  // ‼️ Do 10. 9. 2026 slibovaly popisky u všech 2 092 modelů ceny v bazaru —
  // ve všech pěti jazycích, i když je bazar z webu schovaný od června 2026.
  // V Polsku to stálo 283 z 297 cenových dotazů s NULOU prokliků: Google
  // stránku zobrazil, protože mluvila o ceně, a návštěvník žádnou nenašel.
  //
  // Test se váže na HIDDEN_SECTIONS: dokud je `bazar` skrytý ve VŠECH jazycích,
  // popisek o cenách mluvit nesmí. Až se bazar vrátí, test si to všimne sám
  // a přestane platit — nebude ho třeba mazat, jen bude tolerovat obojí.
  const PRICE_WORDS = /cen[ay]|ceny|giełd|gield|Preise|ціни|cenník|cennik/i;

  it('dokud je bazar skrytý, popisek modelu ceny neslibuje', () => {
    const bazarHiddenEverywhere = locales.every((l) => HIDDEN_SECTIONS[l].includes('bazar'));
    if (!bazarHiddenEverywhere) return; // bazar je zpátky → slib je legitimní

    for (const loc of locales) {
      const desc = ui[loc]['cat.s.d.descFallback'];
      expect(desc, `${loc}: popisek slibuje ceny, ale bazar je skrytý`).not.toMatch(PRICE_WORDS);
    }
  });

  it('spec-led začátek zůstává — ten je změřený jako funkční', () => {
    // ⛔ Nesahat: /stroje překonává svou pozici, viz plán docs/plan-polsko-2026-09.md
    for (const loc of locales) {
      const desc = ui[loc]['cat.s.d.descFallback'];
      expect(desc, `${loc}: chybí {power}`).toContain('{power}');
      expect(desc, `${loc}: chybí {years}`).toContain('{years}');
    }
  });
});
