/**
 * Shared tool registration for the agro-svet MCP server.
 *
 * The tool wiring (names, descriptions, zod input schemas, handlers) lives here
 * exactly ONCE and is reused by both transports:
 *   - the stdio server (`server.ts`), which loads data from disk via `data.ts`;
 *   - the remote Streamable-HTTP Astro route (`src/pages/api/mcp.ts`), which
 *     injects build-time-imported data (Cloudflare Workers have no filesystem).
 *
 * Every tool handler reads from the injected `Datasets` bundle and calls the
 * SAME pure query functions, so there is no duplicated query logic.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import type {
  CommoditiesFile,
  CountryProfile,
  Variety,
  MachineryBrand,
} from "./data.js";
import { getCommodityPrices, listCommodityNames } from "./tools/commodities.js";
import { compareCountries, listIndicators } from "./tools/countries.js";
import { searchCropVarieties, listCropSlugs } from "./tools/varieties.js";
import { searchMachinery, listMachineryFacets } from "./tools/machinery.js";

/** The parsed, in-memory datasets the tools query against. */
export interface Datasets {
  commodities: CommoditiesFile;
  countries: CountryProfile[];
  varieties: Variety[];
  brands: MachineryBrand[];
}

const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});
const fail = (e: unknown) => ({
  content: [
    { type: "text" as const, text: e instanceof Error ? e.message : String(e) },
  ],
  isError: true,
});

export const SERVER_INFO = {
  name: "agro-svet-mcp",
  version: "0.1.0",
} as const;

/**
 * Register the five read-only tools on an McpServer, querying the injected data.
 */
export function registerTools(server: McpServer, data: Datasets): void {
  // ---- get_commodity_prices ----
  server.registerTool(
    "get_commodity_prices",
    {
      title: "Get commodity prices",
      description:
        "Monthly Czech agricultural commodity price series (since 2010). " +
        "Valid commodities: Pšenice, Ječmen, Řepka, Kukuřice, Mléko, Vepřové, " +
        "Hovězí, Vejce, Mák (units like Kč/t). Returns the filtered series plus, " +
        "when available, a 5-year rolling average. Bounds accept a year ('2020') " +
        "or a Czech month label ('Led 2020'); only the year is used for filtering.",
      inputSchema: {
        commodity: z
          .string()
          .describe("Commodity name, e.g. 'Pšenice' (wheat). Case-insensitive."),
        from: z
          .string()
          .optional()
          .describe("Inclusive lower year bound, e.g. '2015'."),
        to: z
          .string()
          .optional()
          .describe("Inclusive upper year bound, e.g. '2024'."),
      },
    },
    async (args) => {
      try {
        return json(getCommodityPrices(data.commodities, args));
      } catch (e) {
        return fail(e);
      }
    },
  );

  // ---- compare_countries ----
  server.registerTool(
    "compare_countries",
    {
      title: "Compare countries by indicator",
      description:
        "Compare the latest value of one agriculture indicator across countries " +
        "(33 European countries + USA + Ukraine). Each result includes value, " +
        "unit, reference period and the cited source + source URL (Eurostat / " +
        "World Bank). Sorted by value descending. Indicator keys include " +
        "wheat_yield, maize_yield, barley_yield, rapeseed_yield, cereal_yield " +
        "(t/ha), cattle_count, pigs_count, ag_land, arable_land, " +
        "ag_value_added_gdp, ag_employment, fert_use, ag_output_value, " +
        "farm_count, organic_share.",
      inputSchema: {
        indicator: z.string().describe("Indicator key, e.g. 'wheat_yield'."),
        countries: z
          .array(z.string())
          .optional()
          .describe(
            "Country slugs to limit to, e.g. ['cesko','nemecko']. Default: all.",
          ),
      },
    },
    async (args) => {
      try {
        return json(compareCountries(data.countries, args));
      } catch (e) {
        return fail(e);
      }
    },
  );

  // ---- search_crop_varieties ----
  server.registerTool(
    "search_crop_varieties",
    {
      title: "Search crop varieties",
      description:
        "Search the registered crop variety (odrůdy) registry (~3,476 records " +
        "across 18 crops, source ÚKZÚZ). Crop slugs include psenice-ozima, " +
        "psenice-jarni, jecmen-ozimy, jecmen-jarni, repka-ozima, kukurice, " +
        "brambory, cukrovka, soja, slunecnice, mak, oves, zito, hrach, etc. " +
        "'query' matches variety name or maintainer (udrzovatel) as a " +
        "case-insensitive substring. Default limit 50, max 200. Returns total " +
        "match count and the page of results.",
      inputSchema: {
        crop: z
          .string()
          .optional()
          .describe("Crop slug, e.g. 'brambory' (potatoes)."),
        year_from: z
          .number()
          .int()
          .optional()
          .describe("Min registration year (rok_registrace)."),
        year_to: z
          .number()
          .int()
          .optional()
          .describe("Max registration year (rok_registrace)."),
        query: z
          .string()
          .optional()
          .describe("Substring matched against name + maintainer."),
        limit: z
          .number()
          .int()
          .optional()
          .describe("Max results (default 50, capped at 200)."),
      },
    },
    async (args) => {
      try {
        return json(searchCropVarieties(data.varieties, args));
      } catch (e) {
        return fail(e);
      }
    },
  );

  // ---- search_machinery ----
  server.registerTool(
    "search_machinery",
    {
      title: "Search agricultural machinery",
      description:
        "Search agricultural machinery models (~2,092 models across 22 brands: " +
        "John Deere, Fendt, Claas, Case IH, New Holland, Zetor, Kubota, etc.). " +
        "Filters: brand (slug/name substring), category (key/label substring), " +
        "power_min / power_max (horsepower, hp), and year (model in production " +
        "that year). Returns matching models with brand, category and series " +
        "context. Default limit 50, max 200.",
      inputSchema: {
        brand: z
          .string()
          .optional()
          .describe("Brand slug or name substring, e.g. 'fendt'."),
        category: z
          .string()
          .optional()
          .describe("Category key or label substring, e.g. 'traktory'."),
        power_min: z
          .number()
          .optional()
          .describe("Minimum engine power in horsepower (hp)."),
        power_max: z
          .number()
          .optional()
          .describe("Maximum engine power in horsepower (hp)."),
        year: z
          .number()
          .int()
          .optional()
          .describe("Model in production during this calendar year."),
        limit: z
          .number()
          .int()
          .optional()
          .describe("Max results (default 50, capped at 200)."),
      },
    },
    async (args) => {
      try {
        return json(searchMachinery(data.brands, args));
      } catch (e) {
        return fail(e);
      }
    },
  );

  // ---- list_datasets ----
  server.registerTool(
    "list_datasets",
    {
      title: "List available datasets",
      description:
        "Discovery catalog: lists each public dataset exposed by this server " +
        "with a description, record count, the tool that queries it, and the " +
        "valid keys/slugs to use as filters.",
      inputSchema: {},
    },
    async () => {
      try {
        const { commodities, countries, varieties, brands } = data;
        const facets = listMachineryFacets(brands);
        return json({
          generated: commodities.generated,
          datasets: [
            {
              name: "commodities",
              description:
                "Monthly Czech agricultural commodity prices since 2010.",
              tool: "get_commodity_prices",
              recordCount: commodities.commodityFull.length,
              keys: listCommodityNames(commodities),
            },
            {
              name: "countries",
              description:
                "Per-country agriculture indicators (Eurostat / World Bank).",
              tool: "compare_countries",
              recordCount: countries.length,
              countrySlugs: countries.map((c) => c.slug),
              indicatorKeys: listIndicators(countries).map((i) => ({
                key: i.key,
                label: i.label,
                unit: i.unit,
              })),
            },
            {
              name: "crop_varieties",
              description: "Registered crop variety registry (ÚKZÚZ).",
              tool: "search_crop_varieties",
              recordCount: varieties.length,
              cropSlugs: listCropSlugs(varieties),
            },
            {
              name: "machinery",
              description:
                "Agricultural machinery brands, series and models.",
              tool: "search_machinery",
              recordCount: brands.length + " brands",
              brandSlugs: facets.brands.map((b) => b.slug),
              categoryKeys: facets.categories,
            },
          ],
        });
      } catch (e) {
        return fail(e);
      }
    },
  );
}
