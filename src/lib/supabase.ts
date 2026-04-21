import { createClient } from '@supabase/supabase-js';

type Env = Record<string, string | undefined>;

function readEnv(env: Env | undefined, key: string): string | undefined {
  return env?.[key] ?? (import.meta.env as any)?.[key] ?? (globalThis as any)?.process?.env?.[key];
}

export function createServerClient(env?: Env) {
  const url = readEnv(env, 'SUPABASE_URL');
  const serviceKey = readEnv(env, 'SUPABASE_SERVICE_KEY');
  if (!url || !serviceKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  return createClient(url, serviceKey);
}

export function createAnonClient(env?: Env) {
  const url = readEnv(env, 'SUPABASE_URL');
  const anonKey = readEnv(env, 'SUPABASE_ANON_KEY');
  if (!url || !anonKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  return createClient(url, anonKey);
}
