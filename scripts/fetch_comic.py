"""Download official Secret Wars (2015) images from marvel.com into docs/media/comic/.

- Covers: the cover each official issue page on marvel.com declares (#1-#9).
- Article images: the images embedded in official marvel.com articles about the event (interior panels/covers).
Writes docs/media/comic.json (file, size, source page, image URL, alt text) and mirrors to public/media/.
"""
import html, io, json, os, re, shutil, urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "media", "comic")
PUBLIC = os.path.join(ROOT, "public", "media", "comic")
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"}


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def page(url):
    return fetch(url).decode("utf-8", "replace")


def save(key, data, min_side=300):
    img = Image.open(io.BytesIO(data)).convert("RGB")
    if min(img.size) < min_side:
        raise ValueError(f"too small {img.size}")
    img.thumbnail((1600, 1600))
    img.save(os.path.join(OUT, key + ".jpg"), "JPEG", quality=85, optimize=True)
    return {"file": f"./media/comic/{key}.jpg", "width": img.width, "height": img.height}


def meta(text, prop):
    m = re.search(r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]+content=["\']([^"\']+)' % prop, text) or \
        re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']%s["\']' % prop, text)
    return html.unescape(m.group(1)) if m else None


def cover_candidates(issue_html, issue_url):
    urls = []
    # Marvel's image CDN: <path>/<variant>.jpg ; "detail" is the full-size cover
    for m in re.finditer(r'(https?:)?//i\.annihil\.us/u/prod/marvel/i/mg/[0-9a-f/]+/[0-9a-f]+(?:/[a-z_]+)?\.jpg', issue_html):
        u = m.group(0)
        u = ("https:" + u) if u.startswith("//") else u
        base = re.sub(r"/[a-z_]+\.jpg$", "", u)
        base = re.sub(r"\.jpg$", "", base)
        urls += [base + "/detail.jpg", base + ".jpg", u]
    og = meta(issue_html, "og:image")
    if og:
        urls.append(urllib.request.urljoin(issue_url, og))
    seen, out = set(), []
    for u in urls:
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def main():
    cfg = json.load(open(os.path.join(ROOT, "scripts", "comic.json"), encoding="utf-8"))
    shutil.rmtree(OUT, ignore_errors=True)
    os.makedirs(OUT, exist_ok=True)
    result = {"covers": {}, "articles": []}
    log = []

    issues = dict(cfg.get("knownIssues", {}))
    try:
        series = page(cfg["series"])
        for m in re.finditer(r'/comics/issue/(\d+)/secret_wars_2015_(\d+)\b', series):
            issues.setdefault(m.group(2), f"https://www.marvel.com/comics/issue/{m.group(1)}/secret_wars_2015_{m.group(2)}")
    except Exception as e:
        log.append(f"series page failed: {e}")
    print("issues:", issues)

    for num, url in sorted(issues.items(), key=lambda kv: int(kv[0])):
        try:
            text = page(url)
        except Exception as e:
            log.append(f"issue {num} page failed: {e}")
            continue
        for cand in cover_candidates(text, url):
            try:
                result["covers"][num] = {**save(f"cover-{num}", fetch(cand)), "source": url, "imageUrl": cand,
                                         "onsale": (re.search(r'Published:\s*</strong>\s*([^<]+)', text) or [None, None])[1]}
                print("cover", num, cand)
                break
            except Exception as e:
                log.append(f"cover {num} candidate {cand}: {e}")

    n = 0
    for art in cfg.get("articles", []):
        try:
            text = page(art)
        except Exception as e:
            log.append(f"article failed {art}: {e}")
            continue
        seen = set()
        for m in re.finditer(r'<img\b[^>]*>', text):
            tag = m.group(0)
            src = None
            for attr in ("data-src", "src"):
                mm = re.search(r'\b%s=["\']([^"\']+)["\']' % attr, tag)
                if mm and not mm.group(1).startswith("data:"):
                    src = html.unescape(mm.group(1))
                    break
            if not src:
                continue
            src = urllib.request.urljoin(art, src)
            if not re.search(r'(cdn\.marvel\.com|i\.annihil\.us|terrigen-cdn)', src) or src in seen:
                continue
            seen.add(src)
            alt = html.unescape((re.search(r'\balt=["\']([^"\']*)["\']', tag) or [None, ""])[1])
            full = re.sub(r"\?.*$", "", src)
            for cand in (full, src):
                try:
                    n += 1
                    key = f"article-{n:02d}"
                    result["articles"].append({**save(key, fetch(cand), 400), "source": art, "imageUrl": cand, "alt": alt})
                    print("article img", key, cand, alt)
                    break
                except Exception as e:
                    n -= 1
                    log.append(f"article img {cand}: {e}")

    result["log"] = log
    json.dump(result, open(os.path.join(ROOT, "docs", "media", "comic.json"), "w"), indent=2, ensure_ascii=False)
    shutil.rmtree(PUBLIC, ignore_errors=True)
    shutil.copytree(OUT, PUBLIC)
    shutil.copy(os.path.join(ROOT, "docs", "media", "comic.json"), os.path.join(ROOT, "public", "media", "comic.json"))
    print("\n".join(log))


if __name__ == "__main__":
    main()
