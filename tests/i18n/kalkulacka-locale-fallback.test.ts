import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { locales, type Locale } from '../../src/i18n/config';
import { content as prevodyJednotek } from '../../src/i18n/kalkulacka/prevody-jednotek';
import { content as prevodyHmotnost } from '../../src/i18n/kalkulacka/prevody-hmotnost';
import { content as hub } from '../../src/i18n/kalkulacka/hub';
import { content as naklady } from '../../src/i18n/kalkulacka/naklady-na-hektar';
import { content as leasing } from '../../src/i18n/kalkulacka/leasing-traktoru';
import { content as usporaNafty } from '../../src/i18n/kalkulacka/uspora-nafty';
import { kombajn, lis, postrikovac, rozmetadlo, secacka, telehandler } from '../../src/i18n/kalkulacka/navratnost';

// PROČ: `uk: {} as PrevodyJednotekContent` je platný TypeScript, ale za běhu
// prázdný objekt — a `content[locale] ?? content.cs` na něj NESÁHNE, protože
// `{}` je truthy. Stránka pak čte `c.title` = undefined, Astro na undefined
// identifikátoru utne SSR stream a URL vrátí HTTP 500.
// Na produkci takhle padalo 18 URL: dvanáct /uk/kalkulacka/* (včetně rozcestníku)
// a šest /pl/kalkulacka/navratnost-*. Nikdo si toho nevšiml, protože prázdný
// blok vypadá v kódu jako „zatím nepřeloženo", ne jako rozbitá stránka.

const MAPS: Record<string, Record<string, any>> = {
  'prevody-jednotek': prevodyJednotek,
  'prevody-hmotnost': prevodyHmotnost,
  hub,
  'naklady-na-hektar': naklady,
  'leasing-traktoru': leasing,
  'uspora-nafty': usporaNafty,
  'navratnost-kombajnu': kombajn,
  'navratnost-lisu': lis,
  'navratnost-postrikovace': postrikovac,
  'navratnost-rozmetadla': rozmetadlo,
  'navratnost-seciho-stroje': secacka,
  'navratnost-telehandleru': telehandler,
};

describe('kalkulačky — fallback do češtiny musí opravdu zabrat', () => {
  it('každá locale dostane v každé kalkulačce neprázdný blok', () => {
    const bad: string[] = [];
    for (const [name, map] of Object.entries(MAPS)) {
      for (const locale of locales as readonly Locale[]) {
        // Přesně to, co dělá stránka: `content[locale] ?? content.cs`.
        const c = map[locale] ?? map.cs;
        if (!c || typeof c.title !== 'string' || c.title.trim() === '') {
          bad.push(`${name} / ${locale}: title = ${JSON.stringify(c?.title)}`);
        }
      }
    }
    expect(bad, `stránka by vrátila HTTP 500:\n${bad.join('\n')}`).toEqual([]);
  });

  it('žádný blok v mapě není prázdný objekt', () => {
    const bad: string[] = [];
    for (const [name, map] of Object.entries(MAPS)) {
      for (const [locale, block] of Object.entries(map)) {
        if (block && typeof block === 'object' && Object.keys(block).length === 0) {
          bad.push(`${name}: ${locale}`);
        }
      }
    }
    // Chybějící klíč je v pořádku (fallback zabere), prázdný objekt NE.
    expect(bad, `prázdný blok obejde ?? fallback:\n${bad.join('\n')}`).toEqual([]);
  });

  it('v src/i18n se nevyskytuje `{} as` přetypování', () => {
    // Zdrojová kontrola navrch: chytne i mapy, které tenhle test ještě neimportuje.
    const dir = join(process.cwd(), 'src/i18n/kalkulacka');
    const bad: string[] = [];
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
      const src = readFileSync(join(dir, f), 'utf8');
      for (const [i, line] of src.split('\n').entries()) {
        if (line.trimStart().startsWith('//')) continue; // komentáře popisují právě tuhle past
        if (/:\s*\{\}\s+as\s+/.test(line)) bad.push(`${f}:${i + 1}: ${line.trim()}`);
      }
    }
    expect(bad, `prázdný cast:\n${bad.join('\n')}`).toEqual([]);
  });
});
