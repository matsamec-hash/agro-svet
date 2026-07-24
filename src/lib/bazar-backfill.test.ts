import { describe, it, expect } from 'vitest';
import { mergeBackfillAttributes } from './bazar-backfill';

describe('mergeBackfillAttributes', () => {
  it('doplní chybějící klíče, existující NEPŘEPÍŠE (default)', () => {
    const out = mergeBackfillAttributes({ klimatizace: true }, { klimatizace: false as any, pohon: '4x4' }, false);
    expect(out).toEqual({ klimatizace: true, pohon: '4x4' });
  });
  it('s force přepíše i existující', () => {
    const out = mergeBackfillAttributes({ pohon: '2x4' }, { pohon: '4x4' }, true);
    expect(out).toEqual({ pohon: '4x4' });
  });
  it('vrátí null když se nic nezměnilo (žádný zápis)', () => {
    expect(mergeBackfillAttributes({ pohon: '4x4' }, { pohon: '4x4' }, false)).toBeNull();
    expect(mergeBackfillAttributes({ klimatizace: true }, {}, false)).toBeNull();
  });
  it('funguje z prázdného výchozího stavu', () => {
    expect(mergeBackfillAttributes({}, { tp_spz: true }, false)).toEqual({ tp_spz: true });
    expect(mergeBackfillAttributes(null as any, { tp_spz: true }, false)).toEqual({ tp_spz: true });
  });
});
