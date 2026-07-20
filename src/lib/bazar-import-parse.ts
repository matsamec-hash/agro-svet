export interface ParsedListing {
  title: string | null;
  price: number | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  hours: number | null;
  imageUrls: string[];
}

function firstMatch(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Best-effort parser Bazoš detailu inzerátu z HTML. Nenalezené pole = null/[].
 *
 * Pozn.: Bazoš má atributy NEKONZISTENTNĚ — h1/div používají class BEZ uvozovek
 * (`<H1 class=nadpisdetail>`), obrázky s uvozovkami (`class="carousel-cell-image"`).
 * Proto všechny class matchujeme s volitelnými uvozovkami (`["']?`). Cena a lokalita
 * NEJSOU v tabulce, ale v textu (`Cena: 1 266 720 Kč, Lokalita: Tachov`). Obrázky se
 * berou z `data-flickity-lazyload` (má ho i lazy-loaded, na rozdíl od `src`).
 * Ověřeno proti reálnému HTML stroje.bazos.cz (2026-07-20).
 */
export function parseBazosListing(html: string): ParsedListing {
  const rawTitle = firstMatch(html, /<h1[^>]*\bclass=["']?nadpisdetail\b["']?[^>]*>([\s\S]*?)<\/h1>/i);
  const title = rawTitle ? stripTags(rawTitle) : null;

  const descRaw = firstMatch(html, /<div[^>]*\bclass=["']?popisdetail\b["']?[^>]*>([\s\S]*?)<\/div>/i);
  const description = descRaw ? stripTags(descRaw) : null;

  const price = parsePrice(firstMatch(html, /Cena:\s*([\d][\d\s]{2,})/i));

  const locationRaw = firstMatch(html, /Lokalita:\s*([^,<.\n]+)/i);

  const phone = description ? (description.match(/\b(\d{3}\s?\d{3}\s?\d{3})\b/)?.[1] ?? null) : null;

  // Motohodiny: "8251 mth", "8 251 motohodin", "8251 mh"
  const hoursRaw = `${title ?? ''} ${description ?? ''}`.match(/([\d][\d\s]{1,})\s*(?:mth|motohodin|mh\b)/i);
  const hours = hoursRaw ? parseInt(hoursRaw[1].replace(/\D/g, ''), 10) : null;

  const imageUrls = Array.from(
    new Set(
      Array.from(
        html.matchAll(/data-flickity-lazyload=["']?([^"'\s>]+)/gi),
        (m) => m[1],
      ),
    ),
  );

  return {
    title,
    price,
    description,
    location: locationRaw ? locationRaw.trim() : null,
    phone: phone ? phone.replace(/\s/g, '') : null,
    hours,
    imageUrls,
  };
}

function parsePrice(raw: string | null): number | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : null;
}
