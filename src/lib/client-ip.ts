// Sdílený modul Samec Digital: spolehlivá IP klienta za Traefikem (Coolify), s Cloudflare nebo bez.
// Zdroj pravdy: ~/samec-kit/security/client-ip.ts. Do projektu se kopíruje (viz SECURITY-STANDARD.md).
//
// Proč: hlavičku `CF-Connecting-IP` si může klient napsat sám, pokud jde na VPS přímo
// (origin Cloudflare nezavírá). Kdo jí věří bezpodmínečně, obejde jakýkoli limit na IP.
// Pravidlo: IP spojení = POSLEDNÍ záznam `X-Forwarded-For` (přidal ho Traefik, klient ho
// nepodvrhne). `CF-Connecting-IP` platí jen tehdy, když toto spojení přichází z rozsahu Cloudflare.

// https://www.cloudflare.com/ips/ (stav 2026-11; změny jsou vzácné a oznamované)
const CLOUDFLARE_V4 = [
  '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18',
  '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17',
  '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
]
const CLOUDFLARE_V6 = [
  '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
  '2a06:98c0::/29', '2c0f:f248::/32',
]

function parseV4(ip: string): bigint | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip)
  if (!m) return null
  const parts = m.slice(1).map(Number)
  if (parts.some((p) => p > 255)) return null
  return parts.reduce((acc, p) => (acc << 8n) | BigInt(p), 0n)
}

function parseV6(ip: string): bigint | null {
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip)
  if (mapped) return null // IPv4 zabalená v IPv6 se řeší jako IPv4 výše
  if (!/^[0-9a-f:]+$/i.test(ip) || ip.split('::').length > 2) return null
  const [head, tail] = ip.split('::')
  const h = head ? head.split(':') : []
  const t = tail !== undefined && tail ? tail.split(':') : []
  const missing = 8 - h.length - t.length
  if (ip.includes('::') ? missing < 1 : h.length !== 8) return null
  const groups = [...h, ...Array(ip.includes('::') ? missing : 0).fill('0'), ...t]
  if (groups.length !== 8) return null
  let out = 0n
  for (const g of groups) {
    if (!/^[0-9a-f]{1,4}$/i.test(g)) return null
    out = (out << 16n) | BigInt(parseInt(g, 16))
  }
  return out
}

function inRange(ip: string, cidrs: string[], parse: (s: string) => bigint | null, bits: number): boolean {
  const value = parse(ip)
  if (value === null) return false
  return cidrs.some((cidr) => {
    const [base, len] = cidr.split('/')
    const b = parse(base)
    if (b === null) return false
    const shift = BigInt(bits - Number(len))
    return value >> shift === b >> shift
  })
}

export function isCloudflareIp(ip: string): boolean {
  const mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip)
  const v4 = mapped ? mapped[1] : ip
  if (parseV4(v4) !== null) return inRange(v4, CLOUDFLARE_V4, parseV4, 32)
  return inRange(ip, CLOUDFLARE_V6, parseV6, 128)
}

/**
 * IP klienta. `socketAddress` = adresa z Astra (`clientAddress`) jako záloha, když chybí `X-Forwarded-For`.
 * Vrací `unknown`, když se nic zjistit nedá (limit na `unknown` je společný, proto je lepší neznámou IP
 * nepouštět do drahých operací).
 */
export function clientIp(headers: Headers, socketAddress?: string | null): string {
  const xff = headers.get('x-forwarded-for')
  const entries = xff ? xff.split(',').map((s) => s.trim()).filter(Boolean) : []
  const peer = entries.length ? entries[entries.length - 1] : (socketAddress ?? headers.get('x-real-ip') ?? '').trim()
  if (!peer) return 'unknown'
  const cf = headers.get('cf-connecting-ip')?.trim()
  if (cf && isCloudflareIp(peer)) return cf
  return peer
}
