// Variabilní symbol pro párování Fio plateb. Číselný, max 10 číslic (limit VS v ČR).
// Přiděluje se z DB sekvence (RPC bazar_next_vs) — tady jen validace/formát.
export function isValidVs(vs: number): boolean {
  return Number.isInteger(vs) && vs >= 1 && vs <= 9_999_999_999;
}
export function vsToString(vs: number): string {
  return String(vs);
}
