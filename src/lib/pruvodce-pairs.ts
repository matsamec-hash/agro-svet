// Comparator pair recommendations for /pruvodce/ hub pages.
// Returns specific /srovnani/[combo]/ deep links matching the power class
// covered by a buying guide — converts decision-stage readers into long-tail
// comparison searches.

import { expandedComparisonPairs, type ComparisonPair } from './comparator';

export interface PruvodcePairFilter {
  category: 'traktory' | 'kombajny';
  hpMin: number;
  hpMax: number;
  limit?: number;
}

export function pairsInPowerRange(filter: PruvodcePairFilter): ComparisonPair[] {
  const { category, hpMin, hpMax, limit = 5 } = filter;
  // expanded pool (~1500) covers mid- and lower-power ranges that the popular
  // topComparisonPairs(500) skip in favor of high-power flagships.
  return expandedComparisonPairs(1500)
    .filter((p) => p.a.category === category)
    .filter((p) => {
      const ah = p.a.power_hp;
      const bh = p.b.power_hp;
      return (
        ah !== null && bh !== null &&
        ah >= hpMin && ah <= hpMax &&
        bh >= hpMin && bh <= hpMax
      );
    })
    .slice(0, limit);
}
