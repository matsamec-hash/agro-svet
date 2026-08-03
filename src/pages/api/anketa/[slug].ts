import type { APIRoute } from 'astro';
import { createAnonClient } from '../../../lib/supabase';
import { edgeThrottle } from '../../../lib/edge-throttle';

export const prerender = false;

// Slug ankety i id možnosti musí být krátký kebab-case slug — brání tvorbě junk řádků.
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,48}$/;

const BOT_RE = /bot|crawler|spider|crawl|google|bing|yandex|duckduck|baidu|slurp|facebook|whatsapp|telegram|linkedin|pinterest|preview|fetch/i;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

type Tally = { option_id: string; votes: number };
const toMap = (rows: Tally[] | null) =>
  Object.fromEntries((rows ?? []).map((r) => [r.option_id, r.votes]));

// GET — aktuální výsledky ankety.
export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug || !SLUG_RE.test(slug)) return json({ ok: false, reason: 'bad_slug' }, 400);

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase
      .from('anketa_hlasy')
      .select('option_id, votes')
      .eq('poll_slug', slug);
    if (error) return json({ ok: false, reason: 'db', tallies: {} });
    return json({ ok: true, tallies: toMap(data as Tally[]) });
  } catch {
    return json({ ok: false, reason: 'unavailable', tallies: {} });
  }
};

// POST — odevzdání hlasu. Body: { option: string }.
export const POST: APIRoute = async ({ params, request, cookies, clientAddress, locals }) => {
  const slug = params.slug;
  if (!slug || !SLUG_RE.test(slug)) return json({ ok: false, reason: 'bad_slug' }, 400);

  let option = '';
  try {
    const body = await request.json();
    option = String(body?.option ?? '');
  } catch {
    return json({ ok: false, reason: 'bad_body' }, 400);
  }
  if (!SLUG_RE.test(option)) return json({ ok: false, reason: 'bad_option' }, 400);

  // Bot filtr — neplníme výsledky crawlery.
  const ua = request.headers.get('user-agent') ?? '';
  if (BOT_RE.test(ua)) return json({ ok: true, skipped: 'bot' });

  // Cookie debounce — jeden hlas na prohlížeč a anketu (30 dní).
  const cookieName = `av_${slug}`;
  if (cookies.has(cookieName)) {
    // Vrať aktuální stav, ať frontend zobrazí výsledky.
    const supabase = createAnonClient();
    const { data } = await supabase.from('anketa_hlasy').select('option_id, votes').eq('poll_slug', slug);
    return json({ ok: true, skipped: 'voted', tallies: toMap(data as Tally[]) });
  }

  // Edge throttle proti skriptovému nafukování.
  const ip = (request.headers.get('cf-connecting-ip') || clientAddress || 'unknown').slice(0, 64);
  const throttle = await edgeThrottle({
    bucket: 'anketa-vote',
    key: `${ip}:${slug}`,
    max: 8,
    windowS: 60,
    ctx: (locals as { cfContext?: { waitUntil?: (p: Promise<unknown>) => void } }).cfContext,
  });
  if (!throttle.ok) return json({ ok: false, reason: 'throttled' }, 200);

  try {
    const supabase = createAnonClient();
    const { data, error } = await supabase.rpc('anketa_vote', { p_slug: slug, p_option: option });
    if (error) return json({ ok: false, reason: 'rpc_error', tallies: {} });

    cookies.set(cookieName, option, {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return json({ ok: true, voted: option, tallies: toMap(data as Tally[]) });
  } catch {
    return json({ ok: false, reason: 'unavailable', tallies: {} });
  }
};
