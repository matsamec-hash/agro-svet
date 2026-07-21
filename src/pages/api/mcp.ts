/**
 * Remote MCP endpoint — Streamable HTTP transport.
 *
 * Exposes the SAME read-only tools as the stdio MCP server (see `mcp/`) over
 * the MCP **Streamable HTTP** transport, served by this site's Worker at
 *   POST https://agro-svet.cz/api/mcp
 *
 * No separate Cloudflare Worker, no new DNS — it ships with the existing site.
 *
 * --- Data loading on Cloudflare Workers (NO filesystem) ---------------------
 * The stdio server reads JSON/YAML from disk with `node:fs`, which does NOT work
 * in the bundled Worker. Here we load the datasets via **build-time imports**:
 * `import.meta.glob(..., { eager: true })` makes Vite inline every dataset file
 * into the bundle at build time (JSON natively; the `*.yaml` machinery files via
 * the repo's `@modyfi/vite-plugin-yaml` plugin). The parsed data is then passed
 * into the EXACT SAME pure tool functions used by stdio (`mcp/src/register.ts`),
 * so there is zero duplicated query logic.
 *
 * --- Transport --------------------------------------------------------------
 * Uses the MCP TypeScript SDK's `WebStandardStreamableHTTPServerTransport`
 * (Request/Response based, runs on Workers) in **stateless mode**
 * (`sessionIdGenerator: undefined`) with `enableJsonResponse: true` — read-only
 * tools need no sessions or SSE streaming, so each POST is a self-contained
 * JSON-RPC request/response. A fresh server+transport is created per request
 * (stateless), which is the SDK's recommended pattern for serverless runtimes.
 *
 * Auth / rate-limiting: NOT implemented yet (public read-only data). See README
 * "Follow-ups".
 */
import type { APIRoute } from 'astro';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';

import {
  registerTools,
  SERVER_INFO,
  type Datasets,
} from '../../../mcp/src/register.js';
import type {
  CommoditiesFile,
  CountryProfile,
  Variety,
  MachineryBrand,
} from '../../../mcp/src/data.js';
import {
  BAZAR_PUBLIC_COLUMNS,
  MAX_LIMIT as BAZAR_MAX_LIMIT,
  type BazarFetcher,
  type BazarListingRow,
} from '../../../mcp/src/tools/bazar.js';
import { createServerClient } from '../../lib/supabase';

export const prerender = false;

// --- Build-time data loading (no fs) ---------------------------------------
// Eager globs are resolved at build time and inlined into the Worker bundle.
// Paths are relative to the project root (leading `/`).
const commoditiesModule = import.meta.glob<{ default: CommoditiesFile }>(
  '/src/data/commodities.json',
  { eager: true },
);
const countryModules = import.meta.glob<{ default: CountryProfile }>(
  '/src/data/svet/*.json',
  { eager: true },
);
const varietyModules = import.meta.glob<{ default: Variety[] }>(
  '/src/data/plodiny/odrudy/*.json',
  { eager: true },
);
// `@modyfi/vite-plugin-yaml` turns each YAML file into a module whose default
// export is the parsed object.
const brandModules = import.meta.glob<{ default: MachineryBrand }>(
  '/src/data/stroje/*.yaml',
  { eager: true },
);

/** Assemble the in-memory datasets once (module scope = cached per isolate). */
function buildDatasets(): Datasets {
  const commodities = Object.values(commoditiesModule)[0]!.default;

  const countries = Object.entries(countryModules)
    // Skip the svet index.json (it is not a country profile).
    .filter(([path]) => !path.endsWith('/index.json'))
    .map(([, m]) => m.default)
    .sort((a, b) => a.nameCs.localeCompare(b.nameCs, 'cs'));

  const varieties: Variety[] = [];
  for (const m of Object.values(varietyModules)) {
    if (Array.isArray(m.default)) varieties.push(...m.default);
  }

  const brands = Object.values(brandModules)
    .map((m) => m.default)
    .sort((a, b) => a.name.localeCompare(b.name, 'cs'));

  return { commodities, countries, varieties, brands };
}

// Built once per Worker isolate; reused across requests.
const datasets = buildDatasets();

/**
 * Live bazar fetcher: queries `bazar_listings` for PUBLIC, active listings only.
 *
 * - Selects strictly the whitelisted public columns (no phone/email/user_id).
 * - Pushes the cheap indexed filters (category/subcategory/brand eq, price/
 *   power/year ranges, title text) down to Postgres; the pure `searchBazar`
 *   then re-applies every filter over the returned rows as the source of truth.
 * - Caps rows at the tool's MAX_LIMIT so a single query can never return the
 *   whole table.
 */
const fetchBazar: BazarFetcher = async (args): Promise<BazarListingRow[]> => {
  const supabase = createServerClient();
  let q = supabase
    .from('bazar_listings')
    .select(BAZAR_PUBLIC_COLUMNS.join(', '))
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(BAZAR_MAX_LIMIT);

  if (args.category) q = q.ilike('category', `%${args.category}%`);
  if (args.subcategory) q = q.ilike('subcategory', `%${args.subcategory}%`);
  if (args.brand) q = q.ilike('brand', `%${args.brand}%`);
  if (args.query) {
    // Mirror the pure searchBazar() semantics: title OR description OR brand.
    // Strip PostgREST `or()` delimiters from the term so it can't break syntax.
    const term = args.query.replace(/[,()*]/g, ' ').trim();
    if (term) {
      q = q.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,brand.ilike.%${term}%`,
      );
    }
  }
  if (args.price_min != null) q = q.gte('price', args.price_min);
  if (args.price_max != null) q = q.lte('price', args.price_max);
  if (args.power_min != null) q = q.gte('power_hp', args.power_min);
  if (args.power_max != null) q = q.lte('power_hp', args.power_max);
  if (args.year_from != null) q = q.gte('year_of_manufacture', args.year_from);
  if (args.region) q = q.ilike('location', `%${args.region}%`);

  const { data, error } = await q;
  if (error) throw new Error(`bazar query failed: ${error.message}`);
  return (data ?? []) as unknown as BazarListingRow[];
};

/** Build a fresh MCP server wired to the (shared) datasets + live bazar. */
function createServer(): McpServer {
  const server = new McpServer(SERVER_INFO);
  registerTools(server, datasets, fetchBazar);
  return server;
}

/**
 * Handle one MCP HTTP request. Stateless: a new server + transport per request,
 * closed once the Response is produced.
 */
async function handle(request: Request): Promise<Response> {
  const server = createServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    // Stateless mode — no sessions for read-only tools.
    sessionIdGenerator: undefined,
    // Return plain JSON responses instead of opening an SSE stream.
    enableJsonResponse: true,
  });

  await server.connect(transport);
  const response = await transport.handleRequest(request);

  // Best-effort cleanup; do not let it block the response.
  void transport.close().catch(() => {});
  return response;
}

export const POST: APIRoute = ({ request }) => handle(request);

// The Streamable HTTP transport also accepts GET (for SSE streams) and DELETE
// (session teardown). In stateless mode GET returns 405 and DELETE is a no-op,
// but we forward them so the transport produces spec-compliant responses.
export const GET: APIRoute = ({ request }) => handle(request);
export const DELETE: APIRoute = ({ request }) => handle(request);

// Permissive CORS preflight so browser-based MCP clients can reach the public,
// read-only endpoint cross-origin.
export const OPTIONS: APIRoute = () =>
  new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, DELETE, OPTIONS',
      'access-control-allow-headers': 'content-type, mcp-protocol-version, mcp-session-id, accept',
      'access-control-max-age': '86400',
    },
  });
