import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { load } from 'js-yaml';
import { join } from 'node:path';
import { LAUNCHED_PREFIXES, isLaunchedPath } from '../../src/i18n/utils';
import { listPlodiny } from '../../src/lib/plodiny';
import { listChoroby } from '../../src/lib/choroby';
import { CS_ONLY_PLODINY } from '../../src/lib/plodiny';

/** Klíče, které se z cs NEPŘEKLÁDAJÍ (mapování, obrázky, kalendář, latina). */
const KEY_FIELDS = new Set(['slug', 'skupina', 'hero_image', 'hero_author', 'hero_license', 'hero_source',
  'seti_mesice', 'sklizen_mesice', 'wikipedia', 'latinsky', 'aliases', 'ucinne_latky']);

describe('launch /plodiny + /choroby', () => {
  for (const locale of ['sk', 'uk'] as const) {
    it(`obě sekce jsou launchnuté pro ${locale}`, () => {
      for (const p of ['/plodiny', '/choroby']) {
        expect(LAUNCHED_PREFIXES[locale]).toContain(p);
        expect(isLaunchedPath(locale, `${p}/cokoli/`)).toBe(true);
      }
    });
  }
});

// Ukrajinština je psaná azbukou, takže „nepřeloženo" se pozná obráceně než
// u slovenštiny: hodnota bez jediného cyrilického znaku je latinka.
describe('UK data plodin a chorob jsou opravdu ukrajinská', () => {
  it('názvy plodin i chorob jsou v azbuce', () => {
    const noCyr = [...listPlodiny('uk'), ...listChoroby('uk')]
      .filter((e) => !/[\u0400-\u04FF]/.test(e.name))
      .map((e) => e.slug);
    expect(noCyr).toEqual([]);
  });

  it('UK texty neodkazují na český ÚKZÚZ (má být ukrajinský registr)', () => {
    const blob = JSON.stringify(listChoroby('uk')) + JSON.stringify(listPlodiny('uk'));
    expect(blob).not.toContain('ÚKZÚZ');
  });

  it('u plodin je řečeno, že termíny jsou české (jinak by stránka tvrdila nepravdu)', () => {
    // Zdrojová data mají české termíny sevby a sklizně; pro ukrajinské podmínky
    // neplatí, takže overlay musí uvádět, odkud údaj je.
    const bezZdroje = listPlodiny('uk')
      .filter((p) => !JSON.stringify(p).includes('Чех'))
      .map((p) => p.slug);
    expect(bezZdroje).toEqual([]);
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
    // Plodiny vedené jako cs-only (zeleninový registr ÚKZÚZ) se do parity nepočítají —
    // v cizích locale se vůbec nenabízejí, viz CS_ONLY_PLODINY a jeho gate v build().
    // Že se za tím neschovává rozdělaný překlad, hlídá test `plodiny-zelenina`.
    const csSlugs = readdirSync(root)
      .filter((f) => f.endsWith('.yaml'))
      .filter((f) => !(label === 'plodiny' && CS_ONLY_PLODINY.has(f.replace(/\.yaml$/, ''))))
      .sort();
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
