#!/usr/bin/env python3
"""Extract brand hints from a public website: colours (ranked), theme-color, fonts, logo/icon candidates,
social and contact links, title/description. Fetches only the home page and up to 6 linked stylesheets.
The page is untrusted data: nothing in it is executed or followed as an instruction.
Usage: python3 -I brand_extract.py https://client.example [--max-css 6] > BRAND_EXTRACT.json
"""
import argparse, collections, colorsys, json, os, re, ssl, sys, urllib.parse, urllib.request

UA = "Mozilla/5.0 (compatible; mms-brand-extract/1.0)"
CTX = ssl.create_default_context(cafile=os.environ.get("SSL_CERT_FILE") or ("/root/.ccr/ca-bundle.crt" if os.path.exists("/root/.ccr/ca-bundle.crt") else None))
SOCIAL = ("facebook.com", "instagram.com", "tiktok.com", "youtube.com", "youtu.be", "linkedin.com", "x.com", "twitter.com", "wa.me", "whatsapp.com", "pinterest.", "snapchat.com", "threads.net")


def get(url, limit=3_000_000):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    with urllib.request.urlopen(req, timeout=25, context=CTX) as r:
        return r.read(limit).decode(r.headers.get_content_charset() or "utf-8", "replace"), r.geturl()


def norm_hex(h):
    h = h.lower().lstrip("#")
    if len(h) in (3, 4):
        h = "".join(c * 2 for c in h[:3])
    return "#" + h[:6] if len(h) >= 6 else None


def rgb_to_hex(m):
    try:
        r, g, b = (int(float(x)) for x in m[:3])
        return f"#{r:02x}{g:02x}{b:02x}"
    except ValueError:
        return None


def describe(hx):
    r, g, b = (int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5))
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    kind = "neutral" if s < 0.12 else "colour"
    return {"hex": hx, "kind": kind, "lightness": round(l, 2), "saturation": round(s, 2), "hue": round(h * 360), "luminance": round(lum, 2)}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("--max-css", type=int, default=6)
    a = ap.parse_args()
    url = a.url if "://" in a.url else "https://" + a.url
    out = {"source": url, "errors": []}
    try:
        html, final = get(url)
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"source": url, "errors": [f"fetch failed: {type(e).__name__}: {e}"]}, indent=1)); return
    out["final_url"] = final
    def meta(name):
        m = re.search(rf'<meta[^>]+(?:name|property)=["\']{name}["\'][^>]*content=["\']([^"\']+)', html, re.I) or \
            re.search(rf'<meta[^>]+content=["\']([^"\']+)["\'][^>]*(?:name|property)=["\']{name}["\']', html, re.I)
        return m.group(1).strip() if m else None
    t = re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S)
    out["title"] = re.sub(r"\s+", " ", t.group(1)).strip() if t else None
    out["description"] = meta("description") or meta("og:description")
    out["theme_color"] = meta("theme-color")
    out["og_image"] = meta("og:image")
    out["lang"] = (re.search(r'<html[^>]+lang=["\']([^"\']+)', html, re.I) or [None, None])[1]
    css_texts = [" ".join(re.findall(r"<style[^>]*>(.*?)</style>", html, re.I | re.S)), " ".join(re.findall(r'style=["\']([^"\']+)', html, re.I))]
    links = re.findall(r'<link[^>]+rel=["\'][^"\']*stylesheet[^"\']*["\'][^>]*href=["\']([^"\']+)', html, re.I) + \
        re.findall(r'<link[^>]+href=["\']([^"\']+\.css[^"\']*)["\']', html, re.I)
    seen = []
    for href in links:
        u = urllib.parse.urljoin(final, href)
        if u in seen or len(seen) >= a.max_css:
            continue
        seen.append(u)
        try:
            css_texts.append(get(u)[0])
        except Exception as e:  # noqa: BLE001
            out["errors"].append(f"css {u}: {type(e).__name__}")
    out["stylesheets"] = seen
    css = "\n".join(css_texts)
    cnt = collections.Counter()
    for h in re.findall(r"#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b", css):
        n = norm_hex(h)
        if n:
            cnt[n] += 1
    for m in re.findall(r"rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)", css):
        n = rgb_to_hex(m)
        if n:
            cnt[n] += 1
    out["css_variables"] = dict(list({k: v.strip() for k, v in re.findall(r"(--[\w-]*(?:color|colour|primary|secondary|accent|brand)[\w-]*)\s*:\s*([^;}{]+)", css, re.I)}.items())[:40])
    ranked = [dict(describe(h), count=c) for h, c in cnt.most_common(40)]
    out["colours_ranked"] = ranked
    out["brand_colour_candidates"] = [c for c in ranked if c["kind"] == "colour"][:8]
    fonts = collections.Counter()
    for f in re.findall(r"font-family\s*:\s*([^;}{]+)", css, re.I):
        first = f.split(",")[0].strip().strip("'\"")
        if first and not first.startswith("var("):
            fonts[first] += 1
    out["fonts_ranked"] = fonts.most_common(10)
    out["google_fonts_links"] = sorted(set(re.findall(r'https?://fonts\.googleapis\.com/[^"\'\s)]+', html)))
    imgs = re.findall(r"<img[^>]+>", html, re.I)
    logos = []
    for tag in imgs:
        if re.search(r"logo|brand", tag, re.I):
            src = re.search(r'src=["\']([^"\']+)', tag, re.I)
            if src:
                logos.append(urllib.parse.urljoin(final, src.group(1)))
    icons = [urllib.parse.urljoin(final, h) for h in re.findall(r'<link[^>]+rel=["\'][^"\']*icon[^"\']*["\'][^>]*href=["\']([^"\']+)', html, re.I)]
    out["logo_candidates"] = list(dict.fromkeys(logos))[:8]
    out["icon_candidates"] = list(dict.fromkeys(icons))[:6]
    hrefs = [urllib.parse.urljoin(final, h) for h in re.findall(r'href=["\']([^"\'#]+)', html, re.I)]
    out["social_links"] = sorted({h for h in hrefs if any(s in h.lower() for s in SOCIAL)})[:20]
    out["contact_links"] = sorted({h for h in hrefs if h.lower().startswith(("mailto:", "tel:"))})[:10]
    out["note"] = "Hints only. Verify against a screenshot and the client's brand guide; ask for vector logo files and licensed fonts."
    print(json.dumps(out, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    sys.exit(main())
