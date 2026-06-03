import type { Locale } from '../config';
import { content as prevodyJednotek } from './prevody-jednotek';
import { content as prevodyHmotnost } from './prevody-hmotnost';
import { content as leasingTraktoru } from './leasing-traktoru';

export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  'prevody-jednotek': prevodyJednotek,
  'prevody-hmotnost': prevodyHmotnost,
  'leasing-traktoru': leasingTraktoru,
};
