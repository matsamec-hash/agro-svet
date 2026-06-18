import type { Locale } from '../config';
import cs from './cs';
import sk from './sk';
import uk from './uk';
import pl from './pl';

export const ui: Record<Locale, Record<string, string>> = { cs, sk, uk, pl };
