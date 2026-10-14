import { describe, it, expect } from 'vitest';
import { serieSlug } from '../../src/lib/akce-supabase';

describe('serieSlug — řada ročníků podle slugu', () => {
  it('odřízne koncový rok', () => {
    expect(serieSlug('den-zemedelce-kamen-2026')).toBe('den-zemedelce-kamen');
    expect(serieSlug('kun-lysa-2027')).toBe('kun-lysa');
  });
  it('slug bez roku není řada', () => {
    expect(serieSlug('farmarske-trhy-brno')).toBeNull();
    expect(serieSlug('akce-1234')).toBeNull();
  });
});
