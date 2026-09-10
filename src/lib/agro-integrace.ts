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

// značka (DB slug) → logo (staženo z Wikimedia Commons, P154). Lemken chybí
// (na Commons nemá logo). Cesty do public/images/znacky/.
/**
 * Loga značek. Všechna jsou z Wikimedia Commons (Wikidata P154) a mají doloženou
 * licenci — viz ZNACKA_LOGO_LICENCE níž. Starší sada v `/images/stroje/brands/`
 * byla stažená z webů výrobců bez jakéhokoli záznamu o původu a je smazaná;
 * kdo logo potřebuje, bere ho odsud.
 *
 * ‼️ Nové logo přidávej jen s doloženou licencí. Bez ní se značka vykreslí bez
 * loga (všechna místa mají podmíněný render) — to je správně, ne rozbité.
 */
export const ZNACKA_LOGO: Record<string, string> = {
  amazone: '/images/znacky/amazone.png',
  bednar: '/images/znacky/bednar.jpg',
  'case-ih': '/images/znacky/case-ih.png',
  claas: '/images/znacky/claas.svg',
  'deutz-fahr': '/images/znacky/deutz-fahr.svg',
  fendt: '/images/znacky/fendt.svg',
  horsch: '/images/znacky/horsch.svg',
  jcb: '/images/znacky/jcb.svg',
  'john-deere': '/images/znacky/john-deere.png',
  joskin: '/images/znacky/joskin.jpg',
  krone: '/images/znacky/krone.svg',
  kubota: '/images/znacky/kubota.svg',
  kuhn: '/images/znacky/kuhn.svg',
  kverneland: '/images/znacky/kverneland.svg',
  manitou: '/images/znacky/manitou.svg',
  'new-holland': '/images/znacky/new-holland.png',
  pottinger: '/images/znacky/pottinger.svg',
  vaderstad: '/images/znacky/vaderstad.svg',
  valtra: '/images/znacky/valtra.png',
  zetor: '/images/znacky/zetor.png',
  // Lemken a Massey Ferguson na Commons použitelné logo nemají (MF je tam jen
  // jako začerněný obdélník) → renderují se bez loga.
};

/**
 * Licence log — autor, licence a odkaz na soubor na Commons. Vykresluje se
 * v bloku „Fotografie" na stránce značky; u licencí bez povinné atribuce
 * (public domain) se neukazuje, ale evidovaná je.
 */
export const ZNACKA_LOGO_LICENCE: Record<string, { author: string; license: string; source: string }> = {
  amazone: { author: 'Amazone (Germany)', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Logo_wordmark_Amazone_H._Dreyer_GmbH_%26_Co._KG.png' },
  bednar: { author: 'Cz-bd-1', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:BEDNAR_logo_2019_RGB.jpg' },
  'case-ih': { author: 'Case IH', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Logo_Case_IH.png' },
  claas: { author: 'Claas', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Claas-Logo.svg' },
  'deutz-fahr': { author: 'SAME Deutz-Fahr', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr-Logo.svg' },
  fendt: { author: 'Fendt', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Fendt-Logo.svg' },
  horsch: { author: 'Horsch Maschinen', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Horsch_Maschinen_Logo.svg' },
  jcb: { author: 'JCB', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:JCB_(J.C._Bamford_Excavators_Limited)_logo.svg' },
  'john-deere': { author: 'John Deere', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:John_Deere_text_only.png' },
  joskin: { author: 'Joskin', license: 'CC BY-SA 4.0', source: 'https://commons.wikimedia.org/wiki/File:Joskin.jpg' },
  krone: { author: 'Krone Agriculture SE', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:KRONE_Agriculture_Logo_RGB.svg' },
  kubota: { author: 'Kubota', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Kubota-Logo.svg' },
  kuhn: { author: 'Kuhn Landmaschinen', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Kuhn-Logo.svg' },
  kverneland: { author: 'Kverneland Group', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Kverneland_201x_logo.svg' },
  manitou: { author: 'Manitou BF SA', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Manitou_Group_Logo.svg' },
  'new-holland': { author: 'New Holland Agriculture', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:New_Holland_Logo_2023.png' },
  pottinger: { author: 'Pöttinger', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Poettinger-logo.svg' },
  vaderstad: { author: 'Väderstad', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:V%C3%A4derstad_logo.svg' },
  valtra: { author: 'Valtra', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Valtra_Logo_Black_Outline_RGB.png' },
  zetor: { author: 'Fruitman cz', license: 'Public domain', source: 'https://commons.wikimedia.org/wiki/File:Zetor_logo_red.png' },
};

// značka (DB slug) → mateřská burzovní firma (ticker v AKCIE)
export const ZNACKA_TO_AKCIE: Record<string, string> = {
  'john-deere': 'DE',
  fendt: 'AGCO',
  'massey-ferguson': 'AGCO',
  valtra: 'AGCO',
  'case-ih': 'CNH',
  'new-holland': 'CNH',
  kubota: 'KUBTY',
};

/** Mateřská burzovní firma pro danou značku (nebo null). */
export function akcieProZnacku(brandSlug: string): AgroAkcie | null {
  const t = ZNACKA_TO_AKCIE[brandSlug];
  return t ? AKCIE.find((a) => a.ticker === t) ?? null : null;
}

// název značky (jak se píše v datech prodejů) → DB slug (jen značky s profilem)
const NAZEV_TO_ZNACKA_SLUG: Record<string, string> = {
  'John Deere': 'john-deere',
  Fendt: 'fendt',
  'Massey Ferguson': 'massey-ferguson',
  Valtra: 'valtra',
  'Case IH': 'case-ih',
  'New Holland': 'new-holland',
  Kubota: 'kubota',
  'Deutz-Fahr': 'deutz-fahr',
  Claas: 'claas',
  Zetor: 'zetor',
};
export const znackaSlugZNazvu = (nazev: string): string | null => NAZEV_TO_ZNACKA_SLUG[nazev] ?? null;

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
