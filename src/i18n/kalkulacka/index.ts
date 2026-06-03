import type { Locale } from '../config';
import { content as prevodyJednotek } from './prevody-jednotek';
import { content as prevodyHmotnost } from './prevody-hmotnost';

export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  'prevody-jednotek': prevodyJednotek,
  'prevody-hmotnost': prevodyHmotnost,
};
