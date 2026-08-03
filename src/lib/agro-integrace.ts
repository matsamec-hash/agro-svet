// Provázací vrstva mezi sekcemi: profily zemí (/svet/) ↔ prodeje techniky
// (/data/prodeje-techniky/) ↔ akcie firem (/akcie/) ↔ značky/stroje (DB).
// Cíl: aby se data nekřížila jen v jedné sekci, ale odkazovala se navzájem.
import { ZEME, type Zeme } from '../data/prodeje-techniky';
import { AKCIE, type AgroAkcie } from '../data/akcie-agro';

// kód trhu (prodeje-techniky) → slug profilu země (/svet/<slug>/)
// Pozn.: ČR nemá /svet/ profil (je to referenční domácí země; data v /statistiky/),
// proto ji sem NEdáváme — odkaz by 404oval.
const KOD_TO_SVET: Record<string, string> = {
  de: 'nemecko',
  fr: 'francie',
  it: 'italie',
  pl: 'polsko',
  uk: 'velka-britanie',
};
export const svetSlugProKod = (kod: string): string | null => KOD_TO_SVET[kod] ?? null;

// vlajka firmy (akcie) → slug profilu země (jen kde profil existuje)
const FLAG_TO_SVET: Record<string, string> = {
  '🇩🇪': 'nemecko',
  '🇬🇧': 'velka-britanie',
  '🇫🇷': 'francie',
  '🇮🇹': 'italie',
  '🇵🇱': 'polsko',
};

// ticker firmy → značky v naší DB (/stroje/<slug>/, /znacky/<slug>/)
export const AKCIE_DB_ZNACKY: Record<string, string[]> = {
  DE: ['john-deere'],
  AGCO: ['fendt', 'massey-ferguson', 'valtra'],
  CNH: ['case-ih', 'new-holland'],
  KUBTY: ['kubota'],
};

export const ZNACKA_LABEL: Record<string, string> = {
  'john-deere': 'John Deere',
  fendt: 'Fendt',
  'massey-ferguson': 'Massey Ferguson',
  valtra: 'Valtra',
  'case-ih': 'Case IH',
  'new-holland': 'New Holland',
  kubota: 'Kubota',
};

export interface ProdejeProZemi {
  zeme: Zeme;
  rok: number;
  traktory: number;
  poradi: number | null; // pořadí mezi národními trhy (1 = největší)
  poradiZCelku: number;
}

/** Poslední ověřený objem registrací + pořadí mezi národními trhy pro daný /svet/ slug. */
export function prodejeProZemi(svetSlug: string): ProdejeProZemi | null {
  const kod = Object.keys(KOD_TO_SVET).find((k) => KOD_TO_SVET[k] === svetSlug);
  if (!kod) return null;
  const zeme = ZEME.find((z) => z.kod === kod);
  if (!zeme) return null;
  const rok = [...zeme.roky].reverse().find((r) => r.traktory != null);
  if (!rok || rok.traktory == null) return null;

  // pořadí mezi národními trhy (bez EU agregátu) podle posledního ověřeného roku
  const narodni = ZEME.filter((z) => z.kod !== 'eu')
    .map((z) => {
      const r = [...z.roky].reverse().find((x) => x.traktory != null);
      return { kod: z.kod, v: r?.traktory ?? 0 };
    })
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const idx = narodni.findIndex((x) => x.kod === kod);

  return {
    zeme,
    rok: rok.rok,
    traktory: rok.traktory,
    poradi: idx >= 0 ? idx + 1 : null,
    poradiZCelku: narodni.length,
  };
}

/** Veřejně obchodované agro firmy se sídlem v dané zemi (dle /svet/ slug). */
export function akcieProZemi(svetSlug: string): AgroAkcie[] {
  return AKCIE.filter((a) => FLAG_TO_SVET[a.zeme] === svetSlug);
}

/** /svet/ slug pro vlajku firmy (null, pokud země nemá profil). */
export const svetSlugProVlajku = (vlajka: string): string | null => FLAG_TO_SVET[vlajka] ?? null;
