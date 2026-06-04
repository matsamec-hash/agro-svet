// src/i18n/nav.ts
import type { Locale } from './config';
import { t } from './utils';

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { section: string; children?: NavLink[] };
export type FooterColumn = { section: string; heading: string; links: NavLink[] };

/** Sekce skryté v daném locale (jurisdikčně vázané / CZ-provozní). cs = nic. */
export const HIDDEN_SECTIONS: Record<Locale, string[]> = {
  cs: [],
  // Fáze 2b A: `data` už sk neskrývá — /dotace a /kalkulacka/dotace-cap byly
  // odemčeny (SK obsah nasazen). Fáze 2b B: /statistiky taky odemčeno (SK obsah).
  // Fáze 2b C: /puda odemčeno → LOCKED_SECTION_PREFIXES je teď prázdné, takže
  // getNav už nic z `data` nefiltruje. uk zůstává plně skrytá.
  sk: ['bazar', 'photo'],
  uk: ['data', 'bazar', 'photo'],
};

/** Novinkové KATEGORIE skryté v non-cs locale: jurisdikčně uzamčené (české
 *  dotace/SZIF, česká legislativa, českým trhem rámované ceny). Vyřazují se
 *  z /sk novinek (nav, listing, kategorie, tag, related, sitemap), dokud je
 *  Fáze 2b nenahradí reálnými SK daty. cs = nic. */
export const HIDDEN_NEWS_CATEGORIES: Record<Locale, string[]> = {
  cs: [],
  sk: ['dotace', 'legislativa', 'trh'],
  uk: ['dotace', 'legislativa', 'trh'],
};

/** cs-root prefixy CZ-jurisdikčních nástrojů/dat. Po Fázi 2b balíku C jsou
 *  VŠECHNY `data` nástroje odemčeny (A=dotace, B=statistiky, C=puda) → prázdné.
 *  Ponecháno pro budoucí použití + lock-guard v Layoutu. */
export const LOCKED_SECTION_PREFIXES: string[] = [];

/** True, pokud cs-root cesta patří do CZ-jurisdikčně uzamčené sekce. */
export function isLockedSectionPath(csRootPath: string): boolean {
  return LOCKED_SECTION_PREFIXES.some((p) => csRootPath === p || csRootPath.startsWith(`${p}/`));
}

/** True, pokud je novinková kategorie v daném locale skrytá (jurisdikčně uzamčená). */
export function isNewsCategoryHidden(locale: Locale, category: string | null | undefined): boolean {
  return !!category && HIDDEN_NEWS_CATEGORIES[locale].includes(category);
}

/** Strom s překladovými klíči (labelKey) + hrefs. Jediný zdroj pravdy o menu. */
const NAV: { section: string; labelKey: string; href: string; children?: { labelKey: string; href: string }[] }[] = [
  {
    section: 'tema', labelKey: 'nav.tema', href: '/novinky/',
    children: [
      { labelKey: 'nav.tema.all', href: '/novinky/' },
      { labelKey: 'nav.tema.tech', href: '/novinky/kategorie/technika/' },
      // Záměrně NEgated pro sk/uk: tohle je novinková KATEGORIE (tag), ne
      // jurisdikčně vázaný nástroj. Skrytá je top-level sekce `data` níže,
      // která obsahuje reálnou /dotace/ stránku (CZ dotační kalkulačky).
      { labelKey: 'nav.tema.dotace', href: '/novinky/kategorie/dotace/' },
      { labelKey: 'nav.tema.trh', href: '/novinky/kategorie/trh/' },
      { labelKey: 'nav.tema.legislativa', href: '/novinky/kategorie/legislativa/' },
      { labelKey: 'nav.tema.howto', href: '/jak-na-to/' },
      { labelKey: 'nav.tema.guide', href: '/pruvodce/' },
      { labelKey: 'nav.tema.market', href: '/prehled/' },
    ],
  },
  {
    section: 'animals', labelKey: 'nav.animals', href: '/plemena/',
    children: [
      { labelKey: 'nav.animals.all', href: '/plemena/' },
      { labelKey: 'nav.animals.cattle', href: '/plemena/hovezi/' },
      { labelKey: 'nav.animals.horses', href: '/plemena/kone/' },
      { labelKey: 'nav.animals.sheep', href: '/plemena/ovce/' },
      { labelKey: 'nav.animals.pigs', href: '/plemena/prasata/' },
      { labelKey: 'nav.animals.bees', href: '/vcelarstvi/' },
      { labelKey: 'nav.animals.snails', href: '/chov-hlemyzdu/' },
    ],
  },
  {
    section: 'tech', labelKey: 'nav.tech', href: '/stroje/',
    children: [
      { labelKey: 'nav.tech.all', href: '/stroje/' },
      { labelKey: 'nav.tech.tractors', href: '/stroje/traktory/' },
      { labelKey: 'nav.tech.combines', href: '/stroje/kombajny/' },
      { labelKey: 'nav.tech.machines', href: '/stroje/zemedelske-stroje/' },
      { labelKey: 'nav.tech.brands', href: '/znacky/' },
      { labelKey: 'nav.tech.compare', href: '/srovnani/' },
      { labelKey: 'nav.tech.toplists', href: '/zebricky/' },
      { labelKey: 'nav.tech.glossary', href: '/slovnik/' },
      { labelKey: 'nav.tech.quizzes', href: '/kviz/' },
      { labelKey: 'nav.tech.dealers', href: '/prodejci/' },
    ],
  },
  {
    section: 'data', labelKey: 'nav.data', href: '/statistiky/',
    children: [
      { labelKey: 'nav.data.markets', href: '/statistiky/' },
      { labelKey: 'nav.data.soil', href: '/puda/' },
      { labelKey: 'nav.data.calculators', href: '/kalkulacka/' },
      { labelKey: 'nav.data.capCalc', href: '/kalkulacka/dotace-cap/' },
      { labelKey: 'nav.data.subsidies', href: '/dotace/' },
    ],
  },
  { section: 'farms', labelKey: 'nav.farms', href: '/farmy/' },
  { section: 'bazar', labelKey: 'nav.bazar', href: '/bazar/' },
  { section: 'photo', labelKey: 'nav.photo', href: '/fotosoutez/' },
];

/** Přeložený + locale-filtrovaný navigační strom. */
export function getNav(locale: Locale): NavItem[] {
  const hidden = HIDDEN_SECTIONS[locale];
  const hiddenCats = HIDDEN_NEWS_CATEGORIES[locale];
  const hiddenCatHrefs = hiddenCats.map((c) => `/novinky/kategorie/${c}/`);
  // Non-cs locale: z viditelných sekcí vyfiltruj stále uzamčené CZ-nástroje
  // (/puda) a přesměruj header dead-linkující na locked cestu.
  // cs musí zůstat byte-identické → filtr neaplikujeme (i když isLockedSectionPath
  // je locale-agnostické, cs si všech 5 dětí + header /statistiky/ ponechává).
  const filterLocked = locale !== 'cs';
  const norm = (href: string) => href.replace(/\/+$/, '') || '/';
  return NAV
    .filter((item) => !hidden.includes(item.section))
    .map((item) => {
      const out: NavItem = { section: item.section, label: t(locale, item.labelKey), href: item.href };
      if (item.children) {
        // Skryj jurisdikčně uzamčené novinkové kategorie (locale-specific; pro cs
        // prázdné → beze změny).
        out.children = item.children
          .filter((c) => !hiddenCatHrefs.includes(c.href))
          .filter((c) => !filterLocked || !isLockedSectionPath(norm(c.href)))
          .map((c) => ({ label: t(locale, c.labelKey), href: c.href }));
        // Pokud vlastní top-level href sekce ukazuje na locked cestu (a filtrujeme),
        // přesměruj na první viditelné dítě, ať header nedead-linkuje na 307 redirect.
        if (filterLocked && isLockedSectionPath(norm(item.href)) && out.children.length) {
          out.href = out.children[0].href;
        }
      }
      return out;
    });
}

const FOOTER: { section: string; headingKey: string; links: { labelKey: string; href: string }[] }[] = [
  {
    section: 'content', headingKey: 'footer.content',
    links: [
      { labelKey: 'footer.news', href: '/novinky/' },
      { labelKey: 'footer.techCatalog', href: '/stroje/' },
      { labelKey: 'footer.breeds', href: '/plemena/' },
      { labelKey: 'footer.soil', href: '/puda/' },
      { labelKey: 'footer.dataStats', href: '/statistiky/' },
    ],
  },
  {
    section: 'bazar', headingKey: 'footer.bazar',
    links: [
      { labelKey: 'footer.allAds', href: '/bazar/' },
      { labelKey: 'footer.addAd', href: '/bazar/novy/' },
      { labelKey: 'footer.login', href: '/bazar/prihlaseni/' },
      { labelKey: 'footer.registration', href: '/bazar/registrace/' },
      { labelKey: 'footer.bazarRules', href: '/bazar/pravidla/' },
    ],
  },
  {
    section: 'photo', headingKey: 'footer.photo',
    links: [
      { labelKey: 'footer.photoCurrent', href: '/fotosoutez/' },
      { labelKey: 'footer.photoArchive', href: '/fotosoutez/archiv/' },
      { labelKey: 'footer.photoRules', href: '/fotosoutez/pravidla/' },
      { labelKey: 'footer.photoGdpr', href: '/fotosoutez/gdpr/' },
    ],
  },
];

/** Přeložené + locale-filtrované footer sloupce. */
export function getFooterColumns(locale: Locale): FooterColumn[] {
  const hidden = HIDDEN_SECTIONS[locale];
  // Non-cs locale skryje odkazy na stále uzamčené CZ-jurisdikční nástroje
  // (/puda) i v ostatních footer sloupcích. Odděleno od `data` hidden flagu
  // (Fáze 2b A/B `data` sk neskrývá, /statistiky odemčeno). cs = false → beze změny.
  const hideLocked = locale !== 'cs';
  return FOOTER
    .filter((col) => !hidden.includes(col.section))
    .map((col) => ({
      section: col.section,
      heading: t(locale, col.headingKey),
      links: col.links
        .filter((l) => !(hideLocked && isLockedSectionPath(l.href.replace(/\/+$/, '') || '/')))
        .map((l) => ({ label: t(locale, l.labelKey), href: l.href })),
    }));
}
