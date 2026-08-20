import { describe, it, expect } from 'vitest';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { isLockedSectionPath } from '../../src/i18n/nav';
import {
  getAllVcely, getAllVybaveni, getAllMed,
  vcelaTemperamentLabel, vcelaVynosLabel, vcelaRojivostLabel,
  medKrystalizaceLabel, vybaveniKategorieLabel, medTypLabel,
} from '../../src/lib/vcelarstvi';

describe('PL fáze 1 launch (stroje/znacky/srovnani/slovnik)', () => {
  const launched = ['/stroje', '/znacky', '/srovnani', '/slovnik'];
  it('4 sekce jsou launchnuté pro pl', () => {
    for (const p of launched) {
      expect(LAUNCHED_PREFIXES.pl).toContain(p);
      expect(isLaunchedPath('pl', p)).toBe(true);
      expect(isLaunchedPath('pl', `${p}/cokoli/`)).toBe(true);
    }
  });
  it('/encyklopedie je launchnuté pro pl (encyklopediePl overlay, 42 md)', () => {
    expect(isLaunchedPath('pl', '/encyklopedie')).toBe(true);
    expect(isLaunchedPath('pl', '/encyklopedie/fendt-724-vario/')).toBe(true);
  });
  it('zbylé jurisdikční / cs-only sekce NEjsou launchnuté pro pl', () => {
    // /dotace + /jak-na-to = PL má vlastní dotační/how-to obsah (jiná jurisdikce).
    // /novinky už launchnuté NENÍ v tomhle seznamu — PL výpis servíruje jen reálně
    // přeložené články (article_translations), takže žádný cs leak.
    for (const p of ['/dotace', '/jak-na-to']) {
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

describe('PL launch /vcelarstvi (pl YAML overlay)', () => {
  it('/vcelarstvi je launchnuté pro pl', () => {
    expect(LAUNCHED_PREFIXES.pl).toContain('/vcelarstvi');
    expect(isLaunchedPath('pl', '/vcelarstvi')).toBe(true);
    for (const p of ['/vcelarstvi/druhy/kranska/', '/vcelarstvi/vybaveni/medomet/', '/vcelarstvi/med/pohankovy/']) {
      expect(isLaunchedPath('pl', p)).toBe(true);
    }
  });
  it('pl overlay má stejnou množinu slugů jako cs (pořadí se liší — řadí se dle locale)', () => {
    const slugs = (arr: { slug: string }[]) => [...arr.map((v) => v.slug)].sort();
    expect(slugs(getAllVcely('pl'))).toEqual(slugs(getAllVcely('cs')));
    expect(slugs(getAllVybaveni('pl'))).toEqual(slugs(getAllVybaveni('cs')));
    expect(slugs(getAllMed('pl'))).toEqual(slugs(getAllMed('cs')));
  });
  it('enum hodnoty + obrázky zůstávají v pl kanonicky české (klíče pro CSS/JSON-LD)', () => {
    const plBySlug = new Map(getAllVcely('pl').map((v) => [v.slug, v]));
    for (const c of getAllVcely('cs')) {
      const p = plBySlug.get(c.slug)!;
      expect(p.temperament).toBe(c.temperament);
      expect(p.medny_vynos).toBe(c.medny_vynos);
      expect(p.rojivost).toBe(c.rojivost);
      expect(p.image_url).toBe(c.image_url);
    }
    const medBySlug = new Map(getAllMed('pl').map((v) => [v.slug, v]));
    for (const c of getAllMed('cs')) {
      expect(medBySlug.get(c.slug)!.typ).toBe(c.typ);
      expect(medBySlug.get(c.slug)!.krystalizace).toBe(c.krystalizace);
    }
    const vybBySlug = new Map(getAllVybaveni('pl').map((v) => [v.slug, v]));
    for (const c of getAllVybaveni('cs')) {
      expect(vybBySlug.get(c.slug)!.kategorie).toBe(c.kategorie);
      expect(vybBySlug.get(c.slug)!.pro_zacatecniky).toBe(c.pro_zacatecniky);
    }
  });
  it('pl próza je skutečně přeložená (ne cs fallback)', () => {
    const plBySlug = new Map(getAllVcely('pl').map((v) => [v.slug, v]));
    for (const c of getAllVcely('cs')) {
      // description se musí lišit vždy; `name` ne u vlastních jmen (Buckfast).
      expect(plBySlug.get(c.slug)!.description).not.toBe(c.description);
    }
    expect(plBySlug.get('kranska')!.name).toBe('Pszczoła kraińska');
    expect(getAllMed('pl').find((m) => m.slug === 'pohankovy')?.name).toBe('Miód gryczany');
    expect(getAllVybaveni('pl').find((v) => v.slug === 'medomet')?.name).toBe('Miodarka');
  });
  it('enum labely se překládají do pl (data zůstávají česky)', () => {
    expect(vcelaTemperamentLabel('mírná', 'pl')).toBe('łagodny');
    expect(vcelaVynosLabel('velmi vysoký', 'pl')).toBe('bardzo wysoka');
    expect(vcelaRojivostLabel('vyšší', 'pl')).toBe('wyższa');
    expect(medKrystalizaceLabel('rychlá', 'pl')).toBe('szybka');
    expect(vybaveniKategorieLabel('zpracovani', 'pl')).toBe('Przetwarzanie miodu');
    expect(medTypLabel('medovicovy', 'pl')).toBe('Spadziowy');
    // cs/sk beze změny
    expect(vcelaTemperamentLabel('mírná', 'cs')).toBe('mírná');
    expect(vcelaTemperamentLabel('mírná', 'sk')).toBe('mierna');
  });
  it('/vcelarstvi není locked', () => {
    expect(isLockedSectionPath('/vcelarstvi')).toBe(false);
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
