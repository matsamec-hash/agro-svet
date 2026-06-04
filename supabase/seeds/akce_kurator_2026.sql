-- supabase/seeds/akce_kurator_2026.sql
-- Kurátorský seed velkých zemědělských / chovatelských / zahradnických akcí v ČR pro rok 2026.
-- zdroj='kurator', rovnou zveřejněné (stav='zverejneno'). Slouží k naplnění kalendáře akcí
-- při startu, aby stránka nebyla prázdná.
--
-- Termíny ověřené k 2026-06-05 dle oficiálních webů pořadatelů (zdrojové URL v komentářích
-- nad každým INSERT). Tam, kde se termín 2026 nepodařilo z oficiálního zdroje 100% potvrdit,
-- je u akce komentář "POZOR" a poznámka v popisu.
--
-- Idempotentní: každý INSERT je chráněn ON CONFLICT (slug) DO NOTHING, takže opětovné
-- spuštění nezduplikuje řádky.
--
-- Konvence: email='info@samecdigital.com', zdroj='kurator', stav='zverejneno',
-- druh='jednorazova', pristi_vyskyt = zacatek. Letní termíny +02:00, zimní +01:00.

-- zdroj: https://www.vcelaostrava.cz/cz/o-veletrhu/
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'vcela-veletrh-ostrava-2026', 'Včela!!! — včelařský jarní veletrh 2026',
  'Jarní včelařský veletrh na výstavišti Černá louka v Ostravě. Představuje se přes 80 včelařských firem z ČR, Slovenska a Polska, s přednáškami a workshopy pro začínající i zkušené včelaře.',
  'vystavy-veletrhy', 'jednorazova', '2026-03-06T09:00:00+01:00', '2026-03-07T17:00:00+01:00',
  '2026-03-06T09:00:00+01:00', 'Ostrava', 'ostrava-mesto', 'moravskoslezsky',
  49.83557, 18.29265, 'Výstaviště Černá louka, Ostrava', 'https://www.vcelaostrava.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.bvv.cz/en/agrishow/event-profile
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'agrishow-brno-2026', 'AGRISHOW 2026',
  'Nový mezinárodní zemědělský veletrh na brněnském výstavišti (nahrazuje Techagro). Spojuje rostlinnou i živočišnou výrobu, moderní zemědělskou techniku a trendy precizního zemědělství. Probíhá souběžně s Národní výstavou hospodářských zvířat a veletrhy SILVA REGINA a BIOMASA.',
  'vystavy-veletrhy', 'jednorazova', '2026-04-12T09:00:00+02:00', '2026-04-15T18:00:00+02:00',
  '2026-04-12T09:00:00+02:00', 'Brno', 'brno-mesto', 'jihomoravsky',
  49.18843, 16.58163, 'Veletrhy Brno, a. s. (BVV)', 'https://www.bvv.cz/agrishow/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.bvv.cz/narodni-vystava-hospodarskych-zvirat-brno
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'narodni-vystava-hospodarskych-zvirat-2026', 'Národní výstava hospodářských zvířat 2026',
  'Národní výstava hospodářských zvířat na brněnském výstavišti — šampionátové soutěže masných a mléčných plemen skotu, chovatelské přehlídky koní, prasat, ovcí a koz. Koná se souběžně s veletrhem AGRISHOW jako součást komplexu zemědělských a lesnických veletrhů.',
  'chovatelske-prehlidky', 'jednorazova', '2026-04-12T09:00:00+02:00', '2026-04-15T18:00:00+02:00',
  '2026-04-12T09:00:00+02:00', 'Brno', 'brno-mesto', 'jihomoravsky',
  49.18843, 16.58163, 'Veletrhy Brno, a. s. (BVV)', 'https://www.bvv.cz/narodni-vystava-hospodarskych-zvirat-brno/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vystavistekromeriz.cz/akce/2026-04-30-floria-jaro-2026---1.-cast-
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'floria-jaro-kromeriz-2026', 'Floria Jaro 2026',
  'Největší zahradnická prodejní výstava v ČR (48. ročník) na Výstavišti Kroměříž. Probíhá ve dvou částech: 30. 4.–3. 5. a 7.–10. 5. 2026. Přísady, květiny, okrasné i ovocné stromy a keře, zahradní nářadí a nábytek, bohatý doprovodný program. Tento záznam pokrývá obě části (od první do poslední).',
  'vystavy-veletrhy', 'jednorazova', '2026-04-30T09:00:00+02:00', '2026-05-10T17:00:00+02:00',
  '2026-04-30T09:00:00+02:00', 'Kroměříž', 'kromeriz', 'zlinsky',
  49.29897, 17.39750, 'Výstaviště Kroměříž', 'https://www.vystavistekromeriz.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://af.mendelu.cz/mendelagro/
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'polni-den-mendelagro-2026', 'Polní den MendelAgro 2026',
  'Největší prezentační polní den Mendelovy univerzity v Brně pro zemědělskou veřejnost. Na Polní pokusné stanici Žabčice si lze prohlédnout řadu polních pokusů se všemi významnými polními plodinami. Koná se v pátek 5. 6. 2026 od 9:00 do 13:00.',
  'polni-dny', 'jednorazova', '2026-06-05T09:00:00+02:00', '2026-06-05T13:00:00+02:00',
  '2026-06-05T09:00:00+02:00', 'Žabčice', 'brno-venkov', 'jihomoravsky',
  49.01556, 16.61500, 'Mendelova univerzita v Brně, Agronomická fakulta', 'https://af.mendelu.cz/mendelagro/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://nasepole.cz/ ; https://www.cazv.cz/nase-pole-2026/
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'nase-pole-nabocany-2026', 'Naše pole Nabočany 2026',
  'Celostátní polní výstava odrůdových pokusů zemědělských plodin, systémů ochrany a výživy rostlin a zemědělské techniky. Koná se 16.–17. 6. 2026 v Nabočanech u Chrudimi.',
  'polni-dny', 'jednorazova', '2026-06-16T09:00:00+02:00', '2026-06-17T17:00:00+02:00',
  '2026-06-16T09:00:00+02:00', 'Nabočany', 'chrudim', 'pardubicky',
  49.92710, 15.74560, 'Naše pole', 'https://nasepole.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vystavistekromeriz.cz/akce/2026-08-07-floria-leto-2026
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'floria-leto-kromeriz-2026', 'Floria Léto 2026',
  'Letní zahradnická prodejní výstava na Výstavišti Kroměříž (7.–9. 8. 2026). Unikátní expozice tisíců květin, květinová aranžmá, desítky prodejců okrasných rostlin, bylinek, zeleniny a řemeslných výrobků.',
  'vystavy-veletrhy', 'jednorazova', '2026-08-07T09:00:00+02:00', '2026-08-09T17:00:00+02:00',
  '2026-08-07T09:00:00+02:00', 'Kroměříž', 'kromeriz', 'zlinsky',
  49.29897, 17.39750, 'Výstaviště Kroměříž', 'https://www.vystavistekromeriz.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.vcb.cz/kalendar-akci/zeme-zivitelka-2026 ; https://www.zemezivitelka.cz/
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'zeme-zivitelka-2026', 'Země živitelka 2026',
  'Největší a nejvýznamnější zemědělská výstava v ČR (52. ročník) — jediná výstava, která zahrnuje celý zemědělsko-potravinářský sektor. Na 21 ha výstavní plochy nejmodernější zemědělská technika, hospodářská zvířata, potraviny a bohatý odborný program. Koná se 20.–25. 8. 2026 na Výstavišti České Budějovice.',
  'vystavy-veletrhy', 'jednorazova', '2026-08-20T09:00:00+02:00', '2026-08-25T18:00:00+02:00',
  '2026-08-20T09:00:00+02:00', 'České Budějovice', 'ceske-budejovice', 'jihocesky',
  48.97658, 14.44476, 'Výstaviště České Budějovice a.s.', 'https://www.vcb.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://www.zscr.cz/kalendar/den-zemedelce-dod-vod-kamen-u-pelhrimova-276 ; https://denzemedelce.cz/
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'den-zemedelce-kamen-2026', 'Den zemědělce — Kámen u Pelhřimova 2026',
  'Tradiční polní výstava zemědělské techniky v akci na polním letišti Kámen u Pelhřimova, spojená se dnem otevřených dveří. Předvádění traktorů, secích a sklízecích strojů v reálném provozu. POZOR: termín 13.–14. 9. 2026 je orientační dle obvyklého zářijového konání; před zveřejněním ověřte u pořadatele.',
  'polni-dny', 'jednorazova', '2026-09-13T09:00:00+02:00', '2026-09-14T17:00:00+02:00',
  '2026-09-13T09:00:00+02:00', 'Kámen', 'pelhrimov', 'vysocina',
  49.39230, 15.05640, 'Zemědělský svaz ČR', 'https://denzemedelce.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;

-- zdroj: https://akce.flora-ol.cz/flora-olomouc-hortikomplex-2026
INSERT INTO akce (slug, nazev, popis, typ, druh, zacatek, konec, pristi_vyskyt,
  obec, okres_slug, kraj_slug, lat, lng, poradatel, web, email, zdroj, stav, zverejneno_at)
VALUES (
  'flora-olomouc-hortikomplex-2026', 'Flora Olomouc — Hortikomplex 2026',
  'Podzimní etapa výstavy Flora Olomouc — velkolepá tradiční přehlídka a prezentace českých i moravských pěstitelů ovoce a zeleniny na Výstavišti Flora Olomouc. Koná se 8.–11. 10. 2026 od 9:00 do 17:00.',
  'vystavy-veletrhy', 'jednorazova', '2026-10-08T09:00:00+02:00', '2026-10-11T17:00:00+02:00',
  '2026-10-08T09:00:00+02:00', 'Olomouc', 'olomouc', 'olomoucky',
  49.58980, 17.26720, 'Výstaviště Flora Olomouc, a. s.', 'https://akce.flora-ol.cz/',
  'info@samecdigital.com', 'kurator', 'zverejneno', now()
) ON CONFLICT (slug) DO NOTHING;
