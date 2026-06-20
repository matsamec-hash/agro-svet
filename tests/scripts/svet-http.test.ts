import { describe, it, expect, vi } from 'vitest';
import { fetchJsonRetry } from '../../scripts/lib/svet/http.mjs';

describe('fetchJsonRetry', () => {
  it('opakuje při neúspěchu a nakonec uspěje', async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 400 })
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ hello: 'world' }) });
    const json = await fetchJsonRetry('https://example.test/x', { fetchImpl });
    expect(json).toEqual({ hello: 'world' });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('opakuje i na vyhozené síťové chybě', async () => {
    const fetchImpl = vi
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: 1 }) });
    const json = await fetchJsonRetry('https://example.test/y', { fetchImpl });
    expect(json).toEqual({ ok: 1 });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('po vyčerpání pokusů vyhodí popisnou chybu', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(fetchJsonRetry('https://example.test/z', { attempts: 2, fetchImpl })).rejects.toThrow(
      /fetchJsonRetry selhal po 2 pokusech/,
    );
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
