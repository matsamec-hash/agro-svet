// Jednorázový generátor polských evergreen návodů pro sekci /poradniki (PL-only).
// Volá OpenAI gpt-4.1-mini (šetří Claude tokeny), výstup = strukturovaný JSON,
// zapíše .md s frontmatterem kompatibilním s howtoSchema. NENÍ YMYL — obecná
// agrotechnika/technika, žádné dotační sazby ani legislativní čísla.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'content', 'poradniki-pl');
mkdirSync(OUT, { recursive: true });
const KEY = readFileSync(join(process.env.HOME, '.army-svet-openai-key'), 'utf8').trim();

const TOPICS = [
  { slug: 'jak-wybrac-ciagnik-do-gospodarstwa', title: 'Jak wybrać ciągnik do gospodarstwa (100–150 KM)', focus: 'dobór ciągnika o mocy 100–150 KM do średniego gospodarstwa: moc a zapotrzebowanie, TUZ i WOM, hydraulika, skrzynia (powershift/CVT), masa i dociążenie, kabina i komfort, serwis/części, koszt eksploatacji' },
  { slug: 'kontrola-uzywanego-ciagnika-przed-zakupem', title: 'Kontrola używanego ciągnika przed zakupem', focus: 'co sprawdzić przy zakupie używanego ciągnika: motogodziny vs stan, silnik i wycieki, skrzynia i sprzęgło, hydraulika i TUZ, opony i oś przednia, elektronika i błędy, dokumenty i historia serwisowa, jazda próbna' },
  { slug: 'jak-wybrac-opryskiwacz-polowy', title: 'Jak wybrać opryskiwacz polowy', focus: 'dobór opryskiwacza polowego: zawieszany vs zaczepiany, pojemność zbiornika, szerokość belki i jej stabilizacja, rodzaje rozpylaczy, systemy sekcji i GPS, płukanie i pojemność czystej wody, atesty i kontrola opryskiwacza' },
  { slug: 'agrotechnika-kukurydzy-krok-po-kroku', title: 'Agrotechnika kukurydzy krok po kroku', focus: 'uprawa kukurydzy od A do Z: dobór stanowiska i pH, uprawa gleby, dobór odmiany i FAO, termin i norma wysiewu, nawożenie (ogólne zasady), ochrona przed chwastami i szkodnikami, zbiór na ziarno i kiszonkę — treść ogólnoedukacyjna, bez konkretnych dawek środków' },
  { slug: 'przygotowanie-kombajnu-do-zniw', title: 'Przygotowanie kombajnu do żniw', focus: 'przegląd kombajnu przed żniwami: czyszczenie i przedmuchanie, kontrola pasów i łańcuchów, heder i nagarniacz, klepisko i sita, układ młócący, smarowanie, filtry i płyny, oświetlenie i bezpieczeństwo, ustawienia wstępne pod zboże' },
];

const sys = `Jesteś doświadczonym polskim agronomem i redaktorem portalu rolniczego. Piszesz rzeczowe, praktyczne poradniki po polsku dla rolników. Treść ma być konkretna, fachowa i evergreen (bez dat, bez cen, bez stawek dotacji, bez numerów ustaw). Zwracasz WYŁĄCZNIE poprawny JSON.`;

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

const yamlStr = (s) => JSON.stringify(String(s)); // bezpečné uvozovky pro YAML
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
