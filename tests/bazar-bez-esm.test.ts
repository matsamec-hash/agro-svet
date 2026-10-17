import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

// Přihlášení do bazaru dřív stahovalo supabase-js z esm.sh — prohlížeč tak
// posílal IP návštěvníka cizímu serveru bez souhlasu. Teď je knihovna z npm
// a Vite ji zbundluje do /_astro/ (stejný původ jako web).

const PAGES = [
  'src/pages/bazar/prihlaseni.astro',
  'src/pages/bazar/registrace.astro',
  'src/pages/bazar/auth/callback.astro',
];

describe('supabase-js z npm, ne z esm.sh', () => {
  it.each(PAGES.map((p) => [p]))('%s nenačítá nic z esm.sh a importuje @supabase/supabase-js', (rel) => {
    const src = readFileSync(rel, 'utf8');
    expect(src).not.toContain('esm.sh');
    expect(src).toMatch(/from '@supabase\/supabase-js'/);
    // define:vars (i jakýkoli jiný atribut) udělá ze skriptu is:inline → Vite
    // by import nezbundloval a prohlížeč by holý specifikátor nenašel.
    expect(src).not.toMatch(/<script[^>]*define:vars/);
  });
});
