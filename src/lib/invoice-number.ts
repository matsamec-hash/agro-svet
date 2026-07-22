// Formát čísla faktury YYYY-NNNN. Autoritativní zdroj sekvence je DB RPC
// bazar_next_invoice_number() — tahle fce jen formátuje (a používá se i pro test parity).
export function formatInvoiceNumber(year: number, seq: number): string {
  return `${year}-${String(seq).padStart(4, '0')}`;
}
