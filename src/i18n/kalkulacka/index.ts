import type { Locale } from '../config';
import { content as prevodyJednotek } from './prevody-jednotek';

export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  'prevody-jednotek': prevodyJednotek,
};
