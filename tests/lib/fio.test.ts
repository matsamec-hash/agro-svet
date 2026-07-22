import { describe, it, expect } from 'vitest';
import { parseFioTransactions } from '../../src/lib/fio';
import sample from '../fixtures/fio-sample.json';

describe('parseFioTransactions', () => {
  it('mapuje jen příchozí CZK platby s VS', () => {
    const txs = parseFioTransactions(sample as any);
    expect(txs).toHaveLength(1);
    expect(txs[0]).toEqual({ id: 26000000001, amountCzk: 249, vs: '10000001', currency: 'CZK' });
  });
  it('prázdný/rozbitý JSON → []', () => {
    expect(parseFioTransactions({} as any)).toEqual([]);
    expect(parseFioTransactions({ accountStatement: { transactionList: null } } as any)).toEqual([]);
  });
});
