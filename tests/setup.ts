// Vitest global setup.
// Provide `import.meta.env` fallbacks so lib modules can run under test.
Object.assign(import.meta.env, {
  PUBLIC_SUPABASE_URL: 'http://localhost:54321',
  PUBLIC_SUPABASE_ANON_KEY: 'test-anon',
  SUPABASE_SERVICE_KEY: 'test-service',
});
