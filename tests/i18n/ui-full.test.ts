// tests/i18n/ui-full.test.ts
import { describe, it, expect } from 'vitest';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';
import uk from '../../src/i18n/ui/uk';

// Klíče, které MUSÍ existovat ve všech plně lokalizovaných slovnících (cs, sk).
const REQUIRED_KEYS = [
  // brand / layout
  'brand.name', 'a11y.skipToContent',
  // nav top-level
  'nav.tema', 'nav.animals', 'nav.tech', 'nav.data', 'nav.farms', 'nav.bazar', 'nav.photo',
  // nav: Téma
  'nav.tema.all', 'nav.tema.tech', 'nav.tema.dotace', 'nav.tema.trh',
  'nav.tema.legislativa', 'nav.tema.howto', 'nav.tema.guide', 'nav.tema.market',
  // nav: Zvířata
  'nav.animals.all', 'nav.animals.cattle', 'nav.animals.horses',
  'nav.animals.sheep', 'nav.animals.pigs', 'nav.animals.bees',
  // nav: Technika
  'nav.tech.all', 'nav.tech.tractors', 'nav.tech.combines', 'nav.tech.machines',
  'nav.tech.brands', 'nav.tech.compare', 'nav.tech.toplists', 'nav.tech.glossary',
  'nav.tech.quizzes', 'nav.tech.dealers',
  // nav: Data
  'nav.data.markets', 'nav.data.soil', 'nav.data.calculators',
  'nav.data.capCalc', 'nav.data.subsidies',
  // header chrome
  'header.search', 'header.searchPlaceholder', 'header.account', 'header.myAds',
  'header.newAd', 'header.profile', 'header.logout', 'header.login',
  'header.menu', 'header.mainMenu', 'header.expand',
  // footer
  'footer.tagline', 'footer.content', 'footer.news', 'footer.techCatalog',
  'footer.breeds', 'footer.soil', 'footer.dataStats',
  'footer.bazar', 'footer.allAds', 'footer.addAd', 'footer.login',
  'footer.registration', 'footer.bazarRules',
  'footer.photo', 'footer.photoCurrent', 'footer.photoArchive',
  'footer.photoRules', 'footer.photoGdpr',
  'footer.operatedBy', 'footer.logoHome',
  'footer.search', 'footer.editorial', 'footer.terms', 'footer.gdpr',
  'footer.dsa', 'footer.contact',
  // 404
  'nf.title', 'nf.description', 'nf.heading', 'nf.body',
  'nf.home', 'nf.news', 'nf.techCatalog', 'nf.bazar', 'nf.breeds', 'nf.search',
  'nf.errorHint', 'nf.operatedBy',
  // cookie consent
  'cc.text', 'cc.more', 'cc.essentials', 'cc.acceptAll',
];

describe('UI dictionaries — plné pokrytí', () => {
  it('cs má všechny požadované klíče a nejsou prázdné', () => {
    for (const k of REQUIRED_KEYS) {
      expect(cs[k], `cs chybí klíč ${k}`).toBeTruthy();
    }
  });

  it('sk má všechny požadované klíče a nejsou prázdné', () => {
    for (const k of REQUIRED_KEYS) {
      expect(sk[k], `sk chybí klíč ${k}`).toBeTruthy();
    }
  });

  it('cs hodnoty odpovídají původním českým labelům (vzorek verbatim)', () => {
    expect(cs['brand.name']).toBe('agro-svět.cz');
    expect(cs['nav.tema']).toBe('Téma');
    expect(cs['nav.animals']).toBe('Zvířata');
    expect(cs['nav.tech.compare']).toBe('Srovnání modelů');
    expect(cs['header.account']).toBe('Účet');
    expect(cs['header.logout']).toBe('Odhlásit se');
    expect(cs['footer.tagline']).toBe('Zemědělská technika, novinky a encyklopedie. Bazar, statistiky, fotosoutěž — vše pro českého zemědělce.');
    expect(cs['nf.heading']).toBe('Tato stránka neexistuje');
    expect(cs['cc.essentials']).toBe('Pouze nezbytné');
    expect(cs['a11y.skipToContent']).toBe('Přeskočit na obsah');
  });

  it('sk se v lokalizovaných klíčích liší od cs (není to jen kopie)', () => {
    expect(sk['nav.animals']).toBe('Zvieratá');
    expect(sk['header.logout']).toBe('Odhlásiť sa');
    expect(sk['cc.essentials']).toBe('Iba nevyhnutné');
    expect(sk['a11y.skipToContent']).toBe('Preskočiť na obsah');
  });

  it('uk má všechny požadované klíče a nejsou prázdné', () => {
    for (const k of REQUIRED_KEYS) {
      expect(uk[k], `uk chybí klíč ${k}`).toBeTruthy();
    }
  });

  it('uk má plnou paritu klíčů s cs (žádný klíč nechybí → žádný cs fallback v UI)', () => {
    const csKeys = Object.keys(cs);
    const ukKeys = new Set(Object.keys(uk));
    const missing = csKeys.filter((k) => !ukKeys.has(k));
    expect(missing, `uk chybí ${missing.length} klíčů: ${missing.slice(0, 20).join(', ')}`).toEqual([]);
  });

  it('uk zachovává interpolační {tokeny} z cs (stejná množina na klíč)', () => {
    const tok = (s: string) => (s.match(/\{\w+\}/g) ?? []).slice().sort();
    const mismatches: string[] = [];
    for (const k of Object.keys(cs)) {
      if (!(k in uk)) continue;
      const a = tok(cs[k]).join(',');
      const b = tok(uk[k]).join(',');
      if (a !== b) mismatches.push(`${k} (cs:[${a}] uk:[${b}])`);
    }
    expect(mismatches, mismatches.join(' | ')).toEqual([]);
  });

  it('uk se v lokalizovaných klíčích liší od cs (Cyrilice, není to kopie)', () => {
    expect(uk['nav.animals']).toBe('Тварини');
    expect(uk['header.logout']).toBe('Вийти');
    expect(uk['cc.essentials']).toBe('Лише необхідні');
    expect(uk['a11y.skipToContent']).toBe('Перейти до вмісту');
  });
});
