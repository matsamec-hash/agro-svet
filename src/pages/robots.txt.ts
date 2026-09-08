import type { APIRoute } from 'astro';

const GATE_ACTIVE_BODY = `User-agent: *
Disallow: /
`;

const NORMAL_BODY = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
# Výjimka: MCP server je veřejné datové rozhraní, ne interní API. Dokumentace
# k němu je na /mcp/, endpoint tady — ať ho crawler smí ověřit.
Allow: /api/mcp/
Disallow: /bazar/moje/
Disallow: /bazar/prihlaseni
Disallow: /bazar/registrace
Disallow: /bazar/odhlaseni
Disallow: /bazar/auth/
Disallow: /bazar/profil
Disallow: /fotosoutez/moje/
Disallow: /fotosoutez/nahrat
Disallow: /hledat
Disallow: /unlock
Disallow: /kat/

# AI search citation bots — allowed (real-time search, not training).
# These crawl on-demand to answer user queries and cite source URLs.
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# AI training crawlers are blocked at Cloudflare's edge (GPTBot, ClaudeBot,
# CCBot, Bytespider, Google-Extended, meta-externalagent, …).

# Machine-readable data: /llms.txt (content map), /mcp/ (MCP server docs),
# /data/licence/ (CC BY 4.0 — cite with a link).

# /sitemap.xml je sitemap INDEX; dílčí sitemapy jsou
# /sitemap/<sekce>.xml (stroje, plodiny, chov, bazar, novinky, ostatni, sk, uk, pl, de).
Sitemap: https://agro-svet.cz/sitemap.xml
Sitemap: https://agro-svet.cz/news-sitemap.xml
`;

export const GET: APIRoute = ({ locals }) => {
  const gated = (locals as { siteGateActive?: boolean }).siteGateActive === true;
  return new Response(gated ? GATE_ACTIVE_BODY : NORMAL_BODY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
