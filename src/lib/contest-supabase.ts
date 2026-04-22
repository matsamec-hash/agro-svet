import { createServerClient } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContestRound {
  id: string;
  slug: string;
  title: string;
  theme: string;
  description: string;
  hero_image: string | null;
  year: number;
  month: number | null;
  is_final: boolean;
  upload_starts_at: string;
  upload_ends_at: string;
  voting_starts_at: string;
  voting_ends_at: string;
  announcement_at: string;
  prize_first: string;
  prize_second: string | null;
  prize_third: string | null;
  status: 'draft' | 'published' | 'upload_open' | 'voting_open' | 'closed' | 'announced';
  winner_entry_id: string | null;
  runner_up_entry_id: string | null;
  third_place_entry_id: string | null;
  required_fields: unknown[];
  optional_fields: unknown[];
}

export interface ContestEntry {
  id: string;
  round_id: string;
  user_id: string;
  photo_path: string;
  photo_width: number;
  photo_height: number;
  title: string;
  caption: string | null;
  author_display_name: string;
  author_location: string | null;
  brand_slug: string | null;
  model_slug: string | null;
  series_slug: string | null;
  location_kraj_slug: string | null;
  location_okres_slug: string | null;
  year_taken: number | null;
  metadata: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'disqualified';
  rejection_reason: string | null;
  vote_count: number;
  last_vote_at: string | null;
  license_merch_print: boolean;
  created_at: string;
}

export async function getActiveRound(client?: SupabaseClient): Promise<ContestRound | null> {
  const sb = client ?? createServerClient();
  const { data } = await sb
    .from('contest_rounds')
    .select('*')
    .in('status', ['upload_open', 'voting_open', 'closed'])
    .order('voting_starts_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as ContestRound | null;
}

export async function getRoundBySlug(slug: string, client?: SupabaseClient): Promise<ContestRound | null> {
  const sb = client ?? createServerClient();
  const { data } = await sb
    .from('contest_rounds')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  return data as ContestRound | null;
}

export async function getApprovedEntries(
  roundId: string,
  opts: { limit?: number; offset?: number } = {},
  client?: SupabaseClient,
): Promise<ContestEntry[]> {
  const sb = client ?? createServerClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('round_id', roundId)
    .eq('status', 'approved')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: true })
    .range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 48) - 1);
  return (data ?? []) as ContestEntry[];
}

export async function getEntry(id: string, client?: SupabaseClient): Promise<ContestEntry | null> {
  const sb = client ?? createServerClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return data as ContestEntry | null;
}

export async function countUserEntriesInRound(
  userId: string,
  roundId: string,
  client?: SupabaseClient,
): Promise<number> {
  const sb = client ?? createServerClient();
  const { count } = await sb
    .from('contest_entries')
    .select('id', { count: 'exact', head: true })
    .eq('round_id', roundId)
    .eq('user_id', userId)
    .neq('status', 'rejected');
  return count ?? 0;
}

export async function getMyEntries(userId: string, client?: SupabaseClient): Promise<ContestEntry[]> {
  const sb = client ?? createServerClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return (data ?? []) as ContestEntry[];
}

export async function getPendingEntries(limit = 48, client?: SupabaseClient): Promise<ContestEntry[]> {
  const sb = client ?? createServerClient();
  const { data } = await sb
    .from('contest_entries')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);
  return (data ?? []) as ContestEntry[];
}

export async function getPublicPhotoUrl(path: string): Promise<string> {
  const sb = createServerClient();
  const { data } = sb.storage.from('contest-photos').getPublicUrl(path);
  return data.publicUrl;
}
