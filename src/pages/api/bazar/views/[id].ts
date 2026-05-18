import type { APIRoute } from 'astro';
import { createAnonClient } from '../../../../lib/supabase';
import { edgeThrottle } from '../../../../lib/edge-throttle';

export const prerender = false;

// UUID v1-v5 format. We accept any v4 from Supabase; reject anything else early.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const BOT_RE = /bot|crawler|spider|crawl|google|bing|yandex|duckduck|baidu|slurp|facebook|whatsapp|telegram|linkedin|pinterest|preview|fetch/i;

export const POST: APIRoute = async ({ params, request, cookies, clientAddress, locals }) => {
  const id = params.id;
  if (!id || !UUID_RE.test(id)) {
    return new Response(JSON.stringify({ ok: false, reason: 'bad_id' }), {
      status: 400,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }

  // Bot filter — never inflate views for crawlers (they don't render JS anyway
  // in most cases, but defensive in case some do).
  const ua = request.headers.get('user-agent') ?? '';
  if (BOT_RE.test(ua)) {
    return new Response(JSON.stringify({ ok: true, skipped: 'bot' }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }

  // Cookie debounce — same visitor can only inflate by +1 per 30 min per listing.
  const cookieName = `bv_${id}`;
  if (cookies.has(cookieName)) {
    return new Response(JSON.stringify({ ok: true, skipped: 'recent' }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }

  // Edge throttle — protect against view-stuffing scripts (caller IP, generous
  // cap so honest reload-spam doesn't trip).
  const ip = (request.headers.get('cf-connecting-ip') || clientAddress || 'unknown').slice(0, 64);
  const throttle = await edgeThrottle({
    bucket: 'bazar-views',
    key: `${ip}:${id}`,
    max: 5,
    windowS: 60,
    ctx: (locals as { cfContext?: { waitUntil?: (p: Promise<unknown>) => void } }).cfContext,
  });
  if (!throttle.ok) {
    return new Response(JSON.stringify({ ok: true, skipped: 'throttled' }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }

  cookies.set(cookieName, '1', {
    maxAge: 60 * 30,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });

  const supabase = createAnonClient();
  const { data, error } = await supabase.rpc('increment_listing_views', { listing_id: id });

  if (error) {
    return new Response(JSON.stringify({ ok: false, reason: 'rpc_error' }), {
      status: 200, // Beacon: always 200 so navigator.sendBeacon doesn't retry.
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }

  return new Response(JSON.stringify({ ok: true, views: data }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
};
