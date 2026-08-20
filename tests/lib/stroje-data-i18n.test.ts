import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { localizeEngine, localizeVideoTitle } from '../../src/lib/stroje-data-i18n';
import { getAllModels } from '../../src/lib/stroje';

const CZ = /[ěřůčšžďťňáéíúýĚŘŮČŠŽĎŤŇÁÉÍÚÝ]/;

describe('localizeEngine', () => {
  it('cs vrací vstup beze změny', () => {
    expect(localizeEngine('Deutz 6-válec vzduchem chlazený', 'cs')).toBe('Deutz 6-válec vzduchem chlazený');
  });

  it('pl přepíše válce i chlazení, typové označení nechá být', () => {
    expect(localizeEngine('Deutz F3L 912, 3-válec vzduchem chlazený 2,8 L', 'pl'))
      .toBe('Deutz F3L 912, 3-cylindrowy chłodzony powietrzem 2,8 L');
  });

  it('pl nechává mezinárodní pojmy (turbo, intercooler, Stage V, common rail)', () => {
    expect(localizeEngine('6-válec turbo intercooler 7.6 L', 'pl'))
      .toBe('6-cylindrowy turbo intercooler 7.6 L');
    expect(localizeEngine('PowerTech PSS 9.0 L, 6-válec Stage V', 'pl'))
      .toBe('PowerTech PSS 9.0 L, 6-cylindrowy Stage V');
  });

  it('sk a uk mají vlastní tvary', () => {
    expect(localizeEngine('4-válec vzduchem chlazený', 'sk')).toBe('4-valec vzduchom chladený');
    expect(localizeEngine('4-válec vzduchem chlazený', 'uk')).toBe('4-циліндровий повітряне охолодження');
  });
});

describe('katalog strojů — engine pod /pl', () => {
  // Regrese: engine se bral přímo z cs YAML, takže žebříčky i detaily modelů
  // pod /pl svítily „6-válec 6.6 L" a „Deutz 6-válec vzduchem chlazený".
  it('žádný pl model nenese české znaky v popisu motoru', () => {
    const bad = getAllModels('pl')
      .filter((m: any) => typeof m.engine === 'string' && CZ.test(m.engine))
      .map((m: any) => `${m.brand_name} ${m.name}: ${m.engine}`);
    expect(bad, `české motory pod /pl:\n${bad.slice(0, 20).join('\n')}`).toEqual([]);
  });

  it('cs katalog zůstává nedotčený', () => {
    const cs = getAllModels('cs').filter((m: any) => typeof m.engine === 'string' && m.engine.includes('-válec'));
    expect(cs.length).toBeGreaterThan(100);
  });

  it('slovník tokenů pokrývá všechny české hodnoty v YAML', () => {
    const dir = join(process.cwd(), 'src/data/stroje');
    const vals = new Set<string>();
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.yaml'))) {
      const src = readFileSync(join(dir, f), 'utf8');
      for (const m of src.matchAll(/^\s*engine:\s*["']?(.+?)["']?\s*$/gm)) vals.add(m[1]);
    }
    const unresolved = [...vals].filter((v) => CZ.test(localizeEngine(v, 'pl')));
    expect(unresolved, `nová česká slova v engine — doplň token:\n${unresolved.join('\n')}`).toEqual([]);
  });
});

describe('titulky videí', () => {
  it('pl přeloží známý český titulek', () => {
    expect(localizeVideoTitle('John Deere řada W – animace', 'pl')).toBe('John Deere seria W – animacja');
  });
  it('neznámý (značkový/anglický) titulek zůstává beze změny', () => {
    expect(localizeVideoTitle('Fendt 1050 Vario', 'pl')).toBe('Fendt 1050 Vario');
    expect(localizeVideoTitle('Claas Xerion – walk-around', 'pl')).toBe('Claas Xerion – walk-around');
  });
  it('každý český youtube_title v YAML má pl překlad', () => {
    const dir = join(process.cwd(), 'src/data/stroje');
    const vals = new Set<string>();
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.yaml'))) {
      const src = readFileSync(join(dir, f), 'utf8');
      for (const m of src.matchAll(/^\s*youtube_title:\s*["']?(.+?)["']?\s*$/gm)) vals.add(m[1]);
    }
    const untranslated = [...vals].filter((v) => CZ.test(v) && localizeVideoTitle(v, 'pl') === v);
    expect(untranslated, `chybí pl titulek videa:\n${untranslated.join('\n')}`).toEqual([]);
  });
});
