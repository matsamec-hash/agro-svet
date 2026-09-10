// tests/scripts/agrimap-preview.test.ts
// ‼️ Mapa v ImageAccordionu je PŘEDGENEROVANÝ soubor (scripts/build-agrimap-preview.mjs),
// ne inline <svg> — kvůli tomu, aby ~63 kB cest necestovalo v každé odpovědi homepage.
// Předgenerovaný asset ale umí tiše zestárnout: podklad se změní, soubor zůstane starý.
// Tyhle testy hlídají obojí — že je v souboru tolik zemí, kolik jich mají data,
// a že se z něj neuřízl kus Evropy kvůli těsnému viewBoxu (Island má zápornou x).
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SVG = path.join(ROOT, 'public/images/agrimap-wheat-yield.svg');
const GEN = path.join(ROOT, 'scripts/build-agrimap-preview.mjs');

describe('předgenerovaná mapa pro ImageAccordion', () => {
  it('soubor existuje a je to SVG', () => {
    expect(fs.existsSync(SVG), 'chybí public/images/agrimap-wheat-yield.svg — pusť `tsx scripts/build-agrimap-preview.mjs`').toBe(true);
    expect(fs.readFileSync(SVG, 'utf8')).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  });

  it('má tolik zemí, kolik jich je v podkladu', () => {
    const geo = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/svet/geo/europe.json'), 'utf8'));
    const paths = (fs.readFileSync(SVG, 'utf8').match(/<path /g) ?? []).length;
    expect(paths, 'počet cest v SVG neodpovídá počtu regionů — mapa je zastaralá').toBe(geo.regions.length);
  });

  it('viewBox pokrývá i to, co teče mimo deklarovaný rozsah podkladu', () => {
    // Island leží na záporné x (-254). Kdyby SVG dostalo viewBox z europe.json
    // ("0 0 1000 1165"), <img> by ho oříznul a z mapy by zmizel.
    const vb = /viewBox="([^"]+)"/.exec(fs.readFileSync(SVG, 'utf8'))![1].split(' ').map(Number);
    expect(vb[0], 'viewBox musí začínat vlevo od nuly, jinak zmizí Island').toBeLessThan(0);
    expect(vb[1], 'viewBox musí začínat nad nulou, jinak se uřízne sever').toBeLessThan(0);
  });

  it('generátor zastaví build, když se podklad změní', () => {
    // Guard je jediné, co brání tichému uříznutí po aktualizaci geometrie.
    expect(fs.readFileSync(GEN, 'utf8')).toContain('europe.viewBox !== SOURCE_VIEWBOX');
  });

  it('akordeon na ten soubor opravdu odkazuje', () => {
    const ia = fs.readFileSync(path.join(ROOT, 'src/components/ImageAccordion.astro'), 'utf8');
    expect(ia).toContain('/images/agrimap-wheat-yield.svg');
    // Hledej IMPORT a POUŽITÍ, ne holé slovo — v souboru je i komentář,
    // který vysvětluje, proč tam ta komponenta už není.
    expect(ia, 'inline <svg> se nesmí vrátit — kvůli tomu ta výměna byla').not.toMatch(/import\s+AgriMapPreview|<AgriMapPreview/);
  });
});
