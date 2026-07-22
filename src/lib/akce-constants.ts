// src/lib/akce-constants.ts
// Pevný číselník typů zemědělských akcí. Slug = URL segment v /akce/typ/[typ]/.
// Rozšiřitelný: přidej klíč + label + popis.

export const AKCE_TYPES = {
  'farmarske-trhy': 'Farmářské trhy',
  'polni-dny': 'Polní dny',
  'prodej-ze-dvora': 'Prodej ze dvora',
  'vystavy-veletrhy': 'Výstavy a veletrhy',
  'kurzy-skoleni': 'Kurzy a školení',
  'chovatelske-prehlidky': 'Chovatelské přehlídky',
  'dny-otevrenych-dveri': 'Dny otevřených dveří',
} as const;

export type AkceTyp = keyof typeof AKCE_TYPES;

export const AKCE_TYP_SLUGS = Object.keys(AKCE_TYPES) as AkceTyp[];

export function isAkceTyp(value: string): value is AkceTyp {
  return value in AKCE_TYPES;
}

export function akceTypLabel(typ: AkceTyp): string {
  return AKCE_TYPES[typ];
}

// Práh indexace landing stránek (typ / kraj / kombinace). Stránka s méně než
// tolika nadcházejícími akcemi se servíruje jako noindex — anti-thin-content
// pojistka (viz poučení z worldstadiumsmap). Zůstává přístupná pro UX i crawl.
export const AKCE_INDEX_MIN = 3;

// Evergreen úvodní text ke každému typu — dává landing stránce samostatnou
// hodnotu i mimo sezónu (kdy je akcí málo). SEO + kontext pro čtenáře.
export const AKCE_TYP_INTRO: Record<AkceTyp, string> = {
  'farmarske-trhy':
    'Farmářské trhy jsou pravidelná setkání regionálních pěstitelů, chovatelů a řemeslníků, kde nakoupíte čerstvé potraviny přímo od výrobce — sezónní zeleninu a ovoce, mléčné výrobky, maso, pečivo i med. Přehled nadcházejících farmářských trhů po celé ČR aktualizujeme průběžně.',
  'polni-dny':
    'Polní dny pořádají osivářské firmy, výzkumné stanice a prodejci techniky přímo na pozemcích. Uvidíte odrůdové pokusy, předvádění strojů v provozu a poradenství agronomů. Sledujte termíny nadcházejících polních dnů v ČR.',
  'prodej-ze-dvora':
    'Prodej ze dvora umožňuje nakoupit potraviny přímo na farmě — od vajec a mléka po maso a zeleninu. Podpoříte lokální hospodáře a máte přehled o původu potravin. Níže najdete farmy a termíny prodeje ze dvora.',
  'vystavy-veletrhy':
    'Zemědělské výstavy a veletrhy představují novinky v technice, chovatelství i pěstitelství na jednom místě. Jsou příležitostí porovnat stroje, navázat kontakty a sledovat trendy oboru. Přehled nadcházejících výstav a veletrhů aktualizujeme průběžně.',
  'kurzy-skoleni':
    'Kurzy a školení pro zemědělce pokrývají agronomii, chov zvířat, obsluhu techniky i dotační administrativu. Pomáhají splnit odborné požadavky a udržet krok s legislativou. Podívejte se na nadcházející termíny vzdělávacích akcí.',
  'chovatelske-prehlidky':
    'Chovatelské přehlídky a výstavy zvířat prezentují plemenný skot, koně, ovce, drůbež i drobná zvířata. Bývají vrcholem chovatelské sezóny a přehlídkou úspěchů regionálních chovatelů. Sledujte termíny nadcházejících chovatelských akcí.',
  'dny-otevrenych-dveri':
    'Dny otevřených dveří na farmách a v zemědělských podnicích umožňují nahlédnout do provozu zblízka. Jsou vhodné pro rodiny, školy i zájemce o obor. Přehled nadcházejících dnů otevřených dveří najdete níže.',
};
