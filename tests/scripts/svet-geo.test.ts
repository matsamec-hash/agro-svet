// tests/scripts/svet-geo.test.ts
// Hranice v /svet musí pocházet ze zdrojů, které komerční web smí použít.
// 2026-10-15 audit licencí našel GISCO NUTS („not for commercial purposes“) a mapu
// Evropy z historical-basemaps (GPL-3.0); 2026-10-17 přestavěno z Natural Earth
// (public domain), USA zůstává z U.S. Census Bureau přes us-atlas. Tyhle testy hlídají,
// aby se starý zdroj nevrátil a aby každá mapa měla geometrii pro všechna data.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { laea3035, dissolve, simplifyShared, signedArea, snapRing } from '../../scripts/lib/svet/geo.mjs';

const ROOT = process.cwd();
const REG = path.join(ROOT, 'src/data/svet/regions');
const readJson = (p: string) => JSON.parse(fs.readFileSync(p, 'utf8'));
const FORBIDDEN = /gisco|eurogeographics|historical-basemaps|aourednik|army-svet|ad2010/i;

const geoFiles = fs.readdirSync(REG).filter((f) => f.endsWith('-geo.json'));

describe('zdroj hranic', () => {
  it('regionální mapy jsou z Natural Earth, USA z U.S. Census Bureau', () => {
    expect(geoFiles.length).toBeGreaterThan(15);
    for (const f of geoFiles) {
      const g = readJson(path.join(REG, f));
      expect(g.boundarySource, f).toBe(f === 'usa-geo.json' ? 'us-census' : 'naturalearth');
      expect(JSON.stringify(g), f).not.toMatch(FORBIDDEN);
    }
  });

  it('mapa Evropy je z Natural Earth a má všechny země z map-metrics (i Švýcarsko)', () => {
    const e = readJson(path.join(ROOT, 'src/data/svet/geo/europe.json'));
    const mm = readJson(path.join(ROOT, 'src/data/svet/map-metrics.json'));
    expect(e.boundarySource).toBe('naturalearth');
    expect(JSON.stringify(e)).not.toMatch(FORBIDDEN);
    expect(e.regions.map((r: { code: string }) => r.code).sort()).toEqual(Object.keys(mm.countries).sort());
    for (const r of e.regions) expect(r.path, r.code).toMatch(/^M[-\d.]+ [-\d.]+L/);
  });

  it('build skripty nestahují zakázané zdroje', () => {
    for (const f of ['build-svet-geo.mjs', 'build-svet-europe-geo.mjs', 'lib/svet/geo.mjs']) {
      const src = fs.readFileSync(path.join(ROOT, 'scripts', f), 'utf8');
      // Komentáře smí starý zdroj zmínit (proč se měnil) — URL ani cesta k souboru ne.
      expect(src, f).not.toMatch(/gisco-services|army-svet\/army-svet|historical-basemaps\/[a-z]/i);
    }
    expect(fs.readFileSync(path.join(ROOT, 'scripts/build-svet-geo.mjs'), 'utf8')).toContain('ne_10m_admin_1_states_provinces');
    expect(fs.readFileSync(path.join(ROOT, 'scripts/build-svet-europe-geo.mjs'), 'utf8')).toContain('ne_10m_admin_0_countries_deu');
  });

  it('každý région s daty má geometrii a naopak (jinak by mapa měla díru)', () => {
    for (const f of geoFiles) {
      const slug = f.replace('-geo.json', '');
      const dataPath = path.join(REG, `${slug}.json`);
      expect(fs.existsSync(dataPath), `${slug}.json`).toBe(true);
      const g = readJson(path.join(REG, f));
      const d = readJson(dataPath);
      const geoCodes = new Set(g.regions.map((r: { code: string }) => r.code));
      for (const code of Object.keys(d.regions)) expect(geoCodes.has(code), `${slug} ${code}`).toBe(true);
      for (const r of g.regions) {
        expect(r.path, `${slug} ${r.code}`).toMatch(/^M/);
        if (slug !== 'usa') expect(d.regions[r.code], `${slug} ${r.code} bez dat`).toBeTruthy();
      }
    }
  });

  it('Portugalsko nemá regionální mapu (NUTS-2 se ze správních jednotek Natural Earth složit nedají)', () => {
    expect(fs.existsSync(path.join(REG, 'portugalsko-geo.json'))).toBe(false);
    expect(fs.existsSync(path.join(REG, 'portugalsko.json'))).toBe(false);
  });

  it('Polsko má Mazowieckie jako PL9 (součet PL91 + PL92) a poznámku o tom', () => {
    const d = readJson(path.join(REG, 'polsko.json'));
    expect(d.regions.PL9).toBeTruthy();
    expect(d.regions.PL91).toBeUndefined();
    expect(d.regionNote).toMatch(/PL9/);
  });
});

describe('scripts/lib/svet/geo.mjs', () => {
  it('EPSG:3035 sedí na příklad z EPSG Guidance Note 7-2 (50° N, 5° E)', () => {
    const [x, y] = laea3035(5, 50);
    expect(x).toBeCloseTo(3962799.45, 1);
    expect(y).toBeCloseTo(2999718.85, 1);
    const [x0, y0] = laea3035(10, 52); // střed projekce = false easting/northing
    expect(x0).toBeCloseTo(4321000, 3);
    expect(y0).toBeCloseTo(3210000, 3);
  });

  it('dissolve: dva sousední čtverce = jeden prstenec se součtem ploch', () => {
    const a = [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]];
    const b = [[[1, 0], [2, 0], [2, 1], [1, 1], [1, 0]]];
    const rings = dissolve([a, b]);
    expect(rings).toHaveLength(1);
    expect(signedArea(rings[0])).toBeCloseTo(2);
  });

  it('dissolve: enkláva uvnitř zůstane dírou (Berlín v Braniborsku)', () => {
    const outer = [[[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]], [[1, 1], [1, 3], [3, 3], [3, 1], [1, 1]]];
    const rings = dissolve([outer]);
    const area = rings.reduce((s: number, r: number[][]) => s + signedArea(r), 0);
    expect(area).toBeCloseTo(16 - 4);
  });

  it('simplifyShared: společná hranice dvou régionů zůstane po zjednodušení totožná', () => {
    // klikatá společná hranice x≈5 mezi A (vlevo) a B (vpravo)
    const shared: number[][] = [[5, 0]];
    for (let y = 1; y < 100; y += 1) shared.push([5 + (y % 2 ? 0.3 : -0.3), y]);
    shared.push([5, 100]);
    // A: (0,0) → podél hranice nahoru → (0,100) → zpět; B: (5,100) → hranice dolů → (10,0) → (10,100)
    const ringA = snapRing([[0, 0], ...shared, [0, 100], [0, 0]], 0.01);
    const ringB = snapRing([...[...shared].reverse(), [10, 0], [10, 100], [5, 100]], 0.01);
    const out = simplifyShared({ A: [ringA], B: [ringB] }, 1);
    const key = (p: number[]) => `${p[0]},${p[1]}`;
    const onBorder = (r: number[][]) => new Set(r.filter((p) => p[0] > 4 && p[0] < 6).map(key));
    expect([...onBorder(out.A[0])].sort()).toEqual([...onBorder(out.B[0])].sort());
    expect(out.A[0].length).toBeLessThan(ringA.length);
  });
});
