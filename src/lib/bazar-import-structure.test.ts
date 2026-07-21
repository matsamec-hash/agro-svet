import { describe, it, expect } from 'vitest';
import { buildStructurePrompt, parseStructureResponse, structureListing } from './bazar-import-structure';

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
