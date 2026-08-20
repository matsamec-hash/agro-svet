import { describe, it, expect } from 'vitest';
import { KVIZ_HISTORIE } from '../../src/lib/kviz';
import { KVIZ_HISTORIE_PL } from '../../src/lib/kviz.pl';

// Polština nemá ě ř ů č š ž ď ť ň á é í ú ý. Model při překladu vyrobil hybridy
// („Żebříček traktorów", „Emisní normy Stage"), které prošly kontrolou otázek,
// protože seděly ve `sourceLabel` — tenhle test kontroluje CELÝ objekt.
const CZ = /[ěřůčšžďťňáéíúý]/;

describe('PL sada kvízu', () => {
  it('má stejný počet otázek a stejné id jako cs (délka i hodnocení sedí)', () => {
    expect(KVIZ_HISTORIE_PL).toHaveLength(KVIZ_HISTORIE.length);
    expect(KVIZ_HISTORIE_PL.map((q) => q.id)).toEqual(KVIZ_HISTORIE.map((q) => q.id));
  });

  it('žádné pole nenese českou diakritiku — včetně sourceLabel', () => {
    const offenders: string[] = [];
    for (const q of KVIZ_HISTORIE_PL) {
      for (const [k, v] of Object.entries(q)) {
        if (CZ.test(JSON.stringify(v))) offenders.push(`${q.id}.${k}: ${JSON.stringify(v).slice(0, 60)}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('index správné odpovědi je v rozsahu možností', () => {
    for (const q of KVIZ_HISTORIE_PL) {
      expect(q.correct).toBeGreaterThanOrEqual(0);
      expect(q.correct).toBeLessThan(q.options.length);
    }
  });

  // 3 otázky byly vázané na české dotace → NESMÍ být přeložené, ale nahrazené.
  it('jurisdikční otázky nesou polská data (ARiMR), ne převedené české', () => {
    const byId = new Map(KVIZ_HISTORIE_PL.map((q) => [q.id, q]));
    for (const id of ['q10', 'q11', 'q13']) {
      const q = byId.get(id)!;
      const blob = JSON.stringify(q);
      expect(blob, `${id} nesmí zmiňovat české instituce ani měnu`).not.toMatch(/SZIF|ÚKZÚZ|Kč/);
      expect(blob, `${id} má odkazovat na polský dotační kontext`).toMatch(/ARiMR|zł|PWD/);
    }
  });
});
