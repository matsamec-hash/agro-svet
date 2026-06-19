import { describe, it, expect } from 'vitest';
import { getNav, getFooterColumns, HIDDEN_SECTIONS, HIDDEN_NEWS_CATEGORIES } from '../../src/i18n/nav';
import { isLaunchedPath } from '../../src/i18n/utils';

describe('pl nav konfigurace', () => {
  it('HIDDEN_SECTIONS.pl skrývá bazar/photo/tema/animals/farms/svet', () => {
    expect(HIDDEN_SECTIONS.pl).toEqual(['bazar', 'photo', 'tema', 'animals', 'farms', 'svet']);
  });
  it('HIDDEN_NEWS_CATEGORIES.pl = dotace/legislativa', () => {
    expect(HIDDEN_NEWS_CATEGORIES.pl).toEqual(['dotace', 'legislativa']);
  });
  it('pl tech dropdown ukazuje JEN launchnuté děti (žádné cs dead-linky)', () => {
    const nav = getNav('pl');
    const tech = nav.find((i) => i.section === 'tech');
    const hrefs = (tech?.children ?? []).map((c) => c.href);
    // launchnuté: /stroje/*, /znacky/, /srovnani/, /slovnik/
    expect(hrefs).toContain('/znacky/');
    expect(hrefs).toContain('/srovnani/');
    expect(hrefs).toContain('/slovnik/');
    // NElaunchnuté nesmí být v pl tech dropdownu:
    expect(hrefs).not.toContain('/zebricky/');
    expect(hrefs).not.toContain('/kviz/');
    expect(hrefs).not.toContain('/prodejci/');
  });
  it('pl nav neobsahuje skryté sekce (bazar/farmy/novinky/plemena)', () => {
    const sections = getNav('pl').map((i) => i.section);
    expect(sections).not.toContain('bazar');
    expect(sections).not.toContain('farms');
    expect(sections).not.toContain('tema');
    expect(sections).not.toContain('animals');
  });
  it('pl footer ukazuje JEN odkazy na launchnuté sekce (žádné cs dead-linky)', () => {
    const cols = getFooterColumns('pl');
    const allLinks = cols.flatMap((c) => c.links.map((l) => l.href));
    // každý footer odkaz musí být launchnutý pro pl (root '/' se ve footeru nevyskytuje)
    for (const href of allLinks) {
      const root = href.replace(/\/+$/, '') || '/';
      expect(isLaunchedPath('pl', root), `footer odkaz ${href} musí být pl-launchnutý`).toBe(true);
    }
    // konkrétně: /novinky/ a /plemena/ (cs-only) NESMÍ být v pl footeru
    expect(allLinks).not.toContain('/novinky/');
    expect(allLinks).not.toContain('/plemena/');
    // /stroje/ a /slovnik/ (launchnuté) tam být MOHOU — ověř, že aspoň /stroje/ je
    expect(allLinks).toContain('/stroje/');
  });
});
