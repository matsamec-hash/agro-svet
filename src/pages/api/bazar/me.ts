import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ logged_in: false }), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
  const name = (user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Uživatel') as string;

  // is_admin řídí zobrazení odkazu „Admin" v profilovém menu. Service-role čtení
  // (bazar_users SELECT RLS je owner-scoped, ale tady scope-ujeme na id usera).
  // I kdyby se odkaz zobrazil neoprávněně, /admin/* stejně gate-uje middleware.
  const supabase = createServerClient();
  const { data: profile } = await supabase
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  const isAdmin = (profile as { is_admin?: boolean } | null)?.is_admin === true;

  return new Response(
    JSON.stringify({ logged_in: true, name, email: user.email ?? null, is_admin: isAdmin }),
    {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    },
  );
};
