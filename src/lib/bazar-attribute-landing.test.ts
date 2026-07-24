import { describe, it, expect } from 'vitest';
import { landingEntriesForCategory, parseAttributeLandingSlug, attributeLandingTitle } from './bazar-attribute-landing';

describe('landingEntriesForCategory', () => {
  it('vrací jen seoLanding atributy platné pro kategorii, enum rozgeneruje po hodnotách', () => {
    const e = landingEntriesForCategory('traktory');
    const slugs = e.map((x) => x.slug);
    expect(slugs).toContain('klimatizace');       // bool
    expect(slugs).toContain('pohon-4x4');         // enum hodnota
    expect(slugs).toContain('pohon-2x4');
    expect(slugs).toContain('celni_nakladac');
    expect(slugs).toContain('tp_spz');
  });
  it('u nestrojní kategorie nevrací strojní landingy', () => {
    expect(landingEntriesForCategory('zvirata').map((x) => x.slug)).not.toContain('klimatizace');
  });
});

describe('parseAttributeLandingSlug', () => {
  it('bool slug → filtr { klimatizace: true }', () => {
    expect(parseAttributeLandingSlug('klimatizace', 'traktory')?.filter).toEqual({ klimatizace: true });
  });
  it('enum slug → filtr { pohon: "4x4" }', () => {
    expect(parseAttributeLandingSlug('pohon-4x4', 'traktory')?.filter).toEqual({ pohon: '4x4' });
  });
  it('neznámý/neseoLanding slug → null', () => {
    expect(parseAttributeLandingSlug('prevodovka-manual', 'traktory')).toBeNull(); // prevodovka nemá seoLanding
    expect(parseAttributeLandingSlug('nesmysl', 'traktory')).toBeNull();
  });
  it('atribut cizí kategorii → null', () => {
    expect(parseAttributeLandingSlug('klimatizace', 'zvirata')).toBeNull();
  });
});

describe('attributeLandingTitle', () => {
  it('složí čitelný titulek', () => {
    const t = attributeLandingTitle('traktory', parseAttributeLandingSlug('klimatizace', 'traktory')!);
    expect(t.toLowerCase()).toContain('traktory');
    expect(t.toLowerCase()).toContain('klimatiz');
  });
});
