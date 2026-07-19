import type { APIRoute } from 'astro';
import { createServerClient } from '../../../../../lib/supabase';
import { getEnvVar } from '../../../../../lib/env';
import { parseBazosListing } from '../../../../../lib/bazar-import-parse';
import { suggestCategory } from '../../../../../lib/bazar-import-category';
import { rewriteListing } from '../../../../../lib/bazar-import-rewrite';
import { createProspectWithDraft } from '../../../../../lib/bazar-seed';

export const prerender = false;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

async function downloadImages(supabase: ReturnType<typeof createServerClient>, urls: string[]): Promise<string[]> {
  const paths: string[] = [];
  for (const [i, url] of urls.slice(0, 5).entries()) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = new Uint8Array(await res.arrayBuffer());
      const ext = (url.split('.').pop() || 'jpg').split('?')[0].slice(0, 4);
      const path = `seed/${crypto.randomUUID()}-${i}.${ext}`;
      const { error } = await supabase.storage.from('bazar-images').upload(path, buf, {
        contentType: res.headers.get('content-type') || 'image/jpeg',
      });
      if (!error) paths.push(path);
    } catch { /* přeskoč nevalidní obrázek */ }
  }
  return paths;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return json({ error: 'unauthenticated' }, 401);

  const supabase = createServerClient();

  // Defense in depth — middleware /admin/* už checkuje is_admin (locals.user
  // nemá is_admin, ten žije v bazar_users; viz ostatní admin API routy).
  const { data: profile } = await supabase
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!(profile as { is_admin?: boolean } | null)?.is_admin) return json({ error: 'forbidden' }, 403);

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === 'string' ? body.url.trim() : '';
  const contact = body?.contact ?? {};
  if (!/^https?:\/\/.*bazos\.cz/i.test(url)) return json({ error: 'Zadejte platný odkaz na bazos.cz' }, 400);

  const pageRes = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (agro-svet import)' } });
  if (!pageRes.ok) return json({ error: `Stránku se nepodařilo stáhnout (${pageRes.status})` }, 502);
  const html = await pageRes.text();

  const parsed = parseBazosListing(html);
  if (!parsed.title) return json({ error: 'Z inzerátu se nepodařilo přečíst název — zkuste zadat ručně.' }, 422);

  const rewritten = await rewriteListing({
    title: parsed.title,
    description: parsed.description ?? '',
    apiKey: getEnvVar('ANTHROPIC_API_KEY') ?? '',
  });
  const category = suggestCategory(rewritten.title, rewritten.description);

  const imagePaths = await downloadImages(supabase, parsed.imageUrls);

  const result = await createProspectWithDraft(supabase, {
    adminId: user.id,
    prospect: {
      name: contact.name ?? '',
      phone: contact.phone ?? parsed.phone ?? '',
      email: contact.email ?? '',
      sourceUrl: url,
    },
    listing: {
      title: rewritten.title,
      description: rewritten.description,
      price: parsed.price,
      category,
      location: parsed.location ?? '',
      phone: contact.phone ?? parsed.phone ?? '',
      email: contact.email ?? '',
    },
    imagePaths,
  });

  return json({ ok: true, ...result });
};
