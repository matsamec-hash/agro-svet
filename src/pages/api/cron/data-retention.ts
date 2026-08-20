// GET /api/cron/data-retention — vynucení retenčních lhůt ze zásad zpracování.
//
// PROČ VZNIKL: zásady slibovaly čtyři lhůty (logy 30 dní, smazané inzeráty 1 rok,
// neaktivní účty 3 roky, odhlášení z newsletteru 30 dní), ale v repu NEEXISTOVAL
// jediný kód, který by cokoliv mazal. Data rostla donekonečna a uživatelům jsme
// tvrdili opak — čl. 5 odst. 1 písm. e) GDPR (omezení uložení).
//
// ‼️ VE VÝCHOZÍM STAVU JEN REPORTUJE. Mazání zapne až `DATA_RETENTION_ENABLED`
// v src/lib/config.ts. Bez flagu vrátí, co BY smazal — pusť si to nejdřív
// nasucho a čísla si prohlédni, teprve pak flag zapni. Smazání je nevratné.
//
// Auth: Authorization: Bearer ${CRON_SECRET}, stejně jako ostatní crony.
// Doporučený interval: 1× denně.

import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { getEnvVar } from '../../../lib/env';
import { DATA_RETENTION_ENABLED } from '../../../lib/config';

export const prerender = false;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Lhůty MUSÍ souhlasit se sekcí 4 zásad zpracování osobních údajů. */
export const RETENTION = {
  /** Anti-fraud pokusy o zadání kódu — drží se jen IP a čas, po pár minutách
   *  bez hodnoty. Jediná tabulka, která rostla donekonečna. */
  codeAttemptsDays: 30,
} as const;

interface Sweep {
  table: string;
  column: string;
  cutoff: string;
  matched: number;
  deleted: number;
  note?: string;
}

async function sweep(
  sb: ReturnType<typeof createServerClient>,
  table: string,
  column: string,
  days: number,
  extra?: (q: any) => any,
): Promise<Sweep> {
  const cutoff = new Date(Date.now() - days * DAY_MS).toISOString();
  let countQ = sb.from(table).select('*', { count: 'exact', head: true }).lt(column, cutoff);
  if (extra) countQ = extra(countQ);
  const { count, error } = await countQ;
  if (error) return { table, column, cutoff, matched: 0, deleted: 0, note: `count selhal: ${error.message}` };

  const matched = count ?? 0;
  if (!DATA_RETENTION_ENABLED || matched === 0) {
    return { table, column, cutoff, matched, deleted: 0, note: DATA_RETENTION_ENABLED ? undefined : 'dry-run' };
  }
  let delQ = sb.from(table).delete().lt(column, cutoff);
  if (extra) delQ = extra(delQ);
  const { error: delErr } = await delQ;
  return {
    table, column, cutoff, matched,
    deleted: delErr ? 0 : matched,
    note: delErr ? `delete selhal: ${delErr.message}` : undefined,
  };
}

export const GET: APIRoute = async ({ request }) => {
  const expected = getEnvVar('CRON_SECRET');
  if (!expected) return new Response('CRON_SECRET env not set', { status: 503 });
  const auth = request.headers.get('authorization') ?? '';
  if (auth !== `Bearer ${expected}`) return new Response('Unauthorized', { status: 401 });

  const sb = createServerClient();
  const sweeps: Sweep[] = [];

  // 1) Anti-fraud pokusy podle IP — bez hodnoty po pár minutách, držíme 30 dní.
  sweeps.push(await sweep(sb, 'bazar_code_attempts', 'created_at', RETENTION.codeAttemptsDays));

  // Inzeráty se tu ZÁMĚRNĚ nemetou: `/bazar/moje/` dělá tvrdý DELETE, řádek je
  // po smazání okamžitě pryč. Zásady dřív slibovaly „1 rok archivace pro audit" —
  // to nikdy neplatilo a text byl opraven, ne kód (okamžité smazání je pro
  // uživatele příznivější a nemá smysl zavádět archiv jen kvůli souladu s větou).

  const body = {
    mode: DATA_RETENTION_ENABLED ? 'delete' : 'dry-run',
    ranAt: new Date().toISOString(),
    retention: RETENTION,
    sweeps,
    // Automatické mazání neaktivních účtů tenhle job NEŘEŠÍ — smazání účtu má
    // kaskádu na inzeráty a je nevratné, takže je to rozhodnutí, ne úklid.
    // Dokud to neplatí, zásady o něm nesmí tvrdit konkrétní lhůtu.
    notImplemented: ['automatické mazání neaktivních účtů'],
  };
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
};
