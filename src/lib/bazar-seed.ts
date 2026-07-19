import type { SupabaseClient } from '@supabase/supabase-js';
import { generateClaimToken, isTokenExpired } from './bazar-seed-token';

export interface ProspectInput {
  name: string;
  phone: string;
  email: string;
  sourceUrl: string;
}

export interface DraftListingInput {
  title: string;
  description: string;
  price: number | null;
  category: string;
  subcategory?: string | null;
  brand?: string | null;
  location: string;
  phone: string;
  email: string;
}

/** Založí prospekta + jeho první draft listing (pending_claim, bez user_id). */
export async function createProspectWithDraft(
  supabase: SupabaseClient,
  args: { adminId: string; prospect: ProspectInput; listing: DraftListingInput; imagePaths: string[] },
): Promise<{ prospectId: string; claimToken: string; listingId: string }> {
  const claimToken = generateClaimToken();
  const { data: prospect, error: pErr } = await supabase
    .from('bazar_seed_prospects')
    .insert({
      name: args.prospect.name,
      phone: args.prospect.phone,
      email: args.prospect.email,
      source_url: args.prospect.sourceUrl,
      claim_token: claimToken,
      created_by: args.adminId,
      status: 'draft',
    })
    .select('id, claim_token')
    .single();
  if (pErr || !prospect) throw new Error(`prospect insert: ${pErr?.message}`);

  const listingId = await addDraftListing(supabase, prospect.id as string, args.listing, args.imagePaths);
  return { prospectId: prospect.id as string, claimToken: prospect.claim_token as string, listingId };
}

/** Přidá další draft listing k existujícímu prospektovi. */
export async function addDraftListing(
  supabase: SupabaseClient,
  prospectId: string,
  listing: DraftListingInput,
  imagePaths: string[],
): Promise<string> {
  const { data, error } = await supabase
    .from('bazar_listings')
    .insert({
      user_id: null,
      seed_prospect_id: prospectId,
      status: 'pending_claim',
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      subcategory: listing.subcategory ?? null,
      brand: listing.brand ?? null,
      location: listing.location,
      phone: listing.phone,
      email: listing.email,
    })
    .select('id')
    .single();
  if (error || !data) throw new Error(`listing insert: ${error?.message}`);

  if (imagePaths.length) {
    const rows = imagePaths.slice(0, 5).map((path, i) => ({
      listing_id: data.id,
      storage_path: path,
      position: i + 1,
    }));
    const { error: imgErr } = await supabase.from('bazar_images').insert(rows);
    if (imgErr) throw new Error(`images insert: ${imgErr.message}`);
  }
  return data.id as string;
}

export async function markProspectSent(
  supabase: SupabaseClient,
  prospectId: string,
  channel: 'email' | 'whatsapp',
): Promise<void> {
  const { error } = await supabase
    .from('bazar_seed_prospects')
    .update({ status: 'sent', channel })
    .eq('id', prospectId);
  if (error) throw new Error(`markProspectSent: ${error.message}`);
}

export interface ProspectRow {
  id: string; email: string; name: string; phone: string;
  claim_token: string; token_expires_at: string; status: string; user_id: string | null;
}

/** Načte prospekta podle tokenu (service role obchází RLS). null když neexistuje. */
export async function getProspectByToken(
  supabase: SupabaseClient,
  token: string,
): Promise<ProspectRow | null> {
  const { data } = await supabase
    .from('bazar_seed_prospects')
    .select('id, email, name, phone, claim_token, token_expires_at, status, user_id')
    .eq('claim_token', token)
    .single();
  return (data as ProspectRow) ?? null;
}

/** Zaznamenej otevření claim odkazu (idempotentně jen z 'sent'/'draft'). */
export async function markProspectOpened(supabase: SupabaseClient, prospectId: string, nowIso: string): Promise<void> {
  await supabase
    .from('bazar_seed_prospects')
    .update({ status: 'opened', opened_at: nowIso })
    .eq('id', prospectId)
    .in('status', ['draft', 'sent']);
}

/** Callback: zajistí auth uživatele (vytvoř nebo dohledej) a vrať jeho id. */
export type EnsureUser = (args: { email: string; name: string; phone: string }) => Promise<string>;

/** Potvrdí prospekta: ověří token, zajistí usera, zveřejní inzeráty, zapíše audit. */
export async function confirmProspect(
  supabase: SupabaseClient,
  args: { token: string; ip: string; termsVersion: string; ensureUser: EnsureUser; now?: Date },
): Promise<{ userId: string; prospectId: string }> {
  const now = args.now ?? new Date();
  const prospect = await getProspectByToken(supabase, args.token);
  if (!prospect) throw new Error('Neplatný odkaz.');
  if (prospect.status === 'confirmed') throw new Error('Tento inzerát už byl potvrzen.');
  if (isTokenExpired(prospect.token_expires_at, now)) throw new Error('Platnost odkazu vypršela (expiroval).');

  const userId = await args.ensureUser({ email: prospect.email, name: prospect.name, phone: prospect.phone });

  const { error: lErr } = await supabase
    .from('bazar_listings')
    .update({ status: 'active', user_id: userId })
    .eq('seed_prospect_id', prospect.id);
  if (lErr) throw new Error(`publish listings: ${lErr.message}`);

  const { error: pErr } = await supabase
    .from('bazar_seed_prospects')
    .update({
      status: 'confirmed',
      confirmed_at: now.toISOString(),
      confirmed_ip: args.ip,
      terms_version: args.termsVersion,
      user_id: userId,
    })
    .eq('id', prospect.id);
  if (pErr) throw new Error(`confirm prospect: ${pErr.message}`);

  return { userId, prospectId: prospect.id };
}
