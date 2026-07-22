import { describe, it, expect } from 'vitest';
import { formatInvoiceNumber } from '../../src/lib/invoice-number';

describe('formatInvoiceNumber', () => {
  it('skládá YYYY-NNNN s nulami', () => {
    expect(formatInvoiceNumber(2026, 1)).toBe('2026-0001');
    expect(formatInvoiceNumber(2026, 42)).toBe('2026-0042');
    expect(formatInvoiceNumber(2026, 1234)).toBe('2026-1234');
  });
  it('>9999 nechá bez ořezu', () => {
    expect(formatInvoiceNumber(2026, 10000)).toBe('2026-10000');
  });
});
