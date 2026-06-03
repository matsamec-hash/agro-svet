import type { Locale } from '../config';
import type { CalcMeta, CalcCurrency } from './types';

export interface Operation { id: string; name: string; haPerHour: number; fuelPerHour: number; note: string }

export interface NakladyContent extends CalcMeta, CalcCurrency {
  form: {
    operation: string; haPerHour: string; fuelPerHour: string;
    fuelPrice: string; laborCost: string; maintenance: string; maintenanceHint: string;
    area: string; areaHint: string;
  };
  result: { perHaKicker: string; fuel: string; labor: string; maint: string; totalCost: string; workTime: string };
  js: { perHa: string; hoursH: string; hoursMin: string };
  cta: { kicker: string; heading: string; leasing: string; tractors: string; combines: string };
  operations: Operation[];
  defaults: { fuelPrice: number; laborCost: number; maintenance: number; area: number };
}

export const content: Record<Locale, NakladyContent> = {
  cs: {
    title: 'Kalkulačka provozních nákladů na hektar — palivo, práce, údržba',
    metaDescription: 'Spočítejte provozní náklady na hektar pro orbu, setí, postřik nebo sklizeň. Spotřeba nafty, výkon plochy, práce obsluhy — Kč/ha pro plánování farmy.',
    h1: 'Provozní náklady na hektar',
    crumb: 'Náklady na hektar',
    kicker: 'Kalkulačka · ekonomika provozu',
    lede: 'Vyberte operaci, upravte spotřebu a výkon plochy podle svých podmínek a doplňte ceny. Kalkulačka spočítá variabilní náklady na hektar — palivo, práci obsluhy a paušál na údržbu. Fixní náklady (odpisy, leasing, pojištění) je třeba připočítat zvlášť.',
    currency: 'CZK',
    numberLocale: 'cs-CZ',
    form: {
      operation: 'Polní operace', haPerHour: 'Výkon plochy', fuelPerHour: 'Spotřeba nafty',
      fuelPrice: 'Cena nafty (po vratce)', laborCost: 'Práce obsluhy', maintenance: 'Údržba a opravy',
      maintenanceHint: 'Paušál na opravy, oleje, opotřebení dílů.', area: 'Plocha (volitelné)', areaHint: 'Pro výpočet celkových nákladů a času.',
    },
    result: { perHaKicker: 'Provozní náklady na hektar', fuel: 'Palivo', labor: 'Práce obsluhy', maint: 'Údržba', totalCost: 'Náklady celkem', workTime: 'Čas práce' },
    js: { perHa: '/ha', hoursH: 'h', hoursMin: 'min' },
    cta: { kicker: 'Plánujete pořízení stroje?', heading: 'Spočítejte si leasing nebo projděte katalog techniky', leasing: 'Kalkulačka leasingu', tractors: 'Katalog traktorů', combines: 'Katalog kombajnů' },
    operations: [
      { id: 'orba', name: 'Orba (pluh)', haPerHour: 1.2, fuelPerHour: 22, note: 'Náročná operace — vysoká spotřeba, malý výkon plochy.' },
      { id: 'podmitka', name: 'Podmítka / kypření', haPerHour: 3.5, fuelPerHour: 18, note: 'Mělké zpracování, vyšší pojezdová rychlost.' },
      { id: 'seti', name: 'Setí (secí kombinace)', haPerHour: 4.0, fuelPerHour: 16, note: 'Široký záběr, střední spotřeba.' },
      { id: 'postrik', name: 'Postřik', haPerHour: 12.0, fuelPerHour: 9, note: 'Velký záběr, nízká spotřeba — nejlevnější na hektar.' },
      { id: 'hnojeni', name: 'Rozmetání hnojiv', haPerHour: 9.0, fuelPerHour: 10, note: 'Vysoký výkon plochy díky širokému rozhozu.' },
      { id: 'sklizen-obili', name: 'Sklizeň obilí (kombajn)', haPerHour: 2.5, fuelPerHour: 38, note: 'Samojízdný stroj, vysoká spotřeba motoru.' },
      { id: 'sklizen-pice', name: 'Sklizeň píce (řezačka/lis)', haPerHour: 3.0, fuelPerHour: 30, note: 'Energeticky náročná sklizňová operace.' },
    ],
    defaults: { fuelPrice: 32, laborCost: 280, maintenance: 150, area: 100 },
    faq: [
      { q: 'Co všechno se počítá do nákladů na hektar?', a: 'Tato kalkulačka pokrývá variabilní provozní náklady — palivo, práci obsluhy a paušál na opravy a údržbu. Nezahrnuje fixní náklady jako odpisy stroje, leasing, pojištění nebo garážování. Pro celkové náklady na hektar je třeba fixní náklady připočítat zvlášť.' },
      { q: 'Proč je orba dražší než postřik?', a: 'Orba je energeticky nejnáročnější operace — pluh klade velký tažný odpor, takže traktor spotřebuje hodně paliva a zvládne jen malou plochu za hodinu. Postřik má naopak široký záběr a malý odpor, takže stejná hodina práce pokryje mnohonásobně větší plochu.' },
      { q: 'Jak přesné jsou výchozí hodnoty výkonu plochy?', a: 'Přednastavené hodnoty (ha/h, l/h) jsou konzervativní české průměry pro stroj střední výkonové třídy. Skutečnost závisí na typu půdy, svažitosti, pracovní šířce nářadí a stylu jízdy. Hodnoty si proto upravte podle vlastní zkušenosti — kalkulačka je počítá dál automaticky.' },
      { q: 'Jakou cenu nafty mám zadat?', a: 'Zadejte cenu, za kterou reálně tankujete — zemědělci často využívají vratku spotřební daně z minerálních olejů (tzv. zelená nafta), takže efektivní cena bývá nižší než pumpová. Pro plánování použijte cenu po vratce.' },
    ],
  },
  sk: {
    title: 'Kalkulačka prevádzkových nákladov na hektár — palivo, práca, údržba',
    metaDescription: 'Vypočítajte prevádzkové náklady na hektár pre orbu, sejbu, postrek alebo zber. Spotreba nafty, výkon plochy, práca obsluhy — €/ha pre plánovanie farmy.',
    h1: 'Prevádzkové náklady na hektár',
    crumb: 'Náklady na hektár',
    kicker: 'Kalkulačka · ekonomika prevádzky',
    lede: 'Vyberte operáciu, upravte spotrebu a výkon plochy podľa svojich podmienok a doplňte ceny. Kalkulačka vypočíta variabilné náklady na hektár — palivo, prácu obsluhy a paušál na údržbu. Fixné náklady (odpisy, leasing, poistenie) je potrebné pripočítať zvlášť.',
    currency: 'EUR',
    numberLocale: 'sk-SK',
    form: {
      operation: 'Poľná operácia', haPerHour: 'Výkon plochy', fuelPerHour: 'Spotreba nafty',
      fuelPrice: 'Cena nafty (po vrátení)', laborCost: 'Práca obsluhy', maintenance: 'Údržba a opravy',
      maintenanceHint: 'Paušál na opravy, oleje, opotrebenie dielov.', area: 'Plocha (voliteľné)', areaHint: 'Na výpočet celkových nákladov a času.',
    },
    result: { perHaKicker: 'Prevádzkové náklady na hektár', fuel: 'Palivo', labor: 'Práca obsluhy', maint: 'Údržba', totalCost: 'Náklady spolu', workTime: 'Čas práce' },
    js: { perHa: '/ha', hoursH: 'h', hoursMin: 'min' },
    cta: { kicker: 'Plánujete obstaranie stroja?', heading: 'Vypočítajte si leasing alebo prejdite katalóg techniky', leasing: 'Kalkulačka leasingu', tractors: 'Katalóg traktorov', combines: 'Katalóg kombajnov' },
    operations: [
      { id: 'orba', name: 'Orba (pluh)', haPerHour: 1.2, fuelPerHour: 22, note: 'Náročná operácia — vysoká spotreba, malý výkon plochy.' },
      { id: 'podmitka', name: 'Podmietka / kyprenie', haPerHour: 3.5, fuelPerHour: 18, note: 'Plytké spracovanie, vyššia pojazdová rýchlosť.' },
      { id: 'seti', name: 'Sejba (sejacia kombinácia)', haPerHour: 4.0, fuelPerHour: 16, note: 'Široký záber, stredná spotreba.' },
      { id: 'postrik', name: 'Postrek', haPerHour: 12.0, fuelPerHour: 9, note: 'Veľký záber, nízka spotreba — najlacnejší na hektár.' },
      { id: 'hnojeni', name: 'Rozmetanie hnojív', haPerHour: 9.0, fuelPerHour: 10, note: 'Vysoký výkon plochy vďaka širokému rozhozu.' },
      { id: 'sklizen-obili', name: 'Zber obilia (kombajn)', haPerHour: 2.5, fuelPerHour: 38, note: 'Samojazdný stroj, vysoká spotreba motora.' },
      { id: 'sklizen-pice', name: 'Zber krmovín (rezačka/lis)', haPerHour: 3.0, fuelPerHour: 30, note: 'Energeticky náročná zberová operácia.' },
    ],
    defaults: { fuelPrice: 1.3, laborCost: 11, maintenance: 6, area: 100 },
    faq: [
      { q: 'Čo všetko sa počíta do nákladov na hektár?', a: 'Táto kalkulačka pokrýva variabilné prevádzkové náklady — palivo, prácu obsluhy a paušál na opravy a údržbu. Nezahŕňa fixné náklady ako odpisy stroja, leasing, poistenie alebo garážovanie. Pre celkové náklady na hektár je potrebné fixné náklady pripočítať zvlášť.' },
      { q: 'Prečo je orba drahšia než postrek?', a: 'Orba je energeticky najnáročnejšia operácia — pluh kladie veľký ťažný odpor, takže traktor spotrebuje veľa paliva a zvládne len malú plochu za hodinu. Postrek má naopak široký záber a malý odpor, takže rovnaká hodina práce pokryje mnohonásobne väčšiu plochu.' },
      { q: 'Aké presné sú východiskové hodnoty výkonu plochy?', a: 'Prednastavené hodnoty (ha/h, l/h) sú konzervatívne priemery pre stroj strednej výkonovej triedy. Skutočnosť závisí od typu pôdy, svahovitosti, pracovnej šírky náradia a štýlu jazdy. Hodnoty si preto upravte podľa vlastnej skúsenosti — kalkulačka ich počíta ďalej automaticky.' },
      { q: 'Akú cenu nafty mám zadať?', a: 'Zadajte cenu, za ktorú reálne tankujete — poľnohospodári často využívajú vrátenie spotrebnej dane z minerálnych olejov (tzv. zelená nafta), takže efektívna cena býva nižšia než pumpová. Na plánovanie použite cenu po vrátení.' },
    ],
  },
  uk: {} as NakladyContent,
};
