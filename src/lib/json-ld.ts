// JSON do <script type="application/ld+json" set:html=...>. Samotné JSON.stringify nechá `</script>`
// v textu (titulek inzerátu, popis) ukončit skript a vložit vlastní HTML (uložené XSS).
// `<` zapsané jako \u003c je v JSON platné a vyhledávače ho čtou stejně.
export function safeJsonLd(value: unknown, replacer?: any, space?: string | number): string {
  return (JSON.stringify(value, replacer, space) ?? 'null')
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
