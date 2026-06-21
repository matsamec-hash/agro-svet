import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "./server.js";

async function connectedClient() {
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  const server = createServer();
  const client = new Client({ name: "smoke", version: "0.0.0" });
  await Promise.all([server.connect(serverT), client.connect(clientT)]);
  return { client, server };
}

describe("MCP server end-to-end (in-memory transport)", () => {
  it("lists all five tools", async () => {
    const { client } = await connectedClient();
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        "compare_countries",
        "get_commodity_prices",
        "list_datasets",
        "search_crop_varieties",
        "search_machinery",
      ].sort(),
    );
  });

  it("tools/call get_commodity_prices for Pšenice returns real data", async () => {
    const { client } = await connectedClient();
    const res = await client.callTool({
      name: "get_commodity_prices",
      arguments: { commodity: "Pšenice", from: "2024", to: "2024" },
    });
    expect(res.isError).toBeFalsy();
    const text = (res.content as { type: string; text: string }[])[0].text;
    const data = JSON.parse(text);
    expect(data.commodity).toBe("Pšenice");
    expect(data.unit).toBe("Kč/t");
    expect(data.data.length).toBe(12);
    expect(data.data.every((p: { label: string }) => p.label.includes("2024"))).toBe(
      true,
    );
  });

  it("tools/call compare_countries returns sourced values", async () => {
    const { client } = await connectedClient();
    const res = await client.callTool({
      name: "compare_countries",
      arguments: { indicator: "wheat_yield", countries: ["cesko", "nemecko"] },
    });
    const data = JSON.parse(
      (res.content as { text: string }[])[0].text,
    );
    expect(data.results.length).toBe(2);
    expect(data.results[0].sourceUrl).toMatch(/^https?:\/\//);
  });
});
