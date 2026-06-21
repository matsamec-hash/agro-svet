/**
 * agro-svet MCP server (stdio transport).
 *
 * Read-only MCP server exposing agro-svet.cz's PUBLIC structured datasets as
 * tools:
 *   - get_commodity_prices   (CZ commodity price series)
 *   - compare_countries      (cross-country agriculture indicators)
 *   - search_crop_varieties  (registered crop variety registry)
 *   - search_machinery       (ag machinery brands/series/models)
 *   - list_datasets          (discovery catalog)
 *
 * No user / Supabase data (bazar, contest, users) is ever exposed.
 *
 * The tool wiring lives in `register.ts` and is shared with the remote
 * Streamable-HTTP transport (Astro route `src/pages/api/mcp.ts`). This file
 * only loads the datasets from disk (Node fs) and connects the stdio transport.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import {
  loadCommodities,
  loadCountries,
  loadVarieties,
  loadBrands,
} from "./data.js";
import { registerTools, SERVER_INFO } from "./register.js";

export function createServer(): McpServer {
  const server = new McpServer(SERVER_INFO);
  registerTools(server, {
    commodities: loadCommodities(),
    countries: loadCountries(),
    varieties: loadVarieties(),
    brands: loadBrands(),
  });
  return server;
}

async function main(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // stderr is safe for logs (stdout is the JSON-RPC channel).
  console.error("agro-svet MCP server running on stdio.");
}

// Run only when invoked directly (not when imported by tests).
const invokedPath = process.argv[1]
  ? new URL(`file://${process.argv[1]}`).pathname
  : "";
if (invokedPath === new URL(import.meta.url).pathname) {
  main().catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  });
}
