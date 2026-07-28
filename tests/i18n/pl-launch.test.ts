import { describe, it, expect } from 'vitest';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';

describe('PL fáze 1 launch (stroje/znacky/srovnani/slovnik)', () => {
  const launched = ['/stroje', '/znacky', '/srovnani', '/slovnik'];
  it('4 sekce jsou launchnuté pro pl', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.pl).toContain(p);
      expect(isLaunchedPath('pl', p)).toBe(true);
      expect(isLaunchedPath('pl', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('zbylé jurisdikční / cs-only sekce NEjsou launchnuté pro pl', () => {
    // /dotace + /jak-na-to = PL má vlastní dotační/how-to obsah (jiná jurisdikce);
    // /encyklopedie = per-locale overlay kolekce `encyklopediePl` neexistuje →
    // launch by 404-oval; /novinky = české články.
    for (const p of ['/dotace', '/jak-na-to', '/encyklopedie', '/novinky']) {
      expect(isLaunchedPath('pl', p)).toBe(false);
    }
  });
  it('cs nikdy nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/slovnik/adblue/')).toBe(false);
  });
  it('launchnuté nejsou locked', () => {
    for (const p of launched) expect(isLockedSectionPath(p)).toBe(false);
  });
});

describe('PL fáze 2 launch (statistiky + data hub)', () => {
  const launched = ['/statistiky', '/data'];
  it('datová sekce je launchnutá pro pl (česká data v PL jazyce)', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.pl).toContain(p);
      expect(isLaunchedPath('pl', p)).toBe(true);
      expect(isLaunchedPath('pl', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('/statistiky komodita podcesta je launchnutá (hub indexovatelný; detail noindex řeší stránka)', () => {
    expect(isLaunchedPath('pl', '/statistiky/komodita/psenice/')).toBe(true);
  });
  it('datová sekce není locked', () => {
    for (const p of launched) expect(isLockedSectionPath(p)).toBe(false);
  });
});

describe('PL fáze 2 launch (univerzální kalkulačky-převodníky)', () => {
  it('2 převodníky (plocha/hmotnost) jsou launchnuté — bez jurisdikce', () => {
    for (const p of ['/kalkulacka/prevody-jednotek', '/kalkulacka/prevody-hmotnost']) {
      expect(isLaunchedPath('pl', p)).toBe(true);
      expect(isLaunchedPath('pl', `${p}/`)).toBe(true);
    }
  });
  it('finanční kalkulačky + hub NEjsou launchnuté (jurisdikční / české ceny)', () => {
    for (const p of ['/kalkulacka', '/kalkulacka/leasing-traktoru', '/kalkulacka/naklady-na-hektar', '/kalkulacka/uspora-nafty', '/kalkulacka/dotace-cap']) {
      expect(isLaunchedPath('pl', p)).toBe(false);
    }
  });
});

describe('PL fáze 3 launch (puda)', () => {
  it('/puda je launchnuté pro pl', () => {
    expect(LAUNCHED_PREFIXES.pl).toContain('/puda');
    expect(isLaunchedPath('pl', '/puda')).toBe(true);
    expect(isLaunchedPath('pl', '/puda/eroze/')).toBe(true);
  });
  it('/puda není locked sekce', () => {
    expect(isLockedSectionPath('/puda')).toBe(false);
  });
  it('cs /puda nedostane gating-noindex', () => {
    expect(isLaunchedPath('cs', '/puda/eroze/')).toBe(false);
  });
});
