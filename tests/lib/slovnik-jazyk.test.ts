import { describe, it, expect } from 'vitest';
import { SLOVNIK_SK } from '../../src/lib/slovnik.sk';
import { SLOVNIK_PL } from '../../src/lib/slovnik.pl';
import { SLOVNIK_UK } from '../../src/lib/slovnik.uk';
import { SLOVNIK_DE } from '../../src/lib/slovnik.de';
import type { SlovnikTerm } from '../../src/lib/slovnik';

/**
 * Slovenský slovník byl strojový překlad z češtiny a zůstalo v něm přes 600 českých
 * slov („půdy", „růst", „zemědělství", „viz", nepřeložené české FAQ). Tenhle test
 * hlídá obsah hesel (ne slugy a cíle wikiodkazů — ty jsou české ID záměrně):
 * - sk: žádné ř/ů/ě mimo vlastní jména z ALLOW a žádná česká slova JSOU|VIZ|TAKÉ|…
 * - pl/uk/de: žádné ř/ů/ě mimo vlastní jména z ALLOW.
 */

/** Vlastní jména (instituce, místa, osoby, tituly), která se píší česky. */
const ALLOW: Record<'sk' | 'pl' | 'uk' | 'de', string[]> = {
  sk: [
    'Praha-Ruzyně', 'Třeboňsko', 'Břeclav', 'Země živitelka', 'Zemědělec', 'Meziboří', 'Němcovej',
    'Přerov nad Labem', 'Pelhřimovsko', 'České Meziříčí',
    'úhořit', // české sloveso citované v etymologii hesla Úhor
  ],
  pl: [
    'Země živitelka', 'Zemědělec', 'Němcovej', 'Přerov nad Labem', 'Praha-Ruzyně', 'České Meziříčí',
    'Českomoravská společnost chovatelů', 'Svaz chovatelů holštýnského skotu', 'Svaz chovatelů masného skotu',
    'Český svaz včelařů',
  ],
  uk: ['Země živitelka', 'Zemědělec', 'Český svaz včelařů'],
  de: [],
};

const CZ_LETTERS = /[řůěŘŮĚ]/;
const CZ_WORDS = /(?<![\p{L}])(jsou|viz|také|pouze|nebo|který|která|které)(?![\p{L}])/iu;

/** Obsahová pole hesla; z wikiodkazu `[[cíl|popisek]]` zůstane jen popisek. */
function contentFields(t: SlovnikTerm): [string, string][] {
  const strip = (s: string) => s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, _target, label) => label ?? '');
  const out: [string, string][] = [
    ['term', t.term],
    ['shortDef', t.shortDef],
    ['longDef', t.longDef],
    ['externalLabel', t.externalLabel ?? ''],
    ...(t.alias ?? []).map((a, i): [string, string] => [`alias[${i}]`, a]),
    ...(t.faq ?? []).flatMap((f, i): [string, string][] => [[`faq[${i}].q`, f.q], [`faq[${i}].a`, f.a]]),
    ...(t.zajimavosti ?? []).map((z, i): [string, string] => [`zajimavosti[${i}]`, z]),
  ];
  return out.map(([k, v]) => [k, strip(v)]);
}

function offenders(list: SlovnikTerm[], allow: string[], words: boolean): string[] {
  const found: string[] = [];
  for (const t of list) {
    for (const [k, raw] of contentFields(t)) {
      let v = raw;
      for (const name of allow) v = v.split(name).join('');
      const letter = v.match(/[\p{L}]*[řůěŘŮĚ][\p{L}]*/u);
      if (letter) found.push(`${t.slug}.${k}: „${letter[0]}"`);
      if (words) {
        const w = v.match(CZ_WORDS);
        if (w) found.push(`${t.slug}.${k}: „${w[0]}"`);
      }
    }
  }
  return found;
}

describe('slovník: žádná čeština v obsahu jiných jazyků', () => {
  it('sk — bez ř/ů/ě (mimo vlastní jména) a bez českých slov jsou/viz/také/pouze/nebo/který', () => {
    expect(offenders(SLOVNIK_SK, ALLOW.sk, true)).toEqual([]);
  });
  it('pl — bez ř/ů/ě mimo vlastní jména', () => {
    expect(offenders(SLOVNIK_PL, ALLOW.pl, false)).toEqual([]);
  });
  it('uk — bez ř/ů/ě mimo vlastní jména', () => {
    expect(offenders(SLOVNIK_UK, ALLOW.uk, false)).toEqual([]);
  });
  it('de — bez ř/ů/ě mimo vlastní jména', () => {
    expect(offenders(SLOVNIK_DE, ALLOW.de, false)).toEqual([]);
  });
  it('allowlist obsahuje jen jména, která v textu opravdu jsou', () => {
    const all: [string, SlovnikTerm[]][] = [['sk', SLOVNIK_SK], ['pl', SLOVNIK_PL], ['uk', SLOVNIK_UK], ['de', SLOVNIK_DE]];
    for (const [loc, list] of all) {
      const blob = list.map((t) => contentFields(t).map(([, v]) => v).join('\n')).join('\n');
      for (const name of ALLOW[loc as keyof typeof ALLOW]) {
        expect(CZ_LETTERS.test(name), `${loc}: „${name}" nemá ř/ů/ě, do allowlistu nepatří`).toBe(true);
        expect(blob.includes(name), `${loc}: „${name}" už v textu není`).toBe(true);
      }
    }
  });
});
