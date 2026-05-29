import { describe, it, expect } from 'vitest';
import { SLOVNIK, KATEGORIE_LABELS } from '../../src/lib/slovnik';

describe('slovník — včelařství', () => {
  it('má label pro kategorii vcelarstvi', () => {
    expect(KATEGORIE_LABELS.vcelarstvi).toBeTruthy();
  });
  it('obsahuje alespoň 50 včelařských hesel', () => {
    const bee = SLOVNIK.filter((t) => t.kategorie === 'vcelarstvi');
    expect(bee.length).toBeGreaterThanOrEqual(50);
  });
  it('všechny slugy v SLOVNIKu jsou unikátní', () => {
    const slugs = SLOVNIK.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('related odkazy včelařských hesel se resolvují', () => {
    const known = new Set(SLOVNIK.map((t) => t.slug));
    for (const t of SLOVNIK.filter((x) => x.kategorie === 'vcelarstvi')) {
      for (const r of t.related ?? []) expect(known.has(r), `${t.slug} → ${r}`).toBe(true);
    }
  });
});
