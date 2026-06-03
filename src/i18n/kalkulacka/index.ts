// Registry per-kalkulačka i18n modulů. Každá kalkulačka se sem zaregistruje;
// parity test (tests/i18n/kalkulacka.test.ts) přes registry iteruje.
// Moduly se přidávají v Tasks 4–9.
import type { Locale } from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  // 'prevody-jednotek': prevodyJednotek.content,  ← přidá Task 4
};
