import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CS_DIR = resolve(__dirname, '../../src/content/puda');
const PL_DIR = resolve(__dirname, '../../src/content/puda-pl');

const mdFiles = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.md')).sort();

describe('pudaPl články — parita s cs', () => {
  it('pl má stejné soubory (slugy) jako cs puda', () => {
    expect(mdFiles(PL_DIR)).toEqual(mdFiles(CS_DIR));
  });
  it('každý pl článek má neprázdný title + popis ve frontmatteru', () => {
    for (const f of mdFiles(PL_DIR)) {
      const src = readFileSync(resolve(PL_DIR, f), 'utf8');
      expect(src, f).toMatch(/^---\s*\ntitle:\s*\S/);
      expect(src, f).toMatch(/\npopis:\s*\S/);
    }
  });
  it('počet ## nadpisů pl == cs (úplnost překladu)', () => {
    for (const f of mdFiles(CS_DIR)) {
      const cs = (readFileSync(resolve(CS_DIR, f), 'utf8').match(/^##/gm) ?? []).length;
      const pl = (readFileSync(resolve(PL_DIR, f), 'utf8').match(/^##/gm) ?? []).length;
      expect(pl, `${f}: nadpisy`).toBe(cs);
    }
  });
});
