import { describe, it, expect } from 'vitest';
import { collections } from '../../src/content.config';

describe('uk overlay kolekce existují', () => {
  it('znackyUk a encyklopedieUk jsou registrované', () => {
    expect(collections).toHaveProperty('znackyUk');
    expect(collections).toHaveProperty('encyklopedieUk');
  });
});
