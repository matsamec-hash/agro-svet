import { describe, expect, it } from 'vitest';
import { safeJsonLd } from './json-ld';

describe('safeJsonLd', () => {
  it('nenechá </script> z uživatelského textu ukončit skript', () => {
    const out = safeJsonLd({ name: 'x</script><img src=x onerror=alert(1)>' });
    expect(out).not.toContain('</script>');
    expect(out).not.toContain('<');
  });
  it('výstup je pořád platný JSON se stejným obsahem', () => {
    const value = { name: 'a</script>b', n: [1, 2], s: 'č š' };
    expect(JSON.parse(safeJsonLd(value))).toEqual(value);
  });
  it('podporuje odsazení jako JSON.stringify', () => {
    expect(safeJsonLd({ a: 1 }, null, 2)).toBe('{\n  "a": 1\n}');
  });
  it('undefined nevrátí undefined', () => {
    expect(safeJsonLd(undefined)).toBe('null');
  });
});
