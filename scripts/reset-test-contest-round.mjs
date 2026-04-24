#!/usr/bin/env node
// Smaže všechny entries + uploadnuté fotky testovacího kola fotosoutěže
// a přepne kolo zpět na upload_open. Spustit:
//   SUPABASE_SERVICE_KEY=... node scripts/reset-test-contest-round.mjs

const SUPABASE_URL = 'https://obhypfuzmknvmknskdwh.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const ROUND_SLUG = process.env.ROUND_SLUG ?? 'test-2026-04';
const BUCKET = 'contest-photos';

if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY env var');
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
};

async function rpc(path, init = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init.method ?? 'GET'} ${path} -> ${res.status}: ${body}`);
  }
  return res;
}

// 1) Najdi kolo
const roundRes = await rpc(
  `/rest/v1/contest_rounds?slug=eq.${encodeURIComponent(ROUND_SLUG)}&select=id,status,title`
);
const rounds = await roundRes.json();
if (rounds.length === 0) {
  console.error(`Kolo se slugem "${ROUND_SLUG}" nenalezeno.`);
  process.exit(1);
}
const round = rounds[0];
console.log(`Kolo: "${round.title}" (${round.id}), status=${round.status}`);

// 2) Stáhni seznam entries + photo_path
const entriesRes = await rpc(
  `/rest/v1/contest_entries?round_id=eq.${round.id}&select=id,photo_path,title`
);
const entries = await entriesRes.json();
console.log(`Nalezeno ${entries.length} příspěvků.`);

// 3) Smaž fotky z Storage
const photoPaths = entries.map((e) => e.photo_path).filter(Boolean);
if (photoPaths.length > 0) {
  console.log(`Mažu ${photoPaths.length} souborů z bucketu "${BUCKET}"…`);
  const delRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({ prefixes: photoPaths }),
  });
  if (!delRes.ok) {
    const body = await delRes.text();
    console.warn(`Varování: storage delete vrátil ${delRes.status}: ${body}`);
  } else {
    const del = await delRes.json();
    console.log(`Storage smazáno: ${Array.isArray(del) ? del.length : '?'} objektů.`);
  }
}

// 4) Smaž entries (votes se smaží kaskádou přes FK ON DELETE CASCADE)
await rpc(`/rest/v1/contest_entries?round_id=eq.${round.id}`, {
  method: 'DELETE',
  headers: { Prefer: 'return=minimal' },
});
console.log(`Entries smazány.`);

// 5) Smaž voters (aby šlo znova hlasovat ze stejného emailu)
await rpc(`/rest/v1/contest_voters?round_id=eq.${round.id}`, {
  method: 'DELETE',
  headers: { Prefer: 'return=minimal' },
});
console.log(`Voters smazáni.`);

// 6) Přepni status na upload_open
await rpc(`/rest/v1/contest_rounds?id=eq.${round.id}`, {
  method: 'PATCH',
  headers: { Prefer: 'return=minimal' },
  body: JSON.stringify({ status: 'upload_open' }),
});
console.log(`Kolo přepnuto na status "upload_open".`);

console.log('\nHotovo.');
