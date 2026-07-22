// src/lib/akce-supabase.ts
import { createServerClient } from './supabase';
import { computeNextOccurrence, type TerminInput } from './akce-recurrence';
import type { Akce, AkceInput, AkceStav } from './akce';

/** Sestaví TerminInput z řádku/inputu pro výpočet příštího výskytu. */
function terminOf(a: {
  druh: 'jednorazova' | 'opakovana';
  zacatek?: string | null;
  konec?: string | null;
  dny_v_tydnu?: number[] | null;
  cas_od?: string | null;
  cas_do?: string | null;
  plati_od?: string | null;
  plati_do?: string | null;
}): TerminInput {
  if (a.druh === 'jednorazova') {
    return { druh: 'jednorazova', zacatek: a.zacatek!, konec: a.konec ?? null };
  }
  return {
    druh: 'opakovana',
    dny_v_tydnu: a.dny_v_tydnu ?? [],
    cas_od: a.cas_od ?? '00:00',
    cas_do: a.cas_do ?? null,
    plati_od: a.plati_od!,
    plati_do: a.plati_do ?? null,
  };
}

/** Vloží anonymní příspěvek se stavem 'ceka'. Vrací id+slug. */
export async function insertSubmission(
  input: AkceInput & { slug: string; lat: number | null; lng: number | null; foto_path?: string | null },
): Promise<{ id: string; slug: string }> {
  const sb = createServerClient();
  const now = new Date();
  const pristi = computeNextOccurrence(terminOf(input), now);
  // foto_path přidáme do insertu jen když fotka je — odolnost proti nasazení
  // kódu před migrací 018 (bez fotky projde i na DB bez sloupce foto_path).
  const fotoCol = input.foto_path ? { foto_path: input.foto_path } : {};
  const { data, error } = await sb
    .from('akce')
    .insert({
      ...fotoCol,
      slug: input.slug,
      nazev: input.nazev,
      popis: input.popis,
      typ: input.typ,
      druh: input.druh,
      zacatek: input.zacatek ?? null,
      konec: input.konec ?? null,
      dny_v_tydnu: input.dny_v_tydnu ?? null,
      cas_od: input.cas_od ?? null,
      cas_do: input.cas_do ?? null,
      plati_od: input.plati_od ?? null,
      plati_do: input.plati_do ?? null,
      pristi_vyskyt: pristi,
      misto_nazev: input.misto_nazev ?? null,
      adresa: input.adresa ?? null,
      obec: input.obec,
      okres_slug: input.okres_slug,
      kraj_slug: input.kraj_slug,
      lat: input.lat,
      lng: input.lng,
      poradatel: input.poradatel ?? null,
      web: input.web ?? null,
      telefon: input.telefon ?? null,
      email: input.email,
      zdroj: 'uzivatel',
      stav: 'ceka',
    })
    .select('id, slug')
    .single();
  if (error) throw error;
  return data as { id: string; slug: string };
}

export async function listPending(): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('stav', 'ceka')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Akce[];
}

export async function getById(id: string): Promise<Akce | null> {
  const sb = createServerClient();
  const { data } = await sb.from('akce').select('*').eq('id', id).maybeSingle();
  return (data as Akce) ?? null;
}

/** Schválí / zamítne. Při schválení přepočítá pristi_vyskyt + nastaví stav. */
export async function moderate(args: {
  id: string;
  action: 'approve' | 'reject';
  reason?: string;
  moderatorId: string;
  patch?: Partial<AkceInput>;
}): Promise<Akce | null> {
  const sb = createServerClient();
  const current = await getById(args.id);
  if (!current) return null;

  if (args.action === 'reject') {
    await sb.from('akce').update({
      stav: 'zamitnuto' as AkceStav,
      zamitnuti_duvod: args.reason ?? null,
      moderoval: args.moderatorId,
      moderovano_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', args.id);
    return getById(args.id);
  }

  const merged = { ...current, ...(args.patch ?? {}) };
  const pristi = computeNextOccurrence(terminOf(merged), new Date());
  await sb.from('akce').update({
    ...(args.patch ?? {}),
    pristi_vyskyt: pristi,
    stav: 'zverejneno' as AkceStav,
    moderoval: args.moderatorId,
    moderovano_at: new Date().toISOString(),
    zverejneno_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', args.id);
  return getById(args.id);
}

/** Veřejný výpis: nadcházející zveřejněné akce, řazené dle příštího výskytu. */
export async function listUpcoming(limit = 60): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('stav', 'zverejneno')
    .not('pristi_vyskyt', 'is', null)
    .order('pristi_vyskyt', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Akce[];
}

/** Public URL fotky akce (bucket akce-images), nebo null. Klient se cachuje,
 *  aby výpis stovek akcí nevytvářel klienta pro každou položku. */
let _fotoClient: ReturnType<typeof createServerClient> | null = null;
export function akceFotoUrl(fotoPath: string | null | undefined): string | null {
  if (!fotoPath) return null;
  _fotoClient ??= createServerClient();
  return _fotoClient.storage.from('akce-images').getPublicUrl(fotoPath).data.publicUrl;
}

/** Povolené typy fotek + limit — sdíleno formulářem i adminem. */
export const AKCE_FOTO_MAX_BYTES = 5 * 1024 * 1024;
export const AKCE_FOTO_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** Nahraje fotku do bucketu akce-images (service-role → bypass RLS). Vrací cestu. */
export async function uploadAkceFoto(buffer: ArrayBuffer, contentType: string): Promise<string> {
  const ext = AKCE_FOTO_TYPES[contentType];
  if (!ext) throw new Error(`Nepodporovaný typ obrázku: ${contentType}`);
  const sb = createServerClient();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await sb.storage.from('akce-images').upload(path, buffer, { contentType, upsert: false });
  if (error) throw error;
  return path;
}

/** Nastaví/odebere foto_path akce (admin). Starou fotku (pokud jiná) smaže. */
export async function setAkceFoto(id: string, fotoPath: string | null): Promise<void> {
  const sb = createServerClient();
  const { data: prev } = await sb.from('akce').select('foto_path').eq('id', id).maybeSingle();
  const oldPath = (prev as { foto_path?: string | null } | null)?.foto_path ?? null;
  const { error } = await sb.from('akce').update({ foto_path: fotoPath, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
  if (oldPath && oldPath !== fotoPath) {
    await sb.storage.from('akce-images').remove([oldPath]).catch(() => {});
  }
}

/** Detail — jedna zveřejněná akce dle slugu (jinak null → 404). */
export async function getBySlug(slug: string): Promise<Akce | null> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('slug', slug)
    .eq('stav', 'zverejneno')
    .maybeSingle();
  if (error) throw error;
  return (data as Akce | null) ?? null;
}

/** Landing: nadcházející zveřejněné akce daného typu. */
export async function listByTyp(typ: string, limit = 100): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('stav', 'zverejneno')
    .eq('typ', typ)
    .not('pristi_vyskyt', 'is', null)
    .order('pristi_vyskyt', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Akce[];
}

/** Landing: nadcházející zveřejněné akce v daném kraji. */
export async function listByKraj(krajSlug: string, limit = 100): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('stav', 'zverejneno')
    .eq('kraj_slug', krajSlug)
    .not('pristi_vyskyt', 'is', null)
    .order('pristi_vyskyt', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Akce[];
}

/** Landing kombinace typ × kraj. */
export async function listByTypAndKraj(typ: string, krajSlug: string, limit = 100): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('stav', 'zverejneno')
    .eq('typ', typ)
    .eq('kraj_slug', krajSlug)
    .not('pristi_vyskyt', 'is', null)
    .order('pristi_vyskyt', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Akce[];
}

/** Související akce pro detail — stejný kraj NEBO typ, mimo sebe, nadcházející. */
export async function listRelated(a: Akce, limit = 4): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb
    .from('akce')
    .select('*')
    .eq('stav', 'zverejneno')
    .neq('id', a.id)
    .not('pristi_vyskyt', 'is', null)
    .or(`kraj_slug.eq.${a.kraj_slug},typ.eq.${a.typ}`)
    .order('pristi_vyskyt', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Akce[];
}

/** Pro údržbový skript: všechny zveřejněné akce. */
export async function listPublishedForMaintenance(): Promise<Akce[]> {
  const sb = createServerClient();
  const { data, error } = await sb.from('akce').select('*').eq('stav', 'zverejneno');
  if (error) throw error;
  return (data ?? []) as Akce[];
}

/** Aktualizuje pristi_vyskyt; jednorázové po termínu → 'probehla'. */
export async function applyMaintenance(a: Akce, now: Date): Promise<void> {
  const sb = createServerClient();
  const pristi = computeNextOccurrence(terminOf(a), now);
  if (a.druh === 'jednorazova' && pristi === null) {
    await sb.from('akce').update({ stav: 'probehla', pristi_vyskyt: null, updated_at: now.toISOString() }).eq('id', a.id);
  } else {
    await sb.from('akce').update({ pristi_vyskyt: pristi, updated_at: now.toISOString() }).eq('id', a.id);
  }
}
