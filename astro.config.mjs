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
  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'sk', 'uk'],
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
