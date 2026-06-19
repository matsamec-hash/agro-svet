// Dynamic comparison insights for /srovnani/[combo]/ pages.
//
// Generates a per-pair TL;DR verdict, dual decision box ("Kdy A vs Kdy B"),
// short SERP-grade meta description, and 5 FAQPage entries — everything
// derived from StrojFlatModel data so we avoid generic boilerplate that
// LLMs and Google deprioritize.
//
// Locale-aware: the function emits cs (default) byte-identically to the
// original, a native Slovak variant for locale 'sk', and a native Ukrainian
// variant for locale 'uk'. Phrases are NOT a translation of this file — they
// are locale-keyed templates built inline so the cs branch stays diff-proof
// against the pre-i18n output.

import type { StrojFlatModel, StrojKategorie } from './stroje';
import type { Locale } from './../i18n/config';
import { modelDisplayName } from './comparator';
import { useCaseDescription } from './competitor-finder';
import { pct, brandDescriptorAkuzativ } from './comparison-insights-shared';
export type { ComparisonFaq, ComparisonInsights } from './comparison-insights-shared';

/**
 * Short dependent-clause describing the farm size implied by a power level.
 * Designed to fit grammatically after "když"/"ak" — returns a fragment without
 * the leading capital letter or trailing period.
 */
function farmSizeClause(category: StrojKategorie, powerHp: number | null, locale: Locale): string | null {
  if (powerHp === null) return null;
  const pick = (cs: string, sk: string, uk: string, pl: string): string =>
    locale === 'sk' ? sk : locale === 'uk' ? uk : locale === 'pl' ? pl : cs;
  if (category === 'traktory') {
    if (powerHp < 50) return pick(
      'máš malé hospodářství do cca 30 hektarů (sady, vinice, komunální využití)',
      'máš malé hospodárstvo do cca 30 hektárov (sady, vinice, komunálne využitie)',
      'у тебе невелике господарство до приблизно 30 гектарів (сади, виноградники, комунальне використання)',
      'masz małe gospodarstwo do ok. 30 hektarów (sady, winnice, zastosowanie komunalne)');
    if (powerHp < 90) return pick(
      'hospodaříš na 30–100 hektarech a hledáš univerzál pro polní práci a sklizeň trávy',
      'hospodáriš na 30–100 hektároch a hľadáš univerzál na poľnú prácu a zber trávy',
      'ти господарюєш на 30–100 гектарах і шукаєш універсал для польових робіт та збирання трави',
      'gospodarzysz na 30–100 hektarach i szukasz wszechstronnego ciągnika do prac polowych i zbioru trawy');
    if (powerHp < 160) return pick(
      'máš střední farmu 100–300 hektarů pro orbu, secí kombinace a postřik',
      'máš strednú farmu 100–300 hektárov na orbu, sejacie kombinácie a postrek',
      'у тебе середня ферма 100–300 гектарів для оранки, посівних комбінацій та обприскування',
      'masz średnie gospodarstwo 100–300 hektarów do orki, agregatów siewnych i oprysku');
    if (powerHp < 250) return pick(
      'máš velkou farmu 300–600 hektarů a chceš tahat široké secí kombinace nebo samochodné postřikovače',
      'máš veľkú farmu 300–600 hektárov a chceš ťahať široké sejacie kombinácie alebo samohybné postrekovače',
      'у тебе велика ферма 300–600 гектарів і ти хочеш тягати широкі посівні комбінації або самохідні обприскувачі',
      'masz duże gospodarstwo 300–600 hektarów i chcesz ciągnąć szerokie agregaty siewne lub samojezdne opryskiwacze');
    return pick(
      'jsi velkovýroba nad 500 hektarů a chceš maximum z denní produktivity',
      'si veľkovýroba nad 500 hektárov a chceš maximum z dennej produktivity',
      'ти великотоварне виробництво понад 500 гектарів і хочеш максимум денної продуктивності',
      'prowadzisz wielkoobszarową produkcję powyżej 500 hektarów i chcesz maksymalnej dziennej wydajności');
  }
  if (category === 'kombajny') {
    if (powerHp < 250) return pick(
      'máš obilninou plochu do 200 ha a vystačíš si se záběrem 5–6 m',
      'máš obilninovú plochu do 200 ha a vystačíš si so záberom 5–6 m',
      'у тебе площа зернових до 200 га і тобі вистачить захвату 5–6 м',
      'masz powierzchnię zbóż do 200 ha i wystarczy ci szerokość robocza 5–6 m');
    if (powerHp < 400) return pick(
      'sklízíš 200–500 ha obilnin a hodí se ti záběr 6–9 m',
      'zbieraš 200–500 ha obilnín a hodí sa ti záber 6–9 m',
      'ти збираєш 200–500 га зернових і тобі підходить захват 6–9 м',
      'zbieras 200–500 ha zbóż i odpowiada ci szerokość robocza 6–9 m');
    if (powerHp < 600) return pick(
      'sklízíš přes 500 ha obilnin a chceš záběr 9–12 m',
      'zbieraš cez 500 ha obilnín a chceš záber 9–12 m',
      'ти збираєш понад 500 га зернових і хочеш захват 9–12 м',
      'zbieras powyżej 500 ha zbóż i chcesz szerokość roboczą 9–12 m');
    return pick(
      'jsi velkovýroba a chceš nejširší záběr (12 m+) a největší zásobník (14 000+ l)',
      'si veľkovýroba a chceš najširší záber (12 m+) a najväčší zásobník (14 000+ l)',
      'ти великотоварне виробництво і хочеш найширший захват (12 м+) та найбільший бункер (14 000+ л)',
      'prowadzisz wielkoobszarową produkcję i chcesz największą szerokość roboczą (12 m+) oraz największy zbiornik (14 000+ l)');
  }
  return null;
}

export function comparisonInsights(
  a: StrojFlatModel,
  b: StrojFlatModel,
  locale: Locale = 'cs',
): ComparisonInsights {
  const pick = (cs: string, sk: string, uk: string, pl: string): string =>
    locale === 'sk' ? sk : locale === 'uk' ? uk : locale === 'pl' ? pl : cs;
  const num = (n: number): string =>
    n.toLocaleString(locale === 'sk' ? 'sk-SK' : locale === 'uk' ? 'uk-UA' : locale === 'pl' ? 'pl-PL' : 'cs-CZ');
  const aName = modelDisplayName(a);
  const bName = modelDisplayName(b);
  const isTractor = a.category === 'traktory';
  const categoryWord = isTractor ? 'traktor' : 'kombajn';
  const categoryWordUk = isTractor ? 'трактор' : 'комбайн';
  const categoryWordPl = isTractor ? 'ciągnik' : 'kombajn';

  // ---- Numeric diffs ----
  const aHp = a.power_hp;
  const bHp = b.power_hp;
  const hpDiff = aHp !== null && bHp !== null ? aHp - bHp : null;
  const hpPct = aHp !== null && bHp !== null ? pct(aHp, bHp) : null;

  const aKg = a.weight_kg ?? null;
  const bKg = b.weight_kg ?? null;
  const kgDiff = aKg !== null && bKg !== null ? aKg - bKg : null;

  const aYear = a.year_from;
  const bYear = b.year_from;
  const yearDiff = aYear !== null && bYear !== null ? aYear - bYear : null;

  const stronger = hpDiff !== null && hpDiff !== 0 ? (hpDiff > 0 ? a : b) : null;
  const lighter = kgDiff !== null && kgDiff !== 0 ? (kgDiff < 0 ? a : b) : null;
  const newer = yearDiff !== null && yearDiff !== 0 ? (yearDiff > 0 ? a : b) : null;

  // ---- TL;DR (LLM-citable definitional answer) ----
  const tldrParts: string[] = [];
  if (stronger && hpDiff !== null && hpPct !== null) {
    const absHp = Math.abs(hpDiff);
    const absPct = Math.abs(hpPct);
    const strongerName = modelDisplayName(stronger);
    const weakerHp = stronger === a ? bHp : aHp;
    const strongerHp = stronger === a ? aHp : bHp;
    tldrParts.push(pick(
      `${strongerName} má vyšší výkon o ${absHp} k (${num(strongerHp!)} vs ${num(weakerHp!)} k, +${absPct} %).`,
      `${strongerName} má vyšší výkon o ${absHp} k (${num(strongerHp!)} vs ${num(weakerHp!)} k, +${absPct} %).`,
      `${strongerName} має вищу потужність на ${absHp} к.с. (${num(strongerHp!)} проти ${num(weakerHp!)} к.с., +${absPct} %).`,
      `${strongerName} ma wyższą moc o ${absHp} KM (${num(strongerHp!)} vs ${num(weakerHp!)} KM, +${absPct} %).`,
    ));
  } else if (aHp !== null && bHp !== null && hpDiff === 0) {
    tldrParts.push(pick(
      `Oba ${categoryWord}y mají stejný výkon ${num(aHp)} k.`,
      `Oba ${categoryWord}y majú rovnaký výkon ${num(aHp)} k.`,
      `Обидва ${categoryWordUk}и мають однакову потужність ${num(aHp)} к.с.`,
      `Oba ${categoryWordPl}i mają taką samą moc ${num(aHp)} KM.`));
  }

  if (lighter && kgDiff !== null) {
    const lighterName = modelDisplayName(lighter);
    tldrParts.push(pick(
      `${lighterName} je lehčí o ${num(Math.abs(kgDiff))} kg.`,
      `${lighterName} je ľahší o ${num(Math.abs(kgDiff))} kg.`,
      `${lighterName} легший на ${num(Math.abs(kgDiff))} кг.`,
      `${lighterName} jest lżejszy o ${num(Math.abs(kgDiff))} kg.`));
  }

  if (newer && yearDiff !== null && Math.abs(yearDiff) >= 2) {
    const newerName = modelDisplayName(newer);
    const newerYear = newer === a ? aYear : bYear;
    tldrParts.push(pick(
      `${newerName} je novější (uveden ${newerYear}).`,
      `${newerName} je novší (uvedený ${newerYear}).`,
      `${newerName} новіший (представлений у ${newerYear}).`,
      `${newerName} jest nowszy (wprowadzony w ${newerYear}).`));
  }

  if (tldrParts.length === 0) {
    tldrParts.push(pick(
      `${aName} a ${bName} jsou ${categoryWord}y srovnatelné třídy.`,
      `${aName} a ${bName} sú ${categoryWord}y porovnateľnej triedy.`,
      `${aName} та ${bName} — ${categoryWordUk}и порівнянного класу.`,
      `${aName} i ${bName} to ${categoryWordPl}i porównywalnej klasy.`));
  }

  const tldr = tldrParts.join(' ');

  // ---- Meta description (~155 chars) ----
  let shortDescription: string;
  if (stronger && hpDiff !== null) {
    const strongerName = modelDisplayName(stronger);
    shortDescription = pick(
      `Srovnání: ${aName} vs ${bName}. ${strongerName} má +${Math.abs(hpDiff)} k. Motor, převodovka, hmotnost, ` +
        `roky výroby a FAQ vedle sebe.`,
      `Porovnanie: ${aName} vs ${bName}. ${strongerName} má +${Math.abs(hpDiff)} k. Motor, prevodovka, hmotnosť, ` +
        `roky výroby a FAQ vedľa seba.`,
      `Порівняння: ${aName} vs ${bName}. ${strongerName} має +${Math.abs(hpDiff)} к.с. Двигун, трансмісія, маса, ` +
        `роки випуску та FAQ поряд.`,
      `Porównanie: ${aName} vs ${bName}. ${strongerName} ma +${Math.abs(hpDiff)} KM. Silnik, skrzynia biegów, masa, ` +
        `lata produkcji i FAQ obok siebie.`);
  } else {
    shortDescription = pick(
      `Srovnání ${aName} a ${bName}: výkon, motor, převodovka, hmotnost, FAQ a vhodné použití.`,
      `Porovnanie ${aName} a ${bName}: výkon, motor, prevodovka, hmotnosť, FAQ a vhodné použitie.`,
      `Порівняння ${aName} та ${bName}: потужність, двигун, трансмісія, маса, FAQ і відповідне застосування.`,
      `Porównanie ${aName} i ${bName}: moc, silnik, skrzynia biegów, masa, FAQ i zastosowanie.`);
  }
  // Hard cap to 158 chars to avoid SERP truncation.
  if (shortDescription.length > 158) shortDescription = shortDescription.slice(0, 155) + '…';

  // ---- Decision boxes ----
  const aUseCase = useCaseDescription(a.category, a.power_hp, locale);
  const bUseCase = useCaseDescription(b.category, b.power_hp, locale);

  function buildDecision(self: StrojFlatModel, other: StrojFlatModel): string {
    const parts: string[] = [];
    const selfName = modelDisplayName(self);
    const isStronger = stronger === self;
    const isLighter = lighter === self;
    const isNewer = newer === self;
    if (isStronger && hpDiff !== null) {
      parts.push(pick(
        `potřebuješ vyšší výkon (${num(self.power_hp!)} k) než nabízí ${other.brand_name}`,
        `potrebuješ vyšší výkon (${num(self.power_hp!)} k), než ponúka ${other.brand_name}`,
        `тобі потрібна вища потужність (${num(self.power_hp!)} к.с.), ніж пропонує ${other.brand_name}`,
        `potrzebujesz wyższej mocy (${num(self.power_hp!)} KM) niż oferuje ${other.brand_name}`));
    }
    if (isLighter && kgDiff !== null && Math.abs(kgDiff) >= 200) {
      parts.push(pick(
        `hraje pro tebe roli nižší hmotnost (méně utužování půdy, lepší manévrovatelnost)`,
        `hrá pre teba rolu nižšia hmotnosť (menšie utláčanie pôdy, lepšia manévrovateľnosť)`,
        `для тебе важлива менша маса (менше ущільнення ґрунту, краща маневреність)`,
        `zależy ci na mniejszej masie (mniejsze ugniatanie gleby, lepsza zwrotność)`));
    }
    if (isNewer && yearDiff !== null && Math.abs(yearDiff) >= 2) {
      parts.push(pick(
        `chceš novější konstrukci (uvedení ${self.year_from}) — typicky modernější elektronika, ISOBUS, emisní stupeň Stage V`,
        `chceš novšiu konštrukciu (uvedenie ${self.year_from}) — typicky modernejšia elektronika, ISOBUS, emisný stupeň Stage V`,
        `хочеш новішу конструкцію (представлення ${self.year_from}) — зазвичай сучасніша електроніка, ISOBUS, екологічний клас Stage V`,
        `chcesz nowszej konstrukcji (wprowadzenie ${self.year_from}) — zazwyczaj nowocześniejsza elektronika, ISOBUS, norma emisji Stage V`));
    }
    // If self has no winning attribute, frame positively via farm-size fit + brand preference.
    if (parts.length === 0) {
      const sizeClause = farmSizeClause(self.category, self.power_hp, locale);
      if (sizeClause) parts.push(sizeClause);
      parts.push(pick(
        `preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`,
        `preferuješ ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`,
        `орієнтуєшся на ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`,
        `preferujesz ${brandDescriptorAkuzativ(self.brand_slug, self.brand_name, locale)}`));
    }
    return pick(
      `Vyber ${selfName} pokud ${parts.join(', a zároveň ')}.`,
      `Vyber ${selfName}, ak ${parts.join(', a zároveň ')}.`,
      `Обери ${selfName}, якщо ${parts.join(', а водночас ')}.`,
      `Wybierz ${selfName}, jeśli ${parts.join(', a jednocześnie ')}.`);
  }

  const decisionA = buildDecision(a, b);
  const decisionB = buildDecision(b, a);

  // ---- FAQs (5 entries) ----
  const faqs: ComparisonFaq[] = [];

  // Q1: Power
  if (aHp !== null && bHp !== null) {
    if (hpDiff === 0) {
      const kw = a.power_kw ?? Math.round(aHp * 0.7457);
      faqs.push({
        q: pick(`Jaký výkon mají ${aName} a ${bName}?`, `Aký výkon majú ${aName} a ${bName}?`, `Яку потужність мають ${aName} та ${bName}?`, `Jaką moc mają ${aName} i ${bName}?`),
        a: pick(
          `Oba ${categoryWord}y mají shodný výkon ${num(aHp)} k (${kw} kW). Rozhodující rozdíl je tedy v dalších parametrech — motoru, převodovce a hmotnosti.`,
          `Oba ${categoryWord}y majú zhodný výkon ${num(aHp)} k (${kw} kW). Rozhodujúci rozdiel je teda v ďalších parametroch — motore, prevodovke a hmotnosti.`,
          `Обидва ${categoryWordUk}и мають однакову потужність ${num(aHp)} к.с. (${kw} кВт). Вирішальна різниця, отже, полягає в інших параметрах — двигуні, трансмісії та масі.`,
          `Oba ${categoryWordPl}i mają taką samą moc ${num(aHp)} KM (${kw} kW). Decydująca różnica leży zatem w innych parametrach — silniku, skrzyni biegów i masie.`),
      });
    } else {
      const strongerName = modelDisplayName(stronger!);
      const weakerName = stronger === a ? bName : aName;
      const strongerHp = stronger === a ? aHp : bHp;
      const weakerHp = stronger === a ? bHp : aHp;
      faqs.push({
        q: pick(
          `Co je výkonnější — ${aName} nebo ${bName}?`,
          `Čo je výkonnejšie — ${aName} alebo ${bName}?`,
          `Що потужніше — ${aName} чи ${bName}?`,
          `Co jest mocniejsze — ${aName} czy ${bName}?`),
        a: pick(
          `Výkonnější je ${strongerName} s ${num(strongerHp!)} k oproti ${num(weakerHp!)} k u ${weakerName}, rozdíl tedy činí ${Math.abs(hpDiff!)} k (přibližně ${Math.abs(hpPct!)} %).`,
          `Výkonnejší je ${strongerName} s ${num(strongerHp!)} k oproti ${num(weakerHp!)} k u ${weakerName}, rozdiel teda predstavuje ${Math.abs(hpDiff!)} k (približne ${Math.abs(hpPct!)} %).`,
          `Потужніший — ${strongerName} з ${num(strongerHp!)} к.с. проти ${num(weakerHp!)} к.с. у ${weakerName}, тобто різниця становить ${Math.abs(hpDiff!)} к.с. (приблизно ${Math.abs(hpPct!)} %).`,
          `Mocniejszy jest ${strongerName} z ${num(strongerHp!)} KM wobec ${num(weakerHp!)} KM w ${weakerName}, różnica wynosi ${Math.abs(hpDiff!)} KM (ok. ${Math.abs(hpPct!)} %).`),
      });
    }
  }

  // Q2: Engine + transmission
  const aEng = a.engine ?? null;
  const bEng = b.engine ?? null;
  const aTr = a.transmission ?? null;
  const bTr = b.transmission ?? null;
  if (aEng || bEng || aTr || bTr) {
    const parts: string[] = [];
    if (aEng) parts.push(pick(`${aName} pohání motor ${aEng}`, `${aName} poháňa motor ${aEng}`, `${aName} оснащено двигуном ${aEng}`, `${aName} napędza silnik ${aEng}`));
    if (bEng) parts.push(pick(`${bName} motor ${bEng}`, `${bName} motor ${bEng}`, `${bName} — двигун ${bEng}`, `${bName} — silnik ${bEng}`));
    if (aTr && bTr && aTr !== bTr) parts.push(pick(
      `Převodovka: ${aName} — ${aTr}, ${bName} — ${bTr}`,
      `Prevodovka: ${aName} — ${aTr}, ${bName} — ${bTr}`,
      `Трансмісія: ${aName} — ${aTr}, ${bName} — ${bTr}`,
      `Skrzynia biegów: ${aName} — ${aTr}, ${bName} — ${bTr}`));
    else if (aTr) parts.push(pick(`Převodovka: ${aTr}`, `Prevodovka: ${aTr}`, `Трансмісія: ${aTr}`, `Skrzynia biegów: ${aTr}`));
    else if (bTr) parts.push(pick(`Převodovka: ${bTr}`, `Prevodovka: ${bTr}`, `Трансмісія: ${bTr}`, `Skrzynia biegów: ${bTr}`));
    faqs.push({
      q: pick(`Jaký mají motor a převodovku?`, `Aký majú motor a prevodovku?`, `Який у них двигун і трансмісія?`, `Jaki mają silnik i skrzynię biegów?`),
      a: parts.join('. ') + '.',
    });
  }

  // Q3: Weight / hmotnost
  if (aKg !== null && bKg !== null && kgDiff !== null && kgDiff !== 0) {
    const lighterName = modelDisplayName(lighter!);
    const lighterKg = lighter === a ? aKg : bKg;
    const heavierKg = lighter === a ? bKg : aKg;
    faqs.push({
      q: pick(`Který ${categoryWord} je lehčí?`, `Ktorý ${categoryWord} je ľahší?`, `Який ${categoryWordUk} легший?`, `Który ${categoryWordPl} jest lżejszy?`),
      a: pick(
        `Lehčí je ${lighterName} s hmotností ${num(lighterKg)} kg oproti ${num(heavierKg)} kg, rozdíl ${num(Math.abs(kgDiff))} kg. Nižší hmotnost znamená menší utužování půdy a lepší manévrovatelnost, ale typicky i nižší tažnou sílu.`,
        `Ľahší je ${lighterName} s hmotnosťou ${num(lighterKg)} kg oproti ${num(heavierKg)} kg, rozdiel ${num(Math.abs(kgDiff))} kg. Nižšia hmotnosť znamená menšie utláčanie pôdy a lepšiu manévrovateľnosť, ale typicky aj nižšiu ťažnú silu.`,
        `Легший — ${lighterName} з масою ${num(lighterKg)} кг проти ${num(heavierKg)} кг, різниця ${num(Math.abs(kgDiff))} кг. Менша маса означає менше ущільнення ґрунту та кращу маневреність, але зазвичай і меншу тягову силу.`,
        `Lżejszy jest ${lighterName} z masą ${num(lighterKg)} kg wobec ${num(heavierKg)} kg, różnica ${num(Math.abs(kgDiff))} kg. Mniejsza masa oznacza mniejsze ugniatanie gleby i lepszą zwrotność, ale zazwyczaj też mniejszą siłę uciągu.`),
    });
  }

  // Q4: For which farm size
  if (aUseCase || bUseCase) {
    const parts: string[] = [];
    if (aUseCase) parts.push(`${aName}: ${aUseCase}`);
    if (bUseCase) parts.push(`${bName}: ${bUseCase}`);
    faqs.push({
      q: pick(
        `Pro jakou velikost farmy se ${aName} a ${bName} hodí?`,
        `Pre akú veľkosť farmy sa ${aName} a ${bName} hodia?`,
        `Для якого розміру ферми підходять ${aName} та ${bName}?`,
        `Do jakiego gospodarstwa pasują ${aName} i ${bName}?`),
      a: parts.join(' '),
    });
  }

  // Q5: Year / novelty
  if (aYear !== null && bYear !== null) {
    if (yearDiff === 0) {
      faqs.push({
        q: pick(
          `Kdy byly ${aName} a ${bName} uvedeny na trh?`,
          `Kedy boli ${aName} a ${bName} uvedené na trh?`,
          `Коли ${aName} та ${bName} вийшли на ринок?`,
          `Kiedy ${aName} i ${bName} weszły na rynek?`),
        a: pick(
          `Oba modely byly uvedeny v roce ${aYear}, jde tedy o současníky stejné generace techniky.`,
          `Oba modely boli uvedené v roku ${aYear}, ide teda o súčasníkov rovnakej generácie techniky.`,
          `Обидві моделі вийшли у ${aYear} році, тобто це сучасники одного покоління техніки.`,
          `Oba modele zostały wprowadzone w ${aYear} roku, są więc współczesnymi tej samej generacji techniki.`),
      });
    } else {
      const newerName = modelDisplayName(newer!);
      const newerYear = newer === a ? aYear : bYear;
      const olderYear = newer === a ? bYear : aYear;
      const ay = Math.abs(yearDiff!);
      // Ukrainian plural for "рік": 1 → рік; 2–4 (not 12–14) → роки; else роки → років.
      const ayMod10 = ay % 10;
      const ayMod100 = ay % 100;
      const plYearWord = ayMod10 === 1 && ayMod100 !== 11 ? 'rok'
        : ayMod10 >= 2 && ayMod10 <= 4 && !(ayMod100 >= 12 && ayMod100 <= 14) ? 'lata'
        : 'lat';
      const yearWord = pick(
        ay === 1 ? 'rok' : ay < 5 ? 'roky' : 'let',
        ay === 1 ? 'rok' : ay < 5 ? 'roky' : 'rokov',
        ayMod10 === 1 && ayMod100 !== 11 ? 'рік'
          : ayMod10 >= 2 && ayMod10 <= 4 && !(ayMod100 >= 12 && ayMod100 <= 14) ? 'роки'
          : 'років',
        plYearWord);
      faqs.push({
        q: pick(`Který model je novější?`, `Ktorý model je novší?`, `Яка модель новіша?`, `Który model jest nowszy?`),
        a: pick(
          `Novější je ${newerName} uvedený v roce ${newerYear} (oproti ${olderYear}). Rozdíl ${ay} ${yearWord} typicky znamená modernější emisní stupeň, lepší elektroniku a aktuálnější ISOBUS implementaci.`,
          `Novší je ${newerName} uvedený v roku ${newerYear} (oproti ${olderYear}). Rozdiel ${ay} ${yearWord} typicky znamená modernejší emisný stupeň, lepšiu elektroniku a aktuálnejšiu ISOBUS implementáciu.`,
          `Новіша — ${newerName}, представлена у ${newerYear} році (проти ${olderYear}). Різниця ${ay} ${yearWord} зазвичай означає сучасніший екологічний клас, кращу електроніку та актуальнішу реалізацію ISOBUS.`,
          `Nowszy jest ${newerName}, wprowadzony w ${newerYear} roku (wobec ${olderYear}). Różnica ${ay} ${yearWord} zazwyczaj oznacza nowocześniejszą normę emisji, lepszą elektronikę i aktualniejszą implementację ISOBUS.`),
      });
    }
  }

  // Trim to 5 max.
  faqs.splice(5);

  // ---- Last updated ----
  // Use today's date so the page reads as fresh to crawlers and LLMs.
  // Data sources (StrojFlatModel) get rebuilt on every deploy, so this is
  // accurate for "page content last verified."
  const lastUpdatedIso = new Date().toISOString().slice(0, 10);

  return { tldr, shortDescription, decisionA, decisionB, faqs, lastUpdatedIso };
}
