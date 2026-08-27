import { describe, it, expect } from 'vitest';
import { isPrerenderedOnlyPath, localizeInternalHref, isLaunchedPath } from '../../src/i18n/utils';

// PROČ: /plodiny je pro sk i pl launchnuté, ale DETAIL ODRŮDY je prerendered
// cs-only (úřední popis ÚKZÚZ k odrůdě registrované v ČR) — pod locale prefixem
// 302 na cs. Totéž dva kvízy, které cílí na české podmínky. Když se takové cesty
// neoznačí, sitemapa locale nabere tisíce URL, které skončí redirectem, a interní
// odkazy vedou přes 302. PL mirror to řešil vlastními branami v sitemap.xml.ts;
// sk launch by tu bránu musel zkopírovat, tak je logika na jednom místě.
describe('prerendered cs-only cesty uvnitř launchnutých sekcí', () => {
  const ODRUDA = '/plodiny/psenice-ozima/seladon/';
  const QUIZ_CS_ONLY = '/kviz/jaky-traktor-potrebujete/';
  const QUIZ_LOCALIZED = '/kviz/historie-znacek/';

  it('detail odrůdy je cs-only, ačkoli /plodiny launchnuté je', () => {
    for (const locale of ['sk', 'pl'] as const) {
      expect(isLaunchedPath(locale, ODRUDA)).toBe(true);
      expect(isPrerenderedOnlyPath(ODRUDA)).toBe(true);
      expect(localizeInternalHref(locale, ODRUDA)).toBe(ODRUDA);
    }
  });

  it('hub, pillar i faceta plodin se lokalizují dál', () => {
    expect(isPrerenderedOnlyPath('/plodiny/')).toBe(false);
    expect(isPrerenderedOnlyPath('/plodiny/psenice-ozima/')).toBe(false);
    expect(isPrerenderedOnlyPath('/plodiny/skupina/obiloviny/')).toBe(false);
    expect(localizeInternalHref('sk', '/plodiny/psenice-ozima/')).toBe('/sk/plodiny/psenice-ozima/');
  });

  it('nelokalizované kvízy jsou cs-only, lokalizovaný a hub ne', () => {
    expect(isPrerenderedOnlyPath(QUIZ_CS_ONLY)).toBe(true);
    expect(isPrerenderedOnlyPath('/kviz/jaka-vcela-pro-vas/')).toBe(true);
    expect(isPrerenderedOnlyPath('/kviz/poznas-znacku/')).toBe(true);
    expect(isPrerenderedOnlyPath(QUIZ_LOCALIZED)).toBe(false);
    expect(isPrerenderedOnlyPath('/kviz/')).toBe(false);
    expect(localizeInternalHref('sk', QUIZ_CS_ONLY)).toBe(QUIZ_CS_ONLY);
    expect(localizeInternalHref('sk', QUIZ_LOCALIZED)).toBe('/sk/kviz/historie-znacek/');
  });

  it('původní prefixová cesta funguje beze změny', () => {
    expect(isPrerenderedOnlyPath('/data/prodeje-techniky')).toBe(true);
    expect(isPrerenderedOnlyPath('/data/prodeje-techniky/2024/')).toBe(true);
    expect(isPrerenderedOnlyPath('/data/')).toBe(false);
  });
});
