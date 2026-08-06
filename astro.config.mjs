// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import yaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  site: 'https://agro-svet.cz',
  trailingSlash: 'always',
  // Astro vestavěný checkOrigin porovnává Origin (https://) proti request.url,
  // jehož schéma je za TLS-terminujícím reverzním proxy (Cloudflare→Traefik→Node)
  // jen `http://` — Node adapter nečte X-Forwarded-Proto. Tím by KAŽDÝ same-origin
  // form/multipart POST padal na 403 "Cross-site POST forbidden" (rozbitý email
  // login, registrace, foto upload, akce). Vypínáme vestavěnou kontrolu a děláme
  // vlastní CSRF check v middleware.ts (host-based, schéma-necitlivý). NEvypínat
  // bez té middleware kontroly.
  security: { checkOrigin: false },
  // 301 redirecty pro legacy URL (Ahrefs 404 report 2026-08-06). Cíle ověřeny 200 na produ.
  // /srovnani/top/* byl starý název žebříčků → dnes /zebricky/* (slugy 1:1).
  redirects: {
    '/srovnani/top/': { status: 301, destination: '/zebricky/' },
    '/srovnani/top/[slug]/': '/zebricky/[slug]/',
    '/agro-bazar/': { status: 301, destination: '/bazar/' },
    '/sklizeci-mlaticky/': { status: 301, destination: '/stroje/kombajny/' },
    // staré cs subkategorie strojů (přejmenované) → kategorie zemědělských strojů
    '/stroje/seti/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
    '/stroje/manipulace/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
    '/stroje/sklizen-picnin/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
    '/stroje/staj-chov/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
    '/stroje/komunal-les/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
    '/stroje/doprava/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
    '/stroje/hnojeni/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
    '/stroje/teleskopy-rotacni/': { status: 301, destination: '/stroje/zemedelske-stroje/' },
  },
  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'sk', 'uk', 'pl'],
    routing: { prefixDefaultLocale: false },
  },
  // Inline všechny (malé) stylesheety do HTML — odstraní render-blocking CSS
  // requesty (~467ms na 4G dle Lighthouse). Celkový CSS je ~15 KB, takže
  // navýšení HTML je zanedbatelné oproti ušetřeným round-tripům k LCP.
  build: { inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
});
