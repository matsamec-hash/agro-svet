import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';

const REQUIRED = [
  'dotace.uk.h.howItWorks', 'dotace.uk.h.programs', 'dotace.uk.h.donors',
  'dotace.uk.sources.h', 'dotace.uk.pills.start',
  'dotace.uk.card.eligibility', 'dotace.uk.card.amount',
];

describe('uk dotace i18n keys', () => {
  it('všechny požadované dotace.uk.* klíče existují', () => {
    for (const k of REQUIRED) {
      expect(ui.uk[k], `chybí uk klíč ${k}`).toBeTruthy();
    }
  });
});
