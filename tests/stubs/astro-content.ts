// Test stub for Astro's virtual `astro:content` + `astro/loaders` modules.
// Lets vitest import `src/content.config.ts` to assert collection registration
// without the full Astro runtime. `defineCollection`/`glob` are inert here —
// we only inspect the returned `collections` object shape.
import { z } from 'astro/zod';

export { z };
export const defineCollection = <T>(config: T): T => config;
export const reference = (collection: string) => z.string().describe(collection);

export const glob = (opts: { pattern: string; base: string }) => ({
  name: 'glob-stub',
  ...opts,
});
