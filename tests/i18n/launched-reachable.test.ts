// tests/i18n/launched-reachable.test.ts
// ‼️ Launchnout sekci a ODKÁZAT na ni jsou DVĚ různé věci.
// Reálný nález 2026-08-31: /de mělo 17 launchnutých sekcí a v hlavičce jednu
// položku, /uk mělo 22 launchnutých sekcí a na homepage čtyři karty. Sekce
// existovaly, renderovaly se, byly v sitemapě — a nevedl na ně jediný odkaz,
// protože v HIDDEN_SECTIONS zůstala zaseknutá `animals`/`tema` z doby, kdy ty
// sekce ještě přeložené nebyly, a rozcestníky mají karty natvrdo.
//
// Tenhle test je invariant NA TŘÍDU: každá launchnutá sekce musí být
// dosažitelná z navigace NEBO z locale rozcestníku. Chytí i příští jazyk.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { LAUNCHED_PREFIXES } from '../../src/i18n/utils';
import { getNav, getFooterColumns, HIDDEN_SECTIONS } from '../../src/i18n/nav';
import type { Locale } from '../../src/i18n/config';

const ROOT = process.cwd();

/** Sekce, které nemusí mít odkaz v menu ani na rozcestníku. */
const NOT_REQUIRED = new Set([
  '/',                            // sám rozcestník
  '/hledat',                      // noindex, vstup je lupa v hlavičce
  '/podminky-pouziti',            // právní — patří do patičky, ne do menu
  '/zpracovani-osobnich-udaju',
  '/dsa-kontakt',
  '/redakce',
]);

/** Rozcestník (locale homepage) pro daný jazyk, pokud existuje. */
const HUB_FILE: Partial<Record<Locale, string>> = {
  de: 'src/components/home/HomeDe.astro',
  uk: 'src/components/home/HomeUk.astro',
  sk: 'src/components/home/HomeSk.astro',
};

function hubHrefs(locale: Locale): string[] {
  const rel = HUB_FILE[locale];
  if (!rel) return [];
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return [];
  const src = fs.readFileSync(abs, 'utf8');
  // href: '/de/plemena/'  →  /plemena
  return [...src.matchAll(/href:\s*'\/([a-z]{2})(\/[^']*)'/g)]
    .filter((m) => m[1] === locale)
    .map((m) => (m[2].replace(/\/+$/, '') || '/'));
}

function navHrefs(locale: Locale): string[] {
  const out: string[] = [];
  for (const item of getNav(locale)) {
    out.push(item.href);
    for (const c of item.children ?? []) out.push(c.href);
  }
  for (const col of getFooterColumns(locale)) for (const l of col.links) out.push(l.href);
  return out.map((h) => h.replace(/\/+$/, '') || '/');
}

/** Sekce je dosažitelná, pokud na ni (nebo do jejího podstromu) vede odkaz. */
function reaches(links: string[], prefix: string): boolean {
  return links.some((h) => h === prefix || h.startsWith(`${prefix}/`));
}

const LOCALES: Locale[] = ['sk', 'uk', 'pl', 'de'];

describe('každá launchnutá sekce je odkazovaná', () => {
  for (const locale of LOCALES) {
    it(`${locale}: žádná launchnutá sekce není osiřelá`, () => {
      const links = [...navHrefs(locale), ...hubHrefs(locale)];
      const orphans = LAUNCHED_PREFIXES[locale]
        .filter((p) => !NOT_REQUIRED.has(p))
        .filter((p) => !reaches(links, p));
      expect(orphans, `${locale} — launchnuté, ale bez odkazu: ${orphans.join(', ')}`).toEqual([]);
    });
  }
});

describe('rozcestník nelinkuje mimo launchnuté', () => {
  for (const locale of Object.keys(HUB_FILE) as Locale[]) {
    it(`${locale}: každá karta rozcestníku míří na launchnutou sekci`, () => {
      const launched = LAUNCHED_PREFIXES[locale];
      const bad = hubHrefs(locale).filter(
        (h) => !launched.some((p) => h === p || h.startsWith(`${p}/`)),
      );
      expect(bad, `${locale} — karty na NElaunchnuté cesty: ${bad.join(', ')}`).toEqual([]);
    });
  }
});

describe('HIDDEN_SECTIONS neschovává sekci, která už obsah má', () => {
  // Nejde zjistit „má obsah" obecně, ale JDE zjistit rozpor: sekce je schovaná
  // v menu, a přitom je její hlavní cesta launchnutá. Přesně tenhle rozpor
  // zamkl /de/plemena a /uk/plemena i po nasazení overlaye.
  const SECTION_MAIN_PATH: Record<string, string> = {
    animals: '/plemena',
    tema: '/novinky',
    data: '/data',
    farms: '/farmy',
    bazar: '/bazar',
    photo: '/fotosoutez',
  };
  for (const locale of LOCALES) {
    it(`${locale}: schovaná sekce nemá launchnutou hlavní cestu`, () => {
      const conflict = (HIDDEN_SECTIONS[locale] as string[])
        .filter((s) => SECTION_MAIN_PATH[s])
        .filter((s) => LAUNCHED_PREFIXES[locale].includes(SECTION_MAIN_PATH[s]));
      expect(conflict, `${locale} — schované v menu, ale launchnuté: ${conflict.join(', ')}`).toEqual([]);
    });
  }
});


// Nalezeno 2026-08-31 při launchi /de/kviz: sekce byla launchnutá, hub se
// vyrenderoval — a nenabízel jediný kvíz, protože LOCALIZED_QUIZZES pro de
// chyběl. Launch sekce a viditelnost jejího obsahu jsou dvě různé věci.
describe('launchnutý /kviz nabízí aspoň jeden kvíz', () => {
  it('LOCALIZED_QUIZZES pokrývá každý locale, kde je /kviz launchnuté', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/pages/kviz/index.astro'), 'utf8');
    const block = src.match(/const LOCALIZED_QUIZZES[^{]*\{([\s\S]*?)\n\};/);
    expect(block, 'LOCALIZED_QUIZZES nenalezeno').toBeTruthy();
    const covered = [...block![1].matchAll(/^\s*(\w+):\s*\[([^\]]*)\]/gm)]
      .filter((m) => m[2].trim().length > 0)
      .map((m) => m[1]);
    const missing = (['sk', 'uk', 'pl', 'de'] as Locale[])
      .filter((l) => LAUNCHED_PREFIXES[l].includes('/kviz'))
      .filter((l) => !covered.includes(l));
    expect(missing, `/kviz launchnuté, ale hub by byl prázdný: ${missing.join(', ')}`).toEqual([]);
  });
});
