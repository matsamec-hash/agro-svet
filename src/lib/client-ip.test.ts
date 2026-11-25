import { describe, expect, it } from 'vitest';
import { clientIp, isCloudflareIp } from './client-ip';

const h = (o: Record<string, string>) => new Headers(o);

describe('isCloudflareIp', () => {
  it('pozná rozsahy Cloudflare (v4, v6, mapovanou v4)', () => {
    expect(isCloudflareIp('172.67.129.218')).toBe(true);
    expect(isCloudflareIp('2606:4700:3030::6815:101')).toBe(true);
    expect(isCloudflareIp('::ffff:104.21.1.190')).toBe(true);
  });
  it('cizí adresy nejsou Cloudflare', () => {
    expect(isCloudflareIp('203.0.113.9')).toBe(false);
    expect(isCloudflareIp('2001:db8::1')).toBe(false);
    expect(isCloudflareIp('not-an-ip')).toBe(false);
  });
});

describe('clientIp', () => {
  it('přímý přístup: podvržená CF-Connecting-IP se ignoruje, platí adresa spojení', () => {
    expect(clientIp(h({ 'x-forwarded-for': '203.0.113.9', 'cf-connecting-ip': '1.2.3.4' }))).toBe('203.0.113.9');
  });
  it('podvržený začátek X-Forwarded-For se ignoruje', () => {
    expect(clientIp(h({ 'x-forwarded-for': '1.1.1.1, 203.0.113.9' }))).toBe('203.0.113.9');
  });
  it('přes Cloudflare platí CF-Connecting-IP, i když je X-Forwarded-For podvržený', () => {
    expect(clientIp(h({ 'x-forwarded-for': '104.21.1.190', 'cf-connecting-ip': '198.51.100.7' }))).toBe('198.51.100.7');
    expect(clientIp(h({ 'x-forwarded-for': '9.9.9.9, 104.21.1.190', 'cf-connecting-ip': '198.51.100.7' }))).toBe('198.51.100.7');
  });
  it('záloha na adresu ze socketu a pak unknown', () => {
    expect(clientIp(h({}), '198.51.100.8')).toBe('198.51.100.8');
    expect(clientIp(h({}))).toBe('unknown');
  });
});
