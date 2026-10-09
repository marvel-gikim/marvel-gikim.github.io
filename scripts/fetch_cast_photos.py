"""Download freely-licensed actor portraits from Wikipedia/Wikimedia Commons.

Only images that Wikipedia marks as free (pilicense=free) are used. For each photo the
author, license and source page are saved to credits.json so the site can show attribution.
Output: docs/cast/<id>.jpg + docs/cast/credits.json (served by GitHub Pages) and a copy in
public/cast/ so the next `npm run build` keeps them.
"""
import io, json, os, re, shutil, sys, time, urllib.parse, urllib.request

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "cast")
PUBLIC = os.path.join(ROOT, "public", "cast")
UA = {"User-Agent": "MarvelGikimFanSite/1.0 (https://github.com/yuvalpeleg022-wq/marvel-gikim)"}
API = "https://en.wikipedia.org/w/api.php?"


def get_json(params):
    url = API + urllib.parse.urlencode({**params, "format": "json", "formatversion": 2})
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.load(r)


def clean(html):
    text = re.sub(r"<[^>]+>", "", html or "")
    return re.sub(r"\s+", " ", text).strip()


def main():
    cast = json.load(open(os.path.join(ROOT, "scripts", "cast.json"), encoding="utf-8"))
    os.makedirs(OUT, exist_ok=True)
    credits, missing = {}, []
    for cid, title in cast.items():
        try:
            page = get_json({"action": "query", "titles": title, "redirects": 1, "prop": "pageimages",
                             "piprop": "name", "pilicense": "free"})["query"]["pages"][0]
            name = page.get("pageimage")
            if not name:
                raise ValueError("no free lead image")
            info = get_json({"action": "query", "titles": "File:" + name, "prop": "imageinfo",
                             "iiprop": "url|extmetadata", "iiurlwidth": 640})["query"]["pages"][0]["imageinfo"][0]
            meta = info.get("extmetadata", {})
            license_name = clean(meta.get("LicenseShortName", {}).get("value"))
            if not license_name:
                raise ValueError("license unknown")
            with urllib.request.urlopen(urllib.request.Request(info["thumburl"], headers=UA), timeout=60) as r:
                img = Image.open(io.BytesIO(r.read())).convert("RGB")
            img.thumbnail((640, 900))
            img.save(os.path.join(OUT, cid + ".jpg"), "JPEG", quality=85, optimize=True)
            credits[cid] = {
                "file": f"./cast/{cid}.jpg",
                "width": img.width,
                "height": img.height,
                "author": clean(meta.get("Artist", {}).get("value")) or "לא צוין",
                "license": license_name,
                "licenseUrl": meta.get("LicenseUrl", {}).get("value", ""),
                "sourceUrl": info.get("descriptionurl", ""),
            }
            print("ok  ", cid, name, license_name)
        except Exception as e:  # keep going; the site shows a fallback for missing photos
            missing.append(cid)
            print("miss", cid, title, e)
        time.sleep(0.4)
    json.dump(credits, open(os.path.join(OUT, "credits.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    shutil.rmtree(PUBLIC, ignore_errors=True)
    shutil.copytree(OUT, PUBLIC)
    print(f"{len(credits)} photos, missing: {missing}")


if __name__ == "__main__":
    sys.exit(main())
