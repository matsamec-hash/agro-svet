// Fio banka — REST výpis transakcí. Čistý parser + tenký fetch klient.
// Bezstavově čteme okno posledních N dní (idempotence řeší fio_transaction_id v DB).
import { getEnvVar } from './env';

export interface FioTx {
  id: number;
  amountCzk: number;
  vs: string;
  currency: string;
}

export function parseFioTransactions(json: any): FioTx[] {
  const list = json?.accountStatement?.transactionList?.transaction;
  if (!Array.isArray(list)) return [];
  const out: FioTx[] = [];
  for (const t of list) {
    const id = t?.column22?.value;
    const amount = t?.column1?.value;
    const vs = t?.column5?.value;
    const currency = t?.column14?.value ?? 'CZK';
    if (typeof id !== 'number') continue;
    if (typeof amount !== 'number' || amount <= 0) continue;
    if (vs == null || String(vs).length === 0) continue;
    out.push({ id, amountCzk: Math.round(amount), vs: String(vs), currency });
  }
  return out;
}

export function fioDateRange(daysBack: number, now: Date): { from: string; to: string } {
  const to = now.toISOString().slice(0, 10);
  const fromD = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  const from = fromD.toISOString().slice(0, 10);
  return { from, to };
}

export async function fetchFioTransactions(daysBack: number, now: Date): Promise<FioTx[]> {
  const token = getEnvVar('FIO_API_TOKEN');
  if (!token) throw new Error('Missing FIO_API_TOKEN');
  const { from, to } = fioDateRange(daysBack, now);
  const url = `https://fioapi.fio.cz/v1/rest/periods/${token}/${from}/${to}/transactions.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fio API ${res.status}`);
  const json = await res.json();
  return parseFioTransactions(json);
}
