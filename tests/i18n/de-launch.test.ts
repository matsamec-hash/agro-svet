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
import { getUzitkovostLabels } from '../../src/lib/plemena';
import { vcelaTemperamentLabel, vcelaVynosLabel, vcelaRojivostLabel, medKrystalizaceLabel, vybaveniKategorieLabel, medTypLabel } from '../../src/lib/vcelarstvi';
import { TIER_LISTS } from '../../src/lib/tier-lists';
import { TIER_LIST_COPY } from '../../src/lib/tier-lists.i18n';
import { SLOVNIK } from '../../src/lib/slovnik';
import { SLOVNIK_DE, KATEGORIE_LABELS_DE } from '../../src/lib/slovnik.de';

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
    expect(isLaunchedPath('de', '/encyklopedie')).toBe(true);
    expect(isLaunchedPath('de', '/encyklopedie/fendt-1050-vario')).toBe(true);
    // Homepage: bez vlastního rozcestníku by /de/ bylo německé chrome nad
    // ČESKÝM tělem — přesně to, kvůli čemu vznikl HomeUk.
    expect(isLaunchedPath('de', '/')).toBe(true);
    // DE-only landingy s německými sazbami GAP.
    expect(isLaunchedPath('de', '/direktzahlungen')).toBe(true);
    expect(isLaunchedPath('de', '/oeko-regelungen')).toBe(true);
  });
  it('CZ-jurisdikční sekce launchnuté NEJSOU (mají vzniknout jako DE/AT obsah)', () => {
    for (const p of ['/dotace', '/statistiky', '/puda', '/data', '/kalkulacka', '/novinky', '/akce', '/farmy', '/historie']) {
      expect(isLaunchedPath('de', p), `${p} nesmí být pro de launchnuté`).toBe(false);
    }
  });
  it('každá launchnutá de sekce má reálný overlay dat', () => {
    // Invariant místo výčtu: co je launchnuté, musí mít vlastní data. /slovnik
    // je od fáze 3d launchnuté, protože slovnik.de.ts existuje a je kompletní.
    const OVERLAY_GUARD: Record<string, () => boolean> = {
      '/slovnik': () => SLOVNIK_DE.length === SLOVNIK.length,
    };
    for (const [p, hasData] of Object.entries(OVERLAY_GUARD)) {
      if (isLaunchedPath('de', p)) {
        expect(hasData(), `${p} je launchnuté, ale overlay dat není kompletní`).toBe(true);
      }
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

describe('encyklopedie-de — hesla encyklopedie', () => {
  const ENC_DIR = path.join(process.cwd(), 'src/content/encyklopedie');
  const ENC_DE = path.join(process.cwd(), 'src/content/encyklopedie-de');
  const csFiles = fs.readdirSync(ENC_DIR).filter((f) => f.endsWith('.md'));

  it('de má heslo pro každé české', () => {
    const missing = csFiles.filter((f) => !fs.existsSync(path.join(ENC_DE, f)));
    expect(missing, `chybí de heslo: ${missing.join(', ')}`).toEqual([]);
  });

  it('žádné de heslo není navíc', () => {
    const extra = fs.readdirSync(ENC_DE).filter((f) => f.endsWith('.md') && !csFiles.includes(f));
    expect(extra, `de heslo bez cs protějšku: ${extra.join(', ')}`).toEqual([]);
  });

  // Hlídá TŘÍDU: frontmatter (popis, vykon, highlights, faq) i próza se snadno
  // zapomenou — stránka se nerozbije, jen svítí česky pod německým chrome.
  it('frontmatter i próza jsou německé (žádná uniklá čeština)', () => {
    const CZ = /[ěščřžůďťň]/;
    const PROPER = ['agro-svět', 'Brno', 'Zbrojovka', 'Kněžnou'];
    const strip = (v: string) => PROPER.reduce((acc, n) => acc.split(n).join(''), v);
    const bad: string[] = [];
    for (const f of csFiles) {
      const raw = fs.readFileSync(path.join(ENC_DE, f), 'utf8');
      raw.split('\n').forEach((line, i) => {
        if (CZ.test(strip(line))) bad.push(`${f}:${i + 1} → ${line.trim().slice(0, 100)}`);
      });
    }
    expect(bad, `česká diakritika v encyklopedie-de:\n${bad.join('\n')}`).toEqual([]);
  });

  it('de heslo není bajtová kopie českého', () => {
    const same = csFiles.filter(
      (f) => fs.readFileSync(path.join(ENC_DIR, f), 'utf8') === fs.readFileSync(path.join(ENC_DE, f), 'utf8'),
    );
    expect(same, `nepřeložená kopie: ${same.join(', ')}`).toEqual([]);
  });

  // „k" jako jednotka výkonu je česká zkratka (koní) — v němčině musí být PS.
  it('vykon a highlights používají PS, ne české „k"', () => {
    const bad: string[] = [];
    for (const f of csFiles) {
      const raw = fs.readFileSync(path.join(ENC_DE, f), 'utf8');
      const m = raw.match(/^vykon:\s*"?([^"\n]+)"?/m);
      if (m && /\d\s*k\b/.test(m[1])) bad.push(`${f} → vykon: ${m[1]}`);
    }
    expect(bad, `česká jednotka výkonu:\n${bad.join('\n')}`).toEqual([]);
  });
});

describe('DE homepage a DE-only landingy', () => {
  const ROOT = process.cwd();

  it('HomeDe komponenta existuje a je zapojená v index.astro', () => {
    expect(fs.existsSync(path.join(ROOT, 'src/components/home/HomeDe.astro'))).toBe(true);
    const idx = fs.readFileSync(path.join(ROOT, 'src/pages/index.astro'), 'utf8');
    expect(idx, 'HomeDe se musí importovat').toContain("import HomeDe from '../components/home/HomeDe.astro'");
    expect(idx, 'isDe větev musí být v renderu').toMatch(/isDe \? <HomeDe \/>/);
    // ‼️ Bez tohohle by se pro de pořád tahal český supabase feed.
    expect(idx, 'feed se pro de musí přeskočit').toContain('!isDe');
  });

  it('HomeDe odkazuje jen na launchnuté DE sekce', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/components/home/HomeDe.astro'), 'utf8');
    const hrefs = [...src.matchAll(/href: '(\/de\/[^']*)'/g)].map((m) => m[1]);
    expect(hrefs.length, 'rozcestník nesmí být prázdný').toBeGreaterThan(3);
    const notLaunched = hrefs.filter((h) => !isLaunchedPath('de', h.replace(/^\/de/, '')));
    expect(notLaunched, `odkaz do nelaunchnuté sekce: ${notLaunched.join(', ')}`).toEqual([]);
  });

  it('DE-only landingy existují a jsou v sitemapě', () => {
    for (const p of ['src/pages/direktzahlungen/index.astro', 'src/pages/oeko-regelungen/index.astro',
      'src/pages/oepul/index.astro', 'src/pages/direktzahlungen-oesterreich/index.astro']) {
      expect(fs.existsSync(path.join(ROOT, p)), `chybí ${p}`).toBe(true);
      const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
      // Non-de locale nesmí dostat německou jurisdikční stránku.
      expect(src, `${p} musí odmítnout non-de locale`).toContain("if (locale !== 'de') return Astro.rewrite('/404')");
    }
    // Nemají cs ekvivalent → do /de mirroru je nedostane žádné zrcadlení.
    const sm = fs.readFileSync(path.join(ROOT, 'src/pages/sitemap.xml.ts'), 'utf8');
    expect(sm).toContain('/de/direktzahlungen/');
    expect(sm).toContain('/de/oeko-regelungen/');
    expect(sm).toContain('/de/oepul/');
    expect(sm).toContain('/de/direktzahlungen-oesterreich/');
  });
});

describe('fáze 3a — žebříčky a právní stránky', () => {
  const ROOT = process.cwd();

  // ‼️ TŘÍDA CHYBY, ne jedno místo: launchnutá sekce, jejíž próza pro daný
  // locale chybí, se tiše vyrenderuje ČESKY pod cizojazyčným chrome. Přesně
  // to udělala /de/ homepage i /uk/ před ní. Test proto neptá „má de blok?",
  // ale „má KAŽDÝ launchnutý locale próza ke KAŽDÉMU žebříčku?".
  it('každý locale s launchnutým /zebricky má překlad všech žebříčků', () => {
    const slugs = TIER_LISTS.map((t) => t.slug);
    for (const loc of Object.keys(LAUNCHED_PREFIXES)) {
      if (loc === 'cs' || !isLaunchedPath(loc as never, '/zebricky')) continue;
      const copy = TIER_LIST_COPY[loc] ?? {};
      const missing = slugs.filter((s) => !copy[s]);
      expect(missing, `${loc}: chybí próza žebříčků ${missing.join(', ')}`).toEqual([]);
      for (const s of slugs) {
        for (const f of ['title', 'description', 'methodology', 'callToAction'] as const) {
          expect((copy[s] as Record<string, string>)[f]?.trim(), `${loc}/${s}.${f} je prázdné`).toBeTruthy();
        }
      }
    }
  });

  it('detail žebříčku nemá natvrdo české texty ani cs formátování čísel', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/pages/zebricky/[slug].astro'), 'utf8');
    // Padalo na „Detail modelu", „m záběr" a `k` jako jednotce koní.
    expect(src, 'popisek odkazu musí jít přes i18n').not.toMatch(/>\s*Detail modelu\s*</);
    expect(src, 'záběr musí jít přes i18n').not.toContain('m záběr');
    expect(src, 'jednotka koní musí jít přes cmp.unitHp').toContain("tr('cmp.unitHp')");
    expect(src, 'čísla se nesmí formátovat natvrdo česky').not.toContain("toLocaleString('cs-CZ')");
  });

  it('právní a redakční stránky mají de větev', () => {
    for (const f of ['podminky-pouziti', 'zpracovani-osobnich-udaju', 'dsa-kontakt', 'redakce']) {
      const src = fs.readFileSync(path.join(ROOT, `src/pages/${f}.astro`), 'utf8');
      expect(src, `${f}: chybí isDe`).toContain("const isDe = locale === 'de';");
      expect(src, `${f}: chybí de větev v renderu`).toContain(') : isDe ? (');
      expect(isLaunchedPath('de', `/${f}`), `${f} není launchnuté`).toBe(true);
    }
  });

  // Německý čtenář musí najít svůj dozorový úřad, ne jen český.
  it('GDPR stránka odkazuje na německý i rakouský dozorový úřad', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/pages/zpracovani-osobnich-udaju.astro'), 'utf8');
    const de = src.slice(src.indexOf(') : isDe ? ('), src.lastIndexOf(') : ('));
    expect(de).toContain('bfdi.bund.de');
    expect(de).toContain('dsb.gv.at');
    expect(de, 'vedoucí úřad zůstává český — provozovatel sídlí v ČR').toContain('uoou.cz');
  });
});

describe('fáze 3b — rakouská jurisdikce', () => {
  const ROOT = process.cwd();

  // Trh je DE+AT. Když je launchnutá jen německá jurisdikce, rakouský čtenář
  // dostane sazby, které pro něj neplatí — horší než žádná stránka.
  it('rakouské landingy jsou launchnuté a odmítnou non-de locale', () => {
    for (const r of ['/oepul', '/direktzahlungen-oesterreich']) {
      expect(isLaunchedPath('de', r), `${r} není launchnuté`).toBe(true);
      for (const loc of ['cs', 'sk', 'pl', 'uk']) {
        expect(isLaunchedPath(loc as never, r), `${r} nesmí být launchnuté pro ${loc}`).toBe(false);
      }
    }
  });

  // ‼️ Rakouské zdroje uvádějí sazby jako „rund/etwa" pro celé období, ne jako
  // roční úřední Einheitsbetrag. Stránka nesmí předstírat přesnost, kterou
  // zdroj nemá — jinak je to YMYL chyba, ne jen stylistika.
  it('rakouské stránky přiznávají, že jde o orientační sazby', () => {
    const dz = fs.readFileSync(path.join(ROOT, 'src/pages/direktzahlungen-oesterreich/index.astro'), 'utf8');
    expect(dz, 'chybí upozornění na richtwerty').toContain('Richtwerte');
    expect(dz, 'sazby se musí uvádět s „rund"').toContain('rund {fmt(BASIS_HEIMGUT)}');
    expect(dz, 'musí odkázat na závaznost bescheidu AMA').toMatch(/Bescheid der\s*<a[^>]*>AMA|Bescheid der AMA/);

    // ÖPUL: pojistka proti tomu, že by se výchozí sazby 2023 vydávaly za aktuální.
    const op = fs.readFileSync(path.join(ROOT, 'src/pages/oepul/index.astro'), 'utf8');
    expect(op, 'chybí varování o zvýšení sazeb od 2024').toContain('Impulsprogramm');
    expect(op, 'u tabulek starých sazeb musí být uveden rok').toContain('Ausgangssätze des Jahres 2023');
    // Řada 2023→2025 je jediné místo, kde je vidět dopad zvýšení.
    expect(op).toContain('v2023: 70');
    expect(op).toContain('v2025: 85');
  });

  it('obě rakouské sazby v FAQ sedí s daty v tabulkách', () => {
    const dz = fs.readFileSync(path.join(ROOT, 'src/pages/direktzahlungen-oesterreich/index.astro'), 'utf8');
    // Efektivní sazba na prvních 20 ha = základ + umverteilung. Kdyby se jedno
    // číslo změnilo a druhé ne, FAQ by tvrdilo něco jiného než tabulka.
    const basis = Number(/const BASIS_HEIMGUT = (\d+)/.exec(dz)![1]);
    const umv20 = Number(/const UMV_20 = (\d+)/.exec(dz)![1]);
    const umv40 = Number(/const UMV_40 = (\d+)/.exec(dz)![1]);
    expect(basis + umv20, 'LKO uvádí 252 €/ha pro prvních 20 ha').toBe(252);
    expect(basis + umv40, 'LKO uvádí 230 €/ha pro 21.–40. ha').toBe(230);
  });
});

describe('fáze 3c — plemena-de overlay', () => {
  const ROOT = process.cwd();
  const FILES = ['hovezi', 'kone', 'ovce', 'prasata'];
  const load = (dir: string, f: string) =>
    yaml.load(fs.readFileSync(path.join(ROOT, `src/data/${dir}/${f}.yaml`), 'utf8')) as {
      name: string; description: string; plemena: { slug: string; name: string; description: string; body?: string }[];
    };

  it('de overlay má stejné druhy i slugy jako cs', () => {
    for (const f of FILES) {
      const cs = load('plemena', f);
      const de = load('plemena-de', f);
      expect(de.plemena.map((p) => p.slug), `${f}: jiné slugy`).toEqual(cs.plemena.map((p) => p.slug));
    }
  });

  // ‼️ Overlay se stejnými slugy může být kompletní a přesto ČESKÝ — parita
  // klíčů nic neříká o jazyku hodnot. Sítko na diakritiku, která v němčině
  // není, s výjimkou vlastních jmen (ta jsou u plemen legitimní: „Česká
  // červinka" je název, ne neproložený text).
  it('de overlay je německy, ne česky', () => {
    // ‼️ NE diakritika: „Přeštice-Schwarzbunt" a „Česká červinka" jsou legitimní
    // vlastní jména v německém textu. Česká SLOVA jsou spolehlivější signál.
    const CZ_WORDS = ['plemeno', 'plemena', 'plemen', 'chovan', 'užitkovost', 'hmotnost',
      'vlastnosti', 'vhodné', 'odolné', 'výborn', 'nejrozšířenější', 'maso s', 'mléko'];
    const czech = (t: string) => CZ_WORDS.filter((w) => t.toLowerCase().includes(w));
    for (const f of FILES) {
      const de = load('plemena-de', f);
      expect(czech(de.description), `${f}: popis druhu zůstal česky`).toEqual([]);
      for (const p of de.plemena) {
        expect(czech(p.description), `${f}/${p.slug}: popis zůstal česky`).toEqual([]);
        if (p.body) {
          // Cizojazyčný termín patří do <em> („umgangssprachlich <em>přeštičky</em>",
          // „tschechisch <em>bílé otcovské plemeno</em>") — ten se z kontroly vyjme.
          // Česká věta MIMO kurzívu je naopak nepřeložený zbytek.
          // Pořadí: nejdřív pryč <em> i s obsahem, pak zbylé značky — jinak by
          // kontrola zabrala na href="/de/plemena/..." místo na textu.
          const text = p.body.replace(/<em>[\s\S]*?<\/em>/g, ' ').replace(/<[^>]+>/g, ' ');
          expect(czech(text), `${f}/${p.slug}: v body zůstala česká věta`).toEqual([]);
        }
      }
    }
  });

  it('de overlay není kopie cs', () => {
    for (const f of FILES) {
      const cs = load('plemena', f);
      const de = load('plemena-de', f);
      const same = de.plemena.filter((p, i) => p.description.trim() === cs.plemena[i].description.trim());
      expect(same.map((p) => p.slug), `${f}: nepřeložené popisy`).toEqual([]);
    }
  });

  // ‼️ TŘÍDA: ternář `sk ? SK : pl ? PL : CS` mlčky vracel ČESKÉ popisky
  // užitkovosti pro uk, přestože /plemena je pro uk launchnuté. Test hlídá
  // všechny locale, ne jen de — jinak by stejná díra vznikla u dalšího jazyka.
  it('každý launchnutý locale má vlastní popisky užitkovosti', () => {
    const cs = getUzitkovostLabels('cs');
    for (const loc of Object.keys(LAUNCHED_PREFIXES)) {
      if (loc === 'cs' || !isLaunchedPath(loc as never, '/plemena')) continue;
      const l = getUzitkovostLabels(loc);
      expect(l, `${loc}: chybí popisky užitkovosti`).toBeTruthy();
      // ‼️ Shoda s češtinou NENÍ důkaz nepřeloženosti — slovenština má
      // „Kombinované" i „Vlna" stejně jako čeština. Invariant je proto:
      // většina popisků se od češtiny liší (tichý fallback by byl shodný VŠUDE).
      const differ = Object.keys(cs).filter((k) => l[k as keyof typeof l] !== cs[k as keyof typeof cs]);
      expect(differ.length, `${loc}: popisky užitkovosti vypadají jako český fallback`).toBeGreaterThan(Object.keys(cs).length / 2);
    }
    // de kontrolujeme adresně — žádný popisek se nesmí shodovat s češtinou.
    const de = getUzitkovostLabels('de');
    expect(Object.keys(cs).filter((k) => de[k as keyof typeof de] === cs[k as keyof typeof cs])).toEqual([]);
  });

  it('stránky plemen formátují čísla podle locale, ne natvrdo česky', () => {
    for (const p of ['src/pages/plemena/index.astro', 'src/pages/plemena/[druh]/index.astro',
      'src/pages/plemena/[druh]/[plemeno]/index.astro']) {
      const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(src, `${p}: ternář zná jen sk/pl, uk a de spadnou na cs-CZ`).not.toContain("locale === 'pl' ? 'pl-PL' : 'cs-CZ'");
      expect(src, `${p}: musí použít BCP47`).toContain('BCP47');
    }
  });
});

describe('fáze 3c — choroby de overlay a sitewide JSON-LD', () => {
  const ROOT = process.cwd();
  const SLUGS = fs.readdirSync(path.join(ROOT, 'src/data/choroby'))
    .filter((f) => f.endsWith('.yaml')).map((f) => f.replace(/\.yaml$/, ''));
  const loadDe = (slug: string) =>
    yaml.load(fs.readFileSync(path.join(ROOT, `src/data/choroby/de/${slug}.yaml`), 'utf8')) as {
      name: string; popis: string; priznaky: string; sireni: string; skodlivost: string;
      cyklus: string; ochrana: string; hostitele: string[];
      ucinne_latky?: { latka: string; pripravky?: string }[];
      faq?: { q: string; a: string }[];
    };

  it('de overlay pokrývá všechny choroby', () => {
    const have = fs.readdirSync(path.join(ROOT, 'src/data/choroby/de')).map((f) => f.replace(/\.yaml$/, ''));
    expect(have.sort()).toEqual(SLUGS.sort());
  });

  it('de overlay je německy', () => {
    const CZ = /[ěščřžůťďň]/;
    for (const slug of SLUGS) {
      const d = loadDe(slug);
      for (const f of ['name', 'popis', 'priznaky', 'sireni', 'skodlivost', 'cyklus', 'ochrana'] as const) {
        expect(CZ.test(d[f]), `${slug}.${f} zůstalo česky`).toBe(false);
      }
      for (const h of d.hostitele) expect(CZ.test(h), `${slug}: hostitel „${h}" zůstal česky`).toBe(false);
      for (const q of d.faq ?? []) {
        expect(CZ.test(q.q) || CZ.test(q.a), `${slug}: FAQ zůstalo česky`).toBe(false);
      }
    }
  });

  // ‼️ Registrace přípravků je NÁRODNÍ. Obchodní název z českého registru
  // („např. Flexity") v Německu platit nemusí — de overlay proto nese jen
  // účinné látky. A ne každá `latka` je INN: jedna nesla „měďnaté přípravky".
  it('účinné látky neobsahují obchodní názvy ani češtinu', () => {
    for (const slug of SLUGS) {
      for (const u of loadDe(slug).ucinne_latky ?? []) {
        expect(u.pripravky, `${slug}: obchodní názvy jsou národní, do de nepatří`).toBeUndefined();
        expect(/[ěščřžůťďňáíé]/.test(u.latka), `${slug}: účinná látka „${u.latka}" zůstala česky`).toBe(false);
      }
    }
  });

  it('detail choroby nelinkuje na nelaunchnuté /plodiny', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/pages/choroby/[slug].astro'), 'utf8');
    expect(src, 'seznam plodin se musí gatovat').toContain("isLaunchedPath(locale, '/plodiny')");
    // Počítadlo i JSON-LD musí vycházet ze SKRYTÉHO seznamu, ne z původního —
    // jinak stránka hlásí „7 Kulturen" a žádnou nezobrazí.
    expect(src, 'JSON-LD musí jet z gatovaného seznamu').toContain('plodinyList.map');
    expect(src, 'nikde nesmí zůstat negatovaný přístup').not.toContain('choroba.plodiny.map');
  });

  it('hub chorob nemá natvrdo české skloňování', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/pages/choroby/index.astro'), 'utf8');
    expect(src).not.toContain("'plodina' :");
    expect(src).not.toContain('vazeb na plodiny');
  });

  // ‼️ TŘÍDA: sitewide Organization JSON-LD jede na KAŽDÉ stránce každé locale.
  // Popis byl natvrdo česky, takže Googlu popisoval německý web česky. Únik
  // neviditelný v těle stránky — proto ho žádná dřívější kontrola nechytila.
  it('sitewide Organization JSON-LD má popis pro každý locale', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/lib/structured-data.ts'), 'utf8');
    expect(src, 'popis nesmí být jedna natvrdo česká konstanta').toContain('ORG_DESCRIPTION_BY_LOCALE');
    for (const loc of Object.keys(LAUNCHED_PREFIXES)) {
      expect(src, `chybí popis organizace pro ${loc}`).toMatch(new RegExp(`^\\s{2}${loc}: '`, 'm'));
    }
    const layout = fs.readFileSync(path.join(ROOT, 'src/layouts/Layout.astro'), 'utf8');
    expect(layout, 'Layout musí locale předat').toContain('siteSchemaGraph(locale)');
  });
});

describe('JSON-LD jazyk — třída „lokální BCP47 mapa"', () => {
  const ROOT = process.cwd();
  const walk = (dir: string): string[] =>
    fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(`${dir}/${e.name}`) : [`${dir}/${e.name}`]);

  // ‼️ i18n/utils.ts má sdílenou BCP47 mapu a u ní komentář „používej tohle,
  // ne vlastní ternář". Přesto v projektu žilo 12 lokálních map — a většina
  // neznala de (dvě ani pl). Nejhorší dopad: /encyklopedie je pro de LAUNCHNUTÉ,
  // takže německé stránky posílaly Googlu inLanguage: undefined.
  it('žádná stránka si nedrží vlastní BCP47 mapu', () => {
    const offenders = walk('src/pages')
      .concat(walk('src/layouts'))
      .filter((f) => /\.(astro|ts)$/.test(f))
      .filter((f) => /const bcp47 = \(\{/.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
    expect(offenders, `lokální BCP47 mapa: ${offenders.join(', ')}`).toEqual([]);
  });

  it('sitewide WebSite deklaruje všechny jazyky portálu', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/lib/structured-data.ts'), 'utf8');
    // Bylo natvrdo ['cs-CZ','sk-SK'] i dlouho poté, co přibyly pl, uk a de.
    expect(src, 'inLanguage musí vycházet ze sdílené mapy').toContain('inLanguage: Object.values(BCP47)');
  });

  it('schémata na launchnutých de stránkách přijímají jazyk', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/lib/structured-data.ts'), 'utf8');
    for (const iface of ['ExpertReviewInput', 'VideoObjectInput', 'HowToInput']) {
      const i = src.indexOf(`interface ${iface} {`);
      expect(i, `chybí ${iface}`).toBeGreaterThan(-1);
      expect(src.slice(i, src.indexOf('\n}', i)), `${iface} nemá lang`).toContain('lang?: string');
    }
    const enc = fs.readFileSync(path.join(ROOT, 'src/pages/encyklopedie/[slug].astro'), 'utf8');
    expect(enc, 'encyklopedie musí jazyk předat').toContain('lang: bcp47');
  });
});

describe('fáze 3c — vcelarstvi de overlay', () => {
  const ROOT = process.cwd();
  const SETS = ['vcely', 'vybaveni', 'med'] as const;
  const load = (dir: string, f: string) =>
    yaml.load(fs.readFileSync(path.join(ROOT, `src/data/vcelarstvi/${dir}${f}.yaml`), 'utf8')) as
      Record<string, unknown>[];

  it('de overlay pokrývá všechny položky', () => {
    for (const f of SETS) {
      const cs = load('', f).map((x) => x.slug);
      const de = load('de/', f).map((x) => x.slug);
      expect(de.sort()).toEqual(cs.sort());
    }
  });

  it('de overlay je německy — včetně FAQ a latinského názvu', () => {
    const CZ = /[ěščřžůťďň]/;
    // ‼️ `faq` jsem při prvním průchodu přehlédl úplně: nerenderuje se v těle
    // stránky nápadně, ale jde do JSON-LD FAQPage. `latinsky` je jinak
    // mezinárodní, u buckfastu ale nese dovětek „(šlechtěný hybrid)".
    const PROSE: Record<string, string[]> = {
      vcely: ['name', 'latinsky', 'puvod', 'zimuvzdornost', 'vhodnost_cr', 'barva', 'description'],
      vybaveni: ['name', 'popis_kratky', 'description'],
      med: ['name', 'zdroj_snusky', 'barva', 'chut', 'popis_kratky', 'description'],
    };
    for (const f of SETS) {
      for (const item of load('de/', f)) {
        for (const k of PROSE[f]) {
          const v = item[k];
          if (typeof v === 'string') expect(CZ.test(v), `${f}/${item.slug}.${k} zůstalo česky`).toBe(false);
        }
        for (const q of (item.faq as { q: string; a: string }[] | undefined) ?? []) {
          expect(CZ.test(q.q) || CZ.test(q.a), `${f}/${item.slug}: FAQ zůstalo česky`).toBe(false);
        }
      }
    }
  });

  // ‼️ TŘÍDA: labely enumů byly řetězené ify `sk … pl … return v`, takže
  // UKRAJINŠTINA dostávala české „mírná" a „vysoký", přestože /vcelarstvi je
  // pro uk launchnuté. Test hlídá KAŽDÝ launchnutý locale, ne jen de.
  it('každý launchnutý locale má přeložené enum labely', () => {
    const CASES: [string, (v: string, l: never) => string][] = [
      ['mírná', vcelaTemperamentLabel as never], ['vysoký', vcelaVynosLabel as never],
      ['vyšší', vcelaRojivostLabel as never], ['velmi pomalá', medKrystalizaceLabel as never],
    ];
    for (const loc of Object.keys(LAUNCHED_PREFIXES)) {
      if (loc === 'cs' || !isLaunchedPath(loc as never, '/vcelarstvi')) continue;
      // ‼️ Shoda s češtinou NENÍ důkaz nepřeloženosti — slovenština má „vysoký"
      // stejně jako čeština. Tichý fallback by se ale shodoval VŠUDE, takže
      // invariant je většinová odlišnost.
      const differ = CASES.filter(([cz, fn]) => fn(cz, loc as never) !== cz);
      expect(differ.length, `${loc}: enum labely vypadají jako český fallback`).toBeGreaterThan(CASES.length / 2);
      // Kategorie a typ medu: slovenština má „Úle" i „Medovicový" shodně
      // s češtinou, takže se hlídá jen to, že se celá sada neshoduje.
      const cat = ['ul', 'ochrana', 'naradi', 'zpracovani', 'krmeni'] as const;
      const csCat = cat.map((k) => vybaveniKategorieLabel(k as never, 'cs' as never));
      const locCat = cat.map((k) => vybaveniKategorieLabel(k as never, loc as never));
      expect(locCat.filter((v, i) => v !== csCat[i]).length,
        `${loc}: kategorie vybavení vypadají jako český fallback`).toBeGreaterThan(cat.length / 2);
    }
    // de kontrolujeme adresně — žádný enum ani kategorie se nesmí shodovat s češtinou.
    for (const [cz, fn] of CASES) {
      expect(fn(cz, 'de' as never), `de: enum „${cz}" zůstal český`).not.toBe(cz);
    }
    expect(vybaveniKategorieLabel('ul' as never, 'de' as never)).toBe('Beuten');
    expect(medTypLabel('kvetovy' as never, 'de' as never)).toBe('Blütenhonig');
  });

  it('výpis vybavení přiznává, že ceny jsou z českého trhu', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src/pages/vcelarstvi/vybaveni/index.astro'), 'utf8');
    expect(src, 'výpis musí u Kč zobrazit poznámku stejně jako detail').toContain("slov.czkNote");
  });
});


describe('slovnik.de.ts — německý slovník (fáze 3d)', () => {
  const csBySlug = new Map(SLOVNIK.map((t) => [t.slug, t]));

  it('má přesně stejné slugy a pořadí jako cs', () => {
    expect(SLOVNIK_DE.map((t) => t.slug)).toEqual(SLOVNIK.map((t) => t.slug));
  });

  it('kategorie a related jsou identické s cs (jsou to klíče, ne text)', () => {
    for (const d of SLOVNIK_DE) {
      const c = csBySlug.get(d.slug)!;
      expect(d.kategorie, d.slug).toBe(c.kategorie);
      expect(d.related ?? [], d.slug).toEqual(c.related ?? []);
    }
  });

  it('žádné pole není prázdné', () => {
    for (const d of SLOVNIK_DE) {
      expect(d.term.trim().length, d.slug).toBeGreaterThan(0);
      expect(d.shortDef.trim().length, d.slug).toBeGreaterThan(20);
      expect(d.longDef.trim().length, d.slug).toBeGreaterThan(200);
    }
  });

  // ‼️ FAQ teče do FAQPage JSON-LD. Když se nepřeloží, Google dostane české
  // otázky pod německou stránkou a v těle to není vidět — přesně ta třída
  // úniku, kterou popisuje feedback-json-ld-nikdy-neproslo-sitem-na-cestinu.
  it('každé heslo, které má FAQ v cs, má PŘELOŽENÉ FAQ v de', () => {
    const notTranslated: string[] = [];
    for (const d of SLOVNIK_DE) {
      const c = csBySlug.get(d.slug)!;
      if (!c.faq?.length) continue;
      expect(d.faq?.length, `${d.slug} přišlo o FAQ`).toBeGreaterThan(0);
      if (JSON.stringify(d.faq) === JSON.stringify(c.faq)) notTranslated.push(d.slug);
    }
    expect(notTranslated, `FAQ spadlo zpátky na češtinu: ${notTranslated.join(', ')}`).toEqual([]);
  });

  it('žádný externí odkaz nemíří na český zdroj', () => {
    const bad = SLOVNIK_DE.filter((t) => t.externalUrl && /cs\.wikipedia\.org|szif\.cz|eagri\.cz|ukzuz\.cz|cschm\.cz|svscr\.cz/.test(t.externalUrl));
    expect(bad.map((t) => t.slug), 'český externí odkaz v de slovníku').toEqual([]);
  });

  // Adresná kontrola: němčina je od češtiny dost vzdálená, takže shoda
  // definice s českou znamená tichý fallback, ne shodu jazyků.
  it('žádná definice se neshoduje s českou', () => {
    const same = SLOVNIK_DE.filter((t) => {
      const c = csBySlug.get(t.slug)!;
      return t.shortDef === c.shortDef || t.longDef === c.longDef;
    });
    expect(same.map((t) => t.slug), 'nepřeložená definice').toEqual([]);
  });

  it('longDef neobsahuje česká slova mimo kurzívu', () => {
    const CZECH = /\b(zemědělsk\w*|rostlin\w*|půd\w*|hnojiv\w*|plodin\w*|sklizeň|osiv\w*|traktor(u|em|y)|České republice|v ČR|Kč)\b/;
    const bad: string[] = [];
    for (const d of SLOVNIK_DE) {
      const body = d.longDef.replace(/\*[^*]+\*/g, ' ').replace(/\[\[[^\]]+\]\]/g, ' ');
      if (CZECH.test(body)) bad.push(d.slug);
    }
    expect(bad, `česká slova v německém textu: ${bad.join(', ')}`).toEqual([]);
  });

  it('KATEGORIE_LABELS_DE pokrývá všechny kategorie a je německy', () => {
    const cats = new Set(SLOVNIK.map((t) => t.kategorie));
    for (const c of cats) {
      expect(KATEGORIE_LABELS_DE[c], `chybí label pro ${c}`).toBeTruthy();
      expect(/[ěščřžýáíéůúňťď]/i.test(KATEGORIE_LABELS_DE[c]), `${c} label je česky`).toBe(false);
    }
  });
});
