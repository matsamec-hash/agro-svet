// tests/i18n/de-launch.test.ts
// DE mutace (trh Německo + Rakousko): hlídá, že se nelaunchne sekce, kterou
// nemáme reálně přeloženou, a že katalogový overlay pokrývá VŠECHNY značky
// a série — jinak by indexovaná /de stránka nesla české tělo.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import de from '../../src/i18n/ui/de';
import cs from '../../src/i18n/ui/cs';
import { LAUNCHED_PREFIXES, isLaunchedPath, plural, localizeInternalHref } from '../../src/i18n/utils';
import { HIDDEN_SECTIONS, HIDDEN_NEWS_CATEGORIES, getNav, getFooterColumns } from '../../src/i18n/nav';
import { CATEGORY_LABELS, FUNCTIONAL_GROUPS, categoryLabel, functionalGroupLabel, familyLabel } from '../../src/lib/stroje';

const STROJE_DIR = path.join(process.cwd(), 'src/data/stroje');

describe('ui/de.ts — parita s cs', () => {
  it('de má přesně stejné klíče jako cs', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(cs).sort());
  });
  it('žádná de hodnota není prázdná', () => {
    for (const [k, v] of Object.entries(de)) expect(v, k).toBeTruthy();
  });
  it('lang.* přepínač má DE položku ve všech slovnících', () => {
    expect(de['lang.de']).toBe('DE');
    expect(cs['lang.de']).toBe('DE');
  });
  it('slovník neobsahuje českou/polskou diakritiku (uniklý jazyk)', () => {
    // de nemá ě ř ů ą ę ł ń ś ź ż ľ ĺ ŕ ô. Výjimka: název brandu (agro-svět),
    // který se v němčině cituje beze změny.
    const FORBIDDEN = /[ěřůĄąĘęŁłŃńŚśŹźŻżľĺŕô]/;
    const allowBrand = (v: string) => v.replace(/agro-svět/g, '');
    const bad: string[] = [];
    for (const [k, v] of Object.entries(de)) {
      if (FORBIDDEN.test(allowBrand(v))) bad.push(`${k} = ${v}`);
    }
    expect(bad, `cizí diakritika v de.ts:\n${bad.join('\n')}`).toEqual([]);
  });
});

describe('de plurál (germánská dvojtvarost)', () => {
  const forms = { one: 'Modell', few: 'Modelle', many: 'Modelle' };
  it('1 = singulár, 0/2/5/100 = plurál', () => {
    expect(plural('de', 1, forms)).toBe('Modell');
    expect(plural('de', 0, forms)).toBe('Modelle');
    expect(plural('de', 2, forms)).toBe('Modelle');
    expect(plural('de', 5, forms)).toBe('Modelle');
    expect(plural('de', 101, forms)).toBe('Modelle');
  });
  it('cs zůstává na 1 / 2–4 / 5+ (žádná regrese)', () => {
    expect(plural('cs', 2, forms)).toBe('Modelle');
    expect(plural('cs', 5, forms)).toBe('Modelle');
  });
});

describe('LAUNCHED_PREFIXES.de — launchujeme jen skutečně přeložené', () => {
  it('katalog techniky a značky jsou launchnuté', () => {
    expect(isLaunchedPath('de', '/stroje')).toBe(true);
    expect(isLaunchedPath('de', '/stroje/traktory/fendt')).toBe(true);
    expect(isLaunchedPath('de', '/srovnani')).toBe(true);
    expect(isLaunchedPath('de', '/znacky')).toBe(true);
    expect(isLaunchedPath('de', '/znacky/zetor')).toBe(true);
  });
  it('CZ-jurisdikční sekce launchnuté NEJSOU (mají vzniknout jako DE/AT obsah)', () => {
    for (const p of ['/dotace', '/statistiky', '/puda', '/data', '/kalkulacka', '/novinky', '/akce', '/farmy', '/historie']) {
      expect(isLaunchedPath('de', p), `${p} nesmí být pro de launchnuté`).toBe(false);
    }
  });
  it('sekce bez de overlaye dat launchnuté NEJSOU', () => {
    // /encyklopedie, /plemena, /slovnik = pořád bez de dat. /znacky už launchnuté je
    // (kolekce znacky-de, 22/22) — proto ho tenhle seznam nesmí obsahovat.
    for (const p of ['/encyklopedie', '/plemena', '/slovnik']) {
      expect(isLaunchedPath('de', p), `${p} nemá de overlay → nesmí být launchnuté`).toBe(false);
    }
  });
  it('sk/uk/pl launch se nezměnil', () => {
    expect(LAUNCHED_PREFIXES.sk).toContain('/dotace');
    expect(LAUNCHED_PREFIXES.pl).toContain('/encyklopedie');
    expect(LAUNCHED_PREFIXES.uk).toContain('/slovnik');
  });
});

describe('de navigace neodkazuje do češtiny', () => {
  it('nav i footer obsahují jen launchnuté cesty', () => {
    const norm = (h: string) => h.replace(/\/+$/, '') || '/';
    for (const item of getNav('de')) {
      expect(isLaunchedPath('de', norm(item.href)), `nav ${item.href}`).toBe(true);
      for (const c of item.children ?? []) {
        expect(isLaunchedPath('de', norm(c.href)), `nav child ${c.href}`).toBe(true);
      }
    }
    for (const col of getFooterColumns('de')) {
      for (const l of col.links) {
        expect(isLaunchedPath('de', norm(l.href)), `footer ${l.href}`).toBe(true);
      }
    }
  });
  it('localizeInternalHref nelokalizuje nelaunchnuté cesty', () => {
    expect(localizeInternalHref('de', '/stroje/')).toBe('/de/stroje/');
    expect(localizeInternalHref('de', '/dotace/')).toBe('/dotace/');
  });
  it('HIDDEN_SECTIONS/CATEGORIES mají de záznam', () => {
    expect(HIDDEN_SECTIONS.de).toBeDefined();
    expect(HIDDEN_NEWS_CATEGORIES.de).toEqual(['dotace', 'legislativa']);
  });
});

describe('src/data/stroje/de overlay — plné pokrytí katalogu', () => {
  const brandFiles = fs.readdirSync(STROJE_DIR).filter((f) => f.endsWith('.yaml'));

  it('existuje overlay pro každou značku', () => {
    const missing = brandFiles.filter((f) => !fs.existsSync(path.join(STROJE_DIR, 'de', f)));
    expect(missing, `chybí de overlay: ${missing.join(', ')}`).toEqual([]);
  });

  it('overlay překládá country, description, kategorie a VŠECHNY série', () => {
    const problems: string[] = [];
    for (const f of brandFiles) {
      const base = yaml.load(fs.readFileSync(path.join(STROJE_DIR, f), 'utf8')) as any;
      const ovPath = path.join(STROJE_DIR, 'de', f);
      if (!fs.existsSync(ovPath)) continue;
      const ov = yaml.load(fs.readFileSync(ovPath, 'utf8')) as any;
      if (!ov?.country) problems.push(`${f}: country`);
      if (!ov?.description) problems.push(`${f}: description`);
      for (const [ck, cat] of Object.entries<any>(base.categories ?? {})) {
        if (!ov?.categories?.[ck]) problems.push(`${f}: kategorie ${ck}`);
        for (const s of cat.series ?? []) {
          if (s.description && !ov?.series?.[String(s.slug)]) problems.push(`${f}: série ${s.slug}`);
          // ‼️ Popisy MODELŮ overlay dřív nepokrýval → /de/…/8rx-410/ neslo českou
          // větu „Vlajkový čtyřpásový model…". Hlídá se i pro nově přidané modely.
          for (const m of s.models ?? []) {
            if (m.description && !ov?.models?.[String(m.slug)]) problems.push(`${f}: model ${m.slug}`);
          }
        }
      }
    }
    expect(problems, `nepřeložené položky:\n${problems.join('\n')}`).toEqual([]);
  });

  // Regrese: /de/stroje/zemedelske-stroje/zpracovani-pudy/ vypisovalo „Kypřiče",
  // „Radličkové podmítače" a „Rotační brány" — chyběla celá sada
  // CATEGORY_LABELS_DE. Test hlídá TŘÍDU (všechny kategorie i skupiny), ne jen
  // ty tři nalezené: fallback v categoryLabel() vrací cs, takže chybějící
  // překlad se nikdy neprojeví výjimkou, jen tichou češtinou na německé stránce.
  it('každá kategorie a funkční skupina má německý název (ne cs fallback)', () => {
    const CZ = /[ěščřžůďťň]/;
    const bad: string[] = [];
    for (const slug of Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>) {
      const label = categoryLabel(slug, 'de');
      if (label === CATEGORY_LABELS[slug]) bad.push(`kategorie ${slug}: spadla na cs „${label}"`);
      else if (CZ.test(label)) bad.push(`kategorie ${slug}: česká diakritika v „${label}"`);
    }
    for (const slug of Object.keys(FUNCTIONAL_GROUPS)) {
      const label = functionalGroupLabel(slug, 'de');
      const cs = (FUNCTIONAL_GROUPS as Record<string, { name: string }>)[slug].name;
      if (label === cs) bad.push(`skupina ${slug}: spadla na cs „${label}"`);
      else if (CZ.test(label)) bad.push(`skupina ${slug}: česká diakritika v „${label}"`);
    }
    expect(bad, `chybí německý název:\n${bad.join('\n')}`).toEqual([]);
  });

  it('familyLabel pod de nevrací české „N. řada"', () => {
    expect(familyLabel('6', 'de')).toBe('Baureihe 6');
    expect(familyLabel('6', 'de')).not.toContain('řada');
  });

  it('overlay neobsahuje uniklou češtinu (ě ř ů) ani polštinu', () => {
    // Kontroluje strukturu, ne jen existenci: hodnota musí být německá.
    const FORBIDDEN = /[ěřůąęłńśźż]/;
    // Vlastní jména se ani v němčině nepřekládají (sídla výrobců).
    const PROPER_NOUNS = ['Rychnov nad Kněžnou', 'Vodňany', 'agro-svět'];
    const strip = (v: string) => PROPER_NOUNS.reduce((acc, n) => acc.split(n).join(''), v);
    const bad: string[] = [];
    for (const f of fs.readdirSync(path.join(STROJE_DIR, 'de'))) {
      const ov = yaml.load(fs.readFileSync(path.join(STROJE_DIR, 'de', f), 'utf8')) as any;
      const walk = (obj: unknown, trail: string) => {
        if (typeof obj === 'string') {
          if (FORBIDDEN.test(strip(obj))) bad.push(`${f} → ${trail}: ${obj.slice(0, 120)}`);
          return;
        }
        if (obj && typeof obj === 'object') {
          for (const [k, v] of Object.entries(obj)) walk(v, `${trail}.${k}`);
        }
      };
      walk(ov, '');
    }
    expect(bad, `česká/polská diakritika v de overlayi:\n${bad.join('\n')}`).toEqual([]);
  });
});

describe('znacky-de — profily značek', () => {
  const ZN_DIR = path.join(process.cwd(), 'src/content/znacky');
  const ZN_DE = path.join(process.cwd(), 'src/content/znacky-de');
  const csFiles = fs.readdirSync(ZN_DIR).filter((f) => f.endsWith('.md'));

  it('de má profil pro každou českou značku', () => {
    const missing = csFiles.filter((f) => !fs.existsSync(path.join(ZN_DE, f)));
    expect(missing, `chybí de profil: ${missing.join(', ')}`).toEqual([]);
  });

  it('žádný de profil není navíc (sirotek by se nikde nevykreslil)', () => {
    const extra = fs.readdirSync(ZN_DE).filter((f) => f.endsWith('.md') && !csFiles.includes(f));
    expect(extra, `de profil bez cs protějšku: ${extra.join(', ')}`).toEqual([]);
  });

  // Hlídá TŘÍDU: `zeme`, `popis` a nadpisy prózy se snadno zapomenou přeložit
  // a stránka se nerozbije — jen svítí česky pod německým chrome.
  it('frontmatter i próza jsou německé (žádná uniklá čeština)', () => {
    const CZ = /[ěščřžůďťň]/;
    // Vlastní jména a české reálie, které se ani v němčině nepřekládají.
    const PROPER = ['agro-svět', 'Rychnov nad Kněžnou', 'Kněžnou', 'Zbrojovka', 'Lesní', 'Brno'];
    const strip = (v: string) => PROPER.reduce((acc, n) => acc.split(n).join(''), v);
    const bad: string[] = [];
    for (const f of csFiles) {
      const raw = fs.readFileSync(path.join(ZN_DE, f), 'utf8');
      raw.split('\n').forEach((line, i) => {
        if (CZ.test(strip(line))) bad.push(`${f}:${i + 1} → ${line.trim().slice(0, 100)}`);
      });
    }
    expect(bad, `česká diakritika v znacky-de:\n${bad.join('\n')}`).toEqual([]);
  });

  it('de profil není bajtová kopie českého', () => {
    const same = csFiles.filter(
      (f) => fs.readFileSync(path.join(ZN_DIR, f), 'utf8') === fs.readFileSync(path.join(ZN_DE, f), 'utf8'),
    );
    expect(same, `nepřeložená kopie: ${same.join(', ')}`).toEqual([]);
  });
});

describe('launchnutá sekce musí mít vlastní data (invariant, ne jen /znacky)', () => {
  // Regrese: /znacky se dalo launchnout dřív, než vznikla kolekce znacky-de —
  // stránka by nespadla, jen by přes cs fallback servírovala české profily.
  // Stejná past čeká na /encyklopedie, /plemena a /slovnik.
  const DATA_FOR_PREFIX: Record<string, () => boolean> = {
    '/znacky': () => fs.existsSync(path.join(process.cwd(), 'src/content/znacky-de')),
    '/encyklopedie': () => fs.existsSync(path.join(process.cwd(), 'src/content/encyklopedie-de')),
    '/plemena': () => fs.existsSync(path.join(process.cwd(), 'src/data/plemena-de')),
    '/slovnik': () => fs.existsSync(path.join(process.cwd(), 'src/lib/slovnik.de.ts')),
  };

  it('žádný launchnutý prefix nestojí na chybějících de datech', () => {
    const broken = Object.entries(DATA_FOR_PREFIX)
      .filter(([prefix, hasData]) => LAUNCHED_PREFIXES.de.includes(prefix) && !hasData())
      .map(([prefix]) => prefix);
    expect(broken, `launchnuto bez de dat: ${broken.join(', ')}`).toEqual([]);
  });

  it('sekce s hotovými de daty nezůstala omylem nelaunchnutá', () => {
    const ready = Object.entries(DATA_FOR_PREFIX)
      .filter(([prefix, hasData]) => hasData() && !LAUNCHED_PREFIXES.de.includes(prefix))
      .map(([prefix]) => prefix);
    expect(ready, `data hotová, ale nelaunchnuto: ${ready.join(', ')}`).toEqual([]);
  });
});
