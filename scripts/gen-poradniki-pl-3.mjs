// 3. dávka /poradniki — CHOV ZWIERZĄT (doplněk k živé sekci /plemena).
// OpenAI gpt-4.1-mini, JSON→md (howtoSchema). Non-YMYL: dobrostan/żywienie/higiena
// jako ogólne dobre praktyki, BEZ dawek leków, przepisów prawnych i stawek dotacji.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'src', 'content', 'poradniki-pl');
mkdirSync(OUT, { recursive: true });
const KEY = readFileSync(join(process.env.HOME, '.army-svet-openai-key'), 'utf8').trim();

const TOPICS = [
  { slug: 'odchow-cielat-pierwsze-tygodnie', title: 'Odchów cieląt w pierwszych tygodniach', focus: 'odchów cieląt: siara i jej znaczenie w pierwszych godzinach, warunki utrzymania (kojce, ściółka, temperatura), pojenie mlekiem/preparatem, wprowadzanie paszy stałej i wody, higiena i profilaktyka, monitorowanie zdrowia i przyrostów, odsadzanie — ogólne dobre praktyki, bez dawek leków' },
  { slug: 'zywienie-krow-mlecznych-podstawy', title: 'Żywienie krów mlecznych — podstawy', focus: 'żywienie krów mlecznych: bilans energii i białka, pasze objętościowe (kiszonki, siano) i treściwe, TMR i systemy zadawania, woda i pobranie suchej masy, żywienie w zasuszeniu i okresie okołoporodowym, kondycja (BCS), typowe błędy — ogólne zasady bez konkretnych receptur' },
  { slug: 'wykrywanie-rui-u-bydla', title: 'Wykrywanie rui u bydła', focus: 'wykrywanie rui u krów: objawy behawioralne i fizjologiczne, obserwacja stada i pory dnia, systemy wspomagające (aktywometry, kamery), kalendarz rozrodu i cykl, optymalny moment inseminacji, dokumentacja, najczęstsze błędy w wykrywaniu' },
  { slug: 'higiena-doju-i-jakosc-mleka', title: 'Higiena doju i jakość mleka', focus: 'higiena doju: przygotowanie wymienia (mycie, dezynfekcja, zdajanie pierwszych strug), prawidłowa kolejność doju, konserwacja aparatu udojowego, chłodzenie i przechowywanie mleka, liczba komórek somatycznych i profilaktyka mastitis, czystość otoczenia — dobre praktyki bez norm prawnych' },
  { slug: 'odchow-prosiat-podstawy', title: 'Odchów prosiąt — podstawy', focus: 'odchów prosiąt: opieka wokół porodu, mikroklimat i strefa grzania, siara i wyrównywanie miotu, dokarmianie i pojenie, higiena kojca, profilaktyka i obserwacja zdrowia, odsadzanie i przejście na paszę — ogólne dobre praktyki, bez dawek leków' },
  { slug: 'bioasekuracja-w-gospodarstwie', title: 'Bioasekuracja w gospodarstwie', focus: 'bioasekuracja: strefy czyste i brudne, kontrola wjazdu i osób, maty i śluzy dezynfekcyjne, higiena obuwia i odzieży, kwarantanna nowych zwierząt, zwalczanie gryzoni i owadów, zarządzanie paszą i wodą, dokumentacja — ogólne zasady prewencji, bez cytowania przepisów' },
];

const sys = `Jesteś doświadczonym polskim zootechnikiem i redaktorem portalu rolniczego. Piszesz rzeczowe, praktyczne poradniki po polsku dla hodowców. Treść ma być konkretna, fachowa i evergreen (bez dat, bez cen, bez stawek dotacji, bez numerów ustaw, bez dawek leków). Zwracasz WYŁĄCZNIE poprawny JSON.`;

function prompt(t) {
  return `Napisz kompletny poradnik "krok po kroku" po polsku na temat: ${t.title}.
Zakres: ${t.focus}.
Zwróć JSON o polach:
{
 "description": "1 zdanie meta-opis (max 155 znaków, po polsku)",
 "obtiznosc": "jedno z: Łatwy / Średni / Zaawansowany",
 "totalTime": "ISO8601 duration np. PT45M lub PT2H",
 "tools": ["3-6 rzeczy/wyposażenia potrzebnego"],
 "intro": "2 akapity wprowadzenia w Markdown (bez nagłówka), łącznie 90-140 słów",
 "steps": [{"name":"krótki tytuł kroku","text":"2-4 zdania konkretnej treści"}],
 "faq": [{"q":"pytanie","a":"odpowiedź 2-3 zdania"}]
}
Wymagania: 6-8 kroków, 3-4 pozycje FAQ. Język wyłącznie polski, znaki UTF-8 (ą ć ę ł ń ó ś ź ż). Bez dawek leków, cen, przepisów i stawek. Sam JSON, nic więcej.`;
}

async function gen(t) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: 'gpt-4.1-mini', temperature: 0.5, response_format: { type: 'json_object' },
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
