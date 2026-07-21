/**
 * Pure helpers for one-click WhatsApp claim outreach.
 *
 * Most bazos sellers leave a PHONE, not an e-mail — the claim e-mail only
 * reaches a minority. A `https://wa.me/<intl>?text=<message>` deep link lets the
 * admin open WhatsApp with the claim message pre-filled and just hit send,
 * which is the main lever for converting seeded drafts into published listings.
 *
 * No network/DB here so it stays unit-testable; the .astro computes the URL
 * server-side and hands it to the button.
 */

/**
 * Normalise a Czech (or already-international) phone number into the digits-only
 * international form WhatsApp expects (e.g. "420601234567"). Returns null when
 * the input can't be turned into a plausible number.
 */
export function normalizeCzPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const hadPlus = raw.trim().startsWith('+');
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);

  // Already carries a CZ/SK country code.
  if ((digits.startsWith('420') || digits.startsWith('421')) && digits.length >= 11 && digits.length <= 13) {
    return digits;
  }
  // Bare 9-digit national number → assume Czech (+420).
  if (digits.length === 9) return `420${digits}`;
  // Explicit international (had a +) with a plausible length → trust it.
  if (hadPlus && digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}

/** Short, friendly claim message for WhatsApp (plain text). */
export function buildClaimWhatsAppMessage(args: {
  name?: string | null;
  listingTitle?: string | null;
  url: string;
}): string {
  const hello = args.name ? `Dobrý den, ${args.name},` : 'Dobrý den,';
  const what = args.listingTitle
    ? `všimli jsme si vaší nabídky „${args.listingTitle}" a připravili vám z ní hotový inzerát`
    : 'všimli jsme si vaší nabídky a připravili vám z ní hotový inzerát';
  return (
    `${hello} ${what} zdarma na zemědělském bazaru Agro-svět. ` +
    `Stačí zkontrolovat a jedním kliknutím zveřejnit (zdarma, kdykoli můžete upravit i smazat):\n${args.url}`
  );
}

/**
 * Build the wa.me deep link. Returns null if the phone can't be normalised
 * (then the UI just hides the WhatsApp button and falls back to copy-link).
 */
export function claimWhatsAppUrl(
  phone: string | null | undefined,
  message: string,
): string | null {
  const intl = normalizeCzPhone(phone);
  if (!intl) return null;
  return `https://wa.me/${intl}?text=${encodeURIComponent(message)}`;
}
