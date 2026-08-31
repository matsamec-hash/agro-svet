// Německá vrstva sezónní sekce (trh Německo + Rakousko).
//
// ‼️ MĚSÍCE SETÍ A SKLIZNĚ SE NEMĚNÍ. Jsou v plodina YAML (seti_mesice /
// sklizen_mesice) a na měsíční granularitě vycházejí pro ČR, Německo i Rakousko
// stejně — všechny tři leží ve stejném pásu (Praha 50°, Berlín 52°, Vídeň 48°).
// Stránka to ale říká nahlas (`sez.note`), aby to nevypadalo jako německy
// měřená data. Stejný princip jako u sezona.pl.ts.
//
// ‼️ ODKAZY NA PRÁCE se NEPŘEKLÁDAJÍ — cs míří na /jak-na-to a /pruvodce, které
// pro de launchnuté NEJSOU. Nahrazené odkazy míří výhradně do launchnutých DE
// sekcí (/de/choroby, /de/stroje, /de/zebricky, /de/slovnik), jinak by karta
// vedla do češtiny.
import type { SeasonSlug, SeasonContent } from './sezona';

export const MONTH_NAMES_DE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

/** Ustálené německé zkratky měsíců. „März" se zkracuje „Mär", ne „Mrz". */
export const MONTH_SHORT_DE = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez',
];

/** Názvy ročních období; slugy zůstávají cs (jsou to URL klíče). */
export const SEASON_NAMES_DE: Record<SeasonSlug, string> = {
  jaro: 'Frühjahr', leto: 'Sommer', podzim: 'Herbst', zima: 'Winter',
};

export const SEASON_CONTENT_DE: Record<SeasonSlug, SeasonContent> = {
  jaro: {
    lead: `Im Frühjahr werden die Sommerungen bestellt — Sommergerste, Hafer, Zuckerrüben, Sonnenblume, Mais und Körnerleguminosen. Die bestimmenden Arbeiten sind Saatbettbereitung, die Andüngung der Winterungen zu Vegetationsbeginn und ein zügiger Saattermin: Jede Woche Verzug bei Sommergetreide kostet Ertrag, weil die Kornfüllung dann in die Frühsommertrockenheit fällt.`,
    workLinks: [
      { href: '/de/choroby/', label: `Krankheiten und Schädlinge im Frühjahr` },
      { href: '/de/stroje/', label: `Technik für Bodenbearbeitung und Aussaat` },
      { href: '/de/slovnik/', label: `Fachbegriffe zur Saatbettbereitung` },
    ],
    faq: [
      { q: `Was wird im Frühjahr ausgesät?`, a: `Von Ende Februar bis Anfang April Sommergerste, Hafer und Sommerweizen, ab Mitte März Zuckerrüben, ab April Sonnenblume und Mais. Körnererbsen und Ackerbohnen gehören zu den frühesten Saaten überhaupt.` },
      { q: `Warum ist der frühe Saattermin bei Sommergetreide so wichtig?`, a: `Die frühe Saat nutzt die Winterfeuchte und verlängert die Vegetationszeit. Sommergerste bestockt kaum; jede Woche Verzug ab Mitte März senkt den Ertrag spürbar und treibt bei Braugerste zugleich den Eiweißgehalt über die Annahmegrenze.` },
      { q: `Welche Arbeiten bestimmen das Frühjahr?`, a: `Saatbettbereitung, die Andüngung der Winterungen nach Düngebedarfsermittlung, die Aussaat der Sommerungen sowie die ersten Herbizid- und Wachstumsreglermaßnahmen im Getreide.` },
    ],
  },
  leto: {
    lead: `Der Sommer ist die Erntezeit: Wintergerste eröffnet Anfang Juli, es folgen Winterraps, Winterweizen, Roggen und Triticale, zuletzt die Sommerungen. Parallel laufen Grünfutterernte, Stroh- und Heubergung sowie unmittelbar nach dem Drusch die Stoppelbearbeitung.`,
    workLinks: [
      { href: '/de/stroje/kombajny/', label: `Mähdrescher im Katalog` },
      { href: '/de/zebricky/', label: `Ranglisten nach Leistung und Arbeitsbreite` },
      { href: '/de/choroby/', label: `Krankheiten im abreifenden Bestand` },
    ],
    faq: [
      { q: `Wann beginnt die Getreideernte?`, a: `In Deutschland und Österreich eröffnet die Wintergerste die Ernte Anfang Juli, danach folgen Winterraps und Winterweizen, im August Sommergetreide, Körnermais und Sonnenblume.` },
      { q: `Warum wird direkt nach der Ernte die Stoppel bearbeitet?`, a: `Um die Kapillarverbindung zu unterbrechen und damit Bodenwasser zu halten, Ausfallgetreide und Unkrautsamen zum Keimen zu bringen und die Strohrotte zu fördern — das senkt zugleich den Fusariumdruck der Folgekultur.` },
      { q: `Worauf kommt es bei der Ernte an?`, a: `Auf die Kornfeuchte: Getreide wird bei rund 14 % gedroschen, feuchtere Ware muss getrocknet werden. Verzögert sich die Ernte durch Regen, drohen Auswuchs und Fallzahlverlust — aus Brotweizen wird dann Futterweizen.` },
    ],
  },
  podzim: {
    lead: `Der Herbst gehört der Bestellung der Winterungen: zuerst Winterraps im August, dann Wintergerste, danach Winterweizen, Roggen und Triticale bis in den Oktober. Dazu kommen Zwischenfruchtaussaat, Kartoffel- und Rübenernte sowie Grunddüngung und Kalkung.`,
    workLinks: [
      { href: '/de/stroje/', label: `Technik für Bestellung und Ernte` },
      { href: '/de/choroby/', label: `Herbstbehandlungen und Schaderreger` },
      { href: '/de/slovnik/', label: `Fachbegriffe zu Düngung und Bestellung` },
    ],
    faq: [
      { q: `Was wird im Herbst gesät?`, a: `Ab Mitte August Winterraps, ab Mitte September Wintergerste, ab Ende September bis Ende Oktober Winterweizen, Roggen und Triticale. Zwischenfrüchte folgen unmittelbar nach der Ernte der Vorfrucht.` },
      { q: `Warum lohnt sich eine spätere Weizensaat?`, a: `Eine Saat ab Anfang Oktober senkt den Druck durch Acker-Fuchsschwanz, Virusvektoren und frühen Septoriabefall erheblich. Der Ertragsnachteil ist gering, der Vorteil beim Pflanzenschutz erheblich.` },
      { q: `Was ist bei Zwischenfrüchten zu beachten?`, a: `Sie erfüllen die Bodenbedeckung nach GLÖZ 6, binden Reststickstoff und sind in roten Gebieten nach Düngeverordnung teils vorgeschrieben. In rapsstarken Fruchtfolgen gehören Senf und Ölrettich als Kreuzblütler nicht in die Mischung.` },
    ],
  },
  zima: {
    lead: `Der Winter ist die Zeit für Planung, Technik und Papier: Maschinenwartung, Anbauplanung, Bodenuntersuchung und Düngebedarfsermittlung, Sortenwahl und Saatgutbestellung — und die Vorbereitung des Sammelantrags. Im Stall läuft die Arbeit unverändert weiter.`,
    workLinks: [
      { href: '/de/stroje/', label: `Maschinenkatalog für die Anschaffungsplanung` },
      { href: '/de/direktzahlungen/', label: `Direktzahlungen — Beträge je Hektar` },
    ],
    faq: [
      { q: `Welche Arbeiten fallen im Winter an?`, a: `Wartung und Instandsetzung der Maschinen, Anbauplanung und Fruchtfolge, Bodenuntersuchung, Düngebedarfsermittlung, Sortenwahl, Saatgut- und Betriebsmittelbestellung sowie die Vorbereitung des Antrags.` },
      { q: `Wann wird der Sammelantrag gestellt?`, a: `In Deutschland läuft die Antragstellung im Frühjahr mit Frist Mitte Mai, in Österreich endet der Mehrfachantrag Ende April. Die Vorbereitung — Flächenabgleich, Nutzungscodes, Auswahl der Öko-Regelungen — gehört in den Winter.` },
    ],
  },
};
