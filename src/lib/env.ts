// Read a runtime env var with fallback so server-side code works in
// both Cloudflare Workers (production / wrangler dev / Astro Cloudflare
// adapter with platformProxy) and plain Astro dev (which reads .env via
// Vite's import.meta.env).
//
// Production: cloudflare:workers env from wrangler.toml [vars] + Worker secrets.
// Dev (`npm run dev`): import.meta.env.* loaded from .env at startup.
import { env as workerEnv } from 'cloudflare:workers';

export function getEnvVar(key: string): string | undefined {
  const fromWorker = (workerEnv as Record<string, unknown> | undefined)?.[key];
  if (typeof fromWorker === 'string' && fromWorker.length > 0) return fromWorker;
  const fromVite = (import.meta.env as Record<string, unknown>)[key];
  if (typeof fromVite === 'string' && fromVite.length > 0) return fromVite;
  return undefined;
}
