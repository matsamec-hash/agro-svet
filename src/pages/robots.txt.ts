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

# NOTE (2026-09-08): an older comment here claimed AI training crawlers were
# blocked at Cloudflare's edge. They were not — AI Crawl Control showed 104k of
# 105k AI crawler requests ALLOWED in 24h (GPTBot 68.2k, PerplexityBot 21.3k,
# ClaudeBot 7.2k; Googlebot only 1.2k for comparison). Nothing is blocked, and
# that is deliberate: the point is to be a cited source, and blocking training
# crawlers costs presence in the models without stopping citation traffic.
# If you ever DO want to block them, do it in Cloudflare AI Crawl Control —
# a Disallow here is a request, not a block, and training crawlers ignore it.

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
