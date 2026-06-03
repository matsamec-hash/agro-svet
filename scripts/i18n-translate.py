#!/usr/bin/env python3
"""CZ->SK SEO localization via Vercel AI Gateway (claude-sonnet-4.6).

Subcommands:
  stroje <brand-slug>   -> writes src/data/stroje/sk/<brand>.yaml  (description overlay)
  znacky <slug>         -> writes src/content/znacky-sk/<slug>.md   (full SK markdown)

Reads AI_GATEWAY_API_KEY from env or ~/agro-svet/.env.
NOT a literal translator: produces native Slovak SEO prose, preserves proper
nouns, model names, numbers/units, markdown structure.
"""
import json, os, sys, urllib.request, re, pathlib

DRAFT_MODEL = "anthropic/claude-sonnet-4.6"   # cheap bulk draft
EDIT_MODEL = "anthropic/claude-opus-4.6"      # native-SK editor polish
GATEWAY = "https://ai-gateway.vercel.sh/v1/chat/completions"

def load_key():
    k = os.environ.get("AI_GATEWAY_API_KEY")
    if k:
        return k
    envp = os.path.expanduser("~/agro-svet/.env")
    if os.path.exists(envp):
        for line in open(envp):
            if line.startswith("AI_GATEWAY_API_KEY="):
                return line.split("=", 1)[1].strip()
    sys.exit("AI_GATEWAY_API_KEY not found")

KEY = load_key()

GLOSSARY = (
    "ZÁVÄZNÝ GLOSÁR (cz -> sk, dodrž konzistentne):\n"
    "samojízdný/sklízecí řezačka -> samohybná rezačka; sklízecí mlátička -> kombajn; "
    "pícniny -> krmoviny; sklizeň -> zber; secí stroj/secí kombinace -> sejačka/sejacia "
    "kombinácia; postřikovač -> postrekovač; nářadí -> náradie; obraceč -> obracač; "
    "shrnovač -> zhŕňač; převodovka -> prevodovka; záběr -> záber; spotřeba -> spotreba; "
    "lis na slámu -> lis na slamu; radlice -> radlica; válec -> valec; "
    "hospodářství -> hospodárstvo; utility (rad) -> úžitkový (rad)."
)

GEO = (
    "\nGEOGRAFIA TRHU (DÔLEŽITÉ): Portál je český. Konkrétne trhové tvrdenia viazané na "
    "krajinu — poradie v predaji, podiel na trhu, MENOVANÝ výhradný dovozca/distribútor, "
    "počet servisných stredísk — PONECHAJ viazané na pôvodnú krajinu (Česká republika / ČR): "
    "len prelož do SK ('v České republice' -> 'v Českej republike', 'dovozce pro ČR' -> "
    "'dovozca pre ČR', nadpis 'Zastoupení v ČR' -> 'Zastúpenie v ČR', 'Pozice v ČR' -> "
    "'Pozícia v ČR'). NEMEŇ ČR na SR/Slovensko a NEVYMÝŠĽAJ slovenských dovozcov, poradia "
    "ani počty stredísk. Všeobecné vyjadrenia bez konkrétneho trhového tvrdenia "
    "('u nás bežne vídané', 'obľúbený stroj') nechaj všeobecné."
)

SYS = (
    "Si profesionálny prekladateľ a SEO copywriter pre slovenský poľnohospodársky "
    "portál (značky strojov, traktory, kombajny). Prekladáš z češtiny do prirodzenej "
    "spisovnej slovenčiny — NIE doslovne, ale ako rodený Slovák píšuci pre slovenských "
    "farmárov. Zachovaj odborný agro-technický register.\n"
    "PRAVIDLÁ:\n"
    "- Vlastné mená značiek/radov/modelov NEPREKLADAJ (CLAAS, Lexion, Jaguar, Arion, "
    "John Deere, Mercedes-Benz, Perkins, FPT, Renault Agriculture, APS HYBRID...).\n"
    "- Čísla, jednotky, roky, výkony (hp/kW), kódy motorov nechaj presne.\n"
    "- Markdown štruktúru (##, -, **bold**, odkazy, pomlčky –) zachovaj 1:1.\n"
    "- Geografické názvy poslovenči kde je to bežné (Vestfálsko, Nemecko), mestá nechaj "
    "(Harsewinkel, Le Mans).\n"
    "- Dĺžku zachovaj podobnú originálu; žiadne pridané vety ani vynechávanie faktov.\n"
    "- Vráť LEN požadovaný výstup, bez komentárov a bez úvodzoviek navyše.\n" + GLOSSARY + GEO
)

def call(messages, model, max_tokens=4000):
    body = json.dumps({"model": model, "messages": messages,
                       "max_tokens": max_tokens, "temperature": 0.3}).encode()
    req = urllib.request.Request(GATEWAY, data=body, headers={
        "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=180) as r:
        d = json.loads(r.read())
    return d["choices"][0]["message"]["content"]

EDIT_SYS = (
    "Si rodený Slovák, odborný editor poľnohospodárskeho portálu. Dostaneš český "
    "originál a slovenský draft. Vráť VYLEPŠENÝ slovenský preklad: oprav čechizmy, "
    "neprirodzené väzby a nekonzistentnú terminológiu, sprav text plynulý ako od "
    "rodeného Slováka. PRÍSNE zachovaj fakty, čísla, vlastné mená, modely a markdown "
    "štruktúru z draftu. Nepridávaj ani neuberaj informácie. Vráť LEN finálny text "
    "(rovnaký formát ako draft), bez komentárov.\n" + GLOSSARY + GEO
)

def strip_fence(s):
    return re.sub(r"^```(json)?|```$", "", s.strip(), flags=re.M).strip()

def _parse_blocks(text, keys):
    """Parse '<<<F:key>>>\\n<value>' blocks into {key: value}.

    Robust against quotes AND multi-line values (value runs until the next marker).
    """
    out = {}
    parts = re.split(r"(?m)^<<<F:(.+?)>>>[ \t]*\n?", text)
    seq = parts[1:]  # drop preamble; then alternating [key, value, key, value, ...]
    for i in range(0, len(seq) - 1, 2):
        k = seq[i].strip()
        if k in keys:
            out[k] = seq[i + 1].strip()
    return out

def translate_kv(label, payload):
    """payload: {key: cz_string}. Returns {key: sk_string} via sonnet draft + opus editor.

    Block protocol ('<<<F:key>>>' + value) instead of JSON — robust against both
    quotes and multi-line values (stroje descriptions use literal YAML scalars).
    """
    if not payload:
        return {}
    keys = set(payload)
    proto = ("Pre KAŽDÉ pole vráť presne tento blok:\n<<<F:kľúč>>>\n<slovenský preklad>\n"
             "Kľúč skopíruj DOSLOVNE v značke <<<F:...>>>. Preklad môže byť viacriadkový. "
             "Žiadne riadky mimo blokov, žiadne komentáre, žiadne úvodzovky navyše.")
    user = (
        f"Prelož do slovenčiny tieto polia ({label}). " + proto + "\n\nVSTUP:\n"
        + "\n".join(f"<<<F:{k}>>>\n{payload[k]}" for k in payload)
    )
    draft = _parse_blocks(call(
        [{"role": "system", "content": SYS}, {"role": "user", "content": user}],
        DRAFT_MODEL, max_tokens=6000), keys)
    euser = (
        "Vylepši slovenské preklady (oprav čechizmy, neprirodzené väzby, terminológiu; "
        "fakty/čísla/mená zachovaj). " + proto +
        "\n\nVSTUP (pre každý kľúč CZ originál a SK draft):\n"
        + "\n".join(f"<<<F:{k}>>>\nCZ: {payload[k]}\nSK: {draft.get(k, payload[k])}" for k in payload)
    )
    final = _parse_blocks(call(
        [{"role": "system", "content": EDIT_SYS}, {"role": "user", "content": euser}],
        EDIT_MODEL, max_tokens=6000), keys)
    # editor wins; fall back to draft then cz for any key the editor dropped
    return {k: final.get(k) or draft.get(k) or payload[k] for k in payload}

def translate_body(body):
    """Translate markdown/HTML body (2-phase). Delimiter guards against preamble."""
    fmt = "Výstup presne v tomto tvare (nič iné):\n===BODY===\n<sk markdown>"
    def grab(t):
        pm = re.search(r"===BODY===\s*(.*)$", t, re.S)
        if not pm:
            sys.exit("body parse failed:\n" + t[:400])
        return pm.group(1).strip()
    user = (
        "Prelož do slovenčiny markdown telo o značke poľnohospodárskych strojov. " + fmt +
        "\nZachovaj VŠETKY ## nadpisy, - odrážky, **bold**, odkazy a HTML značky "
        "(napr. <h2 id=\"...\">) 1:1 — prekladaj iba ich textový obsah.\n\n"
        f"BODY:\n{body.strip()}"
    )
    d = grab(call([{"role": "system", "content": SYS}, {"role": "user", "content": user}],
                  DRAFT_MODEL, max_tokens=8000))
    euser = (
        "Vylepši slovenský preklad markdown tela (čeština = originál, draft = slovenčina). "
        + fmt + f"\n\n--- ORIGINÁL ---\n{body.strip()}\n\n--- DRAFT ---\n{d}"
    )
    return grab(call([{"role": "system", "content": EDIT_SYS}, {"role": "user", "content": euser}],
                     EDIT_MODEL, max_tokens=8000))

# ---------- stroje ----------
def do_stroje(brand):
    import yaml
    root = pathlib.Path(__file__).resolve().parent.parent
    src = root / f"src/data/stroje/{brand}.yaml"
    data = yaml.safe_load(src.read_text())
    payload = {}  # key -> cz_string
    if data.get("country"):
        payload["__country__"] = data["country"].strip()
    if data.get("description"):
        payload["__brand__"] = data["description"].strip()
    for ckey, cat in (data.get("categories") or {}).items():
        if cat.get("name"):
            payload[f"__cat__{ckey}"] = cat["name"].strip()
        for s in (cat.get("series") or []):
            if s.get("description"):
                # YAML may parse purely-numeric slugs (7, 8, 9) as ints — key must be str.
                payload[str(s["slug"])] = s["description"].strip()
    sk = translate_kv(f"popisy/polia značky strojov {data.get('name')}", payload)
    # --- build overlay yaml ---
    def block(key, val):
        return f"{key}: >-\n  " + val.strip().replace("\n", "\n  ")
    lines = ["# SK overlay (popisy/polia) na cs štruktúru. AI draft+editor, review nutný.\n"]
    if "__country__" in sk:
        lines.append(f'country: "{sk.pop("__country__").strip()}"')
    if "__brand__" in sk:
        lines.append(block("description", sk.pop("__brand__")) + "\n")
    cats = {k[7:]: sk.pop(k) for k in list(sk) if k.startswith("__cat__")}
    if cats:
        lines.append("categories:")
        for ck, cv in cats.items():
            lines.append(f'  {ck}: "{cv.strip()}"')
        lines.append("")
    lines.append("series:")
    for k, v in sk.items():
        lines.append("  " + block(k, v).replace("\n", "\n  "))
    dst = root / f"src/data/stroje/sk/{brand}.yaml"
    dst.write_text("\n".join(lines) + "\n")
    print(f"WROTE {dst}")
    print("\n=== PREVIEW ===")
    print(dst.read_text())

# ---------- znacky ----------
# Prose frontmatter fields translated (display-facing). Structural/numeric fields
# (name, slug, website, wikipedia, wikidata, kategorie, zalozena, aktualizovano,
#  founder.name/birth/death, *.year, financials.*.revenue/netIncome, sources.*.url)
# are carried over verbatim — they are language-neutral or must not be re-numbered.
def do_znacky(slug):
    import yaml
    root = pathlib.Path(__file__).resolve().parent.parent
    src = root / f"src/content/znacky/{slug}.md"
    raw = src.read_text()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    fm, body = yaml.safe_load(m.group(1)), m.group(2)

    # --- collect prose fields keyed by structural path ---
    payload = {}
    def add(key, val):
        if isinstance(val, str) and val.strip():
            payload[key] = val.strip()
    add("popis", fm.get("popis"))
    add("zeme", fm.get("zeme"))
    if isinstance(fm.get("founder"), dict):
        add("founder.note", fm["founder"].get("note"))
    for i, s in enumerate(fm.get("snapshot") or []):
        add(f"snapshot.{i}.label", s.get("label"))
        add(f"snapshot.{i}.value", s.get("value"))
    for i, t in enumerate(fm.get("timeline") or []):
        add(f"timeline.{i}.label", t.get("label"))
        add(f"timeline.{i}.detail", t.get("detail"))
    for i, f in enumerate(fm.get("financials") or []):
        add(f"financials.{i}.note", f.get("note"))
    for i, s in enumerate(fm.get("sources") or []):
        add(f"sources.{i}.title", s.get("title"))

    sk = translate_kv(f"frontmatter značky {fm.get('name')}", payload)
    sk_body = translate_body(body)

    # --- write translated values back into the parsed structure ---
    def setv(key):  # translated value, falling back to cz if model dropped a key
        return sk.get(key) or payload[key]
    if "popis" in payload: fm["popis"] = setv("popis")
    if "zeme" in payload: fm["zeme"] = setv("zeme")
    if isinstance(fm.get("founder"), dict) and "founder.note" in payload:
        fm["founder"]["note"] = setv("founder.note")
    for i, s in enumerate(fm.get("snapshot") or []):
        if f"snapshot.{i}.label" in payload: s["label"] = setv(f"snapshot.{i}.label")
        if f"snapshot.{i}.value" in payload: s["value"] = setv(f"snapshot.{i}.value")
    for i, t in enumerate(fm.get("timeline") or []):
        if f"timeline.{i}.label" in payload: t["label"] = setv(f"timeline.{i}.label")
        if f"timeline.{i}.detail" in payload: t["detail"] = setv(f"timeline.{i}.detail")
    for i, f in enumerate(fm.get("financials") or []):
        if f"financials.{i}.note" in payload: f["note"] = setv(f"financials.{i}.note")
    for i, s in enumerate(fm.get("sources") or []):
        if f"sources.{i}.title" in payload: s["title"] = setv(f"sources.{i}.title")

    new_fm = yaml.safe_dump(fm, allow_unicode=True, sort_keys=False,
                            default_flow_style=False, width=4096).rstrip()
    dst = root / f"src/content/znacky-sk/{slug}.md"
    dst.write_text(f"---\n{new_fm}\n---\n\n{sk_body}\n")
    print(f"WROTE {dst}")
    print("\n=== PREVIEW (first 2200 chars) ===")
    print(dst.read_text()[:2200])

if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "stroje":
        do_stroje(sys.argv[2])
    elif cmd == "znacky":
        do_znacky(sys.argv[2])
    else:
        sys.exit("usage: i18n-translate.py {stroje|znacky} <slug>")
