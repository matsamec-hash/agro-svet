import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const csDir = join(process.cwd(), 'src/content/puda');
const ukDir = join(process.cwd(), 'src/content/puda-uk');
const slugs = (dir: string) => readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')).sort();

describe('puda-uk článková parita', () => {
  it('uk slug-set == cs slug-set (stejné slugy, žádný leak/miss)', () => {
    expect(slugs(ukDir)).toEqual(slugs(csDir));
  });
});
