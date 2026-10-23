import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { requireAdmin } from './require-admin';

function fakeAstro(user: { id: string } | null) {
  return {
    locals: { user },
    url: new URL('https://agro-svet.cz/admin/uzivatele/'),
    redirect: (to: string) => new Response(null, { status: 302, headers: { Location: to } }),
  } as any;
}

function fakeClient(row: { is_admin?: boolean } | null) {
  const dotazy: Array<[string, string]> = [];
  const chain: any = {
    select: () => chain,
    eq: (col: string, val: string) => { dotazy.push([col, val]); return chain; },
    maybeSingle: () => Promise.resolve({ data: row, error: null }),
  };
  return { client: () => ({ from: () => chain }) as any, dotazy };
}

describe('requireAdmin', () => {
  it('nepřihlášeného pošle na přihlášení a do databáze nesahá', async () => {
    const res = await requireAdmin(fakeAstro(null), () => { throw new Error('nemá se volat'); });
    expect(res?.status).toBe(302);
    expect(res?.headers.get('Location')).toBe('/bazar/prihlaseni/?redirect=%2Fadmin%2Fuzivatele%2F');
  });

  it('přihlášenému bez admina vrátí 403', async () => {
    const { client } = fakeClient({ is_admin: false });
    expect((await requireAdmin(fakeAstro({ id: 'U1' }), client))?.status).toBe(403);
  });

  it('chybějící řádek v bazar_users = 403', async () => {
    const { client } = fakeClient(null);
    expect((await requireAdmin(fakeAstro({ id: 'U1' }), client))?.status).toBe(403);
  });

  it('admina pustí a hledá podle jeho id', async () => {
    const { client, dotazy } = fakeClient({ is_admin: true });
    expect(await requireAdmin(fakeAstro({ id: 'U1' }), client)).toBeNull();
    expect(dotazy).toEqual([['id', 'U1']]);
  });
});

// Hlídá, aby nová admin stránka nespoléhala jen na middleware (únik 22. 10. 2026).
describe('každá stránka pod src/pages/admin', () => {
  const koren = join(__dirname, '../pages/admin');
  const stranky = (readdirSync(koren, { recursive: true }) as string[])
    .filter((f) => f.endsWith('.astro'))
    .sort();

  it('jich je víc než nula', () => {
    expect(stranky.length).toBeGreaterThan(0);
  });

  it.each(stranky)('%s si ověří admina dřív, než cokoli načte', (f) => {
    const zdroj = readFileSync(join(koren, f), 'utf8');
    const frontmatter = zdroj.split(/^---$/m)[1] ?? '';
    const strazce = frontmatter.indexOf('const zamitnuto = await requireAdmin(Astro);');
    expect(strazce, 'chybí `const zamitnuto = await requireAdmin(Astro);`').toBeGreaterThanOrEqual(0);
    expect(frontmatter).toContain('if (zamitnuto) return zamitnuto;');
    const prvniAwait = frontmatter.search(/\bawait\b/);
    expect(prvniAwait, 'requireAdmin musí být první await ve frontmatteru').toBe(strazce + 'const zamitnuto = '.length);
  });
});
