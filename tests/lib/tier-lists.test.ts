import { describe, it, expect } from 'vitest';
import { TIER_LISTS, getTierList, rankForTierList } from '../../src/lib/tier-lists';

const NEW_SLUGS = [
  'nejsirsi-diskove-podmitace',
  'nejsirsi-radlickove-podmitace',
  'nejsirsi-seci-kombinace',
  'nejsirsi-pneumaticke-seci-stroje',
  'nejsirsi-presne-seci-stroje',
  'nejsirsi-kyprice',
  'nejsirsi-zaci-stroje',
  'nejvykonnejsi-samojizdne-rezacky',
];

describe('tier-lists nářadí', () => {
  it('má 8 nových nářaďových žebříčků', () => {
    for (const s of NEW_SLUGS) expect(getTierList(s), s).toBeTruthy();
  });

  it('každý nový žebříček vrací ≥1 model, score sestupně', () => {
    for (const s of NEW_SLUGS) {
      const def = getTierList(s)!;
      const ranked = rankForTierList(def);
      expect(ranked.length, s).toBeGreaterThan(0);
      for (let i = 1; i < ranked.length; i++) {
        expect(def.score(ranked[i - 1].model)).toBeGreaterThanOrEqual(def.score(ranked[i].model));
      }
    }
  });

  it('záběrové žebříčky obsahují jen modely té effective_category se záběrem', () => {
    const def = getTierList('nejsirsi-diskove-podmitace')!;
    const ranked = rankForTierList(def);
    for (const r of ranked) {
      expect(r.model.effective_category).toBe('podmitace-diskove');
      expect(r.model.pracovni_zaber_m).not.toBeNull();
    }
  });

  it('stávající traktorové/kombajnové žebříčky stále fungují (effective_category fix je zpětně kompatibilní)', () => {
    const t = getTierList('traktory-nad-250-koni')!;
    const k = getTierList('kombajny-nejvykonnejsi')!;
    expect(rankForTierList(t).length).toBeGreaterThan(0);
    expect(rankForTierList(k).length).toBeGreaterThan(0);
    for (const r of rankForTierList(t)) expect(r.model.effective_category).toBe('traktory');
  });
});
