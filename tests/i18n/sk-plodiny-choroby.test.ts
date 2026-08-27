import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { join } from 'node:path';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { listPlodiny } from '../../src/lib/plodiny';
import { listChoroby } from '../../src/lib/choroby';

/** Klíče, které se z cs NEPŘEKLÁDAJÍ (mapování, obrázky, kalendář, latina). */
const KEY_FIELDS = new Set(['slug', 'skupina', 'hero_image', 'hero_author', 'hero_license', 'hero_source',
  'seti_mesice', 'sklizen_mesice', 'wikipedia', 'latinsky', 'aliases', 'ucinne_latky']);

describe('SK launch /plodiny + /choroby', () => {
  it('obě sekce jsou launchnuté pro sk', () => {
    for (const p of ['/plodiny', '/choroby']) {
      expect(LAUNCHED_PREFIXES.sk).toContain(p);
      expect(isLaunchedPath('sk', `${p}/cokoli/`)).toBe(true);
    }
  });
});

// Celá třída, ne jen sk: overlay adresář, který existuje, musí pokrývat VŠECHNY
// cs záznamy. Chybějící soubor = tichý fallback na češtinu uprostřed jinak
// přeložené sekce (applyOverlay padá na cs), což se na stránce nijak neprojeví.
describe('per-locale overlaye plodin a chorob jsou kompletní', () => {
  const cases = [
    { dir: 'src/data/plodiny', label: 'plodiny' },
    { dir: 'src/data/choroby', label: 'choroby' },
  ];

  for (const { dir, label } of cases) {
    const root = join(process.cwd(), dir);
    const csSlugs = readdirSync(root).filter((f) => f.endsWith('.yaml')).sort();
    const localeDirs = readdirSync(root, { withFileTypes: true })
      .filter((e) => e.isDirectory() && /^[a-z]{2}$/.test(e.name))
      .map((e) => e.name);

    it(`${label}: našly se locale adresáře (jinak je test slepý)`, () => {
      expect(localeDirs.length).toBeGreaterThan(0);
      expect(csSlugs.length).toBeGreaterThan(0);
    });

    for (const locale of localeDirs) {
      it(`${label}/${locale}: pokrývá všech ${csSlugs.length} cs souborů`, () => {
        const have = readdirSync(join(root, locale)).filter((f) => f.endsWith('.yaml')).sort();
        expect(have).toEqual(csSlugs);
      });
    }
  }
});

describe('SK data plodin a chorob jsou opravdu slovenská', () => {
  it('žádný název plodiny nezůstal shodný s cs', () => {
    const cs = new Map(listPlodiny('cs').map((p) => [p.slug, p.name]));
    const same = listPlodiny('sk').filter((p) => cs.get(p.slug) === p.name).map((p) => p.slug);
    // Tritikale se cs i sk píše stejně — jediná povolená shoda.
    expect(same).toEqual(['tritikale']);
  });

  it('žádný název choroby nezůstal shodný s cs', () => {
    const cs = new Map(listChoroby('cs').map((c) => [c.slug, c.name]));
    const same = listChoroby('sk').filter((c) => cs.get(c.slug) === c.name).map((c) => c.slug);
    // „Fuzariózy" se cs i sk píše stejně — jediná povolená shoda.
    expect(same).toEqual(['fuzariozy']);
  });

  it('SK texty neodkazují na český ÚKZÚZ (registr přípravků je ÚKSÚP)', () => {
    const blob = JSON.stringify(listChoroby('sk')) + JSON.stringify(listPlodiny('sk'));
    expect(blob).not.toContain('ÚKZÚZ');
  });

  // Kontroluje HODNOTY v overlay YAMLech, ne sloučenou entitu: ta nese i cs-only
  // části (odrůdy, účinné látky), kde je čeština v pořádku.
  it('SK overlay nenechal v přeložených polích české ě/ř/ů', () => {
    const bad: string[] = [];
    for (const dir of ['src/data/plodiny/sk', 'src/data/choroby/sk']) {
      const root = join(process.cwd(), dir);
      for (const f of readdirSync(root).filter((x) => x.endsWith('.yaml'))) {
        const doc = load(readFileSync(join(root, f), 'utf8')) as Record<string, unknown>;
        for (const [k, v] of Object.entries(doc)) {
          if (KEY_FIELDS.has(k)) continue;
          if (/[ěřůĚŘŮ]/.test(JSON.stringify(v))) bad.push(`${dir}/${f}:${k}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
