import { describe, it, expect } from 'vitest';
import { useCaseDescription } from '../../src/lib/competitor-finder';

describe('useCaseDescription locale', () => {
  it('cs (default) beze změny', () => {
    expect(useCaseDescription('traktory', 40, 'cs')).toContain('Kompaktní traktor');
  });
  it('uk = cyrilice', () => {
    expect(useCaseDescription('traktory', 40, 'uk')).toMatch(/[Ѐ-ӿ]/);
  });
  it('null kategorie/power → null', () => {
    expect(useCaseDescription('pluhy' as any, 100, 'uk')).toBeNull();
  });
});
