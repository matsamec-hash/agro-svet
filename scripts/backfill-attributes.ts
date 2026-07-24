/**
 * Backfill `attributes` u existujících inzerátů. Nad každým spustí extrakci
 * z title+description (structureListing = AI + fallback) a mergne do attributes.
 *
 * ⚠️ Vyžaduje nasazenou migraci 022 (sloupec attributes) v cílové DB.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (cílová DB), OPENAI_API_KEY (volitelné; bez něj jen fallback).
 * Spuštění:
 *   node_modules/.bin/tsx scripts/backfill-attributes.ts [--dry-run] [--force] [--limit N] [--no-ai]
 */
import { createServerClient } from '../src/lib/supabase';
import { getEnvVar } from '../src/lib/env';
import { suggestCategory, matchBrand } from '../src/lib/bazar-import-category';
import { structureListing } from '../src/lib/bazar-import-structure';
import { attributesForCategory } from '../src/lib/bazar-attributes';
import { mergeBackfillAttributes } from '../src/lib/bazar-backfill';

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const force = args.has('--force');
  const noAi = args.has('--no-ai');
  const limArg = process.argv.find((a) => a.startsWith('--limit'));
  const limit = limArg ? parseInt(process.argv[process.argv.indexOf(limArg) + 1] ?? '0', 10) : 0;

  const supabase = createServerClient();
  const apiKey = noAi ? '' : (getEnvVar('OPENAI_API_KEY') ?? '');
  console.log(`Backfill atributů — AI: ${apiKey ? 'ANO' : 'NE (fallback)'}${dryRun ? ' · DRY-RUN' : ''}${force ? ' · FORCE' : ''}`);

  const PAGE = 200;
  let from = 0;
  let processed = 0, updated = 0, skipped = 0;
  for (;;) {
    const { data, error } = await supabase
      .from('bazar_listings')
      .select('id, title, description, category, attributes')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`select: ${error.message}`);
    if (!data || data.length === 0) break;

    for (const row of data as Array<{ id: string; title: string; description: string; category: string; attributes: Record<string, unknown> | null }>) {
      if (limit && processed >= limit) { console.log(`\nDosažen --limit ${limit}.`); printSummary(); return; }
      processed++;
      const cat = row.category || suggestCategory(row.title ?? '', row.description ?? '');
      const structured = await structureListing({
        title: row.title ?? '',
        description: row.description ?? '',
        apiKey,
        fallback: { brand: matchBrand(row.title ?? '', row.description ?? ''), category: cat, hours: null },
        categoryAttributes: attributesForCategory(cat),
      });
      const next = mergeBackfillAttributes(row.attributes, structured.attributes, force);
      if (!next) { skipped++; continue; }
      if (dryRun) {
        console.log(`  [dry] ${row.id} ${row.title?.slice(0, 40)} → ${JSON.stringify(next)}`);
        updated++;
        continue;
      }
      const { error: upErr } = await supabase.from('bazar_listings').update({ attributes: next }).eq('id', row.id);
      if (upErr) { console.log(`  ✗ ${row.id}: ${upErr.message}`); skipped++; continue; }
      updated++;
      console.log(`  ✓ ${row.id} ${row.title?.slice(0, 40)} → ${JSON.stringify(next)}`);
      if (apiKey) await new Promise((r) => setTimeout(r, 300)); // šetrně k OpenAI
    }
    from += PAGE;
  }
  printSummary();

  function printSummary() {
    console.log(`\nHotovo: zpracováno ${processed}, ${dryRun ? 'k zápisu' : 'zapsáno'} ${updated}, přeskočeno ${skipped}.`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
