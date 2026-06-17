import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';

const REQUIRED = [
  'stat.uk.h.produkce', 'stat.uk.h.valka',
  'stat.uk.h.ceny', 'stat.uk.sources.h', 'stat.uk.pills.temata',
  'stat.uk.prod.production', 'stat.uk.prod.export',
];

describe('uk statistiky i18n keys', () => {
  it('všechny požadované stat.uk.* klíče existují', () => {
    for (const k of REQUIRED) {
      expect(ui.uk[k], `chybí uk klíč ${k}`).toBeTruthy();
    }
  });
});
