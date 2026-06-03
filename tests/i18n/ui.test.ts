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

  it('t() spadne na cs když klíč v locale chybí', () => {
    expect(t('uk', 'footer.rights')).toBe(ui.cs['footer.rights']);
  });

  it('t() vrátí klíč když chybí všude', () => {
    expect(t('sk', 'nonexistent.key')).toBe('nonexistent.key');
  });

  it('useTranslations vrací funkci vázanou na locale', () => {
    const tr = useTranslations('sk');
    expect(tr('nav.home')).toBe('Domov');
  });
});
