import { describe, it, expect } from 'vitest';
import { DECISION_ROWS, ELIGIBILITY } from '../../src/lib/dotace-hub';
import { readdirSync } from 'node:fs';

const dotaceSlugs = new Set(
  readdirSync('src/content/dotace').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')),
);

describe('dotace-hub data', () => {
  it('má aspoň 6 řádků rozhodovací tabulky', () => {
    expect(DECISION_ROWS.length).toBeGreaterThanOrEqual(6);
  });

  it('každý řádek míří na existující dotační titul', () => {
    for (const row of DECISION_ROWS) {
      expect(dotaceSlugs.has(row.titulSlug), `chybí titul ${row.titulSlug}`).toBe(true);
    }
  });

  it('každý řádek má neprázdný strojeHref začínající /stroje/', () => {
    for (const row of DECISION_ROWS) {
      expect(row.strojeHref.startsWith('/stroje/')).toBe(true);
    }
  });

  it('eligibility skupiny mají label i popis', () => {
    expect(ELIGIBILITY.length).toBeGreaterThanOrEqual(3);
    for (const e of ELIGIBILITY) {
      expect(e.label.length).toBeGreaterThan(0);
      expect(e.popis.length).toBeGreaterThan(0);
    }
  });
});
