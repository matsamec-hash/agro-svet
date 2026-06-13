import { describe, it, expect } from 'vitest';
import { ui } from '../../src/i18n/ui';
import { t, useTranslations } from '../../src/i18n/utils';

describe('UI dictionaries', () => {
  it('cs/sk/uk slovníky existují', () => {
    expect(ui.cs['nav.home']).toBe('Domů');
    expect(ui.sk['nav.home']).toBe('Domov');
    expect(ui.uk['nav.home']).toBe('Головна');
  });

  it('t() vrátí překlad pro locale', () => {
    expect(t('sk', 'nav.machines')).toBe('Stroje');
    expect(t('uk', 'nav.machines')).toBe('Техніка');
  });

  it('uk má vlastní překlad footer.rights (plná parita, žádný cs fallback)', () => {
    expect(ui.uk['footer.rights']).toBe('Усі права захищені');
    expect(t('uk', 'footer.rights')).not.toBe(ui.cs['footer.rights']);
  });

  it('t() spadne na cs když klíč v locale chybí', () => {
    // Mechanismus locale→cs: simulujeme klíč přítomný jen v cs.
    const csOnly = '__test.cs.only__';
    const orig = ui.cs[csOnly];
    ui.cs[csOnly] = 'jen cs';
    try {
      expect(t('uk', csOnly)).toBe('jen cs');
      expect(t('sk', csOnly)).toBe('jen cs');
    } finally {
      if (orig === undefined) delete ui.cs[csOnly];
      else ui.cs[csOnly] = orig;
    }
  });

  it('t() vrátí klíč když chybí všude', () => {
    expect(t('sk', 'nonexistent.key')).toBe('nonexistent.key');
  });

  it('useTranslations vrací funkci vázanou na locale', () => {
    const tr = useTranslations('sk');
    expect(tr('nav.home')).toBe('Domov');
  });
});
