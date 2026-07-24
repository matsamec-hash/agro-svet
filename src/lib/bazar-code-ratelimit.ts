import type { SupabaseClient } from '@supabase/supabase-js';

export const MAX_ATTEMPTS_PER_WINDOW = 10;
export const WINDOW_MINUTES = 10;

/** Zaznamená pokus o zadání kódu z dané IP (pro rate-limit okno). */
export async function recordCodeAttempt(supabase: SupabaseClient, ip: string): Promise<void> {
  await supabase.from('bazar_code_attempts').insert({ ip });
}

/** True když IP v posledních WINDOW_MINUTES překročila MAX_ATTEMPTS_PER_WINDOW pokusů. */
export async function isRateLimited(supabase: SupabaseClient, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await supabase
    .from('bazar_code_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', since);
  return (count ?? 0) >= MAX_ATTEMPTS_PER_WINDOW;
}
