// Detect & emit srcset for images produced by content-network-cms.
//
// The CMS upload pipeline (content-network-cms/src/lib/image-optimize.ts)
// names variant files with a `__v-w<width>` suffix. When this util sees that
// pattern in a URL it knows sibling variants exist at the same base path
// for each width in VARIANT_WIDTHS — perfect for `<img srcset>`.
//
// Old uploads (pre-pipeline) don't have the suffix → we return just `src`
// with no srcset, browser serves the single existing file.
//
// Single source of truth: filename pattern. No DB join or extra fetch.

export const VARIANT_FLAG = '__v-w';
export const VARIANT_WIDTHS = [400, 800, 1600, 2400] as const;
const VARIANT_RE = /^(.+?)__v-w(\d+)(\.[a-zA-Z0-9]+)$/;

export interface ImgSrcsetResult {
  src: string;
  srcset?: string;
  sizes?: string;
}

/**
 * Build srcset+sizes attributes for a CDN URL that may or may not have
 * responsive variants. When the URL doesn't match the variant pattern,
 * returns `{ src }` only — caller can spread it onto `<img>` either way.
 *
 * @param url    The URL stored in `articles.featured_image_url` or similar.
 * @param sizes  Media-condition string telling the browser how the image
 *               will be rendered (e.g., `(max-width: 768px) 100vw, 1200px`).
 *               Omit for fixed-size thumbnails.
 */
export function imgSrcset(
  url: string | null | undefined,
  sizes?: string,
  maxWidth?: number,
): ImgSrcsetResult {
  if (!url) return { src: '' };
  const m = url.match(VARIANT_RE);
  if (!m) return { src: url };
  const [, base, , ext] = m;
  const widths = maxWidth ? VARIANT_WIDTHS.filter((w) => w <= maxWidth) : VARIANT_WIDTHS;
  const srcset = widths.map((w) => `${base}${VARIANT_FLAG}${w}${ext} ${w}w`).join(', ');
  return { src: url, srcset, sizes };
}
