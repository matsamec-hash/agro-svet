import { getViteConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// Vykreslovací sada — viz `tests/render/photo-credits-html.test.ts`.
// `getViteConfig` přinese astro plugin, takže `.astro` komponenty jdou
// naimportovat a vyrenderovat přes Astro Container.
export default getViteConfig({
  resolve: {
    alias: {
      'astro:content': fileURLToPath(new URL('./tests/stubs/astro-content.ts', import.meta.url)),
    },
  },
  test: {
    name: 'render',
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/render/**/*.test.ts'],
  },
});
