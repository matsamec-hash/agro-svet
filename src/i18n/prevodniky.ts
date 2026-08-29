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

export type NumberLocale = 'cs-CZ' | 'sk-SK' | 'pl-PL' | 'uk-UA' | 'de-DE';

export const NUMBER_LOCALE: Record<Locale, NumberLocale> = {
  cs: 'cs-CZ', sk: 'sk-SK', pl: 'pl-PL', uk: 'uk-UA', de: 'de-DE',
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
  // ‼️ Sada jednotek je pevná a historické jednotky jsou české/rakouské
  // (jitro, korec, strych). Pro DE/AT se NEPŘEJMENOVÁVAJÍ na Tagwerk apod. —
  // to by byl jiný převodní poměr. Popisek jen říká, odkud jednotka je.
  // Rakouské jitro = Joch, proto u `jitro` německý název existuje.
  de: {
    ui: { inputLabel: 'Wert eingeben', unitSelectLabel: 'Einheit wählen' },
    unitNames: {
      m2: 'Quadratmeter', a: 'Ar', ha: 'Hektar', km2: 'Quadratkilometer',
      acre: 'Acre', jitro: 'Joch (österreichisch)', korec: 'Korec (tschechisch)',
      strych: 'Strych (tschechisch)', morgen: 'preußischer Morgen',
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
  de: {
    ui: {
      inputLabel: 'Masse eingeben', commodityLabel: 'Kultur (für Bushel)',
      unitSelectLabel: 'Einheit wählen', commoditySelectLabel: 'Kultur für Bushel wählen',
    },
    unitNames: { kg: 'Kilogramm', q: 'Doppelzentner', t: 'Tonne', lb: 'Pfund (pound)', bu: 'Bushel' },
    commodityNames: {
      wheat: 'Weizen', corn: 'Mais', soy: 'Soja', barley: 'Gerste',
      oats: 'Hafer', rye: 'Roggen', canola: 'Raps (Canola)',
    },
  },
};

export function areaDefaults(locale: Locale): AreaDefaults {
  return AREA_DEFAULTS[locale] ?? AREA_DEFAULTS.cs;
}
export function weightDefaults(locale: Locale): WeightDefaults {
  return WEIGHT_DEFAULTS[locale] ?? WEIGHT_DEFAULTS.cs;
}
