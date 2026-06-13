// Sezónní agregační vrstva. Čistá, bez astro:content/async — testovatelná.
// Data: plodiny (listPlodiny) + statická kurátorská mapa howto→sezóna.

import { listPlodiny, type Plodina } from './plodiny';
import type { Akce } from './akce';

export type SeasonSlug = 'jaro' | 'leto' | 'podzim' | 'zima';

export interface Season {
  slug: SeasonSlug;
  name: string;
  /** Měsíce sezóny (1–12). */
  months: number[];
}

export const SEASONS: Season[] = [
  { slug: 'jaro', name: 'Jaro', months: [3, 4, 5] },
  { slug: 'leto', name: 'Léto', months: [6, 7, 8] },
  { slug: 'podzim', name: 'Podzim', months: [9, 10, 11] },
  { slug: 'zima', name: 'Zima', months: [12, 1, 2] },
];

export const MONTH_NAMES_CS = [
  'leden', 'únor', 'březen', 'duben', 'květen', 'červen',
  'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec',
];

export function getSeason(slug: string): Season | undefined {
  return SEASONS.find((s) => s.slug === slug);
}

export function seasonOfMonth(month: number): SeasonSlug {
  return SEASONS.find((s) => s.months.includes(month))!.slug;
}

function sortCs(arr: Plodina[]): Plodina[] {
  return [...arr].sort((a, b) => a.name.localeCompare(b.name, 'cs'));
}

export function cropsSownInMonth(month: number): Plodina[] {
  return sortCs(listPlodiny().filter((p) => p.seti_mesice?.includes(month)));
}

export function cropsHarvestedInMonth(month: number): Plodina[] {
  return sortCs(listPlodiny().filter((p) => p.sklizen_mesice?.includes(month)));
}

export function cropsSownInSeason(slug: SeasonSlug): Plodina[] {
  const months = getSeason(slug)!.months;
  return sortCs(listPlodiny().filter((p) => p.seti_mesice?.some((m) => months.includes(m))));
}

export function cropsHarvestedInSeason(slug: SeasonSlug): Plodina[] {
  const months = getSeason(slug)!.months;
  return sortCs(listPlodiny().filter((p) => p.sklizen_mesice?.some((m) => months.includes(m))));
}

export interface SeasonalLink {
  href: string;
  label: string;
}

export interface SeasonContent {
  lead: string;
  workLinks: SeasonalLink[];
  faq: { q: string; a: string }[];
}

// Kurátorský editorial obsah. Krátké leady (czech-ag-article-style), polní práce
// jako odkazy na existující howto/pruvodce, sezónní FAQ. Žádné dlouhé AI texty.
export const SEASON_CONTENT: Record<SeasonSlug, SeasonContent> = {
  jaro: {
    lead: 'Na jaře se na poli sejí jařiny — jarní ječmen, jarní pšenice, mák, slunečnice, cukrovka i kukuřice. Hlavní práce jsou příprava seťového lůžka, jarní hnojení dusíkem a včasné setí; pozdní výsev jařin snižuje výnos.',
    workLinks: [
      { href: '/jak-na-to/jak-nastavit-seci-stroj/', label: 'Jak nastavit secí stroj' },
      { href: '/pruvodce/jak-vybrat-postrikovac/', label: 'Jak vybrat postřikovač' },
      { href: '/pruvodce/jak-vybrat-rozmetadlo-hnojiv/', label: 'Jak vybrat rozmetadlo hnojiv' },
    ],
    faq: [
      { q: 'Co se na poli seje na jaře?', a: 'Na jaře (březen–květen) se sejí jařiny: jarní ječmen a pšenice (únor–březen), dále mák, cukrovka, slunečnice (březen–duben) a kukuřice se sójou (duben–květen).' },
      { q: 'Proč je u jařin důležitý raný výsev?', a: 'Raný výsev využívá jarní půdní vláhu a prodlužuje vegetaci. Každý týden zpoždění může u jarního ječmene snížit výnos o 0,2–0,3 t/ha a zhoršit jakost.' },
      { q: 'Jaké jsou hlavní jarní práce na poli?', a: 'Příprava seťového lůžka, smykování a vláčení, jarní přihnojení ozimů dusíkem, setí jařin a první ošetření porostů proti plevelům a chorobám.' },
    ],
  },
  leto: {
    lead: 'V létě vrcholí sklizeň: ozimý ječmen (červen), ozimá pšenice, žito, tritikale a hrách (červenec), poté řepka a jarní obiloviny (červenec–srpen). Souběžně probíhá seč pícnin a balíkování slámy a sena.',
    workLinks: [
      { href: '/pruvodce/jak-vybrat-kombajn-stredni-farma/', label: 'Jak vybrat kombajn pro střední farmu' },
      { href: '/pruvodce/jak-vybrat-seci-stroj/', label: 'Jak vybrat secí (žací) stroj' },
      { href: '/pruvodce/jak-vybrat-lis-na-baliky/', label: 'Jak vybrat lis na balíky' },
    ],
    faq: [
      { q: 'Co se sklízí v létě?', a: 'V červnu ozimý ječmen, v červenci ozimá pšenice, žito, tritikale, řepka a hrách, v srpnu jarní obiloviny, mák a řepka jarní.' },
      { q: 'Při jaké vlhkosti zrna sklízet obiloviny?', a: 'Obiloviny se sklízejí při vlhkosti zrna zhruba 13–15 %. Vyšší vlhkost vyžaduje dosoušení, nižší zvyšuje ztráty vydrolením.' },
      { q: 'Jaké letní práce kromě sklizně?', a: 'Seč a sklizeň pícnin (jetel, vojtěška), lisování slámy a sena, podmítka po sklizni a příprava na setí meziplodin či ozimé řepky.' },
    ],
  },
  podzim: {
    lead: 'Na podzim se zakládají ozimy — ozimá řepka (srpen–září), ozimá pšenice, ječmen, žito a tritikale (září–říjen). Dokončuje se sklizeň okopanin: brambory, cukrovka, kukuřice a slunečnice. Klíčová je podmítka a podzimní zpracování půdy.',
    workLinks: [
      { href: '/jak-na-to/jak-seridit-pluh/', label: 'Jak seřídit pluh' },
      { href: '/pruvodce/jak-vybrat-rozmetadlo-hnojiv/', label: 'Jak vybrat rozmetadlo hnojiv' },
      { href: '/pruvodce/jak-vybrat-kombajn-stredni-farma/', label: 'Jak vybrat kombajn pro střední farmu' },
    ],
    faq: [
      { q: 'Co se seje na podzim?', a: 'Ozimy: řepka ozimá (srpen–září), ozimá pšenice, ozimý ječmen, žito a tritikale (září–říjen). Termín setí ozimů je klíčový pro přezimování.' },
      { q: 'Co se sklízí na podzim?', a: 'Okopaniny a pozdní plodiny: brambory (srpen–říjen), cukrovka (září–listopad), kukuřice a slunečnice (září–říjen).' },
      { q: 'Proč je důležitá podmítka?', a: 'Podmítka po sklizni přerušuje kapilaritu, podporuje vzcházení výdrolu a plevelů k následné likvidaci a zapravuje posklizňové zbytky — základ přípravy půdy pro ozimy.' },
    ],
  },
  zima: {
    lead: 'V zimě polní práce odpočívají. Je čas na údržbu a seřízení techniky, plánování osevního postupu, nákup osiv a hnojiv a vyřízení dotací. Ozimy přezimují; sleduje se jejich stav a hrozba vyzimování.',
    workLinks: [
      { href: '/pruvodce/kontrola-ojeteho-traktoru/', label: 'Kontrola ojetého traktoru' },
      { href: '/pruvodce/prvni-traktor-mlady-zemedelec/', label: 'První traktor pro mladého zemědělce' },
    ],
    faq: [
      { q: 'Jaké práce dělat na poli v zimě?', a: 'Polní práce v zimě většinou stojí. Hospodaří se s časem na servis a seřízení strojů, plánování osevních postupů, nákup vstupů (osivo, hnojiva) a administrativu dotací.' },
      { q: 'Co se děje s ozimy v zimě?', a: 'Ozimy přezimují v klidovém stavu. Sleduje se sněhová pokrývka, riziko vyzimování při holomrazech a výskyt plísně sněžné; jarní regenerace začíná s oteplením.' },
    ],
  },
};

export function seasonLead(slug: SeasonSlug): string {
  return SEASON_CONTENT[slug].lead;
}
export function seasonWorkLinks(slug: SeasonSlug): SeasonalLink[] {
  return SEASON_CONTENT[slug].workLinks;
}
export function seasonFaq(slug: SeasonSlug): { q: string; a: string }[] {
  return SEASON_CONTENT[slug].faq;
}

/** Nadcházející akce (pristi_vyskyt >= dnešek), jejichž měsíc spadá do sezóny;
 *  seřazené vzestupně dle data. Čistá — bere `now` parametrem (testovatelnost). */
export function akceInSeason(akce: Akce[], seasonSlug: SeasonSlug, now: Date): Akce[] {
  const months = getSeason(seasonSlug)!.months;
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return akce
    .filter((a) => {
      if (!a.pristi_vyskyt) return false;
      const d = new Date(a.pristi_vyskyt);
      if (Number.isNaN(d.getTime())) return false;
      const dMs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      if (dMs < todayMs) return false;
      return months.includes(d.getMonth() + 1);
    })
    .sort((a, b) => (a.pristi_vyskyt! < b.pristi_vyskyt! ? -1 : a.pristi_vyskyt! > b.pristi_vyskyt! ? 1 : 0));
}
