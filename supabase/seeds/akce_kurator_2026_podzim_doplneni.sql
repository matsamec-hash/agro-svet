-- akce_kurator_2026_podzim_doplneni.sql
-- Doplnění kalendáře o ověřené nadcházející akce (research 2026-07-22).
-- Konvence shodná s akce_kurator_2026.sql: zdroj='kurator', stav='zverejneno',
-- pristi_vyskyt=zacatek, ON CONFLICT (slug) DO NOTHING (idempotentní).
-- Termíny ověřené z oficiálních stránek pořadatelů (URL nad každým INSERTem).
-- Pozn.: DST 2026 končí 25. 10. → říjen/listopad = +01:00, září = +02:00.

-- zdroj: https://www.vll.cz/kun-2026
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'kun-lysa-2026', 'Kůň 2026 — 33. mezinárodní výstava koní',
  '33. mezinárodní výstava koní a veletrh všeho, co k nim patří, na Výstavišti Lysá nad Labem. Chovatelské přehlídky plemen, jezdecké ukázky a prodej ustájení, krmiv i jezdeckých potřeb. Speciální program k 500 letům Habsburků s Lipickou akademickou školou.',
  'vystavy-veletrhy', 'jednorazova', '2026-09-18T09:00:00+02:00', '2026-09-20T18:00:00+02:00',
  '2026-09-18T09:00:00+02:00', 'Lysá nad Labem', 'nymburk', 'stredocesky',
  50.20060, 14.83520, 'Výstaviště Lysá nad Labem', 'https://www.vll.cz/kun-2026',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://polagro.cz/akce/625-den-zemedelce-2026 · https://denzemedelce.cz/
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'den-zemedelce-uncovice-2026', 'Den zemědělce 2026 — Unčovice',
  'Celostátní kontraktační výstava a předváděcí den zemědělské techniky v Unčovicích u Litovle. Statické i dynamické ukázky traktorů, sklízecí a půdozpracující techniky předních značek, poradenství a nabídky prodejců.',
  'vystavy-veletrhy', 'jednorazova', '2026-09-09T09:00:00+02:00', '2026-09-10T17:00:00+02:00',
  '2026-09-09T09:00:00+02:00', 'Unčovice', 'olomouc', 'olomoucky',
  49.70160, 17.07940, 'POL-AGRO TRADING ZT', 'https://denzemedelce.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vll.cz/exotika-2026
-- POZOR: hraniční relevance (exotická fauna/flóra = spíš hobby chovatelství než
-- zemědělství). Pokud nechceš, tento INSERT vynech.
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'exotika-lysa-2026', 'Exotika 2026 — 18. celostátní výstava exotické fauny a flóry',
  '18. celostátní výstava exotické fauny a flóry na Výstavišti Lysá nad Labem — největší evropská výstava papoušků, bažantů, kachniček, plazů a akvarijních ryb doplněná exotickým rostlinným aranžmá.',
  'chovatelske-prehlidky', 'jednorazova', '2026-10-28T09:00:00+01:00', '2026-11-01T17:00:00+01:00',
  '2026-10-28T09:00:00+01:00', 'Lysá nad Labem', 'nymburk', 'stredocesky',
  50.20060, 14.83520, 'Výstaviště Lysá nad Labem', 'https://www.vll.cz/exotika-2026',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;
