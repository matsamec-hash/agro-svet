import { describe, it, expect } from 'vitest';
import { farmLocalBusinessSchema } from '../../src/lib/structured-data';

describe('farmLocalBusinessSchema', () => {
  const base = {
    slug: 'statek-na-brehu',
    name: 'Statek Na Břehu',
    description: 'Rodinný statek.',
    region: 'Jihočeský kraj',
    address: 'Katovice 12, 387 11 Katovice',
    lat: 49.2667,
    lng: 13.8333,
    products: ['Brambory', 'Vejce'],
    eco: true,
    tel: '+420 777 123 456',
    web: 'https://example.cz',
  };

  it('vrací GroceryStore s adresou, geo a url', () => {
    const s = farmLocalBusinessSchema(base) as any;
    expect(s['@type']).toBe('GroceryStore');
    expect(s.url).toBe('https://agro-svet.cz/farmy/statek-na-brehu/');
    expect(s.address['@type']).toBe('PostalAddress');
    expect(s.geo).toMatchObject({ '@type': 'GeoCoordinates', latitude: 49.2667, longitude: 13.8333 });
    expect(s.name).toBe('Statek Na Břehu');
  });

  it('mapuje produkty do makesOffer a telefon/web když jsou', () => {
    const s = farmLocalBusinessSchema(base) as any;
    expect(Array.isArray(s.makesOffer)).toBe(true);
    expect(s.makesOffer.length).toBe(2);
    expect(s.telephone).toBe('+420 777 123 456');
    expect(s.sameAs).toContain('https://example.cz');
  });

  it('vynechá volitelná pole když chybí', () => {
    const s = farmLocalBusinessSchema({ ...base, tel: undefined, web: undefined, address: undefined }) as any;
    expect(s.telephone).toBeUndefined();
    expect(s.sameAs).toBeUndefined();
    expect(s.address).toBeUndefined();
  });
});
