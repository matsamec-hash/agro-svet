// src/i18n/nav.ts
import type { Locale } from './config';
import { t } from './utils';

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { section: string; children?: NavLink[] };
export type FooterColumn = { section: string; heading: string; links: NavLink[] };

/** Sekce skryté v daném locale (jurisdikčně vázané / CZ-provozní). cs = nic. */
export const HIDDEN_SECTIONS: Record<Locale, string[]> = {
  cs: [],
  sk: ['data', 'bazar', 'photo'],
  uk: ['data', 'bazar', 'photo'],
};

/** Strom s překladovými klíči (labelKey) + hrefs. Jediný zdroj pravdy o menu. */
const NAV: { section: string; labelKey: string; href: string; children?: { labelKey: string; href: string }[] }[] = [
  {
    section: 'tema', labelKey: 'nav.tema', href: '/novinky/',
    children: [
      { labelKey: 'nav.tema.all', href: '/novinky/' },
      { labelKey: 'nav.tema.tech', href: '/novinky/kategorie/technika/' },
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
  return NAV
    .filter((item) => !hidden.includes(item.section))
    .map((item) => {
      const out: NavItem = { section: item.section, label: t(locale, item.labelKey), href: item.href };
      if (item.children) {
        out.children = item.children.map((c) => ({ label: t(locale, c.labelKey), href: c.href }));
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
  return FOOTER
    .filter((col) => !hidden.includes(col.section))
    .map((col) => ({
      section: col.section,
      heading: t(locale, col.headingKey),
      links: col.links.map((l) => ({ label: t(locale, l.labelKey), href: l.href })),
    }));
}
