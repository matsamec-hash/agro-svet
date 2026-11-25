#!/usr/bin/env node
// Statická kontrola podle SECURITY-STANDARD.md. Bez závislostí, jen Node ≥ 18 a git.
//
//   node security-check.mjs [cesta-k-projektu] [--json]
//
// Kód 1 = je aspoň jedno neschválené zjištění úrovně FAIL (blokuje nasazení).
// Výjimky: soubor `.security-allow.json` v kořeni projektu:
//   { "allow": [ { "rule": "R2", "path": "src/pages/api/webhooks/stripe.ts", "reason": "ověřený podpis Stripe" } ] }
// Výjimka bez důvodu (`reason`) se nebere.
//
// Kontrola je heuristická (hledá značky v textu). Neověřuje, že ochrana funguje: to dělají testy
// projektu. Je to síto proti zapomenutí, ne důkaz bezpečnosti.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const args = process.argv.slice(2)
const root = resolve(args.find((a) => !a.startsWith('--')) ?? '.')
const asJson = args.includes('--json')

function tracked() {
  try {
    return execFileSync('git', ['-C', root, 'ls-files'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
      .split('\n').filter(Boolean)
  } catch {
    return []
  }
}
const files = tracked()
const read = (f) => {
  try { return readFileSync(join(root, f), 'utf8') } catch { return '' }
}

const allow = (() => {
  const p = join(root, '.security-allow.json')
  if (!existsSync(p)) return []
  try { return JSON.parse(readFileSync(p, 'utf8')).allow ?? [] } catch { return [] }
})().filter((a) => a.reason && String(a.reason).trim() !== '')
const allowed = (rule, path) => allow.some((a) => a.rule === rule && (a.path === path || (a.path.endsWith('/') && path.startsWith(a.path))))

const findings = []
const add = (rule, level, path, line, text) => {
  if (allowed(rule, path)) return
  findings.push({ rule, level, path, line, text })
}

const CODE = /\.(ts|tsx|js|mjs|astro|svelte|php)$/
const TEST = /(\.test\.|\.spec\.|(^|\/)tests?\/|(^|\/)__tests__\/|(^|\/)mockups?\/|(^|\/)scripts\/)/

// R1: CF-Connecting-IP se nesmí číst přímo (jen v client-ip modulu): podvrhne ho kdokoli, kdo jde na VPS mimo Cloudflare.
// R4: tajné klíče ve verzovaných souborech.
const SECRETS = [
  [/sk_live_[0-9A-Za-z]{16,}/, 'Stripe live klíč'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'privátní klíč'],
  [/\bre_[A-Za-z0-9]{24,}\b/, 'Resend klíč'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS klíč'],
  [/eyJhbGciOi[A-Za-z0-9_-]{20,}\.eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}[^'"\n]*service_role/, 'service_role JWT'],
]
for (const f of files) {
  if (/(^|\/)\.env(\.|$)/.test(f) && !/\.(example|sample|template)$/.test(f)) add('R5', 'FAIL', f, 0, '.env je ve verzování')
  if (!CODE.test(f) && !/\.(json|yml|yaml|env|sh|md|txt)$/.test(f)) continue
  if (/(^|\/)(package-lock\.json|pnpm-lock\.yaml|node_modules\/|dist\/|out\/|\.next\/)/.test(f)) continue
  const text = read(f)
  if (!text) continue
  if (CODE.test(f) && !TEST.test(f) && !/client-ip\.(ts|js)$/.test(f)) {
    text.split('\n').forEach((l, i) => {
      if (/cf-connecting-ip/i.test(l) && !/^\s*(\/\/|\/\*|\*|#)/.test(l)) add('R1', 'FAIL', f, i + 1, 'CF-Connecting-IP se čte přímo, použij sdílený client-ip modul')
    })
  }
  if (!TEST.test(f)) {
    for (const [rx, name] of SECRETS) {
      const m = rx.exec(text)
      if (m) add('R4', 'FAIL', f, text.slice(0, m.index).split('\n').length, `možné tajemství: ${name} (hodnota se nevypisuje)`)
    }
  }
}

// R2/R3: veřejné zapisující endpointy.
const ENDPOINT = /(^|\/)(pages\/api|app\/api)\/.+\.(ts|js|astro)$|(^|\/)route\.(ts|js)$|public\/.+\.php$|(^|\/)send\.php$/
const WRITES = /export\s+(const|async function|function)\s+(POST|PUT|PATCH|DELETE|ALL)\b|\$_POST|REQUEST_METHOD/
const RL = /consume\w*\s*\(|edgeThrottle|createRateLimiter|checkRateLimit|rateLimit|rate_limit|limiter|omezovac|limitOk|limit\s*\(|429/i
const AUTH = /locals\.user|timingSafeEqual|INTERNAL_\w*SECRET|getUser\s*\(|requireAdmin|requireUser|isValidSession|checkPassword|verifyToken|authorization|bearer|constructEvent|stripe-signature|webhook[-_ ]?secret|session/i
const BOT = /honeypot|company_website|web_url|_gotcha|botcheck|turnstile|captcha|HONEYPOT_FIELD/i
const MAIL = /resend|sendMail|sendEmail|nodemailer|\bmail\s*\(|sendSubmission|notifyModerator/i
const COST = /anthropic|openai|api\.anthropic|generateContent|stripe\.checkout|createCheckout|geocode\(/i
for (const f of files) {
  if (!ENDPOINT.test(f) || TEST.test(f)) continue
  const text = read(f)
  if (!WRITES.test(text)) continue
  const authed = AUTH.test(text)
  const limited = RL.test(text)
  if (!limited && !authed) add('R2', 'FAIL', f, 0, 'veřejný zapisující endpoint bez limitu četnosti i bez ověření')
  if (MAIL.test(text) && !authed && !limited) {
    add('R3', 'FAIL', f, 0, 'veřejný endpoint posílá e-mail bez limitu (potřeba: limit na IP, na cílovou adresu, celkový strop)')
  } else if (MAIL.test(text) && !authed && !BOT.test(text)) {
    add('R3', 'WARN', f, 0, 'veřejný endpoint posílá e-mail bez honeypotu/captchy (limit je)')
  }
  if (COST.test(text) && !authed && !limited) add('R3', 'FAIL', f, 0, 'veřejný endpoint volá placené API bez limitu')
}

// R7: JSON do <script> přes set:html bez escapování `<` (uložené XSS, `</script>` v textu od uživatele).
for (const f of files) {
  if (!/\.(astro|svelte|tsx|jsx)$/.test(f) || TEST.test(f)) continue
  const text = read(f)
  text.split('\n').forEach((l, i) => {
    if (/set:html=\{\s*JSON\.stringify\(|dangerouslySetInnerHTML=\{\{\s*__html:\s*JSON\.stringify\(/.test(l)) {
      add('R7', 'FAIL', f, i + 1, 'JSON.stringify do <script> bez escapování, použij safeJsonLd (lib/json-ld.ts)')
    }
  })
}

// R6: přesměrování na adresu z formuláře bez kontroly (open redirect). Jen varování.
for (const f of files) {
  if (!CODE.test(f) || TEST.test(f)) continue
  const text = read(f)
  if (/(redirect|location)[^\n]{0,120}form\.get\(\s*['"](next|redirect|backTo|returnTo)['"]/.test(text) && !/safeLocalPath|safeNext|startsWith\(\s*['"]\/['"]\s*\)/.test(text)) {
    add('R6', 'WARN', f, 0, 'přesměrování na hodnotu z formuláře bez kontroly (open redirect)')
  }
}

const fails = findings.filter((x) => x.level === 'FAIL')
if (asJson) {
  console.log(JSON.stringify({ project: relative(process.cwd(), root) || '.', fails: fails.length, findings }, null, 2))
} else {
  console.log(`Bezpečnostní kontrola: ${root}`)
  for (const x of findings) console.log(`${x.level.padEnd(4)} ${x.rule} ${x.path}${x.line ? ':' + x.line : ''}  ${x.text}`)
  console.log(fails.length ? `\n❌ ${fails.length} zjištění blokuje nasazení (výjimky: .security-allow.json s důvodem)` : '\n✅ žádné blokující zjištění')
}
process.exit(fails.length ? 1 : 0)
