import { describe, it, expect } from 'vitest';
import { getSlovnik, type SlovnikTerm } from '../../src/lib/slovnik';
import { extractWikilinks, parseWikilink, renderWikilinks } from '../../src/lib/slovnik-wikilinks';

/**
 * Wikiodkazy `[[slug]]` ve slovníku. Slug je společný pro všechny jazyky
 * (český slug = klíč). Strojový překlad sk slovníku slugy přeložil
 * (`[[hektár]]`, `[[osevný-postup]]`) a web pak ukazoval 173 odkazů doslova
 * i se závorkami; v cs/pl/uk po 9 odkazech na hesla, která nikde neexistují.
 */

const LOCALES = ['cs', 'sk', 'pl', 'uk', 'de'] as const;

/** Pole, která šablona hesla vypisuje jako prostý text (bez wikilink rendereru). */
const plainFields = (t: SlovnikTerm): [string, string][] => [
  ['term', t.term],
  ['shortDef', t.shortDef],
  ...(t.alias ?? []).map((a, i): [string, string] => [`alias[${i}]`, a]),
  ...(t.faq ?? []).flatMap((f, i): [string, string][] => [[`faq[${i}].q`, f.q], [`faq[${i}].a`, f.a]]),
  ...(t.zajimavosti ?? []).map((z, i): [string, string] => [`zajimavosti[${i}]`, z]),
];

describe('slovník — každý [[…]] míří na existující heslo', () => {
  for (const locale of LOCALES) {
    it(`${locale}: longDef nemá odkaz na neexistující slug`, () => {
      const list = getSlovnik(locale);
      const slugs = new Set(list.map((t) => t.slug));
      const broken = list.flatMap((t) =>
        extractWikilinks(t.longDef)
          .filter((l) => !slugs.has(l.slug))
          .map((l) => `${t.slug} → [[${l.slug}]]`),
      );
      expect(broken).toEqual([]);
    });

    it(`${locale}: pole bez rendereru (term, shortDef, alias, FAQ, zajímavosti) nemají [[ ani ]]`, () => {
      const bad = getSlovnik(locale).flatMap((t) =>
        plainFields(t).filter(([, s]) => /\[\[|\]\]/.test(s)).map(([f]) => `${t.slug}.${f}`),
      );
      expect(bad).toEqual([]);
    });

    it(`${locale}: vykreslený longDef nikdy neobsahuje surové [[ ani ]]`, () => {
      const list = getSlovnik(locale);
      const bySlug = new Map(list.map((t) => [t.slug, t.term]));
      const base = locale === 'cs' ? '' : `/${locale}`;
      const bad = list.filter((t) => /\[\[|\]\]/.test(renderWikilinks(t.longDef, bySlug, base))).map((t) => t.slug);
      expect(bad).toEqual([]);
    });
  }
});

describe('renderWikilinks', () => {
  const terms = new Map([['hektar', 'Hektár (ha)'], ['korec', 'Korec']]);

  it('známý slug → odkaz s názvem hesla v jazyce stránky', () => {
    expect(renderWikilinks('Pozri tiež [[hektar]].', terms, '/sk'))
      .toBe('Pozri tiež <a href="/sk/slovnik/hektar/">Hektár (ha)</a>.');
  });

  it('[[slug|text]] → odkaz s vlastním textem', () => {
    expect(renderWikilinks('gleichbedeutend mit dem [[korec|Scheffel]]', terms, '/de'))
      .toBe('gleichbedeutend mit dem <a href="/de/slovnik/korec/">Scheffel</a>');
  });

  it('neznámý slug → prostý text, ne surové závorky', () => {
    expect(renderWikilinks('viz [[parni-stroj]]', terms, '')).toBe('viz parni stroj');
    expect(renderWikilinks('[[hektár]] a [[neni|nic]]', terms, '/sk')).toBe('hektár a nic');
  });

  it('osiřelé [[ / ]] se zahodí', () => {
    expect(renderWikilinks('a [[hektar b]] c [[', terms, '')).toBe('a hektar b c ');
  });

  it('parseWikilink', () => {
    expect(parseWikilink('korec|Scheffel')).toEqual({ slug: 'korec', label: 'Scheffel' });
    expect(parseWikilink('pH-pudy')).toEqual({ slug: 'pH-pudy' });
  });
});
