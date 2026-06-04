import type { Locale } from './config';

export interface DotaceCopy {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  h1: string;
  /** Hero lede HTML (obsahuje interní odkaz na kalkulačku). */
  ledeHtml: string;
  /** Disclaimer blok HTML (obsahuje odkaz na primární zdroj). */
  disclaimerHtml: string;
  crumbHome: string;
  crumbSelf: string;
  titulyTitle: string;
  /** Štítek "% dotace" v kartě titulu, vč. počáteční mezery: " % dotace". */
  pctSuffix: string;
  /** Prefix "strop " v kartě titulu. */
  stropPrefix: string;
  /** CTA na detailu karty: "Detail titulu →". */
  detailCta: string;
  kalendarTitle: string;
  kalendarLink: string;
  thTitul: string;
  thKolo: string;
  thPrijem: string;
  thStav: string;
  /** Poznámka pod tabulkou kol, "{date}" se nahradí datem aktualizace. */
  kalendarNote: string;
  statusLabel: Record<'ocekavane' | 'otevrene' | 'uzavrene', string>;
  ctaKicker: string;
  ctaHeading: string;
  ctaTractors: string;
  ctaCompare: string;
  ctaCalc: string;
  /** Název itemListu pro JSON-LD. */
  itemListName: string;
  /** Frame-copy pro detailovú stránku /dotace/[slug]. */
  detail: DotaceDetailCopy;
}

export interface DotaceDetailCopy {
  /** Suffix názvu stránky: "{name}{titleSuffix}". */
  titleSuffix: string;
  /** "Aktualizováno" / "Aktualizované" (pred dátumom). */
  updatedLabel: string;
  /** Byline HTML (obsahuje odkaz na /redakce/). */
  bylineHtml: string;
  /** Štítky spec-boxov. */
  specRostlinna: string;
  specZivocisna: string;
  specStrop: string;
  specMinVydaje: string;
  /** Sufix percent v spec-boxe, vč. medzery: " %". */
  pctSuffix: string;
  /** Warn-box pre stroje (pravidlo 49 %) — HTML, obsahuje <strong>. */
  warnBoxHtml: string;
  /** Nadpis FAQ sekcie. */
  faqHeading: string;
  /** Prefix "Primární zdroj: " v source-bare. */
  sourceLabel: string;
  /** Text odkazu na primárny zdroj. */
  sourceLinkText: string;
  /** Odkaz "Kalendář kol →". */
  sourceCalendarLink: string;
  /** Cross-CTA. */
  ctaKicker: string;
  ctaHeading: string;
  ctaTractors: string;
  ctaCompare: string;
  ctaLeasing: string;
  /** Jazyk pre Article JSON-LD (BCP-47). */
  inLanguage: string;
}

export const content: Record<Locale, DotaceCopy> = {
  cs: {
    metaTitle: 'Dotace na zemědělskou techniku 2026 — SZIF přehled',
    metaDescription:
      'Přehled dotací SZIF na nákup zemědělské techniky (SP SZP 2023–2027, navazuje na 2023–2024): investice do podniků, technologie snižující emise, podpora mladých zemědělců. Sazby, stropy, termíny kol.',
    kicker: 'SZIF · SP SZP 2023–2027',
    h1: 'Dotace na zemědělskou techniku',
    ledeHtml:
      'Přehled hlavních dotačních titulů SZIF pro nákup techniky ze Strategického plánu Společné zemědělské politiky. Tituly navazují na dotační období SZIF z let 2023 a 2024 a platí i pro aktuální rok. U každého najdete sazby, stropy, podmínky a odkaz na primární zdroj SZIF. Pro plánování investice využijte i&nbsp;<a href="/kalkulacka/leasing-traktoru/">kalkulačku leasingu</a>.',
    disclaimerHtml:
      '<strong>Informativní charakter.</strong> Přehled vychází z veřejně dostupných dokumentů SZIF a MZe a neslouží jako dotační poradenství. Závazné jsou výhradně Pravidla zveřejněná na <a href="https://szif.gov.cz/cs/szp23" target="_blank" rel="noopener">szif.gov.cz</a>. Před podáním žádosti doporučujeme konzultaci s dotačním specialistou.',
    crumbHome: 'Domů',
    crumbSelf: 'Dotace',
    titulyTitle: 'Dotační tituly',
    pctSuffix: ' % dotace',
    stropPrefix: 'strop ',
    detailCta: 'Detail titulu →',
    kalendarTitle: 'Kalendář kol',
    kalendarLink: 'Celý kalendář →',
    thTitul: 'Titul',
    thKolo: 'Kolo',
    thPrijem: 'Příjem žádostí',
    thStav: 'Stav',
    kalendarNote:
      'Termíny jsou orientační dle harmonogramu MZe. Závazné termíny zveřejňuje SZIF přibližně 2 měsíce před zahájením příjmu. Aktualizováno: {date}.',
    statusLabel: { ocekavane: 'Očekávané', otevrene: 'Otevřené', uzavrene: 'Uzavřené' },
    ctaKicker: 'Plánujete investici?',
    ctaHeading: 'Vyberte stroj a spočítejte si financování',
    ctaTractors: 'Katalog traktorů',
    ctaCompare: 'Srovnání modelů',
    ctaCalc: 'Kalkulačky',
    itemListName: 'Dotace na zemědělskou techniku',
    detail: {
      titleSuffix: ' — dotace na techniku 2026',
      updatedLabel: 'Aktualizováno',
      bylineHtml:
        'Zpracováno <a href="/redakce/">redakcí agro-svět.cz</a> z veřejných dokumentů SZIF a MZe',
      specRostlinna: 'Rostlinná výroba',
      specZivocisna: 'Živočišná výroba',
      specStrop: 'Strop dotace',
      specMinVydaje: 'Min. způsobilé výdaje',
      pctSuffix: ' %',
      warnBoxHtml:
        '<strong>Pozor — pravidlo 49 %.</strong> Výdaje na mobilní stroje (traktory, sklízeče, samojízdné postřikovače) smí tvořit maximálně 49 % způsobilých výdajů projektu. Stroj samotný nelze plně dotovat — projekt musí obsahovat i jiné investice. Výjimka pro hospodářství do 150 ha.',
      faqHeading: 'Časté otázky',
      sourceLabel: 'Primární zdroj: ',
      sourceLinkText: 'Pravidla a podmínky SZIF / MZe',
      sourceCalendarLink: 'Kalendář kol →',
      ctaKicker: 'Vyberte stroj',
      ctaHeading: 'Spojte dotaci s konkrétní technikou',
      ctaTractors: 'Katalog traktorů',
      ctaCompare: 'Srovnání modelů',
      ctaLeasing: 'Kalkulačka leasingu',
      inLanguage: 'cs-CZ',
    },
  },
  sk: {
    metaTitle: 'Investičné dotácie pre poľnohospodárov 2026 — prehľad PPA',
    metaDescription:
      'Prehľad investičných dotácií PPA SR zo Strategického plánu SPP 2023–2027 — investície do podnikov, spracovania a podpora mladých poľnohospodárov. Sadzby, stropy, podmienky.',
    kicker: 'PPA · SP SPP 2023–2027',
    h1: 'Investičné dotácie pre poľnohospodárov',
    ledeHtml:
      'Prehľad hlavných investičných dotačných titulov PPA SR zo Strategického plánu Spoločnej poľnohospodárskej politiky. Pri každom nájdete sadzby, stropy, podmienky a odkaz na primárny zdroj PPA.',
    disclaimerHtml:
      '<strong>Informatívny charakter.</strong> Prehľad vychádza z verejne dostupných dokumentov PPA a MPRV SR a neslúži ako dotačné poradenstvo. Záväzné sú výhradne podmienky zverejnené na <a href="https://www.apa.sk" target="_blank" rel="noopener">apa.sk</a>.',
    crumbHome: 'Domov',
    crumbSelf: 'Dotácie',
    titulyTitle: 'Dotačné tituly',
    pctSuffix: ' % dotácia',
    stropPrefix: 'strop ',
    detailCta: 'Detail titulu →',
    kalendarTitle: 'Kalendár kôl',
    kalendarLink: 'Celý kalendár →',
    thTitul: 'Titul',
    thKolo: 'Kolo',
    thPrijem: 'Príjem žiadostí',
    thStav: 'Stav',
    kalendarNote:
      'Termíny sú orientačné podľa harmonogramu PPA. Záväzné termíny zverejňuje PPA vo výzvach. Aktualizované: {date}.',
    statusLabel: { ocekavane: 'Očakávané', otevrene: 'Otvorené', uzavrene: 'Uzavreté' },
    ctaKicker: 'Plánujete investíciu?',
    ctaHeading: 'Vyberte stroj a vypočítajte si financovanie',
    ctaTractors: 'Katalóg traktorov',
    ctaCompare: 'Porovnanie modelov',
    ctaCalc: 'Kalkulačky',
    itemListName: 'Investičné dotácie pre poľnohospodárov',
    detail: {
      titleSuffix: ' — investičná dotácia 2026',
      updatedLabel: 'Aktualizované',
      bylineHtml:
        'Spracované <a href="/sk/redakce/">redakciou agro-svet.cz</a> z verejných dokumentov PPA a MPRV SR',
      specRostlinna: 'Rastlinná výroba',
      specZivocisna: 'Živočíšna výroba',
      specStrop: 'Strop dotácie',
      specMinVydaje: 'Min. oprávnené výdavky',
      pctSuffix: ' %',
      warnBoxHtml:
        '<strong>Pozor — pravidlo 49 %.</strong> Výdavky na mobilné stroje (traktory, kombajny, samochodné postrekovače) môžu tvoriť najviac 49 % oprávnených výdavkov projektu. Samotný stroj nemožno plne dotovať — projekt musí obsahovať aj iné investície.',
      faqHeading: 'Časté otázky',
      sourceLabel: 'Primárny zdroj: ',
      sourceLinkText: 'Podmienky výzvy PPA',
      sourceCalendarLink: 'Kalendár kôl →',
      ctaKicker: 'Vyberte stroj',
      ctaHeading: 'Spojte dotáciu s konkrétnou technikou',
      ctaTractors: 'Katalóg traktorov',
      ctaCompare: 'Porovnanie modelov',
      ctaLeasing: 'Kalkulačka lízingu',
      inLanguage: 'sk-SK',
    },
  },
  uk: {} as DotaceCopy,
};
