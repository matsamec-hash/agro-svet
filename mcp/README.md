# agro-svet MCP server

A standalone, **read-only** [Model Context Protocol](https://modelcontextprotocol.io)
server that exposes agro-svet.cz's **public** structured datasets as MCP tools
over the **stdio** transport.

Only public reference data is served. **No** user / Supabase data (bazar,
contest, accounts) is ever touched.

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

Pure query logic is separated from MCP wiring so it is unit-testable:

- `src/data.ts` — cached loaders for the JSON/YAML datasets.
- `src/tools/{commodities,countries,varieties,machinery}.ts` — pure functions
  taking parsed data + args and returning plain objects (these are TDD-tested).
- `src/server.ts` — builds the `McpServer`, registers tools with zod input
  schemas, and connects `StdioServerTransport`.

## Future work (F2 — remote deploy)

A remote deployment at **`mcp.agro-svet.cz`** using a Cloudflare Worker with the
**Streamable HTTP** transport is planned but not implemented here. This v1 is
stdio-only and intended for local/desktop MCP clients.
