import { createClient } from '@supabase/supabase-js';
import { getEnvVar } from './env';

export function createServerClient() {
  const url = getEnvVar('SUPABASE_URL');
  const serviceKey = getEnvVar('SUPABASE_SERVICE_KEY');
  if (!url || !serviceKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  return createClient(url, serviceKey);
}

export function createAnonClient() {
  const url = getEnvVar('SUPABASE_URL');
  const anonKey = getEnvVar('SUPABASE_ANON_KEY');
  if (!url || !anonKey) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  return createClient(url, anonKey);
}

export function getPublicSupabaseConfig() {
  return {
    url: getEnvVar('PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('PUBLIC_SUPABASE_ANON_KEY'),
  };
}
