// Post-build: set up _worker.js directory for Cloudflare Pages SSR
// Pages needs _worker.js/ in the static output dir to handle server routes

import { cpSync, mkdirSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const serverDir = 'dist/server';
const clientDir = 'dist/client';
const workerDir = join(clientDir, '_worker.js');

// Copy server files to _worker.js directory
mkdirSync(workerDir, { recursive: true });
cpSync(serverDir, workerDir, { recursive: true });

// Create index.js entry point that re-exports the server entry
writeFileSync(
  join(workerDir, 'index.js'),
  `import entry from './entry.mjs';\nexport default entry;\n`
);

// Create _routes.json — route SSR paths through the worker, serve static files directly
const staticExcludes = ['/', '/_astro/*', '/favicon.ico', '/favicon.svg', '/admin/*'];

// Find all prerendered HTML dirs to exclude from worker
function findHtmlDirs(dir, prefix = '') {
  const excludes = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('_') || entry.name === 'admin') continue;
      if (entry.isDirectory()) {
        const subPath = prefix + '/' + entry.name;
        excludes.push(subPath + '/*');
        // Don't recurse deeper — top-level exclusion covers subdirs
      }
    }
  } catch {}
  return excludes;
}

// Exclude prerendered routes (they're static HTML)
const prerenderedExcludes = findHtmlDirs(clientDir);

writeFileSync(
  join(clientDir, '_routes.json'),
  JSON.stringify({
    version: 1,
    include: ['/*'],
    exclude: [...staticExcludes, ...prerenderedExcludes],
  }, null, 2)
);

console.log('Pages SSR setup complete');
console.log('_routes.json excludes:', [...staticExcludes, ...prerenderedExcludes]);
