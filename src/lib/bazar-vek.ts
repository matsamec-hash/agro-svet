import { defaultLocale, type Locale } from '../i18n/config';

/**
 * Věta u registrace a přihlášení do bazaru: registrací uživatel potvrzuje,
 * že mu je aspoň 15 let (mladší potřebují souhlas zákonného zástupce).
 * Přihlášení přes Google zakládá účet při prvním použití, proto věta stojí
 * i na přihlašovací stránce.
 */
export const BAZAR_VEK_VETA: Record<Locale, string> = {
  cs: 'Registrací potvrzujete, že vám je alespoň 15 let.',
  sk: 'Registráciou potvrdzujete, že máte aspoň 15 rokov.',
  pl: 'Rejestrując się, potwierdzasz, że masz co najmniej 15 lat.',
  uk: 'Реєструючись, ви підтверджуєте, що вам щонайменше 15 років.',
  de: 'Mit der Registrierung bestätigen Sie, dass Sie mindestens 15 Jahre alt sind.',
};

export function bazarVekVeta(locale: Locale | undefined): string {
  return BAZAR_VEK_VETA[locale ?? defaultLocale] ?? BAZAR_VEK_VETA[defaultLocale];
}
