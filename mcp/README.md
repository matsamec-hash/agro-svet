# agro-svet MCP server

A standalone, **read-only** [Model Context Protocol](https://modelcontextprotocol.io)
server that exposes agro-svet.cz's **public** structured datasets as MCP tools
over the **stdio** transport.

Over stdio, only public **static reference** data is served — no database.

The remote HTTP transport (`src/pages/api/mcp.ts`, served at
`POST https://agro-svet.cz/api/mcp/`) additionally exposes **`search_bazar`**,
which queries the live marketplace. Even there, only **public, active** listings
and their **public marketing fields** are returned — seller PII (`phone`,
`email`, `user_id`) is never selected. No contest or account data is ever
touched by any transport.

## Datasets

| Dataset        | Source                | Records        | Tool                    |
| -------------- | --------------------- | -------------- | ----------------------- |
| Commodities    | `src/data/commodities.json`         | 9 series (monthly, since 2010) | `get_commodity_prices` |
| Countries      | `src/data/svet/*.json`              | 33 countries × 15 indicators   | `compare_countries`    |
| Crop varieties | `src/data/plodiny/odrudy/*.json`    | ~3,476 across 18 crops (ÚKZÚZ) | `search_crop_varieties` |
| Machinery      | `src/data/stroje/*.yaml`            | 22 brands / ~2,092 models      | `search_machinery`     |

The data is read from the parent repo's `src/data/` directory (paths are
resolved relative to the module, not the working directory).

## Tools

- **`list_datasets`** — discovery catalog: every dataset with description,
  record count, the tool that queries it, and the valid keys/slugs to filter by.
- **`get_commodity_prices`** `{ commodity, from?, to? }` — Czech commodity price
  series (Pšenice, Ječmen, Řepka, Kukuřice, Mléko, Vepřové, Hovězí, Vejce, Mák),
  filtered to a year range, with the 5-year rolling average when available.
- **`compare_countries`** `{ indicator, countries? }` — latest value + unit +
  cited source per country for an indicator (wheat_yield, organic_share, …),
  sorted descending.
- **`search_crop_varieties`** `{ crop?, year_from?, year_to?, query?, limit? }` —
  search the registered variety registry; `query` matches name / maintainer
  (case-insensitive). Default limit 50, max 200.
- **`search_machinery`** `{ brand?, category?, power_min?, power_max?, year?, limit? }` —
  flattened brand → category → series → model search by brand, category,
  horsepower range, or production year. Default limit 50, max 200.
- **`search_bazar`** `{ query?, category?, subcategory?, brand?, price_min?, price_max?, power_min?, power_max?, year_from?, region?, limit? }`
  — **HTTP transport only.** Live search over public, active marketplace
  listings; each hit includes a canonical `agro-svet.cz/bazar/{id}` URL and a
  short excerpt, but no seller contact details. Default limit 30, max 100.

## Run

```bash
nvm use 22        # repo needs node >= 22.12
npm install
npm start         # tsx src/server.ts (stdio)
```

### MCP client config (example)

```json
{
  "mcpServers": {
    "agro-svet": {
      "command": "npx",
      "args": ["tsx", "src/server.ts"],
      "cwd": "/absolute/path/to/agro-svet/mcp"
    }
  }
}
```

## Develop / test

```bash
npm test           # vitest (pure query unit tests + in-memory MCP e2e)
npx tsc --noEmit   # typecheck
npm run build      # emit dist/
```

### Inspect with MCP Inspector

```bash
npx @modelcontextprotocol/inspector npx tsx src/server.ts
```

## Architecture

Pure query logic is separated from MCP wiring so it is unit-testable, and the
tool wiring is shared between the stdio and remote HTTP transports:

- `src/data.ts` — fs-based cached loaders for the JSON/YAML datasets (stdio only).
- `src/tools/{commodities,countries,varieties,machinery}.ts` — pure functions
  taking parsed data + args and returning plain objects (these are TDD-tested).
- `src/register.ts` — `registerTools(server, datasets)`: the tool names,
  descriptions, zod input schemas and handlers, defined ONCE. Handlers read from
  an injected `Datasets` bundle and call the same pure functions. Reused by both
  transports.
- `src/server.ts` — stdio entry: loads data from disk via `data.ts`, calls
  `registerTools`, connects `StdioServerTransport`.

## Remote endpoint (Streamable HTTP)

The same five tools are exposed over the MCP **Streamable HTTP** transport at:

```
POST https://agro-svet.cz/api/mcp/
```

This is **not** a separate service. It is an Astro API route
(`../src/pages/api/mcp.ts`) that ships with — and runs inside — the existing
agro-svet site Worker on Cloudflare. **No separate Cloudflare Worker, no new
DNS, no new infrastructure.** It deploys automatically with the normal site
deploy.

### How it works on Cloudflare Workers (no filesystem)

Workers have no filesystem, so the route does **not** use `data.ts`/`node:fs`.
Instead it loads the datasets via **build-time imports**
(`import.meta.glob('/src/data/...', { eager: true })`), which Vite inlines into
the Worker bundle at build time — JSON natively, and the `*.yaml` machinery files
via the repo's `@modyfi/vite-plugin-yaml` plugin. The parsed data is passed into
the same `registerTools()` used by stdio, so there is zero duplicated query
logic.

The transport is the SDK's `WebStandardStreamableHTTPServerTransport`
(Request/Response based, runs on Workers) in **stateless mode**
(`sessionIdGenerator: undefined`, `enableJsonResponse: true`) — read-only tools
need no sessions or SSE streaming; each POST is a self-contained JSON-RPC
request/response.

> ⚠️ **Always use the trailing slash: `/api/mcp/`.** The site runs
> `trailingSlash: 'always'`, so a POST to `/api/mcp` (no slash) gets a **301**
> redirect to `/api/mcp/` — and most HTTP clients drop the request body when
> following a 301 on POST, so the call silently fails. The trailing slash is the
> only reliable form; every example and client config below uses it.

### MCP client config (remote)

```json
{
  "mcpServers": {
    "agro-svet-remote": {
      "type": "streamable-http",
      "url": "https://agro-svet.cz/api/mcp/"
    }
  }
}
```

### Example curl

```bash
# initialize
curl -X POST https://agro-svet.cz/api/mcp/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'

# list tools
curl -X POST https://agro-svet.cz/api/mcp/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'MCP-Protocol-Version: 2025-06-18' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

# call a tool (wheat prices for 2024)
curl -X POST https://agro-svet.cz/api/mcp/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -H 'MCP-Protocol-Version: 2025-06-18' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_commodity_prices","arguments":{"commodity":"Pšenice","from":"2024","to":"2024"}}}'
```

### Follow-ups (not yet implemented)

- **Auth** — the endpoint is currently open (it only serves public reference
  data, no user/Supabase data). If abuse becomes an issue, add a bearer token or
  the MCP OAuth flow.
- **Rate limiting** — reuse the site's existing `edgeThrottle` helper (see
  `src/lib/edge-throttle.ts`, as used by `/api/geocode`) keyed on
  `cf-connecting-ip`.
