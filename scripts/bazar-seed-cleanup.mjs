import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

const { data: stale, error } = await supabase
  .from('bazar_seed_prospects')
  .select('id')
  .in('status', ['draft', 'sent', 'opened'])
  .lt('created_at', cutoff);
if (error) { console.error(error); process.exit(1); }

for (const p of stale ?? []) {
  const { data: imgs } = await supabase
    .from('bazar_images')
    .select('storage_path, bazar_listings!inner(seed_prospect_id)')
    .eq('bazar_listings.seed_prospect_id', p.id);
  const paths = (imgs ?? []).map((i) => i.storage_path);
  if (paths.length) await supabase.storage.from('bazar-images').remove(paths);
  await supabase.from('bazar_seed_prospects').delete().eq('id', p.id); // CASCADE smaže listings
}
console.log(`Smazáno ${stale?.length ?? 0} nepotvrzených prospektů.`);
