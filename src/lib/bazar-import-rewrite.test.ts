import { describe, it, expect } from 'vitest';
import { buildRewritePrompt, parseRewriteResponse, rewriteListing } from './bazar-import-rewrite';

describe('buildRewritePrompt', () => {
  it('obsahuje originální název i popis', () => {
    const p = buildRewritePrompt('Traktor Zetor', 'Starší traktor, 1990.');
    expect(p).toContain('Traktor Zetor');
    expect(p).toContain('Starší traktor, 1990.');
  });
});
describe('parseRewriteResponse', () => {
  it('rozparsuje JSON blok z odpovědi', () => {
    const r = parseRewriteResponse('{"title":"Zetor 7211 na prodej","description":"Spolehlivý traktor."}');
    expect(r).toEqual({ title: 'Zetor 7211 na prodej', description: 'Spolehlivý traktor.' });
  });
  it('nevalidní JSON → null', () => {
    expect(parseRewriteResponse('to není json')).toBeNull();
  });
});
describe('rewriteListing', () => {
  it('bez apiKey vrací originál (fallback)', async () => {
    const r = await rewriteListing({ title: 'A', description: 'B', apiKey: '' });
    expect(r).toEqual({ title: 'A', description: 'B' });
  });
  it('s LLM klientem vrací přepsaný text', async () => {
    const fakeLlm = async () => '{"title":"Nový A","description":"Nový B"}';
    const r = await rewriteListing({ title: 'A', description: 'B', apiKey: 'x', llm: fakeLlm });
    expect(r).toEqual({ title: 'Nový A', description: 'Nový B' });
  });
  it('když LLM vrátí nesmysl, fallback na originál', async () => {
    const fakeLlm = async () => 'rozbité';
    const r = await rewriteListing({ title: 'A', description: 'B', apiKey: 'x', llm: fakeLlm });
    expect(r).toEqual({ title: 'A', description: 'B' });
  });
});
