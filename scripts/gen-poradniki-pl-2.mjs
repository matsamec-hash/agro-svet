// 2. dávka polských evergreen návodů pro /poradniki. Viz gen-poradniki-pl.mjs.
// OpenAI gpt-4.1-mini, JSON→md (howtoSchema). Non-YMYL: agrotechnika + technika,
// žádné dotace/zákony/konkrétní dávky chemie.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'content', 'poradniki-pl');
mkdirSync(OUT, { recursive: true });
const KEY = readFileSync(join(process.env.HOME, '.army-svet-openai-key'), 'utf8').trim();

const TOPICS = [
  { slug: 'uprawa-pszenicy-ozimej-krok-po-kroku', title: 'Uprawa pszenicy ozimej krok po kroku', focus: 'uprawa pszenicy ozimej: dobór stanowiska i przedplon, uprawa gleby, dobór odmiany, termin i norma wysiewu, nawożenie (ogólne zasady), ochrona jesienna i wiosenna, regulacja łanu, zbiór — treść ogólnoedukacyjna bez konkretnych dawek środków' },
  { slug: 'uprawa-rzepaku-ozimego-krok-po-kroku', title: 'Uprawa rzepaku ozimego krok po kroku', focus: 'uprawa rzepaku ozimego: stanowisko i pH, uprawa gleby, termin i gęstość siewu, dobór odmiany, nawożenie i mikroelementy (ogólnie), ochrona przed szkodnikami i chorobami, przygotowanie do zimy, zbiór — bez konkretnych dawek' },
  { slug: 'jak-wybrac-ladowarke-teleskopowa', title: 'Jak wybrać ładowarkę teleskopową do gospodarstwa', focus: 'dobór ładowarki teleskopowej: udźwig i wysokość podnoszenia, moc i napęd, typ osprzętu i szybkozłącze, kabina i widoczność, opony, koszty eksploatacji i serwis, nowa vs używana' },
  { slug: 'jak-dobrac-opony-rolnicze', title: 'Jak dobrać opony rolnicze', focus: 'dobór opon do ciągnika: oznaczenia rozmiaru, indeks nośności i prędkości, technologie IF/VF, ciśnienie a ugniatanie gleby, bieżnik radialny vs diagonalny, dopasowanie przód/tył, sezonowa kontrola' },
  { slug: 'przeglad-sezonowy-ciagnika', title: 'Przegląd sezonowy ciągnika', focus: 'przegląd ciągnika przed sezonem: oleje i filtry, płyn chłodniczy, układ hamulcowy, akumulator i elektryka, hydraulika i TUZ, smarowanie, opony i ciśnienie, oświetlenie, kontrola wycieków' },
  { slug: 'jak-wybrac-prase-do-bel', title: 'Jak wybrać prasę do bel', focus: 'dobór prasy: prasa zmiennokomorowa vs stałokomorowa vs kostkująca, wielkość i gęstość bel, wydajność a moc ciągnika, systemy wiązania (siatka/sznurek), owijanie, obsługa i serwis, do siana/sianokiszonki/słomy' },
  { slug: 'regulacja-siewnika-przed-siewem', title: 'Regulacja siewnika przed siewem', focus: 'kalibracja siewnika: ustawienie normy wysiewu i próba kręcona, głębokość siewu, rozstaw redlic, docisk redlic, znaczniki, kontrola równomierności, siewnik mechaniczny vs pneumatyczny' },
  { slug: 'przygotowanie-gleby-pod-siew', title: 'Przygotowanie gleby pod siew', focus: 'uprawa przedsiewna: ocena stanu gleby i wilgotności, uprawki pożniwne, orka vs uprawa bezorkowa, doprawianie roli, wyrównanie i struktura roli, dobór narzędzi (brona, agregat, wał), błędy do uniknięcia' },
];

const sys = `Jesteś doświadczonym polskim agronomem i redaktorem portalu rolniczego. Piszesz rzeczowe, praktyczne poradniki po polsku dla rolników. Treść ma być konkretna, fachowa i evergreen (bez dat, bez cen, bez stawek dotacji, bez numerów ustaw, bez konkretnych dawek chemikaliów). Zwracasz WYŁĄCZNIE poprawny JSON.`;

function prompt(t) {
  return `Napisz kompletny poradnik "krok po kroku" po polsku na temat: ${t.title}.
Zakres: ${t.focus}.
Zwróć JSON o polach:
{
 "description": "1 zdanie meta-opis (max 155 znaków, po polsku)",
 "obtiznosc": "jedno z: Łatwy / Średni / Zaawansowany",
 "totalTime": "ISO8601 duration np. PT45M lub PT2H",
 "tools": ["3-6 narzędzi/rzeczy potrzebnych"],
 "intro": "2 akapity wprowadzenia w Markdown (bez nagłówka), łącznie 90-140 słów",
 "steps": [{"name":"krótki tytuł kroku","text":"2-4 zdania konkretnej treści"}],
 "faq": [{"q":"pytanie","a":"odpowiedź 2-3 zdania"}]
}
Wymagania: 6-8 kroków, 3-4 pozycje FAQ. Język wyłącznie polski, znaki UTF-8 (ą ć ę ł ń ó ś ź ż). Bez konkretnych dawek chemikaliów, cen i stawek. Sam JSON, nic więcej.`;
}

async function gen(t) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: sys }, { role: 'user', content: prompt(t) }],
    }),
  });
  if (!res.ok) throw new Error(`${t.slug}: HTTP ${res.status} ${await res.text()}`);
  const j = await res.json();
  return JSON.parse(j.choices[0].message.content);
}

const yamlStr = (s) => JSON.stringify(String(s));
const today = '2026-08-07';

for (const t of TOPICS) {
  const d = await gen(t);
  const fm = [
    '---',
    `title: ${yamlStr(t.title)}`,
    `slug: ${t.slug}`,
    `description: ${yamlStr(d.description)}`,
    `datePublished: ${today}`,
    `lastVerified: ${today}`,
    d.totalTime ? `totalTime: ${yamlStr(d.totalTime)}` : '',
    d.obtiznosc ? `obtiznost: ${yamlStr(d.obtiznosc)}` : '',
    Array.isArray(d.tools) && d.tools.length ? 'tools:\n' + d.tools.map((x) => `  - ${yamlStr(x)}`).join('\n') : '',
    'steps:',
    ...d.steps.map((s) => `  - name: ${yamlStr(s.name)}\n    text: ${yamlStr(s.text)}`),
    Array.isArray(d.faq) && d.faq.length ? 'faq:\n' + d.faq.map((f) => `  - q: ${yamlStr(f.q)}\n    a: ${yamlStr(f.a)}`).join('\n') : '',
    '---',
    '',
    (d.intro || '').trim(),
    '',
  ].filter(Boolean).join('\n');
  writeFileSync(join(OUT, `${t.slug}.md`), fm, 'utf8');
  console.log(`✓ ${t.slug} (${d.steps.length} kroków, ${(d.faq || []).length} FAQ)`);
}
console.log('HOTOVO');
