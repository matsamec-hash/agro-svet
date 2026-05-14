// Wikimedia Commons photo backfill for 12 brands that had zero series photos.
// Downloads each source image, processes it (1280×720 webp, sharp cover, q82),
// saves to public/images/stroje/<brand>/, and injects image_* fields into the
// brand YAML right after the matching `- slug:` line.
//
// All sources are Wikimedia Commons with verified free licenses (CC BY / BY-SA
// 2.0–4.0, CC0, Public Domain) — discovered by a research pass, no dealer or
// magazine images.
//
// Usage: node scripts/wikimedia-photos-12-brands.mjs
// Re-running is safe — YAML inject skips series that already have image_url.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';

// { brand, slug, src (download URL), file (Commons File: page), license, author }
const UPDATES = [
  // ── Amazone ──
  { brand: 'amazone', slug: 'zg-ts', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/ZG-TS10001-profis-pro_Claas_d0_kw_P4031479_d2_230803.jpg', file: 'https://commons.wikimedia.org/wiki/File:ZG-TS10001-profis-pro_Claas_d0_kw_P4031479_d2_230803.jpg', license: 'CC BY-SA 4.0', author: 'Dr. Jan Robert Wibbing' },
  { brand: 'amazone', slug: 'pantera', src: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/AMAZONE_Pantera.jpg', file: 'https://commons.wikimedia.org/wiki/File:AMAZONE_Pantera.jpg', license: 'CC BY-SA 3.0', author: 'Amazone GmbH & Co. KG' },
  { brand: 'amazone', slug: 'ux', src: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Amazone_Ux_7601_super.jpg', file: 'https://commons.wikimedia.org/wiki/File:Amazone_Ux_7601_super.jpg', license: 'Public domain', author: 'Blonder1984' },
  { brand: 'amazone', slug: 'uf', src: 'https://upload.wikimedia.org/wikipedia/commons/5/58/Amazone_UF_2002_Agritechnica_2025_(DSC05134).jpg', file: 'https://commons.wikimedia.org/wiki/File:Amazone_UF_2002_Agritechnica_2025_(DSC05134).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'amazone', slug: 'cirrus', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Amazone_Cirrus_8004-2C_Grand_Agritechnica_2025_(DSC05087).jpg', file: 'https://commons.wikimedia.org/wiki/File:Amazone_Cirrus_8004-2C_Grand_Agritechnica_2025_(DSC05087).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'amazone', slug: 'cataya', src: "https://upload.wikimedia.org/wikipedia/commons/5/5d/Sommet_de_l'%C3%89levage_2019_-_Semoir_Amazone_Cataya_3000_Super.jpg", file: "https://commons.wikimedia.org/wiki/File:Sommet_de_l%27%C3%89levage_2019_-_Semoir_Amazone_Cataya_3000_Super.jpg", license: 'CC BY-SA 4.0', author: 'Sebleouf' },
  { brand: 'amazone', slug: 'precea', src: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Precea6000-TCC_Fendt_d0_mp_DJI_0317_d1_240318.jpg', file: 'https://commons.wikimedia.org/wiki/File:Precea6000-TCC_Fendt_d0_mp_DJI_0317_d1_240318.jpg', license: 'CC BY-SA 4.0', author: 'Dr. Jan Robert Wibbing' },
  { brand: 'amazone', slug: 'catros', src: 'https://upload.wikimedia.org/wikipedia/commons/0/02/CatrosPLUS3003special_CB_Case_d0_kw_DJI_1104_d1_230614.jpg', file: 'https://commons.wikimedia.org/wiki/File:CatrosPLUS3003special_CB_Case_d0_kw_DJI_1104_d1_230614.jpg', license: 'CC BY-SA 4.0', author: 'Dr. Jan Robert Wibbing' },
  { brand: 'amazone', slug: 'catros-xl', src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Sommet_de_l'%C3%89levage_2019_-_D%C3%A9chaumeur_%C3%A0_disques_ind%C3%A9pendants_port%C3%A9_Amazone_Catros_XL_3003.jpg", file: "https://commons.wikimedia.org/wiki/File:Sommet_de_l%27%C3%89levage_2019_-_D%C3%A9chaumeur_%C3%A0_disques_ind%C3%A9pendants_port%C3%A9_Amazone_Catros_XL_3003.jpg", license: 'CC BY-SA 4.0', author: 'Sebleouf' },
  { brand: 'amazone', slug: 'cenius', src: "https://upload.wikimedia.org/wikipedia/commons/0/03/Sommet_de_l'%C3%89levage_2019_-_Cultivateur_port%C3%A9_Amazone_Cenius_3003_Super.jpg", file: "https://commons.wikimedia.org/wiki/File:Sommet_de_l%27%C3%89levage_2019_-_Cultivateur_port%C3%A9_Amazone_Cenius_3003_Super.jpg", license: 'CC BY-SA 4.0', author: 'Sebleouf' },

  // ── Bednar ──
  { brand: 'bednar', slug: 'swifter', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Bednar_swifterdisc.jpg', file: 'https://commons.wikimedia.org/wiki/File:Bednar_swifterdisc.jpg', license: 'CC BY-SA 4.0', author: 'Blonder1984' },
  { brand: 'bednar', slug: 'fenix', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Bednar_Grubber.jpg', file: 'https://commons.wikimedia.org/wiki/File:Bednar_Grubber.jpg', license: 'CC BY-SA 4.0', author: 'Blonder1984' },

  // ── Horsch ──
  { brand: 'horsch', slug: 'pronto', src: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Horsch_Pronto_7_DC_agra_2024_(DSC03799).jpg', file: 'https://commons.wikimedia.org/wiki/File:Horsch_Pronto_7_DC_agra_2024_(DSC03799).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'horsch', slug: 'maestro', src: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Horsch_Maestro_12_TX_Agritechnica_2025_(DSC07412).jpg', file: 'https://commons.wikimedia.org/wiki/File:Horsch_Maestro_12_TX_Agritechnica_2025_(DSC07412).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'horsch', slug: 'avatar', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Horsch_Avatar,_Agritechnica_2023,_Hanover_(P1140845).jpg', file: 'https://commons.wikimedia.org/wiki/File:Horsch_Avatar,_Agritechnica_2023,_Hanover_(P1140845).jpg', license: 'CC BY-SA 4.0', author: 'MB-one' },
  { brand: 'horsch', slug: 'terrano', src: 'https://upload.wikimedia.org/wikipedia/commons/4/49/John_Deere_8R340_mit_Horsch_Terrano_Grubber_(2024).jpg', file: 'https://commons.wikimedia.org/wiki/File:John_Deere_8R340_mit_Horsch_Terrano_Grubber_(2024).jpg', license: 'CC BY-SA 4.0', author: 'JoachimKohler-HB' },
  { brand: 'horsch', slug: 'leeb-pt', src: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Horsch_Leeb_6.300_PT.jpg', file: 'https://commons.wikimedia.org/wiki/File:Horsch_Leeb_6.300_PT.jpg', license: 'CC BY-SA 4.0', author: 'Manataworfl' },

  // ── JCB ──
  { brand: 'jcb', slug: 'loadall-527', src: 'https://upload.wikimedia.org/wikipedia/commons/d/da/JCB_527-58_Agri_Loadall_01.jpg', file: 'https://commons.wikimedia.org/wiki/File:JCB_527-58_Agri_Loadall_01.jpg', license: 'CC BY 3.0', author: 'Huhu Uet' },
  { brand: 'jcb', slug: 'fastrac-2000', src: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/JCB_Fastrac_2135.png', file: 'https://commons.wikimedia.org/wiki/File:JCB_Fastrac_2135.png', license: 'CC BY-SA 4.0', author: 'SE420' },
  { brand: 'jcb', slug: 'fastrac-4000', src: 'https://upload.wikimedia.org/wikipedia/commons/d/df/JCB_Fastrac_4220_agra_2022_(DSC04323).jpg', file: 'https://commons.wikimedia.org/wiki/File:JCB_Fastrac_4220_agra_2022_(DSC04323).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'jcb', slug: 'fastrac-8000', src: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/JCB_Fastrac_8330_Agritechnica_2019_-_Front_and_right_side.jpg', file: 'https://commons.wikimedia.org/wiki/File:JCB_Fastrac_8330_Agritechnica_2019_-_Front_and_right_side.jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },

  // ── Joskin ──
  { brand: 'joskin', slug: 'modulo-2', src: 'https://upload.wikimedia.org/wikipedia/commons/2/22/Joskin_Modulo_2_Werktuigendagen_2009.jpg', file: 'https://commons.wikimedia.org/wiki/File:Joskin_Modulo_2_Werktuigendagen_2009.jpg', license: 'CC BY-SA 2.0', author: 'werktuigendagen' },
  { brand: 'joskin', slug: 'tornado3', src: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Tornado3.jpg', file: 'https://commons.wikimedia.org/wiki/File:Tornado3.jpg', license: 'CC BY-SA 4.0', author: 'Blonder1984' },
  { brand: 'joskin', slug: 'pendislide', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Joskin_Injektor.jpg', file: 'https://commons.wikimedia.org/wiki/File:Joskin_Injektor.jpg', license: 'CC BY-SA 3.0', author: 'Blonder1984' },
  { brand: 'joskin', slug: 'komfort-2', src: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Joskin_tr.jpg', file: 'https://commons.wikimedia.org/wiki/File:Joskin_tr.jpg', license: 'Public domain', author: 'Blonder1984' },
  { brand: 'joskin', slug: 'trans-cap', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Deutz-Fahr_Agrotron_mit_Joskin-Kipper.jpg', file: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_Agrotron_mit_Joskin-Kipper.jpg', license: 'CC BY-SA 2.0', author: 'werktuigendagen' },
  { brand: 'joskin', slug: 'drakkar', src: 'https://upload.wikimedia.org/wikipedia/commons/3/37/Joskin_trailer.JPG', file: 'https://commons.wikimedia.org/wiki/File:Joskin_trailer.JPG', license: 'CC BY-SA 3.0', author: 'Blonder1984' },

  // ── Krone ──
  { brand: 'krone', slug: 'big-x', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Krone_BiG_X_1180_Agritechnica_2025_(DSC07614).jpg', file: 'https://commons.wikimedia.org/wiki/File:Krone_BiG_X_1180_Agritechnica_2025_(DSC07614).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'krone', slug: 'big-pack', src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Krone_BiG_Pack_1290_HDP_VC_agra_2024_(DSC01157).jpg', file: 'https://commons.wikimedia.org/wiki/File:Krone_BiG_Pack_1290_HDP_VC_agra_2024_(DSC01157).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'krone', slug: 'easycut-b', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Krone_EasyCut_3210_CV_trailed_mower_at_lamma_2010_-_IMG_7593.jpg', file: 'https://commons.wikimedia.org/wiki/File:Krone_EasyCut_3210_CV_trailed_mower_at_lamma_2010_-_IMG_7593.jpg', license: 'CC BY-SA 3.0', author: 'BulldozerD11' },
  { brand: 'krone', slug: 'comprima', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/New_Holland_TM_165_met_Krone_Comprina_balenpers.jpg', file: 'https://commons.wikimedia.org/wiki/File:New_Holland_TM_165_met_Krone_Comprina_balenpers.jpg', license: 'CC BY-SA 4.0', author: 'HenkvD' },
  { brand: 'krone', slug: 'big-m', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Krone_BiG_M_450_Agritechnica_2025_(DSC09564).jpg', file: 'https://commons.wikimedia.org/wiki/File:Krone_BiG_M_450_Agritechnica_2025_(DSC09564).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'krone', slug: 'swadro-ts', src: 'https://upload.wikimedia.org/wikipedia/commons/3/33/2018-11-09_(105)_Krone_rotary_rake_Swadro_TS_620_Wilhersdorf,_St._Margarethen_an_der_Sierning,_Austria.jpg', file: 'https://commons.wikimedia.org/wiki/File:2018-11-09_(105)_Krone_rotary_rake_Swadro_TS_620_Wilhersdorf,_St._Margarethen_an_der_Sierning,_Austria.jpg', license: 'CC BY-SA 4.0', author: 'GT1976' },
  { brand: 'krone', slug: 'mx', src: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Krone_AX_280_GL_loader_wagon_at_lamma_2010_-_IMG_7596.jpg', file: 'https://commons.wikimedia.org/wiki/File:Krone_AX_280_GL_loader_wagon_at_lamma_2010_-_IMG_7596.jpg', license: 'CC BY-SA 3.0', author: 'BulldozerD11' },

  // ── Kuhn ──
  { brand: 'kuhn', slug: 'vb', src: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Kuhn_baler.jpg', file: 'https://commons.wikimedia.org/wiki/File:Kuhn_baler.jpg', license: 'CC BY-SA 4.0', author: 'Cjp24' },
  { brand: 'kuhn', slug: 'gmd', src: 'https://upload.wikimedia.org/wikipedia/commons/8/87/New_Holland_T4040_Traktor_mit_Kuhn_Kreiselm%C3%A4her.jpg', file: 'https://commons.wikimedia.org/wiki/File:New_Holland_T4040_Traktor_mit_Kuhn_Kreiselm%C3%A4her.jpg', license: 'CC BY-SA 4.0', author: 'JoachimKohler-HB' },
  { brand: 'kuhn', slug: 'fc', src: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/John_Deere_6420_mit_Kuhn_Kreiselm%C3%A4hwerk.jpg', file: 'https://commons.wikimedia.org/wiki/File:John_Deere_6420_mit_Kuhn_Kreiselm%C3%A4hwerk.jpg', license: 'CC BY-SA 4.0', author: 'JoachimKohler-HB' },
  { brand: 'kuhn', slug: 'master', src: 'https://upload.wikimedia.org/wikipedia/commons/5/53/John_Deere_6920_S_with_Kuhn_plough.jpg', file: 'https://commons.wikimedia.org/wiki/File:John_Deere_6920_S_with_Kuhn_plough.jpg', license: 'CC BY-SA 2.0', author: 'werktuigendagen' },

  // ── Kverneland ──
  { brand: 'kverneland', slug: 'u-drill', src: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Kverneland_u-drill_6000_seed_drill.jpg', file: 'https://commons.wikimedia.org/wiki/File:Kverneland_u-drill_6000_seed_drill.jpg', license: 'CC BY-SA 4.0', author: 'Jean Housen' },
  { brand: 'kverneland', slug: 'ts-evo', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Kverneland_ts-drill_Agritechnica_2025_(DSC06911).jpg', file: 'https://commons.wikimedia.org/wiki/File:Kverneland_ts-drill_Agritechnica_2025_(DSC06911).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'kverneland', slug: 'optima', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Kverneland_Optima_F_SX_Agritechnica_2026_(DSC06760).jpg', file: 'https://commons.wikimedia.org/wiki/File:Kverneland_Optima_F_SX_Agritechnica_2026_(DSC06760).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'kverneland', slug: '5000-m', src: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Kverneland_3232_MN_Centre_Mounted_Mower_Conditioners.jpg', file: 'https://commons.wikimedia.org/wiki/File:Kverneland_3232_MN_Centre_Mounted_Mower_Conditioners.jpg', license: 'CC BY-SA 4.0', author: 'Vauxford' },

  // ── Lemken ──
  { brand: 'lemken', slug: 'rubin', src: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Lemken_Rubin9.jpg', file: 'https://commons.wikimedia.org/wiki/File:Lemken_Rubin9.jpg', license: 'CC BY-SA 3.0', author: 'MarkusHagenlocher' },
  { brand: 'lemken', slug: 'karat-koralin-kristall', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Lemken_Karat_9.JPG', file: 'https://commons.wikimedia.org/wiki/File:Lemken_Karat_9.JPG', license: 'CC BY-SA 3.0', author: 'Blonder1984' },
  { brand: 'lemken', slug: 'diamant', src: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Massey_Ferguson_Traktor_mit_Lemken_Vari-Diamant_Pflug_in_Vorpommern_(2017).jpg', file: 'https://commons.wikimedia.org/wiki/File:Massey_Ferguson_Traktor_mit_Lemken_Vari-Diamant_Pflug_in_Vorpommern_(2017).jpg', license: 'CC BY-SA 4.0', author: 'JoachimKohler-HB' },
  { brand: 'lemken', slug: 'solitair', src: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Lemken_Solitair_9%2B_Agritechnica_2023_(DSC06062).jpg', file: 'https://commons.wikimedia.org/wiki/File:Lemken_Solitair_9%2B_Agritechnica_2023_(DSC06062).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'lemken', slug: 'saphir', src: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Lemken_Saphir_7.jpg', file: 'https://commons.wikimedia.org/wiki/File:Lemken_Saphir_7.jpg', license: 'CC BY-SA 2.0', author: 'werktuigendagen' },
  { brand: 'lemken', slug: 'system-kompaktor-korund', src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Lemken_Kompaktor.JPG', file: 'https://commons.wikimedia.org/wiki/File:Lemken_Kompaktor.JPG', license: 'CC BY-SA 3.0', author: '4028mdk09' },

  // ── Manitou ──
  { brand: 'manitou', slug: 'mlt-737', src: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Manitou_MLT_742-140_V%2B_Platinum_Agritechnica_2025_(DSC07077).jpg', file: 'https://commons.wikimedia.org/wiki/File:Manitou_MLT_742-140_V%2B_Platinum_Agritechnica_2025_(DSC07077).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'manitou', slug: 'mlt-625', src: 'https://upload.wikimedia.org/wikipedia/commons/8/85/2021_Manitou_MLT_630-105_3.6.jpg', file: 'https://commons.wikimedia.org/wiki/File:2021_Manitou_MLT_630-105_3.6.jpg', license: 'CC BY-SA 4.0', author: 'Vauxford' },
  { brand: 'manitou', slug: 'mt-x-625', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/2021_Manitou_MT_625_H.jpg', file: 'https://commons.wikimedia.org/wiki/File:2021_Manitou_MT_625_H.jpg', license: 'CC BY-SA 4.0', author: 'Calreyn88' },

  // ── Pöttinger ──
  { brand: 'pottinger', slug: 'novacat', src: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/P%C3%B6ttinger-M%C3%A4hwerk-2008.JPG', file: 'https://commons.wikimedia.org/wiki/File:P%C3%B6ttinger-M%C3%A4hwerk-2008.JPG', license: 'CC BY-SA 3.0', author: 'Bene16' },
  { brand: 'pottinger', slug: 'servo', src: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Deutz-Fahr_Agrotron_TTV_420,_P%C3%B6ttinger_Servo_35_S.jpg', file: 'https://commons.wikimedia.org/wiki/File:Deutz-Fahr_Agrotron_TTV_420,_P%C3%B6ttinger_Servo_35_S.jpg', license: 'CC BY-SA 3.0', author: 'bdk' },
  { brand: 'pottinger', slug: 'terradisc', src: 'https://upload.wikimedia.org/wikipedia/commons/5/56/P%C3%B6ttinger_Terradisc_HT_12000_Agritechnica_2025_(DSC09129).jpg', file: 'https://commons.wikimedia.org/wiki/File:P%C3%B6ttinger_Terradisc_HT_12000_Agritechnica_2025_(DSC09129).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'pottinger', slug: 'jumbo', src: 'https://upload.wikimedia.org/wikipedia/commons/3/38/P%C3%B6ttinger_Jumbo_8540_agra_2026_(DSC2774).jpg', file: 'https://commons.wikimedia.org/wiki/File:P%C3%B6ttinger_Jumbo_8540_agra_2026_(DSC2774).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },

  // ── Väderstad ──
  { brand: 'vaderstad', slug: 'rapid-a', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7f/V%C3%A4derstad_Rapid_A_600S_Agritechnica_2025_(DSC07407).jpg', file: 'https://commons.wikimedia.org/wiki/File:V%C3%A4derstad_Rapid_A_600S_Agritechnica_2025_(DSC07407).jpg', license: 'CC BY-SA 4.0', author: 'MarcelX42' },
  { brand: 'vaderstad', slug: 'rapid-rd', src: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Vaderstad_Rapid_RDA400_Seed_Drill.jpg', file: 'https://commons.wikimedia.org/wiki/File:Vaderstad_Rapid_RDA400_Seed_Drill.jpg', license: 'CC BY-SA 4.0', author: 'Vauxford' },
  { brand: 'vaderstad', slug: 'carrier', src: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Merzse-mocs%C3%A1r,_V%C3%A4derstad_Carrier_650_talajm%C5%B1vel%C5%91_g%C3%A9p,_2016_Budapest.jpg', file: 'https://commons.wikimedia.org/wiki/File:Merzse-mocs%C3%A1r,_V%C3%A4derstad_Carrier_650_talajm%C5%B1vel%C5%91_g%C3%A9p,_2016_Budapest.jpg', license: 'CC BY-SA 3.0', author: 'Globetrotter19' },
  { brand: 'vaderstad', slug: 'tempo-l', src: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Vaderstad-tempo-world-record.jpg', file: 'https://commons.wikimedia.org/wiki/File:Vaderstad-tempo-world-record.jpg', license: 'CC BY-SA 4.0', author: 'Väderstad' },
];

const UA = 'agro-svet.cz photo backfill (info@samecdigital.com)';

async function downloadAndProcess(u) {
  const dir = `public/images/stroje/${u.brand}`;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const outPath = `${dir}/${u.brand}-${u.slug}.webp`;

  if (existsSync(outPath)) return { ...u, status: 'exists', outPath };

  const res = await fetch(u.src, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${u.src}`);
  const buf = Buffer.from(await res.arrayBuffer());

  await sharp(buf)
    .resize(1280, 720, { fit: 'cover', position: 'center' })
    .webp({ quality: 82 })
    .toFile(outPath);

  return { ...u, status: 'downloaded', outPath };
}

function injectYaml(processed) {
  const fileCache = new Map();
  let ok = 0, skipped = 0, failed = 0;

  for (const u of processed) {
    const file = `src/data/stroje/${u.brand}.yaml`;
    let content = fileCache.get(file) ?? readFileSync(file, 'utf-8');
    const imageUrl = `/images/stroje/${u.brand}/${u.brand}-${u.slug}.webp`;

    if (content.includes(imageUrl)) {
      console.log(`  ⊘ ${u.brand}/${u.slug}: image_url už v YAML`);
      skipped++;
      fileCache.set(file, content);
      continue;
    }

    // Match the series block opener: "      - slug: <slug>\n" (6-space indent).
    const slugEsc = u.slug.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const pattern = new RegExp(`(\\n      - slug: ${slugEsc}\\n)`, 'm');
    if (!pattern.test(content)) {
      console.error(`  ✗ ${u.brand}/${u.slug}: slug nenalezen v YAML`);
      failed++;
      fileCache.set(file, content);
      continue;
    }

    const inject =
      `        image_url: ${imageUrl}\n` +
      `        image_credit_url: ${u.file}\n` +
      `        image_credit: ${u.author}\n` +
      `        image_license: ${u.license}\n`;
    content = content.replace(pattern, `$1${inject}`);
    fileCache.set(file, content);
    console.log(`  ✓ ${u.brand}/${u.slug}`);
    ok++;
  }

  for (const [file, content] of fileCache) writeFileSync(file, content);
  return { ok, skipped, failed };
}

// ── run ──
console.log(`\n📥 Downloading + processing ${UPDATES.length} photos...\n`);
const processed = [];
let dlOk = 0, dlExist = 0, dlFail = 0;
for (const u of UPDATES) {
  try {
    const r = await downloadAndProcess(u);
    processed.push(r);
    if (r.status === 'downloaded') { dlOk++; console.log(`  ✓ ${u.brand}/${u.slug}`); }
    else { dlExist++; console.log(`  ⊘ ${u.brand}/${u.slug}: soubor existuje`); }
  } catch (err) {
    dlFail++;
    console.error(`  ✗ ${u.brand}/${u.slug}: ${err.message}`);
  }
}
console.log(`\n📥 Stáhnuto ${dlOk}, existovalo ${dlExist}, selhalo ${dlFail}`);

console.log(`\n📝 Injecting into YAML...\n`);
const inj = injectYaml(processed);
console.log(`\n📝 YAML — ok ${inj.ok}, skip ${inj.skipped}, fail ${inj.failed}`);
console.log(`\n✅ Hotovo.\n`);
