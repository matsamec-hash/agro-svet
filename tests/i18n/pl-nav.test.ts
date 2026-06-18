import { describe, it, expect } from 'vitest';
import { getNav, HIDDEN_SECTIONS, HIDDEN_NEWS_CATEGORIES } from '../../src/i18n/nav';

describe('pl nav konfigurace', () => {
  it('HIDDEN_SECTIONS.pl skrývá bazar/photo/tema/animals/farms', () => {
    expect(HIDDEN_SECTIONS.pl).toEqual(['bazar', 'photo', 'tema', 'animals', 'farms']);
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
});
