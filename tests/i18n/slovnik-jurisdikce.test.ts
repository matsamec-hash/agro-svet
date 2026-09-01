import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// PROČ: slovenský slovník tvrdil, že „ČMSCH je ústredný evidenčný a registračný
// orgán včelstiev NA SLOVENSKU". To není špatný překlad — je to nepravdivé
// tvrzení o cizí jurisdikci. Slovenský chovatel se registruje v CEHZ
// (Plemenárske služby SR), dotace administruje PPA, přípravky registruje ÚKSÚP.
// Stejně tak „Intervencia 33.73" je kód ČESKÉ intervence a sazby byly v Kč,
// přestože Slovensko platí eurem.
//
// Polská a ukrajinská verze týchž hesel byly v pořádku, protože říkaly
// „w Czechach" / „у Чехії". Rozdíl není v jazyce, ale v tom, jestli je
// jurisdikce POJMENOVANÁ.

const LOCALES = ['sk', 'pl', 'uk', 'de'] as const;
type Loc = (typeof LOCALES)[number];

/** Zkratky českých úřadů. Zmínit je smí kterýkoli slovník — ale musí u toho
 *  říct, že jde o Česko. */
const CZ_AUTHORITY = /(ČMSCH|SZIF|ÚKZÚZ)/;
/** Jak se v daném jazyce řekne „v Česku". */
const NAMES_CZECHIA: Record<Loc, RegExp> = {
  sk: /(v Česku|Českej republike|česk)/i,
  pl: /(w Czechach|czesk)/i,
  uk: /(Чехії|чеськ)/i,
  de: /(Tschechien|tschechisch)/i,
};

interface Entry { slug: string; term: string; shortDef?: string; longDef?: string }

function load(loc: Loc): Entry[] {
  const src = readFileSync(join(process.cwd(), `src/lib/slovnik.${loc}.ts`), 'utf8');
  const start = src.search(/=\s*\[/) + src.slice(src.search(/=\s*\[/)).indexOf('[');
  let depth = 0;
  for (let j = start; j < src.length; j++) {
    if (src[j] === '[') depth++;
    else if (src[j] === ']' && --depth === 0) return JSON.parse(src.slice(start, j + 1));
  }
  throw new Error(`${loc}: pole hesel nenalezeno`);
}

describe('slovník — cizí jurisdikce musí být pojmenovaná', () => {
  it('shrnutí hesla nezmiňuje český úřad, aniž by řeklo, že jde o Česko', () => {
    // shortDef se ukazuje ve výpisu slovníku, takže tady se čtenář o kontext
    // dlouhého textu opřít nemůže.
    const bad: string[] = [];
    for (const loc of LOCALES) {
      for (const e of load(loc)) {
        const d = e.shortDef ?? '';
        if (CZ_AUTHORITY.test(d) && !NAMES_CZECHIA[loc].test(d)) bad.push(`${loc}: ${e.slug} — „${d.slice(0, 90)}…"`);
      }
    }
    expect(bad, `tvrzení o cizí jurisdikci bez uvedení země:\n${bad.join('\n')}`).toEqual([]);
  });

  it('slovenský slovník vede k slovenským úřadům, ne k českým', () => {
    const D = Object.fromEntries(load('sk').map((e) => [e.slug, e]));
    const cmsch = `${D['cmsch'].shortDef} ${D['cmsch'].longDef}`;
    expect(cmsch).toContain('CEHZ');
    expect(cmsch).toContain('Plemenárske služby');
    expect(cmsch).toContain('Slovenský zväz včelárov');
    // ČMSCH smí zůstat, ale jen jako výslovně české upřesnění.
    expect(D['cmsch'].shortDef).not.toContain('ČMSCH');

    expect(D['jednotna-zadost'].shortDef).toContain('PPA');
    expect(D['fungicidy'].longDef).toContain('ÚKSÚP');
    expect(D['fungicidy'].longDef).not.toContain('ÚKZÚZ');
  });

  it('slovenská a polská hesla o dotacích neuvádějí ceny v korunách', () => {
    // Slovensko platí eurem, Polsko zlotým. Sazba v Kč není přepočet, ale
    // převzatý český údaj vydávaný za místní.
    const bad: string[] = [];
    for (const loc of ['sk', 'pl'] as const) {
      for (const slug of ['sp-szp-2023-2027', 'intervence-33-73', 'jednotna-zadost']) {
        const e = load(loc).find((x) => x.slug === slug);
        if (!e) continue;
        if (/\bKč\b/.test(`${e.shortDef ?? ''} ${e.longDef ?? ''}`)) bad.push(`${loc}: ${slug}`);
      }
    }
    expect(bad, `české koruny v dotačním hesle:\n${bad.join('\n')}`).toEqual([]);
  });

  it('německý slovník je na tuto třídu čistý celý', () => {
    // Němčina vznikla už s tímhle pravidlem — drží ho jako referenci.
    const bad = load('de')
      .filter((e) => CZ_AUTHORITY.test(`${e.shortDef ?? ''} ${e.longDef ?? ''}`))
      .map((e) => e.slug);
    expect(bad, `české úřady v německém slovníku:\n${bad.join(', ')}`).toEqual([]);
  });
});
