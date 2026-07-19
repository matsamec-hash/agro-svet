import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import yaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  plugins: [yaml()],
  resolve: {
    alias: {
      // Stub Astro's virtual modules so content.config.ts is importable in tests.
      'astro:content': fileURLToPath(new URL('./tests/stubs/astro-content.ts', import.meta.url)),
      'astro/loaders': fileURLToPath(new URL('./tests/stubs/astro-content.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
  },
});
