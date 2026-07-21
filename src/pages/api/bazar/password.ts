import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const prerender = false;

// Nastavení hesla po claimu. Prodejce je přihlášený jen přes httpOnly cookies
// (server-side auto-login v prevzit/api/confirm.ts), takže browser Supabase klient
// žádnou session nemá → updateUser({password}) z prohlížeče padal na
// „Auth session missing!". Heslo proto nastavíme service rolí podle locals.user
// (kterého middleware naplní z cookie).
export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ error: 'Nejste přihlášen(a).' }), { status: 401 });

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Neplatný požadavek.' }), { status: 400 });
  }
  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length < 8) {
    return new Response(JSON.stringify({ error: 'Heslo musí mít aspoň 8 znaků.' }), { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400 });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
};
