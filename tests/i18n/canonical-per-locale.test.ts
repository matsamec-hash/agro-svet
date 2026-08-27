import { describe, it, expect } from 'vitest';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LAUNCHED_PREFIXES } from '../../src/i18n/utils';

// PROČ: /pl/redakce/ bylo ŽIVĚ indexovatelné, ale kanonizovalo na české
// /redakce/ — `canonical={isSk ? undefined : cs URL}`. Hreflang tedy říkal
// „alternativní jazyková verze", canonical „duplikát češtiny". Google si vybere
// canonical, takže polská (a nově ukrajinská) verze nemá šanci se umístit.
//
// Pravidlo: v šabloně sekce launchnuté pro non-cs locale musí být canonical buď
// vynechaný (Layout dopočítá self-canonical), nebo závislý na locale.

const PAGES = join(process.cwd(), 'src/pages');

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.astro')) out.push(p);
  }
  return out;
}

describe('canonical v launchnutých sekcích', () => {
  it('nikde není natvrdo česká URL', () => {
    const launched = new Set(
      Object.entries(LAUNCHED_PREFIXES)
        .filter(([locale]) => locale !== 'cs')
        .flatMap(([, prefixes]) => prefixes)
        // Sekce existující jen pro jednu locale kanonizují na svůj vlastní
        // prefix natvrdo a je to správně.
        .filter((p) => p !== '/' && !['/poradniki', '/doplaty-bezposrednie', '/ekoschematy'].includes(p)),
    );
    expect(launched.size).toBeGreaterThan(10);

    const bad: string[] = [];
    for (const file of walk(PAGES)) {
      const rel = file.slice(PAGES.length);
      const section = `/${rel.split('/')[1] ?? ''}`;
      if (!launched.has(section)) continue;

      const src = readFileSync(file, 'utf8');
      // Výraz může obsahovat ${...}, takže bereme zbytek řádku za `canonical=`.
      for (const m of src.matchAll(/canonical=(\{.*|"[^"]*")/g)) {
        const expr = m[1];
        // Bezpečné: závisí na locale/prefixu, nebo je to proměnná z frontmatteru.
        if (/locale|isCs|isSk|isPl|isUk|undefined|\bbase\b/.test(expr)) continue;
        if (/^\{[a-zA-Z][\w.]*\}/.test(expr.trim())) continue; // canonical={canonical}
        bad.push(`${rel}: canonical=${expr.trim().slice(0, 60)}`);
      }
    }
    expect(bad, `canonical nezávislý na locale:\n${bad.join('\n')}`).toEqual([]);
  });
});
