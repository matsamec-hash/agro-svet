import type { Locale } from '../config';
import { content as prevodyJednotek } from './prevody-jednotek';
import { content as prevodyHmotnost } from './prevody-hmotnost';
import { content as leasingTraktoru } from './leasing-traktoru';
import { content as usporaNafty } from './uspora-nafty';
import { content as naklady } from './naklady-na-hektar';

export const calcRegistry: Record<string, Record<Locale, unknown>> = {
  'prevody-jednotek': prevodyJednotek,
  'prevody-hmotnost': prevodyHmotnost,
  'leasing-traktoru': leasingTraktoru,
  'uspora-nafty': usporaNafty,
  'naklady-na-hektar': naklady,
};
