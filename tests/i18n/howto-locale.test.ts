import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { LAUNCHED_PREFIXES } from '../../src/i18n/utils';
import { locales, defaultLocale, type Locale } from '../../src/i18n/config';

// PROČ: `HOWTO_COLLECTION = { cs, sk, uk }` je mapa bez zbylých jazyků. Pro
// němčinu by vrátila undefined a `getCollection(undefined)` spadne — stránka
// /de/jak-na-to/ by hodila 500, ne cs fallback. Stejná třída jako prázdný cast
// v kalkulačkách: chybějící klíč v locale mapě se pozná až za běhu.

const ROOT = process.cwd();
const PAGES = ['src/pages/jak-na-to/index.astro', 'src/pages/jak-na-to/[slug].astro'];
/** locale → adresář overlay kolekce (cs je zdroj). */
const DIR: Record<string, string> = {
  cs: 'src/content/howto',
  sk: 'src/content/howto-sk',
  uk: 'src/content/howto-uk',
  de: 'src/content/howto-de',
};

const slugs = (dir: string) =>
  new Set(readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')));

const launched = (l: Locale) => l === defaultLocale || (LAUNCHED_PREFIXES[l] ?? []).some((p) => p === '/jak-na-to');

describe('/jak-na-to — overlay kolekce po locale', () => {
  it('HOWTO_COLLECTION zná každý locale, kde je sekce launchnutá', () => {
    const bad: string[] = [];
    for (const page of PAGES) {
      const src = readFileSync(join(ROOT, page), 'utf8');
      for (const l of locales as readonly Locale[]) {
        if (!launched(l)) continue;
        if (!new RegExp(`\\b${l}:\\s*'howto`).test(src)) bad.push(`${page}: chybí ${l}`);
      }
    }
    expect(bad, `getCollection(undefined) → HTTP 500:\n${bad.join('\n')}`).toEqual([]);
  });

  it('každý launchnutý locale má neprázdný adresář s návody', () => {
    for (const l of locales as readonly Locale[]) {
      if (!launched(l)) continue;
      const dir = DIR[l];
      expect(dir, `${l}: chybí mapování na adresář`).toBeTruthy();
      expect(existsSync(join(ROOT, dir)), `${l}: ${dir} neexistuje`).toBe(true);
      expect(slugs(dir).size, `${l}: prázdná kolekce`).toBeGreaterThan(0);
    }
  });

  it('žádný overlay slug neexistuje mimo českou sadu', () => {
    // Slug se REUSUJE z cs (URL je stejná). Overlay se slugem navíc by vytvořil
    // stránku, na kterou z české struktury nevede cesta a která nemá originál.
    const cs = slugs(DIR.cs);
    const extra: string[] = [];
    for (const [l, dir] of Object.entries(DIR)) {
      if (l === 'cs' || !existsSync(join(ROOT, dir))) continue;
      for (const s of slugs(dir)) if (!cs.has(s)) extra.push(`${l}: ${s}`);
    }
    expect(extra, `overlay slug bez českého originálu:\n${extra.join('\n')}`).toEqual([]);
  });

  it('jurisdikční návody zůstávají cs-only v de a uk', () => {
    // `registrace-vcelaru` = evidence u ČMSCH podle českého veterinárního zákona,
    // `jak-naplanovat-dotaci-na-techniku` = SZIF a kola PRV. Přeložit je znamená
    // servírovat cizímu čtenáři českou právní úpravu, jako by platila u něj.
    //
    // ‼️ ZNÁMÁ ODCHYLKA: sk oba návody přeložené MÁ a odkazuje v nich na ČMSCH
    // i SZIF — slovenský včelař se přitom registruje v CEHZ a dotace čerpá přes
    // PPA. Je to starší obsah, nasazený před tímto pravidlem; test ho proto
    // nehlídá, ale ani nelegitimizuje. Až se sk obsah opraví, přidej sem 'sk'.
    const JURISDICTION = ['registrace-vcelaru', 'jak-naplanovat-dotaci-na-techniku'];
    const bad: string[] = [];
    for (const l of ['de', 'uk'] as const) {
      if (!existsSync(join(ROOT, DIR[l]))) continue;
      for (const j of JURISDICTION) if (slugs(DIR[l]).has(j)) bad.push(`${l}: ${j}`);
    }
    expect(bad, `jurisdikční návod přeložen:\n${bad.join('\n')}`).toEqual([]);
  });

  it('německé návody nejsou české — frontmatter i tělo jsou v němčině', () => {
    // Diakritika je na obsahové overlaye nespolehlivá (česká vlastní jména jsou
    // legitimní), proto hledáme česká SLOVA, která se v němčině vyskytnout nemají.
    const CZ_WORDS = /\b(včel|nastavte|zkontrolujte|hloubka|postup|přípravk|zásob|obsluh|pluhu|medu)\w*/i;
    const bad: string[] = [];
    for (const f of readdirSync(join(ROOT, DIR.de))) {
      // ‼️ Ze scanu VEN musí `slug`, `heroImage`, `relatedUrl` a cíle odkazů —
      // ty české slugy nesou ZÁMĚRNĚ (URL se reusuje z cs, viz test výše).
      // Bez toho test hlásí „traktoru" ze slugu, ne z textu. Klasický falešný
      // poplach jazykové kontroly na obsahovém overlayi.
      const src = readFileSync(join(ROOT, DIR.de, f), 'utf8')
        .replace(/^(slug|heroImage|relatedUrl):.*$/gm, '')
        .replace(/\]\([^)]*\)/g, ']');
      const m = src.match(CZ_WORDS);
      if (m) bad.push(`${f}: „${m[0]}"`);
    }
    expect(bad, `český zbytek v německém overlayi:\n${bad.join('\n')}`).toEqual([]);
  });

  it('de a uk pokrývají stejnou sadu návodů', () => {
    // Obě mutace vynechávají tytéž dva jurisdikční návody — kdyby se sady
    // rozešly, znamená to, že někde chybí soubor nebo přebývá překlad.
    expect([...slugs(DIR.de)].sort()).toEqual([...slugs(DIR.uk)].sort());
  });
});
