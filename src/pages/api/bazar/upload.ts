import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const prerender = false;

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function safeName(name: string): string {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '_')
    .slice(0, 120);
}

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const contentType = request.headers.get('content-type') || '';
  let file: File | null = null;

  if (contentType.startsWith('multipart/form-data')) {
    const form = await request.formData();
    const f = form.get('file');
    if (f instanceof File) file = f;
  } else {
    return new Response(JSON.stringify({ error: 'Expected multipart/form-data' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return new Response(JSON.stringify({ error: `Unsupported type: ${file.type}` }), {
      status: 415,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: `File too large (max ${MAX_SIZE} bytes)` }), {
      status: 413,
      headers: { 'content-type': 'application/json' },
    });
  }

  const supabase = createServerClient();
  const path = `${user.id}/${crypto.randomUUID()}-${safeName(file.name)}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage.from('bazar-images').upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ path }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
