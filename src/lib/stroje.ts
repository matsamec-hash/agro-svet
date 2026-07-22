// YAML imports parsed at compile-time by @modyfi/vite-plugin-yaml — no runtime js-yaml.

export type StrojKategorie =
  | 'traktory' | 'kombajny'
  // zpracování půdy (7)
  | 'pluhy' | 'podmitace-diskove' | 'podmitace-radlickove'
  | 'kyprice' | 'rotacni-brany' | 'kompaktomaty' | 'valce'
  // setí (5)
  | 'seci-stroje-mechanicke' | 'seci-stroje-pneumaticke' | 'seci-stroje-presne'
  | 'seci-kombinace' | 'sazecky-brambor'
  // hnojení (4)
  | 'rozmetadla-mineralni' | 'rozmetadla-statkova' | 'cisterny-kejda' | 'aplikatory-kejda'
  // ochrana rostlin (3)
  | 'postrikovace-nesene' | 'postrikovace-tazene' | 'postrikovace-samojizdne'
  // sklizeň pícnin (8)
  | 'zaci-stroje' | 'obracece' | 'shrnovace'
  | 'lisy-valcove' | 'lisy-hranolove' | 'obalovace'
  | 'rezacky-samojizdne' | 'samosberaci-vozy'
  // sklizeň okopanin (3)
  | 'sklizece-brambor' | 'sklizece-repy' | 'vyoravace'
  // manipulace (5)
  | 'celni-nakladace' | 'teleskopy' | 'kolove-nakladace'
  | 'kloubove-nakladace' | 'smykove-nakladace'
  // doprava (5)
  | 'navesy-sklapeci' | 'navesy-valnik' | 'navesy-posuvne-dno'
  | 'cisterny-voda' | 'prepravniky-zrna'
  // stáj-chov (3)
  | 'krmne-vozy' | 'dojici-roboti' | 'podestylace'
  // komunál-les (3)
  | 'mulcovace' | 'stepkovace' | 'lesni-vyvazecky';

export interface StrojModel {
  slug: string;
  name: string;
  year_from: number | null;
  year_to: number | null;
  power_hp: number | null;
  power_kw: number | null;
  engine?: string;
  transmission?: string;
  weight_kg?: number | null;
  cutting_width_m?: number | null;
  grain_tank_l?: number | null;
  description?: string;
  image_url?: string | null;
  image_credit_url?: string | null;
  image_credit?: string | null;
  image_license?: string | null;
  specs?: Record<string, string | number | boolean | null>;
  // NEW optional fields
  pracovni_zaber_m?: number | null;
  prikon_traktor_hp_min?: number | null;
  prikon_traktor_hp_max?: number | null;
  typ_zavesu?: 'neseny' | 'tazeny' | 'poloneseny' | 'samojizdny' | 'navesny' | null;
}

export interface StrojSeries {
  slug: string;
  name: string;
  year_from: number | null;
  year_to: number | null;
  description?: string;
  image_url?: string | null;
  image_credit_url?: string | null;
  image_credit?: string | null;
  image_license?: string | null;
  /**
   * Family grouping for tile aggregation on brand page. When omitted,
   * seriesFamily(slug) computes a default from the slug.
   */
  family?: string;
  family_label?: string;
  /**
   * Sub-category override for brands organized by functional group (e.g. Kverneland uses
   * categories.zpracovani-pudy with series.subcategory: "pluhy"). When set, this is the
   * effective category for sitemap and listing-page routing.
   */
  subcategory?: StrojKategorie;
  models: StrojModel[];
}

export interface StrojBrand {
  slug: string;
  name: string;
  country: string;
  founded: number;
  website?: string;
  logo?: string;
  description?: string;
  /** Wikipedia article URL (cs preferred, fallback en). Used in JSON-LD sameAs. */
  wikipedia?: string;
  /** Wikidata entity URL (https://www.wikidata.org/wiki/Qxxxxx). Knowledge graph anchor. */
  wikidata?: string;
  /** Brand-level hero photo, decoupled from series tiles. Overrides the per-series cover pick. */
  hero_image?: string | null;
  hero_credit?: string | null;
  hero_credit_url?: string | null;
  hero_license?: string | null;
  categories: Partial<Record<StrojKategorie, { name: string; series: StrojSeries[] }>>;
}

export interface StrojFlatModel extends StrojModel {
  brand_slug: string;
  brand_name: string;
  /** Top-level category from YAML (e.g. "traktory" or "zpracovani-pudy"). */
  category: StrojKategorie;
  /** Effective sub-category for listing routing — series.subcategory if set, else category. */
  effective_category: StrojKategorie;
  series_slug: string;
  series_name: string;
}

export const FUNCTIONAL_GROUPS = {
  'zpracovani-pudy': {
    name: 'Zpracování půdy',
    description: 'Pluhy, podmítače, kypřiče, brány, kompaktomaty a válce',
    categories: ['pluhy', 'podmitace-diskove', 'podmitace-radlickove', 'kyprice', 'rotacni-brany', 'kompaktomaty', 'valce'] as StrojKategorie[],
  },
  'seti': {
    name: 'Setí a sázení',
    description: 'Secí stroje (mechanické, pneumatické, přesné), sázečky',
    categories: ['seci-stroje-mechanicke', 'seci-stroje-pneumaticke', 'seci-stroje-presne', 'seci-kombinace', 'sazecky-brambor'] as StrojKategorie[],
  },
  'hnojeni': {
    name: 'Hnojení',
    description: 'Rozmetadla minerálních a statkových hnojiv, cisterny na kejdu, aplikátory',
    categories: ['rozmetadla-mineralni', 'rozmetadla-statkova', 'cisterny-kejda', 'aplikatory-kejda'] as StrojKategorie[],
  },
  'ochrana-rostlin': {
    name: 'Ochrana rostlin',
    description: 'Postřikovače nesené, tažené, samojízdné',
    categories: ['postrikovace-nesene', 'postrikovace-tazene', 'postrikovace-samojizdne'] as StrojKategorie[],
  },
  'sklizen-picnin': {
    name: 'Sklizeň pícnin a slámy',
    description: 'Žací stroje, obraceče, shrnovače, lisy, řezačky, samosběrací vozy',
    categories: ['zaci-stroje', 'obracece', 'shrnovace', 'lisy-valcove', 'lisy-hranolove', 'obalovace', 'rezacky-samojizdne', 'samosberaci-vozy'] as StrojKategorie[],
  },
  'sklizen-okopanin': {
    name: 'Sklizeň okopanin',
    description: 'Sklízeče brambor, řepy, vyorávače',
    categories: ['sklizece-brambor', 'sklizece-repy', 'vyoravace'] as StrojKategorie[],
  },
  'manipulace': {
    name: 'Manipulace a nakládání',
    description: 'Teleskopy, čelní/kolové/kloubové/smykové nakladače',
    categories: ['celni-nakladace', 'teleskopy', 'kolove-nakladace', 'kloubove-nakladace', 'smykove-nakladace'] as StrojKategorie[],
  },
  'doprava': {
    name: 'Doprava',
    description: 'Návěsy sklápěcí, valníkové, s posuvným dnem, cisterny na vodu, přepravníky zrna',
    categories: ['navesy-sklapeci', 'navesy-valnik', 'navesy-posuvne-dno', 'cisterny-voda', 'prepravniky-zrna'] as StrojKategorie[],
  },
  'staj-chov': {
    name: 'Stáj a chov',
    description: 'Krmné vozy, dojicí roboti, podestýlací stroje',
    categories: ['krmne-vozy', 'dojici-roboti', 'podestylace'] as StrojKategorie[],
  },
  'komunal-les': {
    name: 'Komunál a les',
    description: 'Mulčovače, štěpkovače, lesní vyvážečky',
    categories: ['mulcovace', 'stepkovace', 'lesni-vyvazecky'] as StrojKategorie[],
  },
} as const;

export type FunctionalGroupSlug = keyof typeof FUNCTIONAL_GROUPS;

export function getEffectiveZaber(model: StrojModel): number | null {
  return model.pracovni_zaber_m ?? model.cutting_width_m ?? null;
}

export function getFunctionalGroupForCategory(cat: StrojKategorie): FunctionalGroupSlug | null {
  for (const [slug, group] of Object.entries(FUNCTIONAL_GROUPS)) {
    if ((group.categories as readonly string[]).includes(cat)) return slug as FunctionalGroupSlug;
  }
  return null;
}

// Kanonické české názvy kategorií strojů (funkční subkategorie nemají `name` v YAML
// značek → jinak se v title/H1/breadcrumb zobrazoval syrový slug „kolove-nakladace").
export const CATEGORY_LABELS: Record<StrojKategorie, string> = {
  traktory: 'Traktory',
  kombajny: 'Kombajny',
  pluhy: 'Pluhy',
  'podmitace-diskove': 'Diskové podmítače',
  'podmitace-radlickove': 'Radličkové podmítače',
  kyprice: 'Kypřiče',
  'rotacni-brany': 'Rotační brány',
  kompaktomaty: 'Kompaktomaty',
  valce: 'Válce',
  'seci-stroje-mechanicke': 'Mechanické secí stroje',
  'seci-stroje-pneumaticke': 'Pneumatické secí stroje',
  'seci-stroje-presne': 'Přesné secí stroje',
  'seci-kombinace': 'Secí kombinace',
  'sazecky-brambor': 'Sázečky brambor',
  'rozmetadla-mineralni': 'Rozmetadla minerálních hnojiv',
  'rozmetadla-statkova': 'Rozmetadla statkových hnojiv',
  'cisterny-kejda': 'Cisterny na kejdu',
  'aplikatory-kejda': 'Aplikátory kejdy',
  'postrikovace-nesene': 'Nesené postřikovače',
  'postrikovace-tazene': 'Tažené postřikovače',
  'postrikovace-samojizdne': 'Samojízdné postřikovače',
  'zaci-stroje': 'Žací stroje',
  obracece: 'Obraceče',
  shrnovace: 'Shrnovače',
  'lisy-valcove': 'Válcové lisy',
  'lisy-hranolove': 'Hranolové lisy',
  obalovace: 'Obalovače',
  'rezacky-samojizdne': 'Samojízdné řezačky',
  'samosberaci-vozy': 'Samosběrací vozy',
  'sklizece-brambor': 'Sklízeče brambor',
  'sklizece-repy': 'Sklízeče řepy',
  vyoravace: 'Vyorávače',
  'celni-nakladace': 'Čelní nakladače',
  teleskopy: 'Teleskopické manipulátory',
  'kolove-nakladace': 'Kolové nakladače',
  'kloubove-nakladace': 'Kloubové nakladače',
  'smykove-nakladace': 'Smykem řízené nakladače',
  'navesy-sklapeci': 'Sklápěcí návěsy',
  'navesy-valnik': 'Valníkové návěsy',
  'navesy-posuvne-dno': 'Návěsy s posuvným dnem',
  'cisterny-voda': 'Cisterny na vodu',
  'prepravniky-zrna': 'Přepravníky zrna',
  'krmne-vozy': 'Krmné vozy',
  'dojici-roboti': 'Dojící roboti',
  podestylace: 'Podestýlače',
  mulcovace: 'Mulčovače',
  stepkovace: 'Štěpkovače',
  'lesni-vyvazecky': 'Lesní vyvážečky',
};

// Lokalizované názvy kategorií (sk/uk/pl). cs = CATEGORY_LABELS výše. Chybějící klíč
// spadne na cs. ⚠️ uk/pl odborné termíny vhodné dát ověřit rodilému mluvčímu.
const CATEGORY_LABELS_SK: Record<StrojKategorie, string> = {
  traktory: 'Traktory', kombajny: 'Kombajny', pluhy: 'Pluhy',
  'podmitace-diskove': 'Diskové podmietače', 'podmitace-radlickove': 'Radličkové podmietače',
  kyprice: 'Kypriče', 'rotacni-brany': 'Rotačné brány', kompaktomaty: 'Kompaktomaty', valce: 'Valce',
  'seci-stroje-mechanicke': 'Mechanické sejačky', 'seci-stroje-pneumaticke': 'Pneumatické sejačky',
  'seci-stroje-presne': 'Presné sejačky', 'seci-kombinace': 'Sejacie kombinácie', 'sazecky-brambor': 'Sadzače zemiakov',
  'rozmetadla-mineralni': 'Rozmetadlá minerálnych hnojív', 'rozmetadla-statkova': 'Rozmetadlá maštaľných hnojív',
  'cisterny-kejda': 'Cisterny na hnojovicu', 'aplikatory-kejda': 'Aplikátory hnojovice',
  'postrikovace-nesene': 'Nesené postrekovače', 'postrikovace-tazene': 'Ťahané postrekovače', 'postrikovace-samojizdne': 'Samohybné postrekovače',
  'zaci-stroje': 'Žacie stroje', obracece: 'Obracače', shrnovace: 'Zhrňovače',
  'lisy-valcove': 'Valcové lisy', 'lisy-hranolove': 'Hranolové lisy', obalovace: 'Obaľovače',
  'rezacky-samojizdne': 'Samohybné rezačky', 'samosberaci-vozy': 'Zberacie vozy',
  'sklizece-brambor': 'Zberače zemiakov', 'sklizece-repy': 'Zberače repy', vyoravace: 'Vyorávače',
  'celni-nakladace': 'Čelné nakladače', teleskopy: 'Teleskopické manipulátory', 'kolove-nakladace': 'Kolesové nakladače',
  'kloubove-nakladace': 'Kĺbové nakladače', 'smykove-nakladace': 'Šmykom riadené nakladače',
  'navesy-sklapeci': 'Sklápacie návesy', 'navesy-valnik': 'Valníkové návesy', 'navesy-posuvne-dno': 'Návesy s posuvnou podlahou',
  'cisterny-voda': 'Cisterny na vodu', 'prepravniky-zrna': 'Prepravníky zrna', 'krmne-vozy': 'Kŕmne vozy',
  'dojici-roboti': 'Dojacie roboty', podestylace: 'Podstielače', mulcovace: 'Mulčovače',
  stepkovace: 'Štiepkovače', 'lesni-vyvazecky': 'Lesné vyvážačky',
};
const CATEGORY_LABELS_UK: Record<StrojKategorie, string> = {
  traktory: 'Трактори', kombajny: 'Комбайни', pluhy: 'Плуги',
  'podmitace-diskove': 'Дискові лущильники', 'podmitace-radlickove': 'Лапові культиватори',
  kyprice: 'Культиватори', 'rotacni-brany': 'Ротаційні борони', kompaktomaty: 'Комбіновані агрегати', valce: 'Котки',
  'seci-stroje-mechanicke': 'Механічні сівалки', 'seci-stroje-pneumaticke': 'Пневматичні сівалки',
  'seci-stroje-presne': 'Точні сівалки', 'seci-kombinace': 'Посівні комбінації', 'sazecky-brambor': 'Картоплесаджалки',
  'rozmetadla-mineralni': 'Розкидачі мінеральних добрив', 'rozmetadla-statkova': 'Розкидачі органічних добрив',
  'cisterny-kejda': 'Цистерни для рідкого гною', 'aplikatory-kejda': 'Аплікатори рідкого гною',
  'postrikovace-nesene': 'Навісні обприскувачі', 'postrikovace-tazene': 'Причіпні обприскувачі', 'postrikovace-samojizdne': 'Самохідні обприскувачі',
  'zaci-stroje': 'Косарки', obracece: 'Ворушилки', shrnovace: 'Валкоутворювачі',
  'lisy-valcove': 'Рулонні прес-підбирачі', 'lisy-hranolove': 'Тюкові прес-підбирачі', obalovace: 'Обмотувачі',
  'rezacky-samojizdne': 'Самохідні кормозбиральні комбайни', 'samosberaci-vozy': 'Самозавантажувальні візки',
  'sklizece-brambor': 'Картоплезбиральні комбайни', 'sklizece-repy': 'Бурякозбиральні комбайни', vyoravace: 'Копачі',
  'celni-nakladace': 'Фронтальні навантажувачі', teleskopy: 'Телескопічні навантажувачі', 'kolove-nakladace': 'Колісні навантажувачі',
  'kloubove-nakladace': 'Шарнірно-зчленовані навантажувачі', 'smykove-nakladace': 'Навантажувачі з бортовим поворотом',
  'navesy-sklapeci': 'Самоскидні напівпричепи', 'navesy-valnik': 'Бортові напівпричепи', 'navesy-posuvne-dno': 'Напівпричепи з рухомою підлогою',
  'cisterny-voda': 'Цистерни для води', 'prepravniky-zrna': 'Зерновози', 'krmne-vozy': 'Кормороздавачі',
  'dojici-roboti': 'Доїльні роботи', podestylace: 'Розкидачі підстилки', mulcovace: 'Мульчувачі',
  stepkovace: 'Подрібнювачі', 'lesni-vyvazecky': 'Форвардери',
};
const CATEGORY_LABELS_PL: Record<StrojKategorie, string> = {
  traktory: 'Ciągniki', kombajny: 'Kombajny', pluhy: 'Pługi',
  'podmitace-diskove': 'Brony talerzowe', 'podmitace-radlickove': 'Kultywatory ścierniskowe',
  kyprice: 'Kultywatory', 'rotacni-brany': 'Brony wirnikowe', kompaktomaty: 'Agregaty uprawowe', valce: 'Wały uprawowe',
  'seci-stroje-mechanicke': 'Siewniki mechaniczne', 'seci-stroje-pneumaticke': 'Siewniki pneumatyczne',
  'seci-stroje-presne': 'Siewniki punktowe', 'seci-kombinace': 'Agregaty uprawowo-siewne', 'sazecky-brambor': 'Sadzarki do ziemniaków',
  'rozmetadla-mineralni': 'Rozsiewacze nawozów mineralnych', 'rozmetadla-statkova': 'Rozrzutniki obornika',
  'cisterny-kejda': 'Wozy asenizacyjne', 'aplikatory-kejda': 'Aplikatory gnojowicy',
  'postrikovace-nesene': 'Opryskiwacze zawieszane', 'postrikovace-tazene': 'Opryskiwacze ciągane', 'postrikovace-samojizdne': 'Opryskiwacze samojezdne',
  'zaci-stroje': 'Kosiarki', obracece: 'Przetrząsacze', shrnovace: 'Zgrabiarki',
  'lisy-valcove': 'Prasy zwijające', 'lisy-hranolove': 'Prasy kostkujące', obalovace: 'Owijarki',
  'rezacky-samojizdne': 'Sieczkarnie samojezdne', 'samosberaci-vozy': 'Przyczepy samozbierające',
  'sklizece-brambor': 'Kombajny ziemniaczane', 'sklizece-repy': 'Kombajny buraczane', vyoravace: 'Kopaczki',
  'celni-nakladace': 'Ładowacze czołowe', teleskopy: 'Ładowarki teleskopowe', 'kolove-nakladace': 'Ładowarki kołowe',
  'kloubove-nakladace': 'Ładowarki przegubowe', 'smykove-nakladace': 'Ładowarki burtowe',
  'navesy-sklapeci': 'Przyczepy wywrotki', 'navesy-valnik': 'Przyczepy platformowe', 'navesy-posuvne-dno': 'Przyczepy z ruchomą podłogą',
  'cisterny-voda': 'Cysterny na wodę', 'prepravniky-zrna': 'Przyczepy przeładunkowe', 'krmne-vozy': 'Wozy paszowe',
  'dojici-roboti': 'Roboty udojowe', podestylace: 'Słomiarki', mulcovace: 'Mulczery',
  stepkovace: 'Rębaki', 'lesni-vyvazecky': 'Forwardery',
};
const CATEGORY_LABELS_BY_LOCALE: Record<string, Record<StrojKategorie, string>> = {
  cs: CATEGORY_LABELS, sk: CATEGORY_LABELS_SK, uk: CATEGORY_LABELS_UK, pl: CATEGORY_LABELS_PL,
};

export function categoryLabel(cat: StrojKategorie, locale: string = 'cs'): string {
  return (CATEGORY_LABELS_BY_LOCALE[locale] ?? CATEGORY_LABELS)[cat] ?? CATEGORY_LABELS[cat] ?? cat;
}

// Lokalizované názvy funkčních skupin (cs = FUNCTIONAL_GROUPS[].name). ⚠️ uk/pl k ověření.
const FUNCTIONAL_GROUP_LABELS: Record<string, Record<string, string>> = {
  sk: { 'zpracovani-pudy': 'Spracovanie pôdy', seti: 'Sejba a sadenie', hnojeni: 'Hnojenie', 'ochrana-rostlin': 'Ochrana rastlín', 'sklizen-picnin': 'Zber krmovín a slamy', 'sklizen-okopanin': 'Zber okopanín', manipulace: 'Manipulácia a nakladanie', doprava: 'Doprava', 'staj-chov': 'Maštaľ a chov', 'komunal-les': 'Komunál a les' },
  uk: { 'zpracovani-pudy': 'Обробіток ґрунту', seti: 'Сівба та садіння', hnojeni: 'Внесення добрив', 'ochrana-rostlin': 'Захист рослин', 'sklizen-picnin': 'Заготівля кормів і соломи', 'sklizen-okopanin': 'Збирання коренеплодів', manipulace: 'Навантаження та переміщення', doprava: 'Транспорт', 'staj-chov': 'Тваринництво', 'komunal-les': 'Комунальна та лісова техніка' },
  pl: { 'zpracovani-pudy': 'Uprawa gleby', seti: 'Siew i sadzenie', hnojeni: 'Nawożenie', 'ochrana-rostlin': 'Ochrona roślin', 'sklizen-picnin': 'Zbiór pasz i słomy', 'sklizen-okopanin': 'Zbiór okopowych', manipulace: 'Przeładunek', doprava: 'Transport', 'staj-chov': 'Obora i hodowla', 'komunal-les': 'Technika komunalna i leśna' },
};
export function functionalGroupLabel(slug: string, locale: string = 'cs'): string {
  const loc = FUNCTIONAL_GROUP_LABELS[locale];
  if (loc && loc[slug]) return loc[slug];
  return (FUNCTIONAL_GROUPS as Record<string, { name: string }>)[slug]?.name ?? slug;
}

// Vite plugin parses YAML at compile-time → default export is already an object.
const brandModules = import.meta.glob('/src/data/stroje/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

// Per-locale prose overlays: /src/data/stroje/<locale>/<slug>.yaml
// (country/description/category-names/series-descriptions). cs has no overlay.
const overlayModules = import.meta.glob('/src/data/stroje/*/*.yaml', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>;

interface StrojOverlay {
  country?: string;
  description?: string;
  categories?: Record<string, string>;
  series?: Record<string, string>;
  models?: Record<string, string>; // model.slug -> SK popis (Fáze stroje-detail)
}

function getOverlay(slug: string, locale: string): StrojOverlay | null {
  return (overlayModules[`/src/data/stroje/${locale}/${slug}.yaml`] as StrojOverlay) ?? null;
}

// Pure overlay merge: cs base + prose overlay → lokalizovaný brand. ov=null → base
// beze změny (cs identita). Nemutuje base (structuredClone). Exportováno kvůli testům.
// cs struktura zůstává single source of truth — mění se jen prose stringy.
export function applyStrojOverlay(base: StrojBrand, ov: StrojOverlay | null): StrojBrand {
  if (!ov) return base;
  const b = structuredClone(base) as any;
  if (ov.country) b.country = ov.country;
  if (ov.description) b.description = ov.description;
  for (const [ck, cat] of Object.entries(b.categories || {}) as [string, any][]) {
    if (ov.categories?.[ck]) cat.name = ov.categories[ck];
    for (const s of cat.series || []) {
      if (ov.series?.[s.slug]) s.description = ov.series[s.slug];
      for (const m of s.models || []) {
        if (ov.models?.[m.slug]) m.description = ov.models[m.slug];
      }
    }
  }
  return b as StrojBrand;
}

function localizeBrand(base: StrojBrand, locale: string): StrojBrand {
  return applyStrojOverlay(base, getOverlay(base.slug, locale));
}

let cachedBrands: StrojBrand[] | null = null;
let cachedFlat: StrojFlatModel[] | null = null;

function coerceSlug(value: unknown): string {
  return typeof value === 'string' ? value : String(value);
}

function normalizeBrand(raw: any): StrojBrand {
  raw.slug = coerceSlug(raw.slug);
  for (const cat of Object.values(raw.categories || {}) as any[]) {
    for (const series of cat.series || []) {
      series.slug = coerceSlug(series.slug);
      for (const model of series.models || []) {
        model.slug = coerceSlug(model.slug);
      }
    }
  }
  return raw as StrojBrand;
}

export function getAllBrands(): StrojBrand[] {
  if (cachedBrands) return cachedBrands;
  const brands: StrojBrand[] = [];
  for (const [path, raw] of Object.entries(brandModules)) {
    const parsed = raw as StrojBrand;
    if (!parsed?.slug) {
      console.warn(`[stroje] Missing brand slug in ${path}`);
      continue;
    }
    brands.push(normalizeBrand(parsed));
  }
  brands.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  cachedBrands = brands;
  return brands;
}

export function getBrand(slug: string, locale: string = 'cs'): StrojBrand | undefined {
  const base = getAllBrands().find((b) => b.slug === slug);
  if (!base || locale === 'cs') return base;
  return localizeBrand(base, locale);
}

export function getAllModels(): StrojFlatModel[] {
  if (cachedFlat) return cachedFlat;
  const flat: StrojFlatModel[] = [];
  for (const brand of getAllBrands()) {
    for (const [catKey, cat] of Object.entries(brand.categories || {})) {
      const category = catKey as StrojKategorie;
      for (const series of cat.series || []) {
        const effective_category = (series.subcategory as StrojKategorie | undefined) ?? category;
        for (const model of series.models || []) {
          flat.push({
            ...model,
            year_from: model.year_from ?? null,
            year_to: model.year_to ?? null,
            brand_slug: brand.slug,
            brand_name: brand.name,
            category,
            effective_category,
            series_slug: series.slug,
            series_name: series.name,
          });
        }
      }
    }
  }
  cachedFlat = flat;
  return flat;
}

export function getModelBySlug(slug: string): StrojFlatModel | undefined {
  return getAllModels().find((m) => m.slug === slug);
}

export function getSeries(brandSlug: string, seriesSlug: string, locale: string = 'cs'): { brand: StrojBrand; category: StrojKategorie; series: StrojSeries } | undefined {
  const brand = getBrand(brandSlug, locale);
  if (!brand) return undefined;
  for (const [catKey, cat] of Object.entries(brand.categories || {})) {
    const s = cat.series.find((x) => x.slug === seriesSlug);
    if (s) return { brand, category: catKey as StrojKategorie, series: s };
  }
  return undefined;
}

export function seriesFamily(slug: string): string {
  if (/^\d/.test(slug)) return slug[0];
  const m = slug.match(/^([a-z]+)/);
  return m ? m[1] : slug;
}

export function familyLabel(family: string): string {
  if (/^\d+$/.test(family)) return `${family}. řada`;
  if (family.length <= 4) return family.toUpperCase();
  return family[0].toUpperCase() + family.slice(1);
}

export function formatPowerRange(models: StrojModel[]): string {
  const hps = models.map((m) => m.power_hp).filter((x): x is number => typeof x === 'number');
  if (hps.length === 0) return '';
  const min = Math.min(...hps);
  const max = Math.max(...hps);
  return min === max ? `${min} k` : `${min}–${max} k`;
}

export function formatYearRange(yearFrom: number | null, yearTo: number | null): string {
  if (!yearFrom) return '';
  if (!yearTo) return `${yearFrom}–dosud`;
  return `${yearFrom}–${yearTo}`;
}
