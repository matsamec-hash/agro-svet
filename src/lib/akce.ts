// src/lib/akce.ts
import { isAkceTyp, type AkceTyp } from './akce-constants';

export type AkceStav = 'ceka' | 'zverejneno' | 'zamitnuto' | 'probehla';
export type AkceDruh = 'jednorazova' | 'opakovana';

export interface AkceInput {
  nazev: string;
  typ: AkceTyp;
  druh: AkceDruh;
  zacatek?: string;
  konec?: string | null;
  dny_v_tydnu?: number[];
  cas_od?: string;
  cas_do?: string | null;
  plati_od?: string;
  plati_do?: string | null;
  misto_nazev?: string | null;
  adresa?: string | null;
  obec: string;
  kraj_slug: string;
  okres_slug: string;
  poradatel?: string | null;
  web?: string | null;
  telefon?: string | null;
  email: string;
  popis: string;
}

export interface Akce extends AkceInput {
  id: string;
  slug: string;
  stav: AkceStav;
  zdroj: 'uzivatel' | 'kurator' | 'feed';
  lat: number | null;
  lng: number | null;
  pristi_vyskyt: string | null;
  foto_path: string | null;
  created_at: string;
  zverejneno_at: string | null;
}

const DIACRITICS: Record<string, string> = {
  á: 'a', č: 'c', ď: 'd', é: 'e', ě: 'e', í: 'i', ň: 'n', ó: 'o', ř: 'r',
  š: 's', ť: 't', ú: 'u', ů: 'u', ý: 'y', ž: 'z',
};

function asciiFold(s: string): string {
  return s.toLowerCase().replace(/[áčďéěíňóřšťúůýž]/g, (c) => DIACRITICS[c] ?? c);
}

export function slugifyAkce(nazev: string, obec: string, suffix?: string): string {
  const raw = [nazev, obec, suffix].filter(Boolean).join(' ');
  const slug = asciiFold(raw)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export function validateAkceInput(input: AkceInput): ValidationResult {
  const errors: string[] = [];
  if (!input.nazev?.trim()) errors.push('Vyplňte název akce.');
  if (!isAkceTyp(input.typ)) errors.push('Neplatný typ akce.');
  if (!input.obec?.trim()) errors.push('Vyplňte obec.');
  if (!input.kraj_slug?.trim()) errors.push('Vyberte kraj.');
  if (!input.okres_slug?.trim()) errors.push('Vyberte okres.');
  if (!EMAIL_RE.test(input.email ?? '')) errors.push('Zadejte platný e-mail.');
  if (!input.popis?.trim() || input.popis.trim().length < 10)
    errors.push('Popis musí mít aspoň 10 znaků.');

  if (input.druh === 'jednorazova') {
    if (!input.zacatek) errors.push('Vyplňte datum a čas konání.');
  } else if (input.druh === 'opakovana') {
    if (!input.dny_v_tydnu || input.dny_v_tydnu.length === 0)
      errors.push('Vyberte aspoň jeden den v týdnu.');
    if (!input.cas_od) errors.push('Vyplňte čas od.');
    if (!input.plati_od) errors.push('Vyplňte platnost od.');
  } else {
    errors.push('Neplatný druh akce.');
  }
  return { ok: errors.length === 0, errors };
}
