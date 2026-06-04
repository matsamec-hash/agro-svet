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
  input: AkceInput & { slug: string; lat: number | null; lng: number | null },
): Promise<{ id: string; slug: string }> {
  const sb = createServerClient();
  const now = new Date();
  const pristi = computeNextOccurrence(terminOf(input), now);
  const { data, error } = await sb
    .from('akce')
    .insert({
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
