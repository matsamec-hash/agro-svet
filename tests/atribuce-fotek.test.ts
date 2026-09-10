import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import yaml from 'js-yaml';

/**
 * Fotky pod CC BY / CC BY-SA vyžadují jméno autora, licenci a odkaz na zdroj.
 * „Foto: Wikimedia Commons" je zdroj, ne atribuce — přesně za tuhle vadu přišla
 * 10. 9. 2026 advokátní výzva na svetovestadiony.cz.
 *
 * Zástupné (AI generované) obrázky strojů kredit nepotřebují — jsou vlastní.
 */
const ZAKAZANI_AUTORI = /^(wikimedia commons|commons|wikipedia|unknown|unknown author|own work|internet)$/i;
/** Licence, u kterých se jméno autora uvádět nemusí. */
const BEZ_ATRIBUCE = /(^|\b)(cc0|public domain|volné dílo|pd-)/i;
const ZAKAZANE_LICENCE = /(editorial|press use|press only|volné užití)/i;

function souboryYaml(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...souboryYaml(p));
    else if (/\.ya?ml$/.test(e)) out.push(p);
  }
  return out;
}

type Zaznam = { soubor: string; img: string; autor?: string; licence?: string; zdroj?: string };

function zaznamy(): Zaznam[] {
  const out: Zaznam[] = [];
  const walk = (n: unknown, soubor: string) => {
    if (Array.isArray(n)) return n.forEach((v) => walk(v, soubor));
    if (!n || typeof n !== 'object') return;
    const o = n as Record<string, unknown>;
    const img = Object.entries(o).find(([k, v]) => k.endsWith('image_url') && typeof v === 'string');
    if (img) {
      out.push({
        soubor, img: img[1] as string,
        autor: o.image_credit as string | undefined,
        licence: o.image_license as string | undefined,
        zdroj: (o.image_credit_url ?? o.image_source_url) as string | undefined,
      });
    }
    Object.values(o).forEach((v) => walk(v, soubor));
  };
  for (const f of souboryYaml('src/data')) {
    try { walk(yaml.load(readFileSync(f, 'utf8')), f); } catch { /* nevalidní yaml řeší jiný test */ }
  }
  return out;
}

describe('atribuce fotek', () => {
  const vsechny = zaznamy();
  const sKreditem = vsechny.filter((z) => z.zdroj);

  it('data obsahují obrázky ke kontrole', () => {
    expect(vsechny.length).toBeGreaterThan(300);
  });

  it('žádný autor není jen zdroj („Wikimedia Commons")', () => {
    const spatne = sKreditem
      .filter((z) => !BEZ_ATRIBUCE.test(z.licence ?? ''))
      .filter((z) => !z.autor || ZAKAZANI_AUTORI.test(z.autor.trim()));
    expect(spatne.map((z) => `${z.img} → ${z.autor}`)).toEqual([]);
  });

  it('žádná fotka nestojí na „editorial / press use" místo licence', () => {
    const spatne = sKreditem.filter((z) => z.licence && ZAKAZANE_LICENCE.test(z.licence));
    expect(spatne.map((z) => `${z.img} → ${z.licence}`)).toEqual([]);
  });

  it('každá kreditovaná fotka má licenci i odkaz na zdroj', () => {
    const spatne = sKreditem.filter((z) => !z.licence || !z.zdroj);
    expect(spatne.map((z) => z.img)).toEqual([]);
  });

  it('licence je rozpoznatelně volná, ne domněnka o „press use"', () => {
    const VOLNA = /(cc0|cc by|public domain|volné dílo|gfdl|pd-)/i;
    const spatne = sKreditem.filter((z) => !z.licence || !VOLNA.test(z.licence));
    expect(spatne.map((z) => `${z.img} → ${z.licence}`)).toEqual([]);
  });
});
