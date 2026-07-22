import { describe, it, expect } from 'vitest';
import { buildInvoicePdf } from '../../src/lib/invoice-pdf';

describe('buildInvoicePdf', () => {
  it('vygeneruje neprázdné PDF s diakritikou (font embedding nespadne)', async () => {
    const bytes = await buildInvoicePdf({
      invoiceNumber: '2026-0001', issueDate: new Date('2026-07-22'),
      planLabel: '30 dní', days: 30, amountCzk: 249, vs: 10000001,
      buyerName: 'Žluťoučký Kůň', buyerEmail: 'test@example.cz',
    });
    expect(bytes.length).toBeGreaterThan(1000);
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe('%PDF');
  });
});
