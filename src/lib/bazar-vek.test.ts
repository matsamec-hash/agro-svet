import { describe, it, expect } from 'vitest';
import { bazarVekVeta, BAZAR_VEK_VETA } from './bazar-vek';
import { locales } from '../i18n/config';

describe('bazarVekVeta', () => {
  it('má větu o 15 letech ve všech jazycích', () => {
    for (const l of locales) {
      expect(BAZAR_VEK_VETA[l], l).toContain('15');
    }
  });
  it('polsky přirozeně', () => {
    expect(bazarVekVeta('pl')).toBe('Rejestrując się, potwierdzasz, że masz co najmniej 15 lat.');
  });
  it('bez locale spadne na češtinu', () => {
    expect(bazarVekVeta(undefined)).toBe('Registrací potvrzujete, že vám je alespoň 15 let.');
  });
});
