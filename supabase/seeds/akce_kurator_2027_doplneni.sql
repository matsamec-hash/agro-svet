-- akce_kurator_2027_doplneni.sql
-- Doplnění kalendáře o ověřené akce na konec 2026 a rok 2027 (research 2026-11-15).
-- Konvence shodná s akce_kurator_2026.sql: zdroj='kurator', stav='zverejneno',
-- pristi_vyskyt=zacatek, ON CONFLICT (slug) DO NOTHING (idempotentní).
-- Termíny ověřené z oficiálních stránek pořadatelů (URL nad každým INSERTem).
-- Pozn.: DST 2027 začíná 28. 3. → leden–březen = +01:00, duben–červen = +02:00;
--        DST 2026 skončilo 25. 10. → listopad 2026 = +01:00.
-- Nezařazeno záměrně: Agrishow/Techagro Brno (další ročník až 2028), Kůň / Exotika /
-- Podzimní Zemědělec / Jiřinkové slavnosti Lysá (termín 2027 zatím neoznámen),
-- jarní Flora Olomouc 2027 (termín zatím neoznámen).

-- zdroj: https://www.vll.cz/cv-chovatel-2026
-- Pořadatelem není Výstaviště Lysá (uvádí stránka), konkrétní pořadatel není zveřejněn.
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'cv-chovatel-lysa-2026', 'CV chovatel 2026 — celostátní výstava drobného zvířectva',
  'Celostátní výstava drobného zvířectva na Výstavišti Lysá nad Labem — přehlídka chovatelů drobných hospodářských a okrasných zvířat. Otevřeno v pátek 10–18 h a v sobotu 9–16 h.',
  'chovatelske-prehlidky', 'jednorazova', '2026-11-20T10:00:00+01:00', '2026-11-21T16:00:00+01:00',
  '2026-11-20T10:00:00+01:00', 'Lysá nad Labem', 'nymburk', 'stredocesky',
  50.20060, 14.83520, NULL, 'https://www.vll.cz/cv-chovatel-2026',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vll.cz/nas-chovatel-2027
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'nas-chovatel-lysa-2027', 'Náš chovatel 2027 — 21. středočeská výstava drobného zvířectva',
  '21. středočeská výstava drobného zvířectva na Výstavišti Lysá nad Labem, rozšířená o celostátní speciální výstavy klubů chovatelů. Přibližně 1 300 okrasných holubů, 1 300 králíků a 500 kusů drůbeže, trh zvířat v sobotu 16. 1. v hale A1, poradenství a prodej chovatelských pomůcek, veterinárních přípravků a krmiv. Vystavování a trh s hrabavou a vodní drůbeží může být kvůli nákazové situaci omezen.',
  'chovatelske-prehlidky', 'jednorazova', '2027-01-15T10:00:00+01:00', '2027-01-16T16:00:00+01:00',
  '2027-01-15T10:00:00+01:00', 'Lysá nad Labem', 'nymburk', 'stredocesky',
  50.20060, 14.83520, 'Výstaviště Lysá nad Labem a Krajské sdružení Středočeského kraje ČSCH', 'https://www.vll.cz/nas-chovatel-2027',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vll.cz/jarni-zemedelec-2027 · https://www.vll.cz/farma-2027
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'jarni-zemedelec-lysa-2027', 'Jarní Zemědělec 2027 — 64. veletrh zahrádkářství, zemědělství a potravinářství',
  '64. ročník veletrhu na Výstavišti Lysá nad Labem: květiny, osivo, sazenice, stromky a keře, moderní zemědělská a zahradní technika, regionální potraviny a soutěž o nejlepší potravinářský výrobek Středočeského kraje. Vstupenka platí i na souběžnou výstavu hospodářských zvířat Farma 2027 (včetně mláďat) a Festival dechovky 2027. Otevřeno denně 9–17 h, v neděli 9–16 h.',
  'vystavy-veletrhy', 'jednorazova', '2027-03-17T09:00:00+01:00', '2027-03-21T16:00:00+01:00',
  '2027-03-17T09:00:00+01:00', 'Lysá nad Labem', 'nymburk', 'stredocesky',
  50.20060, 14.83520, 'Výstaviště Lysá nad Labem', 'https://www.vll.cz/jarni-zemedelec-2027',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://horse-expo.cz/
-- POZOR: dny 2.–4. 4. 2027 potvrzené, hodiny otevření na webu nejsou → 9–18 h je orientační
-- (shodně s ročníkem 2026). Hraniční relevance (jezdectví / hobby horsing).
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'horse-expo-praha-2027', 'Horse Expo 2027',
  'Druhý ročník veletrhu koní a hobby horsingu na PVA EXPO Praha v Letňanech (2.–4. 4. 2027). Hala 3: výstava, nákupy, přednášky a program pro děti. Hala 4: koně, ukázky jezdectví a večerní Night Show.',
  'vystavy-veletrhy', 'jednorazova', '2027-04-02T09:00:00+02:00', '2027-04-04T18:00:00+02:00',
  '2027-04-02T09:00:00+02:00', 'Praha', 'praha', 'praha',
  50.11740, 14.50000, 'Urban Elements s.r.o.', 'https://horse-expo.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vll.cz/natura-viva-2027
-- POZOR: hraniční relevance (myslivost, rybářství, včelařství, lesnictví — ne čisté zemědělství).
-- Stejně jako ročník 2026 v akce_kurator_2026.sql. Pokud nechceš, tento INSERT vynech.
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'natura-viva-lysa-2027', 'Natura Viva 2027 — 32. mezinárodní veletrh myslivosti, rybářství a včelařství',
  '32. mezinárodní veletrh myslivosti, rybářství, včelařství a pobytu v přírodě na Výstavišti Lysá nad Labem. Lovecká a rybářská výbava, optika a termovize, vybavení pro kynologii, odborné besedy na hlavním pódiu; vystavují Českomoravská myslivecká jednota, Český rybářský svaz, Český svaz včelařů, Lesy ČR a Fakulta lesnická a dřevařská ČZU. Otevřeno denně 9–17 h, v neděli 9–16 h.',
  'vystavy-veletrhy', 'jednorazova', '2027-05-19T09:00:00+02:00', '2027-05-23T16:00:00+02:00',
  '2027-05-19T09:00:00+02:00', 'Lysá nad Labem', 'nymburk', 'stredocesky',
  50.20060, 14.83520, 'Výstaviště Lysá nad Labem', 'https://www.vll.cz/natura-viva-2027',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vll.cz/kvety-2027
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'kvety-lysa-2027', 'Květy 2027 — 32. celostátní výstava květin a zahradnické trhy',
  '32. ročník celostátní přehlídky květin a zahradnických trhů na Výstavišti Lysá nad Labem. Monumentální květinová kompozice a prodej květin přímo od pěstitelů, kteří poradí s výběrem. Otevřeno denně 9–17 h, v neděli 9–16 h.',
  'vystavy-veletrhy', 'jednorazova', '2027-06-10T09:00:00+02:00', '2027-06-13T16:00:00+02:00',
  '2027-06-10T09:00:00+02:00', 'Lysá nad Labem', 'nymburk', 'stredocesky',
  50.20060, 14.83520, 'Výstaviště Lysá nad Labem', 'https://www.vll.cz/kvety-2027',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;
