#!/usr/bin/env node
/**
 * Rohatka licencí fotek — běží PŘED buildem, takže fotka bez doloženého
 * oprávnění se na web nedostane ani tehdy, když nikdo nepustil testy.
 *
 * Hlídá dvě věci, na kterých se to láme:
 *   1. Žádný obrázek nesmí mít jako licenci pouhý štítek „Public domain"
 *      (ani „volné dílo"), pokud k němu v `src/lib/photo-credit.ts` není
 *      v tabulce PD_DUVODY zapsaný KONKRÉTNÍ důvod a jurisdikce. Štítek na
 *      Wikimedia Commons tvrdí právní stav v zemi původu a v USA, ne v ČR.
 *   2. Licence vázaná jen na cizí jurisdikci (PD-US-gov, PD-US-expired)
 *      neprojde vůbec — český web z ní nic nemá.
 *
 * Plnou kontrolu (autor, odkaz na licenci, obrázky bez kreditu) dělá
 * `tests/lib/photo-credit.test.ts`. Tahle rohatka je ta část, která musí
 * proběhnout vždycky, i bez devDependencies.
 *
 * Proč: advokátní výzva PhotoClaim (52-06966, 2 169,95 EUR) proti
 * svetovestadiony.cz stála přesně na vadné atribuci.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'src', 'data');
const REGISTR = join(ROOT, 'src', 'lib', 'photo-credit.ts');

const PUHE_PD = /^(public domain|volné dílo|pd)$/i;
const CIZI_JURISDIKCE = /PD-US-gov|PD-USGov|PD-US-expired|PD-Italy|PD-Russia|PD-India/i;

/** Klíče v PD_DUVODY — bere jen řádky uvnitř té jedné tabulky. */
function pdDuvody(src) {
  const start = src.indexOf('export const PD_DUVODY');
  if (start < 0) return { keys: new Set(), blok: '' };
  const blok = src.slice(start, src.indexOf('\n};', start));
  return { keys: new Set([...blok.matchAll(/'(\/images\/[^']+)'\s*:/g)].map((m) => m[1])), blok };
}

/** Cesta bez responzivní varianty — v datech i v registru musí sedět na sebe. */
const canon = (p) => p.replace(/__v-w\d+(?=\.[a-zA-Z0-9]+$)/, '').split('?')[0];

function souboryDat(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...souboryDat(p));
    else if (/\.(ya?ml|json)$/.test(e.name)) out.push(p);
  }
  return out;
}

const src = readFileSync(REGISTR, 'utf8');
const { keys: PD_OK, blok } = pdDuvody(src);
const chyby = [];

if (PD_OK.size === 0) chyby.push('Tabulka PD_DUVODY je prázdná nebo se ji nepodařilo přečíst.');
// Šablony i jurisdikce se popisují na vlastních řádcích — stačí projít je.
for (const m of src.matchAll(/^\s*(sablona|jurisdikce):\s*'([^']*)'/gm)) {
  if (CIZI_JURISDIKCE.test(m[2]) || /^(USA|US|Spojené státy)\b/i.test(m[2]))
    chyby.push(`důvod volnosti „${m[2]}" platí jen mimo ČR — na český web nestačí`);
}
void blok;

// --- data: image_* / hero_* dvojice cesta + licence v jednom bloku ---
for (const f of souboryDat(DATA)) {
  const txt = readFileSync(f, 'utf8');
  const lines = txt.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const img = /(?:image_url|hero_image|image|src)\s*:\s*["']?(\/images\/[^"'\s,]+)/.exec(lines[i]);
    if (!img) continue;
    // licence patří k témuž záznamu → hledej v následujících osmi řádcích
    const okno = lines.slice(i, i + 8).join('\n');
    const lic = /(?:image_license|hero_license|license|licence)\s*:\s*["']?([^"'\n,}]+)/.exec(okno);
    if (!lic) continue;
    if (!PUHE_PD.test(lic[1].trim())) continue;
    const cesta = canon(img[1]);
    if (!PD_OK.has(cesta)) chyby.push(`${cesta} (${f.replace(ROOT + '/', '')}): „${lic[1].trim()}" bez důvodu v PD_DUVODY`);
  }
}

// --- registr: EXTRA_CREDITS a spol. ---
for (const m of src.matchAll(/'(\/images\/[^']+)'\s*:\s*\{[^}]*license:\s*'([^']+)'/g)) {
  if (!PUHE_PD.test(m[2].trim())) continue;
  const cesta = canon(m[1]);
  if (!PD_OK.has(cesta)) chyby.push(`${cesta} (photo-credit.ts): „${m[2]}" bez důvodu v PD_DUVODY`);
}

if (chyby.length) {
  const u = [...new Set(chyby)];
  console.error(`\n✗ Licence fotek: ${u.length} ${u.length === 1 ? 'problém' : 'problémů'}\n`);
  for (const c of u) console.error('  •', c);
  console.error(
    '\nBuild zastaven. „Public domain" sám o sobě není doklad — dohledej na Commons\n' +
      'konkrétní PD šablonu, zapiš důvod a jurisdikci do PD_DUVODY, nebo fotku smaž\n' +
      'a nahraď zástupným obrázkem (scripts/make-zastupny-obrazek.mjs).\n',
  );
  process.exit(1);
}
console.log(`✓ Licence fotek: ${PD_OK.size} volných děl má doložený důvod i jurisdikci.`);
