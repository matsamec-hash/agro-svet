import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import cs from '../../src/i18n/ui/cs';
import sk from '../../src/i18n/ui/sk';
import pl from '../../src/i18n/ui/pl';
import uk from '../../src/i18n/ui/uk';

// PROČ: dvakrát mi do šablony spadlo volání překladače pod jménem, které v tom
// souboru neexistuje — `{__t('stat.timeAll')}` (překladač se tam jmenuje `tt`)
// a `t(...)` v souboru, kde `const t = srovnaniStrings(locale)`. Astro to
// nezachytí při buildu; spadne to až za běhu při SSR renderu a JEDNO takové
// volání utne celý HTML stream → produkce servíruje useknutou stránku.
// Tenhle test proto ověřuje dvě věci naráz:
//   1) identifikátor překladače je v daném souboru opravdu zaveden,
//   2) použitý klíč existuje v cs mapě (překlepy v klíčích).

const ROOT = join(process.cwd(), 'src');

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.astro')) out.push(p);
  }
  return out;
}

/** Rozdělí .astro na frontmatter (---…---) a šablonu. */
function split(src: string): { fm: string; body: string } {
  if (!src.startsWith('---')) return { fm: '', body: src };
  const end = src.indexOf('\n---', 3);
  if (end < 0) return { fm: '', body: src };
  return { fm: src.slice(3, end), body: src.slice(end + 4) };
}

const files = walk(ROOT);

// Sjednocení všech locale map: uk-only komponenty (PudaUk, StatistikyUk,
// DotaceUk) mají vlastní `*.uk.*` klíče, které v cs.ts záměrně nejsou.
const KNOWN_KEYS = new Set([...Object.keys(cs), ...Object.keys(sk), ...Object.keys(pl), ...Object.keys(uk)]);

describe('.astro — volání překladače', () => {
  it('každý identifikátor překladače je v souboru zavedený', () => {
    const bad: string[] = [];
    for (const f of files) {
      const { fm, body } = split(readFileSync(f, 'utf8'));
      // ident('klic') nebo ident(locale, 'klic')
      const idents = new Set<string>();
      for (const m of body.matchAll(/\b([A-Za-z_$][\w$]*)\(\s*(?:locale\s*,\s*)?'[\w.-]+'\s*[),]/g)) {
        idents.add(m[1]);
      }
      for (const id of idents) {
        // zajímají nás jen jména, která vypadají jako překladač
        if (!/^(_*t|tr|tt|tUi|tf|_+[\w$]*)$/.test(id)) continue;
        const declared =
          new RegExp(`\\b(?:const|let|var|function)\\s+${id}\\b`).test(fm) ||
          new RegExp(`\\b${id}\\b\\s*(?:,|}|$)`, 'm').test(
            fm.split('\n').filter((l) => l.trim().startsWith('import')).join('\n'),
          );
        if (!declared) bad.push(`${f.replace(process.cwd() + '/', '')}: ${id}(...)`);
      }
    }
    expect(bad, `nedeklarovaný překladač v šabloně:\n${bad.join('\n')}`).toEqual([]);
  });

  it('klíče použité v šablonách existují aspoň v jedné locale mapě', () => {
    const missing: string[] = [];
    for (const f of files) {
      const { body } = split(readFileSync(f, 'utf8'));
      for (const m of body.matchAll(/\b(?:t|tr|tt|tUi)\(\s*(?:locale\s*,\s*)?'([\w.-]+)'\s*\)/g)) {
        const key = m[1];
        // heuristika: klíče mají tečku (jinak jde o něco jiného než i18n)
        if (!key.includes('.')) continue;
        if (!KNOWN_KEYS.has(key)) missing.push(`${f.replace(process.cwd() + '/', '')}: ${key}`);
      }
    }
    expect(missing, `klíč nenalezen v žádné ui/*.ts:\n${missing.join('\n')}`).toEqual([]);
  });
});
