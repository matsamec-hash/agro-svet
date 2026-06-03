export const locales = ['cs', 'sk', 'uk'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'cs';

export const localeNames: Record<Locale, string> = {
  cs: 'Čeština',
  sk: 'Slovenčina',
  uk: 'Українська',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
