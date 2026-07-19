import { describe, it, expect } from 'vitest';
import { buildClaimEmail, claimUrl } from './bazar-seed-email';

describe('claimUrl', () => {
  it('sestaví absolutní odkaz s tokenem', () => {
    expect(claimUrl('ABC')).toBe('https://agro-svet.cz/bazar/prevzit/ABC');
  });
});

describe('buildClaimEmail', () => {
  it('obsahuje jméno, odkaz a je HTML', () => {
    const { subject, html } = buildClaimEmail({ name: 'Jan', token: 'ABC', listingTitle: 'Traktor Zetor' });
    expect(subject).toContain('Traktor Zetor');
    expect(html).toContain('Jan');
    expect(html).toContain('https://agro-svet.cz/bazar/prevzit/ABC');
  });
});
