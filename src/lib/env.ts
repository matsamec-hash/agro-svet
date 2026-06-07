// Read a runtime env var with fallback so server-side code works in both
// the Node origin (production on VPS via @astrojs/node — process.env) and
// plain Astro dev (which reads .env via Vite's import.meta.env).
export function getEnvVar(key: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[key] : undefined;
  if (typeof fromProcess === 'string' && fromProcess.length > 0) return fromProcess;
  const fromVite = (import.meta.env as Record<string, unknown>)[key];
  if (typeof fromVite === 'string' && fromVite.length > 0) return fromVite;
  return undefined;
}
