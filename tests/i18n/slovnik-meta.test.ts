import { describe, it, expect } from 'vitest';
import { getSlovnik, slovnikMetaDescription } from '../../src/lib/slovnik';
import { useTranslations, tf } from '../../src/i18n/utils';

const LOCALES = ['cs', 'sk', 'pl', 'uk', 'de'] as const;

describe('slovnikMetaDescription', () => {
  it.each(LOCALES)('%s: popisek nikdy nevydá hotovou definici (shortDef)', (locale) => {
    const t = useTranslations(locale as any);
    for (const term of getSlovnik(locale)) {
      // Jádro opravy: shortDef je celá odpověď na dotaz. Když ji dáme do popisku,
      // uživatel ji přečte přímo ve výsledku vyhledávání a nemá proč kliknout.
      expect(slovnikMetaDescription(term, locale, false, t, tf as any)).not.toContain(term.shortDef);
    }
  });

  it.each(LOCALES)('%s: popisek se vejde do 160 znaků, jmenuje heslo a nemá nevyplněné placeholdery', (locale) => {
    const t = useTranslations(locale as any);
    for (const term of getSlovnik(locale)) {
      const desc = slovnikMetaDescription(term, locale, false, t, tf as any);
      expect(desc.length).toBeLessThanOrEqual(160);
      expect(desc).toContain(term.term);
      expect(desc).not.toContain('{');
    }
  });

  it.each(LOCALES)('%s: převodník se slibuje jen tam, kde ho stránka vykreslí', (locale) => {
    const t = useTranslations(locale as any);
    const label = t('slovnik.detail.metaConverter');
    const term = getSlovnik(locale).find((x) => x.slug === 'hektar')!;
    expect(slovnikMetaDescription(term, locale, true, t, tf as any)).toContain(label);
    expect(slovnikMetaDescription(term, locale, false, t, tf as any)).not.toContain(label);
  });

  it.each(LOCALES)('%s: FAQ se slibuje jen u hesel, která ho mají', (locale) => {
    const t = useTranslations(locale as any);
    const label = t('slovnik.detail.metaFaq');
    const terms = getSlovnik(locale);
    const withFaq = terms.find((x) => x.faq && x.faq.length > 0)!;
    const without = terms.find((x) => !x.faq || x.faq.length === 0)!;
    expect(slovnikMetaDescription(withFaq, locale, false, t, tf as any)).toContain(label);
    expect(slovnikMetaDescription(without, locale, false, t, tf as any)).not.toContain(label);
  });
});
