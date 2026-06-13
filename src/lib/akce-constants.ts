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
