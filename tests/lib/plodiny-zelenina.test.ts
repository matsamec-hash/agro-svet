import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { listPlodinyBySkupina, listIndexableOdrudy, listPlodiny, SKUPINA_LABELS, CS_ONLY_PLODINY } from '../../src/lib/plodiny';
import { ui } from '../../src/i18n/ui';
import { isPrerenderedOnlyPath, localizeInternalHref } from '../../src/i18n/utils';

const DRUHY = JSON.parse(readFileSync('scripts/plodiny-druhy.json', 'utf8')) as Record<string, string[]>;

describe('zelenina — registr ÚKZÚZ', () => {
  it('každá plodina z mapy druhů má YAML i vygenerované odrůdy', () => {
    for (const slug of Object.keys(DRUHY)) {
      expect(existsSync(`src/data/plodiny/${slug}.yaml`), `chybí YAML pro ${slug}`).toBe(true);
      const json = `src/data/plodiny/odrudy/${slug}.json`;
      expect(existsSync(json), `chybí odrůdy pro ${slug}`).toBe(true);
      expect(JSON.parse(readFileSync(json, 'utf8')).length, `${slug} má prázdné odrůdy`).toBeGreaterThan(0);
    }
  });

  it('žádný druh ÚKZÚZ nepatří do dvou plodin zároveň', () => {
    // Původní importér filtroval `speciesName` PODŘETĚZCEM: needle „salát" bral i „Okurka
    // (salátová)" a „Řepa salátová", „květák" bral „Brokolice (květáková)". Mapa proto drží
    // přesné názvy a tenhle test hlídá, že se dvě plodiny nepřekryjí.
    const kde = new Map<string, string>();
    for (const [slug, druhy] of Object.entries(DRUHY)) {
      for (const d of druhy) {
        expect(kde.has(d), `druh „${d}" je v ${kde.get(d)} i v ${slug}`).toBe(false);
        kde.set(d, slug);
      }
    }
  });

  it('mapa druhů pokrývá právě plodiny skupiny zelenina', () => {
    expect(new Set(listPlodinyBySkupina('zelenina').map((p) => p.slug))).toEqual(new Set(Object.keys(DRUHY)));
  });

  it('zelenina přispívá indexovatelnými odrůdami', () => {
    const zelenina = new Set(listPlodinyBySkupina('zelenina').map((p) => p.slug));
    const n = listIndexableOdrudy().filter((e) => zelenina.has(e.plodina_slug)).length;
    expect(n).toBeGreaterThan(1000);
  });
});

describe('zelenina — hero obrázky a atribuce', () => {
  const plodiny = listPlodinyBySkupina('zelenina');

  it('každá plodina má hero obrázek, který na disku existuje', () => {
    for (const p of plodiny) {
      expect(p.hero_image, `${p.slug} nemá hero_image`).toBeTruthy();
      expect(existsSync(`public${p.hero_image}`), `${p.slug}: chybí soubor ${p.hero_image}`).toBe(true);
    }
  });

  it('každý hero obrázek má licenci a odkaz na zdroj', () => {
    for (const p of plodiny) {
      expect(p.hero_license, `${p.slug} nemá hero_license`).toBeTruthy();
      expect(p.hero_source, `${p.slug} nemá hero_source`).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    }
  });

  it('atribuce autora je krátká a bez cizího kontaktu', () => {
    // Commons pole Artist je volný text; jeden uploader tam měl 905 znaků včetně
    // vlastního e-mailu a celého znění licence. Do atribuce na webu to nesmí.
    for (const p of plodiny) {
      const a = p.hero_author ?? '';
      expect(a.length, `${p.slug}: hero_author je příliš dlouhý (${a.length} zn.)`).toBeLessThanOrEqual(80);
      expect(a, `${p.slug}: hero_author obsahuje e-mail`).not.toMatch(/@\S+\.\w+/);
      expect(a, `${p.slug}: hero_author je víceřádkový`).not.toMatch(/\n/);
    }
  });
});

describe('zelenina — brána cs-only', () => {
  const LOCALES = ['sk', 'pl', 'uk', 'de'] as const;

  it('zelenina se v cizích locale vůbec nenabízí', () => {
    // /plodiny je pro sk i uk launchnuté. Bez brány by applyPlodinaOverlay spadl na cs
    // a v přeložené sekci by seděla česká stránka.
    for (const loc of LOCALES) {
      const leaked = listPlodiny(loc).map((p) => p.slug).filter((s) => CS_ONLY_PLODINY.has(s));
      expect(leaked, `${loc} nabízí cs-only plodiny: ${leaked.join(', ')}`).toEqual([]);
      expect(listPlodinyBySkupina('zelenina', loc), `${loc} má zeleninu ve výpisu skupiny`).toEqual([]);
    }
  });

  it('cs-only plodina nemá overlay v ŽÁDNÉM jazyce', () => {
    // Kdyby overlay pro část jazyků existoval, brána by hotový překlad tiše skrývala.
    for (const slug of CS_ONLY_PLODINY) {
      for (const loc of LOCALES) {
        expect(existsSync(`src/data/plodiny/${loc}/${slug}.yaml`),
          `${slug} má ${loc} overlay — vyřaď ho z CS_ONLY_PLODINY, jinak zůstane skrytý`).toBe(false);
      }
    }
  });

  it('cs-only seznam odpovídá právě skupině zelenina', () => {
    expect(new Set(listPlodinyBySkupina('zelenina').map((p) => p.slug))).toEqual(new Set(CS_ONLY_PLODINY));
  });
});

describe('zelenina — brána sitemapy a křížových odkazů', () => {
  it('cs-only plodina a její skupina se nezrcadlí do locale mirroru', () => {
    // Sitemapa staví cs seznam a pak ho zrcadlí do launchnutých locale. /plodiny JE
    // pro sk i uk launchnuté, takže bez brány by mirror nabídl ~1 500 mrtvých URL —
    // přesně to se už jednou stalo u /de (2 744 mrtvých adres).
    for (const slug of CS_ONLY_PLODINY) {
      expect(isPrerenderedOnlyPath(`/plodiny/${slug}/`), `${slug} by se zrcadlil`).toBe(true);
    }
    expect(isPrerenderedOnlyPath('/plodiny/skupina/zelenina/')).toBe(true);
  });

  it('polní plodiny se zrcadlí dál (brána nesmí zabrat plošně)', () => {
    for (const slug of ['psenice-ozima', 'kukurice', 'brambory']) {
      expect(isPrerenderedOnlyPath(`/plodiny/${slug}/`), `${slug} přestal být v mirroru`).toBe(false);
    }
    expect(isPrerenderedOnlyPath('/plodiny/skupina/obiloviny/')).toBe(false);
  });

  it('cizí locale na cs-only plodinu ani nelinkuje', () => {
    for (const loc of ['sk', 'uk'] as const) {
      expect(localizeInternalHref(loc, '/plodiny/paprika/')).toBe('/plodiny/paprika/');
      expect(localizeInternalHref(loc, '/plodiny/psenice-ozima/')).toBe(`/${loc}/plodiny/psenice-ozima/`);
    }
  });
});

describe('zelenina — i18n', () => {
  it('skupina zelenina má label ve všech pěti jazycích', () => {
    expect(SKUPINA_LABELS.zelenina).toBeTruthy();
    for (const loc of ['cs', 'sk', 'uk', 'pl', 'de'] as const) {
      expect(ui[loc]['plod.skupina.zelenina'], `${loc} nemá plod.skupina.zelenina`).toBeTruthy();
    }
  });
});
