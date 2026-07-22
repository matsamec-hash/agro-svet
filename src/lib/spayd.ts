// SPAYD (Short Payment Descriptor) v1.0 — český standard „QR Platba".
// Formát: SPD*1.0*ACC:<IBAN>*AM:<částka>*CC:CZK*X-VS:<vs>*MSG:<zpráva>
export interface SpaydInput {
  iban: string;
  amountCzk: number;
  vs: number;
  message: string;
}

// SPAYD hodnoty nesmí obsahovat '*' (delimiter). MSG držíme ASCII bez diakritiky.
function sanitize(s: string): string {
  return s
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSpayd({ iban, amountCzk, vs, message }: SpaydInput): string {
  const parts = [
    'SPD', '1.0',
    `ACC:${iban.replace(/\s+/g, '')}`,
    `AM:${amountCzk.toFixed(2)}`,
    'CC:CZK',
    `X-VS:${vs}`,
    `MSG:${sanitize(message)}`,
  ];
  return parts.join('*');
}
