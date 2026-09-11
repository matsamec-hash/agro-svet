import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import yaml from '@modyfi/vite-plugin-yaml';

// Dva projekty, jeden příkaz.
//
// `unit` je původní sada — rychlá, bez Astro. `render` potřebuje astro vite
// plugin (jinak se `.astro` soubory nedají importovat) a vykresluje stránky
// přes Astro Container, aby šlo hlídat i to, co je opravdu v HTML.
// ‼️ Musí být oba v jednom kořenovém configu: kdyby render sada visela na
// vlastním `--config`, holé `vitest run` by ji tiše přeskočilo — a přesně tu
// díru tyhle testy zalepují.
export default defineConfig({
  test: {
    projects: [
      {
        plugins: [yaml()],
        resolve: {
          alias: {
            // Stub Astro's virtual modules so content.config.ts is importable in tests.
            'astro:content': fileURLToPath(new URL('./tests/stubs/astro-content.ts', import.meta.url)),
            'astro/loaders': fileURLToPath(new URL('./tests/stubs/astro-content.ts', import.meta.url)),
          },
        },
        test: {
          name: 'unit',
          environment: 'happy-dom',
          setupFiles: ['./tests/setup.ts'],
          include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
          exclude: ['tests/render/**'],
        },
      },
      './vitest.render.config.ts',
    ],
  },
});
