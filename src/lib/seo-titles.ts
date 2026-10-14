/**
 * Šablony <title> a meta description pro stránky, které mají v GSC hodně
 * zobrazení a málo prokliků: detail modelu stroje, heslo slovníku, encyklopedie.
 *
 * Pravidla, která hlídají testy (tests/lib/seo-titles.test.ts):
 *  - titulek slibuje jen to, co stránka opravdu ukáže (cenu jen když ji vykreslí),
 *  - žádná prázdná hodnota („undefined k", „null", „od ") — chybějící údaj se vynechá,
 *  - titulek se vejde do TITLE_MAX znaků; když se nevejde plná verze, bere se kratší.
 *    Brand „| agro-svět.cz" přidává až Layout, a jen když se vejde (pageTitle maxLength).
 */

import { tf, t, bcp47 } from '../i18n/utils';
import type { Locale } from '../i18n/config';
import { TITLE_MAX } from './head-meta';

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** První kandidát, který se vejde do `max`; když žádný, ten nejkratší. Prázdné přeskočí. */
export function firstFitting(candidates: (string | null | undefined | false)[], max = TITLE_MAX): string {
  const list = candidates.filter((c): c is string => typeof c === 'string').map(clean).filter(Boolean);
  if (list.length === 0) return '';
  return list.find((c) => c.length <= max) ?? list.reduce((a, b) => (b.length < a.length ? b : a));
}

const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;

/** Roky výroby do titulku: „1980–1998", u vyráběných „od 2019". Bez roku prázdný řetězec. */
export function machineTitleYears(locale: Locale, yearFrom?: number | null, yearTo?: number | null): string {
  if (!isNum(yearFrom)) return '';
  if (isNum(yearTo)) return yearTo === yearFrom ? String(yearFrom) : `${yearFrom}–${yearTo}`;
  return tf(locale, 'cat.s.d.seoSince', { year: yearFrom });
}

export interface MachineTitleInput {
  /** Značka + model, např. „Zetor 7745". */
  name: string;
  powerHp?: number | null;
  yearFrom?: number | null;
  yearTo?: number | null;
  /** Stránka v tomto jazyce opravdu vykreslí cenu (bazar s cenou / obvyklá cena ojetiny). */
  hasPrice?: boolean;
}

/**
 * „Zetor 7745 — technické údaje a cena: 77 k, 1980–1998". Od nejbohatší verze
 * ubírá: nejdřív cenu, pak roky, nakonec výkon, dokud se titulek nevejde.
 * Model bez výkonu v datech (nářadí) dostane jen „{model} — technické údaje".
 */
export function machineSeoTitle(locale: Locale, m: MachineTitleInput, max = TITLE_MAX): string {
  const head = tf(locale, 'cat.s.d.seoTitle', { name: m.name });
  const headPrice = m.hasPrice ? tf(locale, 'cat.s.d.seoTitlePrice', { name: m.name }) : null;
  const power = isNum(m.powerHp) ? tf(locale, 'cat.s.d.seoPower', { power: m.powerHp }) : '';
  const years = machineTitleYears(locale, m.yearFrom, m.yearTo);
  // Čísla jen s výkonem: samotné „technické údaje: od 2012" (kombajn bez výkonu
  // v datech) čte se jako chyba, ne jako údaj.
  const full = power ? [power, years].filter(Boolean).join(', ') : '';
  const short = power;
  const withFacts = (h: string | null, facts: string) => (h && facts ? `${h}: ${facts}` : null);
  return firstFitting(
    [
      withFacts(headPrice, full),
      withFacts(head, full),
      withFacts(headPrice, short),
      withFacts(head, short),
      headPrice,
      head,
    ],
    max,
  );
}

/**
 * Motor do popisku: „motor Zetor 7201 (3-válec 3,12 L)". Text bere tak, jak ho
 * ukazuje tabulka na stránce — pro sk/pl/uk/de je už přeložený datovou vrstvou
 * (localizeEngine v lib/stroje-data-i18n), takže do cizího jazyka neprosákne
 * čeština. Část za první čárkou jde do závorky, aby se nebila s čárkami výčtu.
 */
export function engineSummary(locale: Locale, engine?: string | null): string {
  const raw = clean(engine ?? '');
  if (!raw) return '';
  const [head, ...rest] = raw.split(', ');
  const body = rest.length > 0 ? `${head} (${rest.join(', ')})` : head;
  return tf(locale, 'cat.s.d.descEngine', { engine: body });
}

export interface MachineDescInput {
  /** Značka + model. */
  title: string;
  /** „traktor" / „kombajn" v daném jazyce. */
  singular: string;
  powerHp: number;
  powerKw?: number | null;
  /** Roky výroby tak, jak je ukazuje stránka („1980–1998", „2019–dosud"). */
  years: string;
  engine?: string | null;
  weightKg?: number | null;
  /** Stránka v tomto jazyce ukáže sekci častých závad. */
  hasFaults?: boolean;
  /** Stránka v tomto jazyce ukáže obvyklou cenu ojetiny. */
  hasUsedPrice?: boolean;
}

/**
 * Spec-led popisek: „Zetor 7745 — traktor, výkon 77 k (57 kW), roky výroby
 * 1980–1998, motor Zetor 7201 (3válcový, 3,12 l). Časté závady a obvyklá cena
 * ojetiny." Začátek (výkon + roky) je změřený jako funkční, ten zůstává vždy;
 * ostatní se ubírá od konce priority, dokud se popisek nevejde do `max`.
 */
export function machineSeoDescription(locale: Locale, m: MachineDescInput, max = 160): string {
  const numLocale = bcp47(locale);
  const kw = isNum(m.powerKw) ? tf(locale, 'cat.s.d.descKw', { kw: m.powerKw }) : '';
  const engine = engineSummary(locale, m.engine);
  const weight = isNum(m.weightKg) ? tf(locale, 'cat.s.d.descWeight', { kg: m.weightKg.toLocaleString(numLocale) }) : '';
  const offers = {
    table: t(locale, 'cat.s.d.descOfferTable'),
    faults: m.hasFaults ? t(locale, 'cat.s.d.descOfferFaults') : '',
    price: m.hasUsedPrice ? t(locale, 'cat.s.d.descOfferUsedPrice') : '',
  };
  const build = (drop: Set<string>) => {
    const extra = [drop.has('engine') ? '' : engine, drop.has('weight') ? '' : weight].filter(Boolean);
    const lead = tf(locale, 'cat.s.d.descFallback', {
      title: m.title,
      singular: m.singular,
      power: m.powerHp,
      kw: drop.has('kw') ? '' : kw,
      years: m.years,
      extra: extra.length > 0 ? `, ${extra.join(', ')}` : '',
    });
    const offerList = (['table', 'faults', 'price'] as const).filter((k) => !drop.has(k) && offers[k]).map((k) => offers[k]);
    const and = t(locale, 'cat.s.d.descAnd');
    const joined = offerList.length > 1
      ? `${offerList.slice(0, -1).join(', ')}${and}${offerList[offerList.length - 1]}`
      : offerList[0] ?? '';
    const sentence = joined ? ` ${joined.charAt(0).toUpperCase()}${joined.slice(1)}.` : '';
    return clean(`${lead}${sentence}`);
  };
  // Pořadí, v jakém se ubírá, když je popisek dlouhý: obecná „tabulka" (titulek už
  // říká technické údaje), hmotnost, kW, motor, cena, závady. Výkon a roky nikdy.
  const DROP_ORDER = ['table', 'weight', 'kw', 'engine', 'price', 'faults'];
  for (let i = 0; i <= DROP_ORDER.length; i++) {
    const d = build(new Set(DROP_ORDER.slice(0, i)));
    if (d.length <= max) return d;
  }
  return build(new Set(DROP_ORDER));
}

export interface EncTitleInput {
  name: string;
  powerHp?: number | null;
  /** Ruční titulek z frontmatteru (`titulek`) — má přednost, když se vejde. */
  titulek?: string | null;
}

/** Encyklopedie: „CLAAS Lexion 8900 — technické údaje, výkon 790 k". */
export function encSeoTitle(locale: Locale, e: EncTitleInput, max = TITLE_MAX): string {
  const power = isNum(e.powerHp) ? e.powerHp : null;
  return firstFitting(
    [
      e.titulek ?? null,
      power ? tf(locale, 'enc.seoTitle', { name: e.name, power }) : null,
      power ? tf(locale, 'enc.seoTitleShort', { name: e.name, power }) : null,
      e.name,
    ],
    max,
  );
}
