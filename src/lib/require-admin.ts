// Vlastní kontrola admina pro stránky pod /admin/. Middleware je hlídá taky,
// ale samotné nestačí: 22. 10. 2026 se /sk/admin/… přes next(strippedPath)
// vykreslil bez kontroly a seznam uživatelů bazaru byl vidět bez přihlášení.
// API routy pod /admin/ si práva ověřovaly samy, a proto tehdy nešlo nic měnit.
// Stránky teď dělají totéž.
//
// Použití hned na začátku frontmatteru, před prvním dotazem do databáze:
//   const zamitnuto = await requireAdmin(Astro);
//   if (zamitnuto) return zamitnuto;
import type { AstroGlobal } from 'astro';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from './supabase';

type AdminAstro = Pick<AstroGlobal, 'locals' | 'url' | 'redirect'>;

/** Vrátí odpověď, kterou má stránka poslat místo sebe (přihlášení / 403),
 *  nebo `null`, když je přihlášený uživatel admin. */
export async function requireAdmin(
  Astro: AdminAstro,
  // Service role: SELECT na bazar_users pustí RLS jen na vlastní řádek a
  // klient tu nemá JWT uživatele (stejně jako middleware a admin API).
  getClient: () => SupabaseClient = createServerClient,
): Promise<Response | null> {
  const user = Astro.locals.user;
  if (!user) {
    return Astro.redirect('/bazar/prihlaseni/?redirect=' + encodeURIComponent(Astro.url.pathname));
  }
  const { data } = await getClient()
    .from('bazar_users')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if ((data as { is_admin?: boolean } | null)?.is_admin !== true) {
    return new Response('Forbidden', { status: 403 });
  }
  return null;
}
