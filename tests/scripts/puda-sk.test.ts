import { describe, it, expect } from 'vitest';
import { buildPudaPayload } from '../../scripts/lib/puda-sk.mjs';

describe('buildPudaPayload', () => {
  it('mapuje cena/najem řady na year/value a filtruje null', () => {
    const cena = [{ time: '2017', value: 3244 }, { time: '2024', value: 5743 }];
    const najem = [{ time: '2011', value: 37 }, { time: '2024', value: 69 }];
    const plodiny = [
      { crop: 'Pšenica', year: '2023', hectares: 380000 },
      { crop: 'Repka', year: '2023', hectares: 140000 },
      { crop: 'Pšenica', year: '2022', hectares: 360000 }, // starší rok ignorovat
    ];
    const out = buildPudaPayload({ cena, najem, plodiny, generated: 'X' });
    expect(out.cena.series).toEqual([{ year: 2017, value: 3244 }, { year: 2024, value: 5743 }]);
    expect(out.cena.unit).toBe('EUR/ha');
    expect(out.cena.agriprod).toBe('ARAXIB');
    expect(out.najem.series).toEqual([{ year: 2011, value: 37 }, { year: 2024, value: 69 }]);
    expect(out.plodiny).toEqual([
      { crop: 'Pšenica', hectares: 380000 },
      { crop: 'Repka', hectares: 140000 },
    ]);
    expect(out.generated).toBe('X');
  });

  it('prázdné vstupy → prázdné série (blok se vynechá)', () => {
    const out = buildPudaPayload({ cena: [], najem: [], plodiny: [], generated: 'X' });
    expect(out.cena.series).toEqual([]);
    expect(out.najem.series).toEqual([]);
    expect(out.plodiny).toEqual([]);
  });
});
