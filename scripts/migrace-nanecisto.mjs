#!/usr/bin/env node
// Zkouška migrace NANEČISTO: vypíše SQL, které v jedné transakci
//   1) pustí testy PŘED migrací (ukáže, co je dnes špatně),
//   2) aplikuje migraci (její begin/commit se odstraní, jinak by commit potvrdil zkoušku),
//   3) pustí tytéž testy PO migraci,
//   4) vše vrátí ROLLBACKem — v databázi nezůstane nic.
//
// Použití (jako supabase_admin, protože tabulky vlastní i supabase_admin):
//   node scripts/migrace-nanecisto.mjs supabase/migrations/029_anon_minimalni_prava.sql \
//        supabase/tests/029_anon_minimalni_prava.test.sql \
//     | ssh root@187.124.12.96 'docker exec -i supabase-db-<kontejner> psql -U supabase_admin -d postgres'
//
// Každý řádek výstupu: FAZE|OK/FAIL|role|co se ověřuje|čekáno|dostal
// Po migraci nesmí být žádné FAIL. Před migrací FAIL být MAJÍ (test tak dokazuje, že funguje).
import { readFileSync } from 'node:fs';

const [, , migracePath, testPath] = process.argv;
if (!migracePath || !testPath) {
  console.error('Použití: node scripts/migrace-nanecisto.mjs <migrace.sql> <test.sql>');
  process.exit(2);
}

const migrace = readFileSync(migracePath, 'utf8')
  .split('\n')
  .filter((radek) => !/^\s*(begin|commit);\s*$/i.test(radek))
  .join('\n');
const test = readFileSync(testPath, 'utf8');

const hlavicka = String.raw`\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned
begin;
set local lock_timeout = '3s';

-- Porovná, jestli dotaz pod aktuální rolí projde ('ok') nebo spadne ('ERR <sqlstate>').
create function pg_temp.expect(faze text, kdo text, nazev text, q text, cekano text) returns text
language plpgsql as $f$
declare got text;
begin
  begin
    execute q;
    got := 'ok';
  exception when others then
    got := 'ERR ' || sqlstate;
  end;
  return faze || '|' || case when got = cekano then 'OK  ' else 'FAIL' end || '|' || kdo || '|' || nazev
    || '|čekáno ' || cekano || '|dostal ' || got;
end $f$;

-- Porovná textový výsledek dotazu (ověřování práv a invariantů, nic se nezapisuje).
create function pg_temp.expect_val(faze text, nazev text, q text, cekano text) returns text
language plpgsql as $f$
declare got text;
begin
  execute q into got;
  return faze || '|' || case when got is not distinct from cekano then 'OK  ' else 'FAIL' end || '|system|' || nazev
    || '|čekáno ' || coalesce(cekano, 'NULL') || '|dostal ' || coalesce(got, 'NULL');
end $f$;

grant execute on function pg_temp.expect(text, text, text, text, text) to anon, authenticated, service_role;
`;

process.stdout.write(
  [hlavicka, '\\set faze PRED', test, migrace, '\\set faze PO', test, 'rollback;', ''].join('\n'),
);
