// Copy stránky /kontakt/ (kontaktní formulář) ve všech pěti jazycích.
//
// Proč stránka vůbec je: Impressum (§ 5 DDG, § 5 ECG) chce vedle e-mailu ještě
// DRUHOU rychlou a přímou elektronickou cestu. Podle SDEU C-298/07 (DIV/
// deutsche internet versicherung) to splní elektronický formulář, na který se
// odpovídá e-mailem. Proto formulář, ne telefon.
//
// Témata (KONTAKT_TOPICS) a meze polí (KONTAKT_LIMITS) jsou smlouva mezi
// šablonou (src/pages/kontakt.astro) a API (src/pages/api/kontakt.ts) —
// drží se tady, ať se nemůžou rozejít. Locale bez vlastní varianty dostane cs
// (stejně jako i18n/akcie.ts).
import type { Locale } from './config';

export const KONTAKT_TOPICS = ['general', 'error', 'rights', 'privacy', 'other'] as const;
export type KontaktTopic = (typeof KONTAKT_TOPICS)[number];

export function isKontaktTopic(value: string): value is KontaktTopic {
  return (KONTAKT_TOPICS as readonly string[]).includes(value);
}

/** Kódy chyb v `?err=`. `rate` = throttle, `server` = Resend selhal / chybí klíč. */
export const KONTAKT_ERRORS = ['topic', 'name', 'email', 'url', 'message-short', 'message-long', 'rate', 'server'] as const;
export type KontaktError = (typeof KONTAKT_ERRORS)[number];

export const KONTAKT_LIMITS = {
  nameMax: 120,
  emailMax: 254,
  urlMax: 2000,
  messageMin: 10,
  messageMax: 4000,
} as const;

export interface KontaktCopy {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  lead: string;

  operatorHeading: string;
  /** Stát sídla v jazyce stránky — sídlo samo je fakt, ne lokalizovatelný údaj. */
  country: string;
  icoLabel: string;
  emailHeading: string;
  /** V jakých jazycích nám lze psát (drží se seznamu z /dsa-kontakt/). */
  languages: string;

  formHeading: string;
  topicLabel: string;
  topicPlaceholder: string;
  topics: Record<KontaktTopic, string>;
  nameLabel: string;
  optional: string;
  emailLabel: string;
  emailHint: string;
  urlLabel: string;
  messageLabel: string;
  messageHint: string;
  /** Popisek honeypotu — člověk ho nevidí, čtečka ho přeskočí (aria-hidden). */
  honeypotLabel: string;
  privacyBefore: string;
  privacyLink: string;
  privacyAfter: string;
  submit: string;

  ok: string;
  again: string;
  errors: Record<KontaktError, string>;

  otherHeading: string;
  linkBazar: string;
  /** Přípona u odkazu na českou stránku (bazar je jen česky); cs = ''. */
  csOnlyNote: string;
  linkDsa: string;
  linkPrivacy: string;
}

const cs: KontaktCopy = {
  metaTitle: 'Kontakt — Agro-svět',
  metaDescription: 'Napište provozovateli agro-svet.cz: kontaktní formulář a e-mail info@samecdigital.com. Odpovídáme e-mailem, zpravidla do 2 pracovních dnů.',
  h1: 'Kontakt',
  lead: 'Máte dotaz, našli jste v obsahu chybu, nebo chcete uplatnit svá práva? Napište nám přes formulář níže nebo e-mailem. Odpovídáme e-mailem, zpravidla do 2 pracovních dnů.',

  operatorHeading: 'Provozovatel',
  country: 'Česká republika',
  icoLabel: 'IČO',
  emailHeading: 'E-mail',
  languages: 'Psát nám můžete česky, slovensky, polsky, ukrajinsky nebo anglicky.',

  formHeading: 'Kontaktní formulář',
  topicLabel: 'Téma',
  topicPlaceholder: '— vyberte —',
  topics: {
    general: 'Obecný dotaz',
    error: 'Chyba v obsahu',
    rights: 'Porušení práv (autorská práva, práva k fotografiím, ochranné známky)',
    privacy: 'Osobní údaje (žádost podle GDPR)',
    other: 'Jiné',
  },
  nameLabel: 'Jméno',
  optional: '(nepovinné)',
  emailLabel: 'Váš e-mail',
  emailHint: 'Na tuto adresu vám odpovíme.',
  urlLabel: 'Adresa stránky, které se zpráva týká',
  messageLabel: 'Zpráva',
  messageHint: '10 až 4 000 znaků.',
  honeypotLabel: 'Toto pole nevyplňujte',
  privacyBefore: 'Údaje z formuláře použijeme jen k vyřízení vaší zprávy a k odpovědi na ni. Podrobnosti najdete v ',
  privacyLink: 'zásadách zpracování osobních údajů',
  privacyAfter: '.',
  submit: 'Odeslat zprávu',

  ok: 'Děkujeme, zprávu jsme přijali. Odpovíme vám e-mailem, zpravidla do 2 pracovních dnů.',
  again: 'Napsat další zprávu',
  errors: {
    topic: 'Vyberte téma zprávy.',
    name: 'Jméno je příliš dlouhé (nejvýše 120 znaků).',
    email: 'Zadejte platnou e-mailovou adresu, abychom vám mohli odpovědět.',
    url: 'Adresa stránky není platná. Vložte ji celou, např. https://agro-svet.cz/…',
    'message-short': 'Zpráva je příliš krátká (alespoň 10 znaků).',
    'message-long': 'Zpráva je příliš dlouhá (nejvýše 4 000 znaků).',
    rate: 'V krátké době jste odeslali příliš mnoho zpráv. Zkuste to prosím za 15 minut, nebo nám napište na info@samecdigital.com.',
    server: 'Zprávu se nepodařilo odeslat. Zkuste to prosím znovu, nebo nám napište přímo na info@samecdigital.com.',
  },

  otherHeading: 'Další kontaktní cesty',
  linkBazar: 'Nahlášení závadného inzerátu v bazaru',
  csOnlyNote: '',
  linkDsa: 'Kontaktní bod podle nařízení o digitálních službách (DSA)',
  linkPrivacy: 'Zásady zpracování osobních údajů',
};

const sk: KontaktCopy = {
  metaTitle: 'Kontakt — Agro-svet',
  metaDescription: 'Napíšte prevádzkovateľovi agro-svet.cz: kontaktný formulár a e-mail info@samecdigital.com. Odpovedáme e-mailom, spravidla do 2 pracovných dní.',
  h1: 'Kontakt',
  lead: 'Máte otázku, našli ste v obsahu chybu alebo chcete uplatniť svoje práva? Napíšte nám cez formulár nižšie alebo e-mailom. Odpovedáme e-mailom, spravidla do 2 pracovných dní.',

  operatorHeading: 'Prevádzkovateľ',
  country: 'Česká republika',
  icoLabel: 'IČO',
  emailHeading: 'E-mail',
  languages: 'Písať nám môžete po slovensky, po česky, po poľsky, po ukrajinsky alebo po anglicky.',

  formHeading: 'Kontaktný formulár',
  topicLabel: 'Téma',
  topicPlaceholder: '— vyberte —',
  topics: {
    general: 'Všeobecná otázka',
    error: 'Chyba v obsahu',
    rights: 'Porušenie práv (autorské práva, práva k fotografiám, ochranné známky)',
    privacy: 'Osobné údaje (žiadosť podľa GDPR)',
    other: 'Iné',
  },
  nameLabel: 'Meno',
  optional: '(nepovinné)',
  emailLabel: 'Váš e-mail',
  emailHint: 'Na túto adresu vám odpovieme.',
  urlLabel: 'Adresa stránky, ktorej sa správa týka',
  messageLabel: 'Správa',
  messageHint: '10 až 4 000 znakov.',
  honeypotLabel: 'Toto pole nevypĺňajte',
  privacyBefore: 'Údaje z formulára použijeme len na vybavenie vašej správy a odpoveď na ňu. Podrobnosti nájdete v ',
  privacyLink: 'zásadách spracúvania osobných údajov',
  privacyAfter: '.',
  submit: 'Odoslať správu',

  ok: 'Ďakujeme, správu sme prijali. Odpovieme vám e-mailom, spravidla do 2 pracovných dní.',
  again: 'Napísať ďalšiu správu',
  errors: {
    topic: 'Vyberte tému správy.',
    name: 'Meno je príliš dlhé (najviac 120 znakov).',
    email: 'Zadajte platnú e-mailovú adresu, aby sme vám mohli odpovedať.',
    url: 'Adresa stránky nie je platná. Vložte ju celú, napr. https://agro-svet.cz/…',
    'message-short': 'Správa je príliš krátka (aspoň 10 znakov).',
    'message-long': 'Správa je príliš dlhá (najviac 4 000 znakov).',
    rate: 'V krátkom čase ste odoslali príliš veľa správ. Skúste to, prosím, o 15 minút alebo nám napíšte na info@samecdigital.com.',
    server: 'Správu sa nepodarilo odoslať. Skúste to, prosím, znova alebo nám napíšte priamo na info@samecdigital.com.',
  },

  otherHeading: 'Ďalšie kontaktné možnosti',
  linkBazar: 'Nahlásenie závadného inzerátu v bazári',
  csOnlyNote: ' (v češtine)',
  linkDsa: 'Kontaktné miesto podľa nariadenia o digitálnych službách (DSA)',
  linkPrivacy: 'Zásady spracúvania osobných údajov',
};

// Polština: neosobní zdvořilé tvary („prosimy…", „można…") — bez Pan/Pani,
// které by nutily volit rod, a bez tykání.
const pl: KontaktCopy = {
  metaTitle: 'Kontakt — Agro-svet',
  metaDescription: 'Kontakt z operatorem serwisu agro-svet.cz: formularz kontaktowy i e-mail info@samecdigital.com. Odpowiadamy e-mailem, zwykle w ciągu 2 dni roboczych.',
  h1: 'Kontakt',
  lead: 'W razie pytań, zauważonego błędu w treści lub chęci skorzystania z przysługujących praw prosimy o wiadomość przez formularz poniżej lub e-mailem. Odpowiadamy e-mailem, zwykle w ciągu 2 dni roboczych.',

  operatorHeading: 'Operator serwisu',
  country: 'Republika Czeska',
  icoLabel: 'Numer identyfikacyjny (IČO)',
  emailHeading: 'E-mail',
  languages: 'Wiadomość można napisać po polsku, czesku, słowacku, ukraińsku lub angielsku.',

  formHeading: 'Formularz kontaktowy',
  topicLabel: 'Temat',
  topicPlaceholder: '— proszę wybrać —',
  topics: {
    general: 'Pytanie ogólne',
    error: 'Błąd w treści',
    rights: 'Naruszenie praw (prawa autorskie, prawa do zdjęć, znaki towarowe)',
    privacy: 'Dane osobowe (wniosek na podstawie RODO)',
    other: 'Inne',
  },
  nameLabel: 'Imię i nazwisko',
  optional: '(opcjonalnie)',
  emailLabel: 'Adres e-mail',
  emailHint: 'Na ten adres wyślemy odpowiedź.',
  urlLabel: 'Adres strony, której dotyczy wiadomość',
  messageLabel: 'Wiadomość',
  messageHint: 'Od 10 do 4000 znaków.',
  honeypotLabel: 'Tego pola nie należy wypełniać',
  privacyBefore: 'Dane z formularza wykorzystujemy wyłącznie do rozpatrzenia wiadomości i udzielenia odpowiedzi. Szczegóły zawierają ',
  privacyLink: 'zasady przetwarzania danych osobowych',
  privacyAfter: '.',
  submit: 'Wyślij wiadomość',

  ok: 'Dziękujemy, wiadomość dotarła. Odpowiemy e-mailem, zwykle w ciągu 2 dni roboczych.',
  again: 'Wyślij kolejną wiadomość',
  errors: {
    topic: 'Prosimy wybrać temat wiadomości.',
    name: 'Imię i nazwisko jest za długie (maksymalnie 120 znaków).',
    email: 'Prosimy podać prawidłowy adres e-mail — na niego wyślemy odpowiedź.',
    url: 'Adres strony jest nieprawidłowy. Prosimy wkleić pełny adres, np. https://agro-svet.cz/…',
    'message-short': 'Wiadomość jest za krótka (co najmniej 10 znaków).',
    'message-long': 'Wiadomość jest za długa (maksymalnie 4000 znaków).',
    rate: 'W krótkim czasie wysłano zbyt wiele wiadomości. Prosimy spróbować ponownie za 15 minut lub napisać na info@samecdigital.com.',
    server: 'Nie udało się wysłać wiadomości. Prosimy spróbować ponownie lub napisać bezpośrednio na info@samecdigital.com.',
  },

  otherHeading: 'Inne formy kontaktu',
  linkBazar: 'Zgłoszenie niedozwolonego ogłoszenia w bazarze',
  csOnlyNote: ' (po czesku)',
  linkDsa: 'Punkt kontaktowy zgodnie z aktem o usługach cyfrowych (DSA)',
  linkPrivacy: 'Zasady przetwarzania danych osobowych',
};

const uk: KontaktCopy = {
  metaTitle: 'Контакти — Agro-svet',
  metaDescription: 'Напишіть оператору сайту agro-svet.cz: контактна форма та e-mail info@samecdigital.com. Відповідаємо електронною поштою, зазвичай протягом 2 робочих днів.',
  h1: 'Контакти',
  lead: 'Маєте запитання, помітили помилку в матеріалі чи бажаєте скористатися своїми правами? Напишіть нам через форму нижче або електронною поштою. Відповідаємо електронною поштою, зазвичай протягом 2 робочих днів.',

  operatorHeading: 'Оператор сайту',
  country: 'Чеська Республіка',
  icoLabel: 'Ідентифікаційний номер (IČO)',
  emailHeading: 'E-mail',
  languages: 'Писати нам можна українською, чеською, словацькою, польською або англійською.',

  formHeading: 'Контактна форма',
  topicLabel: 'Тема',
  topicPlaceholder: '— оберіть —',
  topics: {
    general: 'Загальне запитання',
    error: 'Помилка в матеріалі',
    rights: 'Порушення прав (авторське право, права на фотографії, торговельні марки)',
    privacy: 'Персональні дані (запит відповідно до GDPR)',
    other: 'Інше',
  },
  nameLabel: 'Ім’я',
  optional: '(необов’язково)',
  emailLabel: 'Ваш e-mail',
  emailHint: 'На цю адресу ми надішлемо відповідь.',
  urlLabel: 'Адреса сторінки, якої стосується повідомлення',
  messageLabel: 'Повідомлення',
  messageHint: 'Від 10 до 4000 символів.',
  honeypotLabel: 'Не заповнюйте це поле',
  privacyBefore: 'Дані з форми ми використовуємо лише для розгляду вашого повідомлення та відповіді на нього. Докладніше — у ',
  privacyLink: 'засадах обробки персональних даних',
  privacyAfter: '.',
  submit: 'Надіслати повідомлення',

  ok: 'Дякуємо, ми отримали ваше повідомлення. Відповімо електронною поштою, зазвичай протягом 2 робочих днів.',
  again: 'Написати ще одне повідомлення',
  errors: {
    topic: 'Оберіть тему повідомлення.',
    name: 'Ім’я задовге (не більше 120 символів).',
    email: 'Вкажіть дійсну адресу електронної пошти, щоб ми могли вам відповісти.',
    url: 'Адреса сторінки недійсна. Вставте її повністю, наприклад https://agro-svet.cz/…',
    'message-short': 'Повідомлення закоротке (щонайменше 10 символів).',
    'message-long': 'Повідомлення задовге (не більше 4000 символів).',
    rate: 'Ви надіслали забагато повідомлень за короткий час. Спробуйте, будь ласка, через 15 хвилин або напишіть нам на info@samecdigital.com.',
    server: 'Не вдалося надіслати повідомлення. Спробуйте, будь ласка, ще раз або напишіть нам безпосередньо на info@samecdigital.com.',
  },

  otherHeading: 'Інші способи зв’язку',
  linkBazar: 'Повідомлення про недопустиме оголошення на барахолці',
  csOnlyNote: ' (чеською)',
  linkDsa: 'Контактний пункт відповідно до Акта про цифрові послуги (DSA)',
  linkPrivacy: 'Засади обробки персональних даних',
};

const de: KontaktCopy = {
  metaTitle: 'Kontakt — Agro-svet',
  metaDescription: 'Kontakt zum Anbieter von agro-svet.cz: Kontaktformular und E-Mail info@samecdigital.com. Wir antworten per E-Mail, in der Regel innerhalb von 2 Werktagen.',
  h1: 'Kontakt',
  lead: 'Sie haben eine Frage, einen Fehler in unseren Inhalten entdeckt oder möchten Ihre Rechte geltend machen? Schreiben Sie uns über das Formular unten oder per E-Mail. Wir antworten per E-Mail, in der Regel innerhalb von 2 Werktagen.',

  operatorHeading: 'Anbieter',
  country: 'Tschechische Republik',
  icoLabel: 'Identifikationsnummer (IČO)',
  emailHeading: 'E-Mail',
  languages: 'Sie können uns auf Deutsch, Tschechisch, Slowakisch oder Englisch schreiben.',

  formHeading: 'Kontaktformular',
  topicLabel: 'Thema',
  topicPlaceholder: '— bitte wählen —',
  topics: {
    general: 'Allgemeine Anfrage',
    error: 'Fehler im Inhalt',
    rights: 'Rechtsverletzung (Urheberrecht, Bildrechte, Marken)',
    privacy: 'Datenschutz (Anfrage nach der DSGVO)',
    other: 'Sonstiges',
  },
  nameLabel: 'Name',
  optional: '(optional)',
  emailLabel: 'Ihre E-Mail-Adresse',
  emailHint: 'An diese Adresse senden wir unsere Antwort.',
  urlLabel: 'Adresse der betroffenen Seite',
  messageLabel: 'Nachricht',
  messageHint: '10 bis 4.000 Zeichen.',
  honeypotLabel: 'Dieses Feld bitte nicht ausfüllen',
  privacyBefore: 'Wir verwenden Ihre Angaben ausschließlich, um Ihre Anfrage zu bearbeiten und zu beantworten. Einzelheiten finden Sie in der ',
  privacyLink: 'Datenschutzerklärung',
  privacyAfter: '.',
  submit: 'Nachricht senden',

  ok: 'Vielen Dank, wir haben Ihre Nachricht erhalten. Wir antworten Ihnen per E-Mail, in der Regel innerhalb von 2 Werktagen.',
  again: 'Weitere Nachricht schreiben',
  errors: {
    topic: 'Bitte wählen Sie ein Thema aus.',
    name: 'Der Name ist zu lang (höchstens 120 Zeichen).',
    email: 'Bitte geben Sie eine gültige E-Mail-Adresse an, damit wir Ihnen antworten können.',
    url: 'Die Adresse der Seite ist ungültig. Bitte fügen Sie sie vollständig ein, z. B. https://agro-svet.cz/…',
    'message-short': 'Die Nachricht ist zu kurz (mindestens 10 Zeichen).',
    'message-long': 'Die Nachricht ist zu lang (höchstens 4.000 Zeichen).',
    rate: 'Sie haben in kurzer Zeit zu viele Nachrichten gesendet. Bitte versuchen Sie es in 15 Minuten erneut oder schreiben Sie uns an info@samecdigital.com.',
    server: 'Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@samecdigital.com.',
  },

  otherHeading: 'Weitere Kontaktmöglichkeiten',
  linkBazar: 'Meldung eines rechtswidrigen Inserats im Gebrauchtmarkt',
  csOnlyNote: ' (auf Tschechisch)',
  linkDsa: 'Kontaktstelle nach dem Gesetz über digitale Dienste (DSA)',
  linkPrivacy: 'Datenschutzerklärung',
};

export const content: Record<Locale, KontaktCopy> = { cs, sk, pl, uk, de };

export function kontaktCopy(locale: string): KontaktCopy {
  return content[locale as Locale] ?? cs;
}
