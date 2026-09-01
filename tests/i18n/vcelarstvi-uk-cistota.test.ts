import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

// PROČ: ukrajinský overlay včelařství nesl u pěti včel FAQ CELÉ ČESKY — a FAQ
// teče do FAQPage JSON-LD, takže Google dostával české otázky pod ukrajinskou
// stránkou. Vedle toho `Nástavkový úл` a `Rozpěrka (páčidло)` byly napůl
// přeložené názvy a próza začínala českým podmětem („Akátový med належить…").
//
// ‼️ Enum hodnoty (temperament/výnos/rojivost/krystalizace/kategorie) zůstávají
// kanonicky ČESKY — jsou to klíče pro CSS třídy a JSON-LD, překládá je *Label().
// Ceny v Kč taky zůstávají: je to český trh a stránka to hlásí přes slov.czkNote.
// Test proto kontroluje jen VOLNÝ TEXT a Kč ceny vyjímá.

const ROOT = path.resolve(__dirname, '../..');
const CZ = /[ěščřžůýáíéúóťďňĚŠČŘŽŮÝÁÍÉÚÓŤĎŇ]/;

const ENUM_FIELDS: Record<string, string[]> = {
  vcely: ['temperament', 'medny_vynos', 'rojivost'],
  med: ['typ', 'krystalizace'],
  vybaveni: ['kategorie'],
};
// Neprózová pole: slugy, obrázky, odkazy — čeština v nich není únik.
// ‼️ `latinsky` ve skipu ZÁMĚRNĚ NENÍ. Vypadá jako čistá latina, ale buckfast
// tam nesl „Apis mellifera (šlechtěný hybrid)" — český dovětek v závorce, který
// se vypisuje pod ukrajinskou hlavičkou. Pole, které „je přece jen termín",
// je právě to, kde se překlad zapomene.
const SKIP = new Set([
  'slug', 'image_url', 'image_credit', 'image_source_url', 'image_license',
  'wikipedia', 'wikidata', 'related', 'pro_zacatecniky',
  // ceny jsou v Kč záměrně (český trh + slov.czkNote)
  'orientacni_cena',
]);
// Vlastní jména institucí smějí zůstat v originále (uvedená v závorce).
const ALLOWED = [/Český svaz včelařů/];

function collectCzech(node: unknown, at: string, dataset: string, out: string[]): void {
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectCzech(v, `${at}[${i}]`, dataset, out));
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      if (SKIP.has(k) || ENUM_FIELDS[dataset].includes(k)) continue;
      collectCzech(v, `${at}.${k}`, dataset, out);
    }
  } else if (typeof node === 'string') {
    const stripped = ALLOWED.reduce((s, re) => s.replace(re, ''), node);
    if (CZ.test(stripped)) out.push(`${at}: ${stripped.slice(0, 80)}`);
  }
}

describe('ukrajinský overlay včelařství neobsahuje češtinu v próze', () => {
  for (const dataset of ['vcely', 'vybaveni', 'med'] as const) {
    it(`${dataset}.yaml`, () => {
      const file = path.join(ROOT, `src/data/vcelarstvi/uk/${dataset}.yaml`);
      const items = yaml.load(fs.readFileSync(file, 'utf8')) as unknown[];
      expect(items.length).toBeGreaterThan(0);
      const found: string[] = [];
      items.forEach((it, i) => collectCzech(it, `${dataset}[${i}]`, dataset, found));
      expect(found).toEqual([]);
    });
  }

  it('enum hodnoty naopak ČESKY zůstat MUSÍ (klíče pro CSS a JSON-LD)', () => {
    const vcely = yaml.load(
      fs.readFileSync(path.join(ROOT, 'src/data/vcelarstvi/uk/vcely.yaml'), 'utf8'),
    ) as Array<{ temperament: string; medny_vynos: string; rojivost: string }>;
    const temperamenty = new Set(vcely.map((v) => v.temperament));
    expect([...temperamenty].every((t) => ['mírná', 'střední', 'obranná'].includes(t))).toBe(true);
  });

  it('FAQ existuje a je ukrajinské — teče do FAQPage JSON-LD', () => {
    const vcely = yaml.load(
      fs.readFileSync(path.join(ROOT, 'src/data/vcelarstvi/uk/vcely.yaml'), 'utf8'),
    ) as Array<{ faq?: { q: string; a: string }[] }>;
    const faqs = vcely.flatMap((v) => v.faq ?? []);
    expect(faqs.length).toBeGreaterThanOrEqual(9);
    for (const f of faqs) {
      expect(CZ.test(f.q), `česká otázka: ${f.q}`).toBe(false);
      expect(/[Ѐ-ӿ]/.test(f.q), `otázka není cyrilicí: ${f.q}`).toBe(true);
      expect(/[Ѐ-ӿ]/.test(f.a), `odpověď není cyrilicí: ${f.a.slice(0, 60)}`).toBe(true);
    }
  });
});
