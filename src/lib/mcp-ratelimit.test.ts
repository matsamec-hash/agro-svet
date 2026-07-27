import { describe, it, expect } from 'vitest';
import { checkMcpRateLimit, clientIpFrom, MCP_MAX_REQUESTS, MCP_WINDOW_MS } from './mcp-ratelimit';

describe('checkMcpRateLimit', () => {
  it('pustí prvních MAX požadavků, MAX+1 zablokuje', () => {
    const ip = 'test-a';
    const t0 = 1_000_000;
    for (let i = 0; i < MCP_MAX_REQUESTS; i++) {
      expect(checkMcpRateLimit(ip, t0).limited).toBe(false);
    }
    const res = checkMcpRateLimit(ip, t0);
    expect(res.limited).toBe(true);
    expect(res.retryAfter).toBeGreaterThan(0);
  });

  it('po vypršení okna zase pustí', () => {
    const ip = 'test-b';
    const t0 = 2_000_000;
    for (let i = 0; i < MCP_MAX_REQUESTS; i++) checkMcpRateLimit(ip, t0);
    expect(checkMcpRateLimit(ip, t0).limited).toBe(true);
    // o okno + 1 ms později je historie prošlá
    expect(checkMcpRateLimit(ip, t0 + MCP_WINDOW_MS + 1).limited).toBe(false);
  });

  it('limituje per-IP nezávisle', () => {
    const t0 = 3_000_000;
    for (let i = 0; i < MCP_MAX_REQUESTS; i++) checkMcpRateLimit('ip-x', t0);
    expect(checkMcpRateLimit('ip-x', t0).limited).toBe(true);
    expect(checkMcpRateLimit('ip-y', t0).limited).toBe(false);
  });
});

describe('clientIpFrom', () => {
  const mk = (h: Record<string, string>) => new Request('https://x/', { headers: h });
  it('preferuje cf-connecting-ip', () => {
    expect(clientIpFrom(mk({ 'cf-connecting-ip': '1.2.3.4', 'x-forwarded-for': '9.9.9.9' }))).toBe('1.2.3.4');
  });
  it('spadne na první x-forwarded-for', () => {
    expect(clientIpFrom(mk({ 'x-forwarded-for': '5.6.7.8, 9.9.9.9' }))).toBe('5.6.7.8');
  });
  it('fallback když nic', () => {
    expect(clientIpFrom(mk({}), 'fb')).toBe('fb');
    expect(clientIpFrom(mk({}))).toBe('unknown');
  });
});
