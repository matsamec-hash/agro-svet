// @vitest-environment node
// tests/kontakt.test.ts
// Kontaktní formulář /kontakt/ — druhá elektronická cesta vedle e-mailu, kterou
// chce Impressum (§ 5 DDG / § 5 ECG, SDEU C-298/07). Hlídá:
//  - API: honeypot, validaci, throttle, 303 zpátky do jazyka odesílatele,
//    že e-mail jde JEN provozovateli (žádná otevřená relay) a že selhání
//    Resendu nekončí 500, ale hláškou,
//  - texty ve všech pěti jazycích,
//  - launch pro sk/uk/pl/de, sitemapu ve shodě s /dsa-kontakt a odkaz v patičce.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const send = vi.hoisted(() => vi.fn());
vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

import { POST, THROTTLE_MAX } from '../src/pages/api/kontakt';
import { normalizePageUrl } from '../src/lib/kontakt-email';
import {
  content,
  kontaktCopy,
  KONTAKT_TOPICS,
  KONTAKT_ERRORS,
  KONTAKT_LIMITS,
  type KontaktCopy,
} from '../src/i18n/kontakt';
import { locales } from '../src/i18n/config';
import { isLaunchedPath, navHref } from '../src/i18n/utils';
import { allowInMirror, MIRROR_LOCALES, type MirrorContext } from '../src/lib/sitemap-mirror';

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p), 'utf8');

// Throttle drží stav v paměti procesu → každý test má vlastní IP.
let ipSeq = 0;
const nextIp = () => `203.0.113.${++ipSeq}`;

const VALID = {
  locale: 'de',
  topic: 'general',
  name: 'Hans Müller',
  email: 'hans@example.de',
  url: 'https://agro-svet.cz/de/stroje/',
  message: 'Guten Tag, ich habe eine Frage zum Katalog.',
  website: '',
};

async function submit(fields: Partial<Record<keyof typeof VALID, string>> = {}, ip = nextIp()): Promise<Response> {
  const body = new URLSearchParams({ ...VALID, ...fields } as Record<string, string>);
  const request = new Request('https://agro-svet.cz/api/kontakt/', {
    method: 'POST',
    body, // application/x-www-form-urlencoded — přesně to, co pošle <form method="POST">
    headers: { 'cf-connecting-ip': ip },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return POST({ request, locals: {}, clientAddress: '127.0.0.1' } as any) as Promise<Response>;
}

function location(res: Response): URL {
  return new URL(res.headers.get('location') ?? 'about:blank');
}

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: 'email_1' }, error: null });
  process.env.RESEND_API_KEY = 're_test_key';
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
  vi.restoreAllMocks();
});

describe('POST /api/kontakt/ — úspěch a přesměrování', () => {
  it('platná zpráva: 303 na /de/kontakt/?ok=1 a jeden e-mail provozovateli', async () => {
    const res = await submit();
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('https://agro-svet.cz/de/kontakt/?ok=1#formular');
    expect(send).toHaveBeenCalledTimes(1);
    const mail = send.mock.calls[0][0];
    expect(mail.to).toBe('info@samecdigital.com');
    expect(mail.from).toMatch(/<[^@>]+@mail\.agro-svet\.cz>$/);
    expect(mail.replyTo).toBe('hans@example.de');
    expect(mail.subject).toBe('[Kontakt de] Obecný dotaz — Hans Müller');
    expect(mail.html).toContain('https://agro-svet.cz/de/stroje/');
    expect(mail.text).toContain('Guten Tag, ich habe eine Frage zum Katalog.');
  });

  it('cs nemá prefix; neznámé nebo chybějící locale spadne na cs', async () => {
    expect(location(await submit({ locale: 'cs' })).pathname).toBe('/kontakt/');
    expect(location(await submit({ locale: 'xx' })).pathname).toBe('/kontakt/');
    for (const l of ['sk', 'pl', 'uk'] as const) {
      expect(location(await submit({ locale: l })).pathname).toBe(`/${l}/kontakt/`);
    }
  });

  it('bez jména je v předmětu e-mail odesílatele', async () => {
    await submit({ name: '', locale: 'pl', topic: 'rights' });
    expect(send.mock.calls[0][0].subject).toBe(
      '[Kontakt pl] Porušení práv (autorská práva, práva k fotografiím, ochranné známky) — hans@example.de',
    );
  });

  it('odpověď má měnitelné hlavičky (middleware do nich zapisuje bezpečnostní hlavičky)', async () => {
    const res = await submit();
    expect(() => res.headers.set('X-Frame-Options', 'DENY')).not.toThrow();
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('obsah zprávy je v HTML e-mailu escapovaný, odřádkování jména neproteče do předmětu', async () => {
    await submit({ message: '<script>alert(1)</script> & "uvozovky"', name: 'Eva\r\nBcc: x@y.cz' });
    const mail = send.mock.calls[0][0];
    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;uvozovky&quot;');
    expect(mail.subject).not.toMatch(/[\r\n]/);
    expect(mail.subject).toContain('Eva Bcc: x@y.cz');
  });

  it('návštěvníkovi se nic neposílá — jediný adresát je provozovatel', async () => {
    await submit({ email: 'victim@example.com' });
    expect(send).toHaveBeenCalledTimes(1);
    const mail = send.mock.calls[0][0];
    expect([mail.to].flat()).toEqual(['info@samecdigital.com']);
    expect(mail.cc).toBeUndefined();
    expect(mail.bcc).toBeUndefined();
  });
});

describe('POST /api/kontakt/ — honeypot a validace', () => {
  it('vyplněný honeypot předstírá úspěch a nic neodešle', async () => {
    const res = await submit({ website: 'https://spam.example' });
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('https://agro-svet.cz/de/kontakt/?ok=1#formular');
    expect(send).not.toHaveBeenCalled();
  });

  const cases: Array<[string, Partial<Record<keyof typeof VALID, string>>, string]> = [
    ['chybějící e-mail', { email: '' }, 'email'],
    ['neplatný e-mail', { email: 'hans@' }, 'email'],
    ['e-mail s mezerou', { email: 'hans müller@example.de' }, 'email'],
    ['krátká zpráva', { message: 'Ahoj' }, 'message-short'],
    ['zpráva jen z mezer', { message: '            ' }, 'message-short'],
    ['dlouhá zpráva', { message: 'x'.repeat(KONTAKT_LIMITS.messageMax + 1) }, 'message-long'],
    ['neznámé téma', { topic: 'reklama' }, 'topic'],
    ['chybějící téma', { topic: '' }, 'topic'],
    ['javascript: URL', { url: 'javascript:alert(1)' }, 'url'],
    ['nesmyslná URL', { url: 'není to adresa' }, 'url'],
    ['dlouhé jméno', { name: 'x'.repeat(KONTAKT_LIMITS.nameMax + 1) }, 'name'],
  ];
  for (const [label, fields, code] of cases) {
    it(`${label} → err=${code}, nic se neodešle`, async () => {
      const res = await submit(fields);
      expect(res.status).toBe(303);
      const loc = location(res);
      expect(loc.pathname).toBe('/de/kontakt/');
      expect(loc.searchParams.get('err')).toBe(code);
      expect(loc.searchParams.get('ok')).toBeNull();
      expect(send).not.toHaveBeenCalled();
    });
  }

  it('URL a jméno jsou nepovinné', async () => {
    const res = await submit({ url: '', name: '' });
    expect(location(res).searchParams.get('ok')).toBe('1');
  });

  it('URL bez schématu se doplní na https://', async () => {
    expect(normalizePageUrl('agro-svet.cz/stroje/')).toBe('https://agro-svet.cz/stroje/');
    expect(normalizePageUrl('ftp://agro-svet.cz/')).toBe('');
    expect(normalizePageUrl('localhost')).toBe('');
  });

  it('CRLF z textarey se počítá jako jeden znak (jako maxlength v prohlížeči)', async () => {
    const lf = Array.from({ length: 40 }, () => 'a'.repeat(99)).join('\n'); // 40×99 + 39 = 3 999 znaků
    expect(lf.length).toBeLessThanOrEqual(KONTAKT_LIMITS.messageMax);
    const crlf = lf.replace(/\n/g, '\r\n'); // 4 038 znaků — bez normalizace by neprošla
    expect(crlf.length).toBeGreaterThan(KONTAKT_LIMITS.messageMax);
    const res = await submit({ message: crlf });
    expect(location(res).searchParams.get('ok')).toBe('1');
  });

  it('ne-formulářové tělo nespadne na 500', async () => {
    const request = new Request('https://agro-svet.cz/api/kontakt/', {
      method: 'POST',
      body: '{"a":1}',
      headers: { 'content-type': 'application/json' },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = (await POST({ request, locals: {}, clientAddress: '127.0.0.1' } as any)) as Response;
    expect(res.status).toBe(303);
    expect(location(res).searchParams.get('err')).toBe('server');
    expect(send).not.toHaveBeenCalled();
  });
});

describe('POST /api/kontakt/ — throttle a selhání odeslání', () => {
  it(`po ${THROTTLE_MAX} zprávách z jedné IP → err=rate; jiná IP projde`, async () => {
    const ip = nextIp();
    for (let i = 0; i < THROTTLE_MAX; i++) {
      expect(location(await submit({}, ip)).searchParams.get('ok')).toBe('1');
    }
    const blocked = await submit({}, ip);
    expect(location(blocked).searchParams.get('err')).toBe('rate');
    expect(send).toHaveBeenCalledTimes(THROTTLE_MAX);
    expect(location(await submit({}, nextIp())).searchParams.get('ok')).toBe('1');
  });

  it('neplatné odeslání z limitu neubírá', async () => {
    const ip = nextIp();
    for (let i = 0; i < THROTTLE_MAX + 2; i++) await submit({ email: 'spatne' }, ip);
    expect(location(await submit({}, ip)).searchParams.get('ok')).toBe('1');
  });

  it('chybějící RESEND_API_KEY → err=server, nic se neodešle', async () => {
    delete process.env.RESEND_API_KEY;
    const res = await submit();
    expect(location(res).searchParams.get('err')).toBe('server');
    expect(send).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('chyba z Resendu → err=server', async () => {
    send.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'nope' } });
    expect(location(await submit()).searchParams.get('err')).toBe('server');
  });

  it('výjimka z Resendu (síť) → err=server, ne 500', async () => {
    send.mockRejectedValue(new Error('ECONNRESET'));
    const res = await submit();
    expect(res.status).toBe(303);
    expect(location(res).searchParams.get('err')).toBe('server');
  });
});

describe('texty /kontakt/ ve všech jazycích', () => {
  const STRING_KEYS = (Object.keys(content.cs) as Array<keyof KontaktCopy>).filter(
    (k) => typeof content.cs[k] === 'string',
  );

  it('každý jazyk má vlastní blok se všemi klíči', () => {
    for (const l of locales) {
      const c = content[l];
      expect(c, l).toBeDefined();
      for (const k of STRING_KEYS) {
        if (k === 'csOnlyNote' || k === 'privacyAfter') continue;
        expect(c[k], `${l}.${k}`).toBeTruthy();
      }
      for (const t of KONTAKT_TOPICS) expect(c.topics[t], `${l}.topics.${t}`).toBeTruthy();
      for (const e of KONTAKT_ERRORS) expect(c.errors[e], `${l}.errors.${e}`).toBeTruthy();
    }
  });

  it('ne-cs jazyky nejsou zkopírovaná čeština', () => {
    for (const l of locales.filter((x) => x !== 'cs')) {
      for (const k of ['lead', 'submit', 'ok', 'formHeading', 'messageLabel', 'privacyBefore'] as const) {
        expect(content[l][k], `${l}.${k}`).not.toBe(content.cs[k]);
      }
      expect(content[l].errors.server, l).not.toBe(content.cs.errors.server);
      // Odkaz na bazar vede na českou stránku — ne-cs to musí říct.
      expect(content[l].csOnlyNote.trim(), l).not.toBe('');
    }
    expect(content.cs.csOnlyNote).toBe('');
  });

  it('lhůta odpovědi „2 pracovní dny" je ve všech jazycích', () => {
    for (const l of locales) {
      expect(content[l].lead, l).toMatch(/\b2\b/);
      expect(content[l].ok, l).toMatch(/\b2\b/);
    }
  });

  it('neznámé locale dostane cs', () => {
    expect(kontaktCopy('xx')).toBe(content.cs);
  });
});

describe('/kontakt — launch, sitemapa, patička', () => {
  const ctx: MirrorContext = { articleMeta: new Map(), translatedIds: new Map(), howtoSlugs: new Map() };

  it('launchnuté pro sk, uk, pl, de → odkazy se lokalizují', () => {
    for (const l of ['sk', 'uk', 'pl', 'de'] as const) {
      expect(isLaunchedPath(l, '/kontakt'), l).toBe(true);
      expect(navHref(l, '/kontakt/'), l).toBe(`/${l}/kontakt/`);
    }
    expect(navHref('cs', '/kontakt/')).toBe('/kontakt/');
  });

  it('prefix /kontakt nepouští sousední cesty (/kontakty)', () => {
    expect(isLaunchedPath('de', '/kontakty')).toBe(false);
  });

  it('v sitemapě je cs URL a zrcadlí se do stejných jazyků jako /dsa-kontakt/', () => {
    expect(read('src/lib/sitemap-entries.ts')).toContain("['/kontakt/', 'yearly', '0.3', STATIC_LASTMOD]");
    for (const l of MIRROR_LOCALES) {
      expect(allowInMirror('/kontakt/', l, ctx), l).toBe(allowInMirror('/dsa-kontakt/', l, ctx));
      expect(allowInMirror('/kontakt/', l, ctx), l).toBe(true);
    }
  });

  it('patička odkazuje na /kontakt/, ne na mailto', () => {
    const footer = read('src/components/Footer.astro');
    expect(footer).toContain(`<a href={navHref(locale, '/kontakt/')}>{tr('footer.contact')}</a>`);
    expect(footer).not.toContain('mailto:info@samecdigital.com');
  });

  it('stránka posílá na /api/kontakt/ a jména polí sedí s API', () => {
    const page = read('src/pages/kontakt.astro');
    expect(page).toContain('action="/api/kontakt/"');
    for (const name of ['locale', 'topic', 'name', 'email', 'url', 'message', 'website']) {
      expect(page, name).toContain(`name="${name}"`);
    }
    expect(page).toContain('export const prerender = false');
  });

  it('stránka nenačítá nic cizího (žádný skript, žádný externí zdroj)', () => {
    const page = read('src/pages/kontakt.astro');
    expect(page).not.toMatch(/<script/i);
    expect(page).not.toMatch(/\b(src|href|action)="https?:\/\//i);
    expect(page).not.toMatch(/turnstile|recaptcha|hcaptcha/i);
  });
});
