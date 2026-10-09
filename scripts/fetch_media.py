"""Download official promotional media into docs/media/fetched/.

- YouTube: the official thumbnail of each trailer (maxres, falling back to hq).
- Pages: the page's own og:image / twitter:image (the image the official page declares).
Writes docs/media/fetched.json with file + size for the site, and mirrors to public/media/fetched/.
"""
import html, io, json, os, re, shutil, urllib.parse, urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "media", "fetched")
PUBLIC = os.path.join(ROOT, "public", "media", "fetched")
UA = {"User-Agent": "Mozilla/5.0 (compatible; MarvelGikimFanSite/1.0; +https://github.com/yuvalpeleg022-wq/marvel-gikim)"}


def fetch(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def save(key, data):
    img = Image.open(io.BytesIO(data)).convert("RGB")
    img.thumbnail((1600, 1600))
    img.save(os.path.join(OUT, key + ".jpg"), "JPEG", quality=85, optimize=True)
    return {"file": f"./media/fetched/{key}.jpg", "width": img.width, "height": img.height}


def og_image(page_url):
    page = fetch(page_url).decode("utf-8", "replace")
    for prop in ("og:image", "twitter:image"):
        m = re.search(r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]+content=["\']([^"\']+)' % prop, page) or \
            re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+(?:property|name)=["\']%s["\']' % prop, page)
        if m:
            url = urllib.request.urljoin(page_url, html.unescape(m.group(1)))
            # Disney's CDN crops via ?region=...; drop it to get the full, uncropped image
            return re.sub(r"[?&]region=[^&]*", "", url).replace("?&", "?").rstrip("?")
    raise ValueError("no og:image")


def main():
    cfg = json.load(open(os.path.join(ROOT, "scripts", "media.json"), encoding="utf-8"))
    os.makedirs(OUT, exist_ok=True)
    out, missing = {}, []
    for key, vid in cfg["youtube"].items():
        for size in ("maxresdefault", "hqdefault"):
            try:
                out[key] = {**save(key, fetch(f"https://i.ytimg.com/vi/{vid}/{size}.jpg")), "source": f"https://www.youtube.com/watch?v={vid}"}
                try:  # official title and channel, from YouTube's oEmbed
                    oe = json.loads(fetch("https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote(f"https://www.youtube.com/watch?v={vid}")))
                    out[key].update({"title": oe.get("title"), "channel": oe.get("author_name")})
                except Exception as e:
                    print("no oembed", key, e)
                print("ok  ", key, size)
                break
            except Exception as e:
                print("retry", key, size, e)
        else:
            missing.append(key)
    for key, url in cfg["pages"].items():
        try:
            img_url = og_image(url)
            out[key] = {**save(key, fetch(img_url)), "source": url, "imageUrl": img_url}
            print("ok  ", key, img_url)
        except Exception as e:
            missing.append(key)
            print("miss", key, url, e)
    json.dump(out, open(os.path.join(ROOT, "docs", "media", "fetched.json"), "w"), indent=2)
    shutil.rmtree(PUBLIC, ignore_errors=True)
    shutil.copytree(OUT, PUBLIC)
    shutil.copy(os.path.join(ROOT, "docs", "media", "fetched.json"), os.path.join(ROOT, "public", "media", "fetched.json"))
    print("missing:", missing)


if __name__ == "__main__":
    main()
