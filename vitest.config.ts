import { defineConfig } from 'vitest/config';
import yaml from '@modyfi/vite-plugin-yaml';

export default defineConfig({
  plugins: [yaml()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
});
