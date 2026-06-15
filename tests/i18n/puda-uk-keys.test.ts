import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';

const REQUIRED = [
  'puda.uk.crumbHome', 'puda.uk.crumbSelf', 'puda.back',
  'puda.uk.h.reforma', 'puda.uk.h.cena', 'puda.uk.h.najem',
  'puda.uk.h.plodiny', 'puda.uk.h.ohrozeni', 'puda.uk.sources.h',
];

describe('uk puda i18n keys', () => {
  it('všechny požadované klíče existují v uk slovníku', () => {
    for (const k of REQUIRED) {
      expect(ui.uk[k], `chybí uk klíč ${k}`).toBeTruthy();
    }
  });
});
