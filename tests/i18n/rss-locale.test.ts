// tests/i18n/rss-locale.test.ts
// ‼️ TŘÍDA CHYBY: strojově čitelný výstup se servíruje pod VŠEMI jazykovými
// prefixy (middleware přepíše /de/rss.xml na cs-root routu), ale nikdo se do něj
// nedívá očima, takže tam český obsah přežil roky. Do 2026-09-10 dostal Němec,
// Polák i Ukrajinec do čtečky české dotační zpravodajství — včetně kategorií,
// které jsou pro jeho jazyk schválně skryté, a s odkazy na české URL.
// Stránky na tohle testy mají; feed neměl žádný.
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ui } from '../../src/i18n/ui';
import { locales } from '../../src/i18n/config';

const ROOT = process.cwd();
const RSS = fs.readFileSync(path.join(ROOT, 'src/pages/rss.xml.ts'), 'utf8');
const LAYOUT = fs.readFileSync(path.join(ROOT, 'src/layouts/Layout.astro'), 'utf8');

describe('RSS feed respektuje jazyk', () => {
  it('bere locale z requestu, ne napevno češtinu', () => {
    expect(RSS).toMatch(/locals as \{ locale\?: Locale \}|getLocaleFromUrl/);
    expect(RSS, 'jazyk kanálu musí vycházet z locale').toContain('bcp47(locale)');
    expect(RSS, 'natvrdo zadaný cs-CZ se nesmí vrátit').not.toMatch(/FEED_LANG\s*=\s*'cs-CZ'/);
  });

  it('ne-cs bere jen reálně přeložené články', () => {
    expect(RSS).toContain('fetchTranslatedArticleIds');
    expect(RSS).toContain('overlayArticle');
  });

  it('vyřazuje jurisdikčně skryté kategorie', () => {
    // /de a /pl nesmí dostat české dotace a legislativu ani ve feedu.
    expect(RSS).toContain('HIDDEN_NEWS_CATEGORIES');
  });

  it('odkazy míří pod prefix daného jazyka', () => {
    expect(RSS).toContain('localizePath(locale, `/novinky/${a.slug}/`)');
    expect(RSS, 'atom:self musí ukazovat na feed daného jazyka').toContain("localizePath(locale, '/rss.xml')");
  });

  it('prázdná množina překladů vede k prázdnému feedu, ne k dotazu bez filtru', () => {
    // Kdyby se `if (translatedIds) q = q.in(...)` vypustilo, jazyk bez překladů
    // by dostal VŠECHNY české články — přesně původní chyba.
    expect(RSS).toContain('translatedIds.size > 0');
    expect(RSS).toContain('if (translatedIds) q = q.in');
  });

  it('hlavička odkazuje na feed vlastního jazyka, ne na /rss.xml', () => {
    expect(LAYOUT).toContain("localizePath(locale, '/rss.xml')");
    expect(LAYOUT, 'natvrdo zadaná česká cesta se nesmí vrátit').not.toContain('href="/rss.xml"');
  });

  it('každý jazyk má vlastní název a popis feedu', () => {
    for (const loc of locales) {
      for (const key of ['rss.title', 'rss.desc', 'rss.linkTitle']) {
        expect(ui[loc][key], `${loc}: chybí ${key}`).toBeTruthy();
      }
    }
    // Popis nesmí zůstat český fallback — to je celý smysl téhle opravy.
    for (const loc of locales.filter((l) => l !== 'cs')) {
      expect(ui[loc]['rss.desc'], `${loc} má český popis feedu`).not.toBe(ui.cs['rss.desc']);
    }
  });
});
