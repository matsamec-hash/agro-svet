export interface ParsedListing {
  title: string | null;
  price: number | null;
  description: string | null;
  location: string | null;
  phone: string | null;
  imageUrls: string[];
}

function firstMatch(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Best-effort parser Bazoš detailu inzerátu z HTML. Nenalezené pole = null/[]. */
export function parseBazosListing(html: string): ParsedListing {
  const rawTitle = firstMatch(html, /<h1[^>]*class="nadpisdetail"[^>]*>([\s\S]*?)<\/h1>/i);
  const title = rawTitle ? stripTags(rawTitle) : null;

  const priceRaw = firstMatch(html, /Cena:\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
  const price = priceRaw ? parsePrice(priceRaw) : null;

  const location = firstMatch(html, /Lokalita:\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);

  const descRaw = firstMatch(html, /<div[^>]*class="popisdetail"[^>]*>([\s\S]*?)<\/div>/i);
  const description = descRaw ? stripTags(descRaw) : null;

  const phone = description ? (description.match(/\b(\d{3}\s?\d{3}\s?\d{3})\b/)?.[1] ?? null) : null;

  const imageUrls = Array.from(
    html.matchAll(/<img[^>]*class="carousel-cell-image"[^>]*src="([^"]+)"/gi),
    (m) => m[1],
  );

  return {
    title,
    price,
    description,
    location: location ? stripTags(location) : null,
    phone: phone ? phone.replace(/\s/g, '') : null,
    imageUrls,
  };
}

function parsePrice(raw: string): number | null {
  const digits = stripTags(raw).replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : null;
}
