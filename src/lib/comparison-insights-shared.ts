// Sdílené typy a helpery pro oba srovnávací verdikt enginy
// (comparison-insights.ts = hp osa traktor/kombajn; implement-comparison-insights.ts = záběr osa nářadí).
// Vyčleněno, aby implement engine mohl reusovat brandDescriptorAkuzativ + typy,
// aniž by se měnil cs výstup hp enginu (chráněno snapshot testem).

import type { Locale } from './../i18n/config';

export interface ComparisonFaq {
  q: string;
  a: string;
}

export interface ComparisonInsights {
  /** 2–3 sentence verdict-style TL;DR. */
  tldr: string;
  /** ~155 char SERP meta description. */
  shortDescription: string;
  /** "Vyber A když…". */
  decisionA: string;
  /** "Vyber B když…". */
  decisionB: string;
  /** 5 FAQ entries pro FAQPage schema. */
  faqs: ComparisonFaq[];
  /** ISO date pro "aktualizováno" badge + dateModified. */
  lastUpdatedIso: string;
}

/** Procentní rozdíl a vs b zaokrouhlený na celé %. */
export function pct(a: number, b: number): number {
  if (b === 0) return 0;
  return Math.round(((a - b) / b) * 100);
}

/**
 * Popis značky v akuzativu — pasuje gramaticky za "preferuješ".
 * Příklad: "preferuješ německou prémiovou značku Fendt".
 * Obsahuje traktorové i nářaďové značky; neznámá → fallback "značku {brandName}".
 */
export function brandDescriptorAkuzativ(brand: string, brandName: string, locale: Locale): string {
  const mapCs: Record<string, string> = {
    fendt: 'německou prémiovou značku Fendt',
    'john-deere': 'amerického giganta John Deere',
    'case-ih': 'americkou značku Case IH (koncern CNH)',
    'new-holland': 'evropskou značku New Holland (koncern CNH)',
    claas: 'německého lídra v kombajnech Claas',
    'massey-ferguson': 'tradiční značku Massey Ferguson (koncern AGCO)',
    valtra: 'finskou značku Valtra (koncern AGCO)',
    'deutz-fahr': 'německou značku Deutz-Fahr (koncern SDF)',
    kubota: 'japonskou značku Kubota',
    zetor: 'českou značku Zetor z Brna',
    // nářaďové značky
    bednar: 'českou značku Bednar',
    amazone: 'německou značku Amazone',
    krone: 'německou značku Krone',
    vaderstad: 'švédskou značku Väderstad',
    pottinger: 'rakouskou značku Pöttinger',
    kverneland: 'norskou značku Kverneland',
    lemken: 'německou značku Lemken',
    kuhn: 'francouzskou značku Kuhn',
  };
  const mapSk: Record<string, string> = {
    fendt: 'nemeckú prémiovú značku Fendt',
    'john-deere': 'amerického giganta John Deere',
    'case-ih': 'americkú značku Case IH (koncern CNH)',
    'new-holland': 'európsku značku New Holland (koncern CNH)',
    claas: 'nemeckého lídra v kombajnoch Claas',
    'massey-ferguson': 'tradičnú značku Massey Ferguson (koncern AGCO)',
    valtra: 'fínsku značku Valtra (koncern AGCO)',
    'deutz-fahr': 'nemeckú značku Deutz-Fahr (koncern SDF)',
    kubota: 'japonskú značku Kubota',
    zetor: 'českú značku Zetor z Brna',
    bednar: 'českú značku Bednar',
    amazone: 'nemeckú značku Amazone',
    krone: 'nemeckú značku Krone',
    vaderstad: 'švédsku značku Väderstad',
    pottinger: 'rakúsku značku Pöttinger',
    kverneland: 'nórsku značku Kverneland',
    lemken: 'nemeckú značku Lemken',
    kuhn: 'francúzsku značku Kuhn',
  };
  const mapUk: Record<string, string> = {
    fendt: 'німецький преміальний бренд Fendt',
    'john-deere': 'американського гіганта John Deere',
    'case-ih': 'американський бренд Case IH (концерн CNH)',
    'new-holland': 'європейський бренд New Holland (концерн CNH)',
    claas: 'німецького лідера у комбайнах Claas',
    'massey-ferguson': 'традиційний бренд Massey Ferguson (концерн AGCO)',
    valtra: 'фінський бренд Valtra (концерн AGCO)',
    'deutz-fahr': 'німецький бренд Deutz-Fahr (концерн SDF)',
    kubota: 'японський бренд Kubota',
    zetor: 'чеський бренд Zetor із Брно',
    bednar: 'чеський бренд Bednar',
    amazone: 'німецький бренд Amazone',
    krone: 'німецький бренд Krone',
    vaderstad: 'шведський бренд Väderstad',
    pottinger: 'австрійський бренд Pöttinger',
    kverneland: 'норвезький бренд Kverneland',
    lemken: 'німецький бренд Lemken',
    kuhn: 'французький бренд Kuhn',
  };
  const mapPl: Record<string, string> = {
    fendt: 'niemiecką markę premium Fendt',
    'john-deere': 'amerykańskiego giganta John Deere',
    'case-ih': 'amerykańską markę Case IH (koncern CNH)',
    'new-holland': 'europejską markę New Holland (koncern CNH)',
    claas: 'niemieckiego lidera kombajnów Claas',
    'massey-ferguson': 'tradycyjną markę Massey Ferguson (koncern AGCO)',
    valtra: 'fińską markę Valtra (koncern AGCO)',
    'deutz-fahr': 'niemiecką markę Deutz-Fahr (koncern SDF)',
    kubota: 'japońską markę Kubota',
    zetor: 'czeską markę Zetor z Brna',
    bednar: 'czeską markę Bednar',
    amazone: 'niemiecką markę Amazone',
    krone: 'niemiecką markę Krone',
    vaderstad: 'szwedzką markę Väderstad',
    pottinger: 'austriacką markę Pöttinger',
    kverneland: 'norweską markę Kverneland',
    lemken: 'niemiecką markę Lemken',
    kuhn: 'francuską markę Kuhn',
  };
  const map = locale === 'sk' ? mapSk : locale === 'uk' ? mapUk : locale === 'pl' ? mapPl : mapCs;
  return map[brand] ?? (locale === 'uk' ? `бренд ${brandName}` : locale === 'pl' ? `markę ${brandName}` : `značku ${brandName}`);
}
