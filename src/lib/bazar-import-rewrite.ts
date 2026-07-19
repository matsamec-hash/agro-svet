export interface RewriteResult {
  title: string;
  description: string;
}

/** Funkce, která pošle prompt do LLM a vrátí textovou odpověď. Injektovatelné kvůli testům. */
export type LlmClient = (prompt: string) => Promise<string>;

const MODEL = 'claude-haiku-4-5-20251001';

export function buildRewritePrompt(title: string, description: string): string {
  return [
    'Jsi copywriter pro český zemědělský inzertní portál. Přepiš inzerát tak, aby byl',
    'originální (ne kopie), čtivý a SEO-laděný. Zachovej VŠECHNA fakta beze změny',
    '(cena, značka, model, rok, motohodiny, rozměry, kontakt). Nevymýšlej údaje.',
    'Vrať POUZE JSON: {"title": "...", "description": "..."} bez dalšího textu.',
    '',
    `Původní název: ${title}`,
    `Původní popis: ${description}`,
  ].join('\n');
}

export function parseRewriteResponse(raw: string): RewriteResult | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const obj = JSON.parse(match[0]);
    if (typeof obj.title === 'string' && typeof obj.description === 'string') {
      return { title: obj.title.trim(), description: obj.description.trim() };
    }
    return null;
  } catch {
    return null;
  }
}

/** Default LLM klient — Anthropic Messages API přes fetch (žádná SDK závislost). */
async function anthropicClient(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}`);
  const data = await res.json();
  return data?.content?.[0]?.text ?? '';
}

export async function rewriteListing(opts: {
  title: string;
  description: string;
  apiKey: string;
  llm?: LlmClient;
}): Promise<RewriteResult> {
  const original: RewriteResult = { title: opts.title, description: opts.description };
  if (!opts.apiKey) return original;
  const llm = opts.llm ?? ((p: string) => anthropicClient(opts.apiKey, p));
  try {
    const raw = await llm(buildRewritePrompt(opts.title, opts.description));
    return parseRewriteResponse(raw) ?? original;
  } catch {
    return original;
  }
}
