import { createClient } from '@supabase/supabase-js';
import { env } from 'cloudflare:workers';

export function createServerClient() {
  const url = (env as any).SUPABASE_URL;
  const serviceKey = (env as any).SUPABASE_SERVICE_KEY;
  if (!url || !serviceKey) {
    const keys = Object.keys(env as any).join(',');
    throw new Error(`Missing SUPABASE_URL or SUPABASE_SERVICE_KEY. env keys: [${keys}]`);
  }
  return createClient(url, serviceKey);
}

export function createAnonClient() {
  const url = (env as any).SUPABASE_URL;
  const anonKey = (env as any).SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  return createClient(url, anonKey);
}

export function getPublicSupabaseConfig() {
  return {
    url: (env as any).PUBLIC_SUPABASE_URL,
    anonKey: (env as any).PUBLIC_SUPABASE_ANON_KEY,
  };
}
