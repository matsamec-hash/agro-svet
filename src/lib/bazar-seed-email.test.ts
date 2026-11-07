import { describe, it, expect, vi } from 'vitest';
import { buildClaimEmail, claimUrl, sendClaimEmail } from './bazar-seed-email';
import { BAZAR_CLAIM_EMAIL_ENABLED } from './config';

const resendSend = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: resendSend };
  },
}));

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

describe('sendClaimEmail', () => {
  it('při vypnuté vlajce nic neodešle (příjemci se neregistrovali, bez souhlasu a odhlášení)', async () => {
    expect(BAZAR_CLAIM_EMAIL_ENABLED).toBe(false);
    const ok = await sendClaimEmail('re_test_key', 'prodejce@example.cz', {
      name: 'Jan',
      token: 'ABC',
      listingTitle: 'Traktor Zetor',
    });
    expect(ok).toBe(false);
    expect(resendSend).not.toHaveBeenCalled();
  });
});
