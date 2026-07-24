import { describe, it, expect } from 'vitest';
import {
  buildStructurePrompt,
  parseStructureResponse,
  structureListing,
  extractAttributesFallback,
} from './bazar-import-structure';
import { attributesForCategory } from './bazar-attributes';

const FALLBACK = { brand: 'john-deere', category: 'traktory', hours: 8251 };

describe('buildStructurePrompt', () => {
  it('obsahuje originální text i seznam kategorií', () => {
    const p = buildStructurePrompt('Traktor Zetor', 'popis');
    expect(p).toContain('Traktor Zetor');
    expect(p).toContain('traktory');
  });
});

describe('parseStructureResponse', () => {
  it('rozparsuje JSON', () => {
    expect(parseStructureResponse('{"brand":"zetor"}')).toEqual({ brand: 'zetor' });
  });
  it('nevalidní → null', () => {
    expect(parseStructureResponse('nope')).toBeNull();
  });
});

describe('structureListing', () => {
  it('bez apiKey → fallback + původní text', async () => {
    const r = await structureListing({ title: 'A', description: 'B', apiKey: '', fallback: FALLBACK });
    expect(r).toMatchObject({ title: 'A', description: 'B', brand: 'john-deere', category: 'traktory', hours: 8251 });
  });

  it('s AI → strukturovaná pole, validní slug', async () => {
    const llm = async () =>
      '{"title":"JD 6210R","description":"Nový popis","brand":"john-deere","category":"traktory","type":"6210R","year":2018,"hours":8251,"powerHp":210,"features":["AutoPowr","Přední závěs"]}';
    const r = await structureListing({ title: 'A', description: 'B', apiKey: 'x', fallback: FALLBACK, llm });
    expect(r.title).toBe('JD 6210R');
    expect(r.brand).toBe('john-deere');
    expect(r.year).toBe(2018);
    expect(r.powerHp).toBe(210);
    expect(r.features).toEqual(['AutoPowr', 'Přední závěs']);
  });

  it('AI vrátí neplatný brand slug → spadne na fallback brand', async () => {
    const llm = async () => '{"title":"X","description":"Y","brand":"nesmysl","category":"traktory"}';
    const r = await structureListing({ title: 'A', description: 'B', apiKey: 'x', fallback: FALLBACK, llm });
    expect(r.brand).toBe('john-deere');
  });

  it('když LLM hodí chybu → fallback', async () => {
    const llm = async () => {
      throw new Error('boom');
    };
    const r = await structureListing({ title: 'A', description: 'B', apiKey: 'x', fallback: FALLBACK, llm });
    expect(r).toMatchObject({ title: 'A', brand: 'john-deere', hours: 8251 });
  });
});

describe('atributy — AI', () => {
  it('structureListing vrátí validní attributes z LLM a zahodí smetí', async () => {
    const llm = async () => JSON.stringify({
      title: 'Zetor 5245', description: 'popis', brand: 'zetor', category: 'traktory',
      type: null, year: null, hours: null, powerHp: null, features: [],
      attributes: { klimatizace: true, pohon: '4x4', neznamy: 'x' },
    });
    const r = await structureListing({
      title: 'Zetor 5245', description: 'popis', apiKey: 'x',
      fallback: { brand: 'zetor', category: 'traktory', hours: null },
      categoryAttributes: attributesForCategory('traktory'), llm,
    });
    expect(r.attributes).toEqual({ klimatizace: true, pohon: '4x4' });
  });
});

describe('extractAttributesFallback (regexy)', () => {
  it('najde klimatizaci, 4x4, TP+SPZ, čelní nakladač', () => {
    const out = extractAttributesFallback('traktory',
      'Traktor s klimatizací, pohon 4x4, čelní nakladač, prodám s TP a SPZ');
    expect(out).toEqual({ klimatizace: true, pohon: '4x4', celni_nakladac: true, tp_spz: true });
  });
  it('nenajde nic v prázdném textu', () => {
    expect(extractAttributesFallback('traktory', '')).toEqual({});
  });
  it('čelní nakladač i ve skloňovaných tvarech', () => {
    expect(extractAttributesFallback('traktory', 's čelním nakladačem')).toEqual({ celni_nakladac: true });
    expect(extractAttributesFallback('traktory', 'montáž čelního nakladače')).toEqual({ celni_nakladac: true });
  });
});

describe('structureListing merge fallback ∪ AI', () => {
  it('doplní deterministický atribut, který AI vynechala (AI hodnoty vyhrávají)', async () => {
    const llm = async () => JSON.stringify({
      title: 'Zetor 9540', description: 'popis', brand: 'zetor', category: 'traktory',
      type: null, year: null, hours: null, powerHp: null, features: [],
      attributes: { prevodovka: 'manual' }, // AND: neuvedla celni_nakladac, ač je v textu
    });
    const r = await structureListing({
      title: 'Zetor 9540 s čelním nakladačem a SPZ', description: 'prodám s TP a SPZ',
      apiKey: 'x', fallback: { brand: 'zetor', category: 'traktory', hours: null },
      categoryAttributes: attributesForCategory('traktory'), llm,
    });
    expect(r.attributes).toEqual({ prevodovka: 'manual', celni_nakladac: true, tp_spz: true });
  });
});

describe('structureListing bez apiKey použije fallback atributy', () => {
  it('vytáhne atributy regexem', async () => {
    const r = await structureListing({
      title: 'Zetor s klimatizací 4x4', description: 'čelní nakladač',
      apiKey: '', fallback: { brand: 'zetor', category: 'traktory', hours: null },
      categoryAttributes: attributesForCategory('traktory'),
    });
    expect(r.attributes).toEqual({ klimatizace: true, pohon: '4x4', celni_nakladac: true });
  });
});
