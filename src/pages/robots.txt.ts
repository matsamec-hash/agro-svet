import type { APIRoute } from 'astro';

const GATE_ACTIVE_BODY = `User-agent: *
Disallow: /
`;

const NORMAL_BODY = `User-agent: *
Allow: /
Disallow: /admin/
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

Sitemap: https://agro-svet.cz/sitemap.xml
Sitemap: https://agro-svet.cz/news-sitemap.xml
`;

export const GET: APIRoute = ({ locals }) => {
  const gated = (locals as { siteGateActive?: boolean }).siteGateActive === true;
  return new Response(gated ? GATE_ACTIVE_BODY : NORMAL_BODY, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
