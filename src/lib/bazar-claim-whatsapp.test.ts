import { describe, it, expect } from 'vitest';
import {
  normalizeCzPhone,
  buildClaimWhatsAppMessage,
  claimWhatsAppUrl,
} from './bazar-claim-whatsapp';

describe('normalizeCzPhone', () => {
  it('formats a bare 9-digit CZ number as +420', () => {
    expect(normalizeCzPhone('601234567')).toBe('420601234567');
    expect(normalizeCzPhone('601 234 567')).toBe('420601234567');
  });

  it('keeps an existing +420 / 420 prefix (strips punctuation)', () => {
    expect(normalizeCzPhone('+420 601 234 567')).toBe('420601234567');
    expect(normalizeCzPhone('420601234567')).toBe('420601234567');
  });

  it('drops a 00 international prefix', () => {
    expect(normalizeCzPhone('00420601234567')).toBe('420601234567');
  });

  it('supports Slovak +421', () => {
    expect(normalizeCzPhone('+421905123456')).toBe('421905123456');
  });

  it('returns null for junk / too short', () => {
    expect(normalizeCzPhone('12345')).toBeNull();
    expect(normalizeCzPhone('')).toBeNull();
    expect(normalizeCzPhone(null)).toBeNull();
    expect(normalizeCzPhone('telefon dohodou')).toBeNull();
  });
});

describe('buildClaimWhatsAppMessage', () => {
  it('includes name, listing title and url', () => {
    const msg = buildClaimWhatsAppMessage({ name: 'Jan', listingTitle: 'Zetor 7245', url: 'https://agro-svet.cz/bazar/prevzit/tok' });
    expect(msg).toContain('Jan');
    expect(msg).toContain('Zetor 7245');
    expect(msg).toContain('https://agro-svet.cz/bazar/prevzit/tok');
  });

  it('works without name / title (generic)', () => {
    const msg = buildClaimWhatsAppMessage({ url: 'https://x/y' });
    expect(msg).toContain('Dobrý den,');
    expect(msg).toContain('https://x/y');
  });
});

describe('claimWhatsAppUrl', () => {
  it('builds a wa.me link with url-encoded message', () => {
    const url = claimWhatsAppUrl('601234567', 'ahoj & test');
    expect(url).toBe('https://wa.me/420601234567?text=ahoj%20%26%20test');
  });

  it('returns null when phone cannot be normalised', () => {
    expect(claimWhatsAppUrl('dohodou', 'x')).toBeNull();
    expect(claimWhatsAppUrl(null, 'x')).toBeNull();
  });
});
