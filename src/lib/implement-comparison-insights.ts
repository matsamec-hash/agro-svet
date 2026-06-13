// Verdikt engine pro srovnání NÁŘADÍ na /srovnani/[combo]/ — paralelní k
// comparison-insights.ts (hp osa traktor/kombajn). Osy: pracovní záběr (m),
// potřebný příkon traktoru (k), typ závěsu, rok uvedení. Vše odvozeno z dat,
// templováno cs (default) / sk / uk. Stejný interface jako hp engine.

import type { StrojFlatModel } from './stroje';
import type { Locale } from './../i18n/config';
import { modelDisplayName } from './comparator';
import {
  brandDescriptorAkuzativ,
  type ComparisonFaq,
  type ComparisonInsights,
} from './comparison-insights-shared';

export type { ComparisonFaq, ComparisonInsights };

/** Klauzule velikosti hospodářství dle záběru — fragment za "když"/"ak" bez velkého písmene/tečky. */
function zaberFarmClause(zaber: number | null, locale: Locale): string | null {
  if (zaber === null) return null;
  const pick = (cs: string, sk: string, uk: string): string =>
    locale === 'sk' ? sk : locale === 'uk' ? uk : cs;
  if (zaber < 3.5) return pick(
    'máš menší pozemky a chceš lehkou, snadno manévrovatelnou soupravu',
    'máš menšie pozemky a chceš ľahkú, ľahko manévrovateľnú súpravu',
    'у тебе невеликі ділянки і ти хочеш легкий, маневрений агрегат');
  if (zaber < 6) return pick(
    'hospodaříš na střední výměře a hledáš rovnováhu mezi záběrem a potřebným výkonem traktoru',
    'hospodáriš na strednej výmere a hľadáš rovnováhu medzi záberom a potrebným výkonom traktora',
    'ти господарюєш на середній площі і шукаєш баланс між шириною захвату та потрібною потужністю трактора');
  if (zaber < 9) return pick(
    'obděláváš větší výměru a chceš vyšší denní plošný výkon',
    'obrábaš väčšiu výmeru a chceš vyšší denný plošný výkon',
    'ти обробляєш більшу площу і хочеш вищу денну продуктивність');
  return pick(
    'jsi velkovýroba a chceš maximum hektarů za den s nejširším záběrem',
    'si veľkovýroba a chceš maximum hektárov za deň s najširším záberom',
    'ти великотоварне виробництво і хочеш максимум гектарів за день із найширшим захватом');
}

/** Lokalizovaný název typu závěsu (nominativ). */
function zavesNoun(typ: string | null | undefined, locale: Locale): string | null {
  if (!typ) return null;
  const t: Record<string, [string, string, string]> = {
    neseny: ['nesený', 'nesený', 'начіпний'],
    tazeny: ['tažený', 'ťahaný', 'причіпний'],
    poloneseny: ['polonesený', 'polonesený', 'напівначіпний'],
    samojizdny: ['samojízdný', 'samohybný', 'самохідний'],
    navesny: ['návěsný', 'návesný', 'причіпний (на přívěsu)'],
  };
  const row = t[typ];
  if (!row) return null;
  return locale === 'sk' ? row[1] : locale === 'uk' ? row[2] : row[0];
}

export function implementComparisonInsights(
  a: StrojFlatModel,
  b: StrojFlatModel,
  locale: Locale = 'cs',
): ComparisonInsights {
  const pick = (cs: string, sk: string, uk: string): string =>
    locale === 'sk' ? sk : locale === 'uk' ? uk : cs;
  const numLocale = locale === 'sk' ? 'sk-SK' : locale === 'uk' ? 'uk-UA' : 'cs-CZ';
  const num = (n: number): string => n.toLocaleString(numLocale);
  const aName = modelDisplayName(a);
  const bName = modelDisplayName(b);

  // ---- Záběr ----
  const aZ = a.pracovni_zaber_m ?? null;
  const bZ = b.pracovni_zaber_m ?? null;
  const zDiff = aZ !== null && bZ !== null ? aZ - bZ : null;
  const wider = zDiff !== null && zDiff !== 0 ? (zDiff > 0 ? a : b) : null;

  // ---- Příkon (min) ----
  const aP = a.prikon_traktor_hp_min ?? null;
  const bP = b.prikon_traktor_hp_min ?? null;
  const pDiff = aP !== null && bP !== null ? aP - bP : null;
  const lessPower = pDiff !== null && pDiff !== 0 ? (pDiff < 0 ? a : b) : null;

  // ---- Rok ----
  const aY = a.year_from;
  const bY = b.year_from;
  const yDiff = aY !== null && bY !== null ? aY - bY : null;
  const newer = yDiff !== null && yDiff !== 0 ? (yDiff > 0 ? a : b) : null;

  const fmtZ = (z: number): string => `${num(z)} m`;

  // ---- TL;DR ----
  const tldrParts: string[] = [];
  if (wider && zDiff !== null) {
    const widerName = modelDisplayName(wider);
    const widerZ = wider === a ? aZ! : bZ!;
    const narrowerZ = wider === a ? bZ! : aZ!;
    tldrParts.push(pick(
      `${widerName} má širší záběr o ${num(Math.abs(zDiff))} m (${fmtZ(widerZ)} vs ${fmtZ(narrowerZ)}) — vyšší plošný výkon, ale potřebuje silnější traktor.`,
      `${widerName} má širší záber o ${num(Math.abs(zDiff))} m (${fmtZ(widerZ)} vs ${fmtZ(narrowerZ)}) — vyšší plošný výkon, ale potrebuje silnejší traktor.`,
      `${widerName} має ширший захват на ${num(Math.abs(zDiff))} м (${fmtZ(widerZ)} проти ${fmtZ(narrowerZ)}) — вища продуктивність, але потрібен потужніший трактор.`));
  } else if (aZ !== null && bZ !== null && zDiff === 0) {
    tldrParts.push(pick(
      `${aName} i ${bName} mají stejný pracovní záběr ${fmtZ(aZ)}.`,
      `${aName} aj ${bName} majú rovnaký pracovný záber ${fmtZ(aZ)}.`,
      `${aName} і ${bName} мають однакову ширину захвату ${fmtZ(aZ)}.`));
  }

  if (lessPower && pDiff !== null) {
    const lpName = modelDisplayName(lessPower);
    const lpP = lessPower === a ? aP! : bP!;
    tldrParts.push(pick(
      `${lpName} vystačí s lehčím traktorem (od ${num(lpP)} k).`,
      `${lpName} vystačí s ľahším traktorom (od ${num(lpP)} k).`,
      `${lpName} обходиться легшим трактором (від ${num(lpP)} к.с.).`));
  }

  const aZav = zavesNoun(a.typ_zavesu, locale);
  const bZav = zavesNoun(b.typ_zavesu, locale);
  if (aZav && bZav && a.typ_zavesu !== b.typ_zavesu) {
    tldrParts.push(pick(
      `${aName} je ${aZav}, ${bName} je ${bZav}.`,
      `${aName} je ${aZav}, ${bName} je ${bZav}.`,
      `${aName} — ${aZav}, ${bName} — ${bZav}.`));
  }

  if (tldrParts.length === 0) {
    tldrParts.push(pick(
      `${aName} a ${bName} jsou stroje srovnatelné třídy.`,
      `${aName} a ${bName} sú stroje porovnateľnej triedy.`,
      `${aName} та ${bName} — машини порівнянного класу.`));
  }
  const tldr = tldrParts.join(' ');

  // ---- Meta description (≤158) ----
  let shortDescription: string;
  if (wider && zDiff !== null) {
    const widerName = modelDisplayName(wider);
    shortDescription = pick(
      `Srovnání: ${aName} vs ${bName}. ${widerName} má širší záběr (+${num(Math.abs(zDiff))} m). Příkon traktoru, typ závěsu, hmotnost a FAQ vedle sebe.`,
      `Porovnanie: ${aName} vs ${bName}. ${widerName} má širší záber (+${num(Math.abs(zDiff))} m). Príkon traktora, typ závesu, hmotnosť a FAQ vedľa seba.`,
      `Порівняння: ${aName} vs ${bName}. ${widerName} має ширший захват (+${num(Math.abs(zDiff))} м). Потужність трактора, тип зчіпки, маса та FAQ поряд.`);
  } else {
    shortDescription = pick(
      `Srovnání ${aName} a ${bName}: pracovní záběr, potřebný příkon traktoru, typ závěsu, hmotnost a FAQ.`,
      `Porovnanie ${aName} a ${bName}: pracovný záber, potrebný príkon traktora, typ závesu, hmotnosť a FAQ.`,
      `Порівняння ${aName} та ${bName}: ширина захвату, потрібна потужність трактора, тип зчіпки, маса та FAQ.`);
  }
  if (shortDescription.length > 158) shortDescription = shortDescription.slice(0, 155) + '…';

  // ---- Decision boxy ----
  function buildDecision(self: StrojFlatModel, other: StrojFlatModel): string {
    const parts: string[] = [];
    const selfName = modelDisplayName(self);
    const selfZ = self.pracovni_zaber_m ?? null;
    const isWider = wider === self;
    const isLessPower = lessPower === self;
    const isNewer = newer === self;
    if (isWider && selfZ !== null) {
      parts.push(pick(
        `potřebuješ vyšší plošný výkon — širší záběr ${fmtZ(selfZ)} zvládne víc hektarů za den`,
        `potrebuješ vyšší plošný výkon — širší záber ${fmtZ(selfZ)} zvládne viac hektárov za deň`,
        `тобі потрібна вища продуктивність — ширший захват ${fmtZ(selfZ)} обробить більше гектарів за день`));
    }
    if (isLessPower && self.prikon_traktor_hp_min !== null) {
      parts.push(pick(
        `máš k dispozici slabší traktor (stačí od ${num(self.prikon_traktor_hp_min)} k)`,
        `máš k dispozícii slabší traktor (stačí od ${num(self.prikon_traktor_hp_min)} k)`,
        `у тебе слабший трактор (достатньо від ${num(self.prikon_traktor_hp_min)} к.с.)`));
    }
    const selfZav = zavesNoun(self.typ_zavesu, locale);
    if (selfZav && other.typ_zavesu !== self.typ_zavesu) {
      if (self.typ_zavesu === 'neseny' || self.typ_zavesu === 'poloneseny') {
        parts.push(pick(
          `chceš ${selfZav} stroj (kratší souprava, lepší manévrovatelnost)`,
          `chceš ${selfZav} stroj (kratšia súprava, lepšia manévrovateľnosť)`,
          `ти хочеш ${selfZav} агрегат (коротший склад, краща маневреність)`));
      } else {
        parts.push(pick(
          `preferuješ ${selfZav} stroj (větší záběr bez zatížení zadní nápravy traktoru)`,
          `preferuješ ${selfZav} stroj (väčší záber bez zaťaženia zadnej nápravy traktora)`,
          `ти віддаєш перевагу ${selfZav} агрегату (більший захват без навантаження задньої осі трактора)`));
      }
    }
    if (isNewer && yDiff !== null && Math.abs(yDiff) >= 2) {
      parts.push(pick(
        `chceš novější konstrukci (uvedení ${self.year_from})`,
        `chceš novšiu konštrukciu (uvedenie ${self.year_from})`,
        `хочеш новішу конструкцію (представлення ${self.year_from})`));
    }
    if (parts.length === 0) {
      const sizeClause = zaberFarmClause(self.pracovni_zaber_m ?? null, locale);
      if (sizeClause) parts.push(sizeClause);
      parts.push(pick(
        `preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`,
        `preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`,
        `орієнтуєшся на ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`));
    }
    return pick(
      `Vyber ${selfName} pokud ${parts.join(', a zároveň ')}.`,
      `Vyber ${selfName}, ak ${parts.join(', a zároveň ')}.`,
      `Обери ${selfName}, якщо ${parts.join(', а водночас ')}.`);
  }
  const decisionA = buildDecision(a, b);
  const decisionB = buildDecision(b, a);

  // ---- FAQs ----
  const faqs: ComparisonFaq[] = [];

  // Q1: záběr
  if (aZ !== null && bZ !== null) {
    if (zDiff === 0) {
      faqs.push({
        q: pick(`Jaký pracovní záběr mají ${aName} a ${bName}?`, `Aký pracovný záber majú ${aName} a ${bName}?`, `Яка ширина захвату в ${aName} та ${bName}?`),
        a: pick(
          `Oba stroje mají shodný pracovní záběr ${fmtZ(aZ)}. Rozhodující rozdíl je tedy v potřebném příkonu traktoru, typu závěsu a hmotnosti.`,
          `Oba stroje majú zhodný pracovný záber ${fmtZ(aZ)}. Rozhodujúci rozdiel je teda v potrebnom príkone traktora, type závesu a hmotnosti.`,
          `Обидві машини мають однакову ширину захвату ${fmtZ(aZ)}. Вирішальна різниця — у потрібній потужності трактора, типі зчіпки та масі.`),
      });
    } else {
      const widerName = modelDisplayName(wider!);
      const widerZ = wider === a ? aZ : bZ;
      const narrowerZ = wider === a ? bZ : aZ;
      const narrowerName = wider === a ? bName : aName;
      faqs.push({
        q: pick(`Co má širší záběr — ${aName}, nebo ${bName}?`, `Čo má širší záber — ${aName}, alebo ${bName}?`, `Що має ширший захват — ${aName} чи ${bName}?`),
        a: pick(
          `Širší záběr má ${widerName} (${fmtZ(widerZ)}) oproti ${fmtZ(narrowerZ)} u ${narrowerName}, rozdíl ${num(Math.abs(zDiff))} m. Širší záběr znamená vyšší plošný výkon, ale i vyšší nároky na výkon traktoru.`,
          `Širší záber má ${widerName} (${fmtZ(widerZ)}) oproti ${fmtZ(narrowerZ)} u ${narrowerName}, rozdiel ${num(Math.abs(zDiff))} m. Širší záber znamená vyšší plošný výkon, ale aj vyššie nároky na výkon traktora.`,
          `Ширший захват у ${widerName} (${fmtZ(widerZ)}) проти ${fmtZ(narrowerZ)} у ${narrowerName}, різниця ${num(Math.abs(zDiff))} м. Ширший захват означає вищу продуктивність, але й вищі вимоги до потужності трактора.`),
      });
    }
  }

  // Q2: příkon traktoru
  if (aP !== null || bP !== null) {
    const fmtPrikon = (m: StrojFlatModel): string => {
      const lo = m.prikon_traktor_hp_min ?? null;
      const hi = m.prikon_traktor_hp_max ?? null;
      if (lo === null && hi === null) return pick('neuvedeno', 'neuvedené', 'не вказано');
      if (lo !== null && hi !== null) return lo === hi ? `${num(lo)} k` : `${num(lo)}–${num(hi)} k`;
      return `${num((lo ?? hi)!)} k`;
    };
    faqs.push({
      q: pick(`Jaký traktor je potřeba pro ${aName} a ${bName}?`, `Aký traktor je potrebný pre ${aName} a ${bName}?`, `Який трактор потрібен для ${aName} та ${bName}?`),
      a: pick(
        `${aName} vyžaduje traktor ${fmtPrikon(a)}, ${bName} ${fmtPrikon(b)}. Zvol stroj podle výkonu traktoru, který máš v parku.`,
        `${aName} vyžaduje traktor ${fmtPrikon(a)}, ${bName} ${fmtPrikon(b)}. Zvoľ stroj podľa výkonu traktora, ktorý máš v parku.`,
        `${aName} потребує трактор ${fmtPrikon(a)}, ${bName} — ${fmtPrikon(b)}. Обирай машину за потужністю трактора, який є у твоєму парку.`),
    });
  }

  // Q3: typ závěsu
  if (aZav || bZav) {
    faqs.push({
      q: pick(`Jsou ${aName} a ${bName} nesené, nebo tažené?`, `Sú ${aName} a ${bName} nesené, alebo ťahané?`, `${aName} та ${bName} начіпні чи причіпні?`),
      a: pick(
        `${aName}: ${aZav ?? 'neuvedeno'}. ${bName}: ${bZav ?? 'neuvedeno'}. Nesené stroje jsou obratnější a kratší, tažené umožní větší záběr bez zatížení zadní nápravy traktoru.`,
        `${aName}: ${aZav ?? 'neuvedené'}. ${bName}: ${bZav ?? 'neuvedené'}. Nesené stroje sú obratnejšie a kratšie, ťahané umožnia väčší záber bez zaťaženia zadnej nápravy traktora.`,
        `${aName}: ${aZav ?? 'не вказано'}. ${bName}: ${bZav ?? 'не вказано'}. Начіпні машини маневреніші й коротші, причіпні дають більший захват без навантаження задньої осі трактора.`),
    });
  }

  // Q4: vhodnost dle záběru
  const aFarm = zaberFarmClause(aZ, locale);
  const bFarm = zaberFarmClause(bZ, locale);
  if (aFarm || bFarm) {
    const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
    const parts: string[] = [];
    if (aFarm) parts.push(`${aName} — ${cap(aFarm)}.`);
    if (bFarm) parts.push(`${bName} — ${cap(bFarm)}.`);
    faqs.push({
      q: pick(`Pro jak velkou farmu se ${aName} a ${bName} hodí?`, `Pre akú veľkú farmu sa ${aName} a ${bName} hodia?`, `Для якої ферми підходять ${aName} та ${bName}?`),
      a: parts.join(' '),
    });
  }

  // Q5: rok / novost
  if (aY !== null && bY !== null) {
    if (yDiff === 0) {
      faqs.push({
        q: pick(`Kdy byly ${aName} a ${bName} uvedeny?`, `Kedy boli ${aName} a ${bName} uvedené?`, `Коли вийшли ${aName} та ${bName}?`),
        a: pick(
          `Oba stroje byly uvedeny v roce ${aY}, jde o současníky stejné generace.`,
          `Oba stroje boli uvedené v roku ${aY}, ide o súčasníkov rovnakej generácie.`,
          `Обидві машини вийшли у ${aY} році — це сучасники одного покоління.`),
      });
    } else {
      const newerName = modelDisplayName(newer!);
      const newerYear = newer === a ? aY : bY;
      const olderYear = newer === a ? bY : aY;
      faqs.push({
        q: pick(`Který stroj je novější?`, `Ktorý stroj je novší?`, `Яка машина новіша?`),
        a: pick(
          `Novější je ${newerName}, uvedený v roce ${newerYear} (oproti ${olderYear}). Novější konstrukce typicky znamená lepší kompatibilitu s ISOBUS a aktuálnější řešení uložení/seřízení.`,
          `Novší je ${newerName}, uvedený v roku ${newerYear} (oproti ${olderYear}). Novšia konštrukcia typicky znamená lepšiu kompatibilitu s ISOBUS a aktuálnejšie riešenie uloženia/nastavenia.`,
          `Новіша — ${newerName}, представлена у ${newerYear} році (проти ${olderYear}). Новіша конструкція зазвичай означає кращу сумісність з ISOBUS та сучасніші рішення.`),
      });
    }
  }

  faqs.splice(5);

  const lastUpdatedIso = new Date().toISOString().slice(0, 10);

  return { tldr, shortDescription, decisionA, decisionB, faqs, lastUpdatedIso };
}
