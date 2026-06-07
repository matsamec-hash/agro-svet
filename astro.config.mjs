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
