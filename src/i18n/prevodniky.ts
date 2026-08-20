// Per-locale výchozí stringy pro vložené převodníky (AreaConverter,
// WeightConverter).
//
// PROČ: komponenty měly české defaulty a lokalizaci dostávaly jen z props na
// stránkách /kalkulacka/prevody-*. Jenže stejné převodníky jsou vložené i do
// /slovnik/<jednotka>/, kde se props nepředávaly — takže /uk/slovnik/korec/
// (i sk a pl) ukazoval „metr čtvereční", „rakouské/české jitro", „Zadej
// hodnotu" uprostřed jinak přeložené stránky.
//
// Komponenta si teď bere default podle `locale`; explicitní props mají pořád
// přednost, takže kalkulačkové stránky se chovají PŘESNĚ jako dosud.
// cs hodnoty jsou doslovná kopie původních hardcoded defaultů (byte-identita).
import type { Locale } from './config';

export type NumberLocale = 'cs-CZ' | 'sk-SK' | 'pl-PL' | 'uk-UA';

export const NUMBER_LOCALE: Record<Locale, NumberLocale> = {
  cs: 'cs-CZ', sk: 'sk-SK', pl: 'pl-PL', uk: 'uk-UA',
};

export interface AreaDefaults {
  ui: { inputLabel: string; unitSelectLabel: string };
  unitNames: Record<string, string>;
}

export const AREA_DEFAULTS: Record<Locale, AreaDefaults> = {
  cs: {
    ui: { inputLabel: 'Zadej hodnotu', unitSelectLabel: 'Vyber jednotku' },
    unitNames: {
      m2: 'metr čtvereční', a: 'ar', ha: 'hektar', km2: 'kilometr čtvereční',
      acre: 'akr (acre)', jitro: 'rakouské/české jitro', korec: 'český korec',
      strych: 'český strych', morgen: 'pruský morgen',
    },
  },
  sk: {
    ui: { inputLabel: 'Zadaj hodnotu', unitSelectLabel: 'Vyber jednotku' },
    unitNames: {
      m2: 'meter štvorcový', a: 'ár', ha: 'hektár', km2: 'kilometer štvorcový',
      acre: 'aker (acre)', jitro: 'rakúsko-uhorské jitro', korec: 'korec',
      strych: 'strych', morgen: 'pruský morgen',
    },
  },
  pl: {
    ui: { inputLabel: 'Wpisz wartość', unitSelectLabel: 'Wybierz jednostkę' },
    unitNames: {
      m2: 'metr kwadratowy', a: 'ar', ha: 'hektar', km2: 'kilometr kwadratowy',
      acre: 'akr (acre)', jitro: 'jitro (austro-węgierskie)', korec: 'korzec (czeski)',
      strych: 'strych (czeski)', morgen: 'morga pruska',
    },
  },
  uk: {
    ui: { inputLabel: 'Введіть значення', unitSelectLabel: 'Виберіть одиницю' },
    unitNames: {
      m2: 'квадратний метр', a: 'ар', ha: 'гектар', km2: 'квадратний кілометр',
      acre: 'акр (acre)', jitro: 'йітро (австро-угорське)', korec: 'корець (чеський)',
      strych: 'стрих (чеський)', morgen: 'прусський морген',
    },
  },
};

export interface WeightDefaults {
  ui: { inputLabel: string; commodityLabel: string; unitSelectLabel: string; commoditySelectLabel: string };
  unitNames: Record<string, string>;
  commodityNames: Record<string, string>;
}

export const WEIGHT_DEFAULTS: Record<Locale, WeightDefaults> = {
  cs: {
    ui: {
      inputLabel: 'Zadej hmotnost', commodityLabel: 'Komodita (pro bušl)',
      unitSelectLabel: 'Vyber jednotku', commoditySelectLabel: 'Vyber komoditu pro bušl',
    },
    unitNames: { kg: 'kilogram', q: 'metrický cent', t: 'tuna', lb: 'libra (pound)', bu: 'bušl (bushel)' },
    commodityNames: {
      wheat: 'pšenice', corn: 'kukuřice', soy: 'sója', barley: 'ječmen',
      oats: 'oves', rye: 'žito', canola: 'řepka (canola)',
    },
  },
  sk: {
    ui: {
      inputLabel: 'Zadaj hmotnosť', commodityLabel: 'Komodita (pre bušel)',
      unitSelectLabel: 'Vyber jednotku', commoditySelectLabel: 'Vyber komoditu pre bušel',
    },
    unitNames: { kg: 'kilogram', q: 'metrický cent', t: 'tona', lb: 'libra (pound)', bu: 'bušel (bushel)' },
    commodityNames: {
      wheat: 'pšenica', corn: 'kukurica', soy: 'sója', barley: 'jačmeň',
      oats: 'ovos', rye: 'raž', canola: 'repka (canola)',
    },
  },
  pl: {
    ui: {
      inputLabel: 'Podaj masę', commodityLabel: 'Towar (dla buszla)',
      unitSelectLabel: 'Wybierz jednostkę', commoditySelectLabel: 'Wybierz towar dla buszla',
    },
    unitNames: { kg: 'kilogram', q: 'kwintal', t: 'tona', lb: 'funt (pound)', bu: 'buszel (bushel)' },
    commodityNames: {
      wheat: 'pszenica', corn: 'kukurydza', soy: 'soja', barley: 'jęczmień',
      oats: 'owies', rye: 'żyto', canola: 'rzepak (canola)',
    },
  },
  uk: {
    ui: {
      inputLabel: 'Введіть масу', commodityLabel: 'Культура (для бушеля)',
      unitSelectLabel: 'Виберіть одиницю', commoditySelectLabel: 'Виберіть культуру для бушеля',
    },
    unitNames: { kg: 'кілограм', q: 'центнер', t: 'тонна', lb: 'фунт (pound)', bu: 'бушель (bushel)' },
    commodityNames: {
      wheat: 'пшениця', corn: 'кукурудза', soy: 'соя', barley: 'ячмінь',
      oats: 'овес', rye: 'жито', canola: 'ріпак (canola)',
    },
  },
};

export function areaDefaults(locale: Locale): AreaDefaults {
  return AREA_DEFAULTS[locale] ?? AREA_DEFAULTS.cs;
}
export function weightDefaults(locale: Locale): WeightDefaults {
  return WEIGHT_DEFAULTS[locale] ?? WEIGHT_DEFAULTS.cs;
}
