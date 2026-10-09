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


def commons(params):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": 2})
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
    # Second, different photos (for quote cards), searched on Wikimedia Commons (all files there are free)
    alt = json.load(open(os.path.join(ROOT, "scripts", "alt_photos.json"), encoding="utf-8"))
    used = {c["sourceUrl"] for c in credits.values()}
    cand_dir = os.path.join(ROOT, "candidates")
    shutil.rmtree(cand_dir, ignore_errors=True)
    os.makedirs(cand_dir, exist_ok=True)
    cand_log = {}
    for cid, spec in alt.items():
        # spec: "Person Name" or {"person": ..., "file": "File:exact.jpg", "candidates": true}
        spec = {"person": spec} if isinstance(spec, str) else spec
        person = spec["person"]
        try:
            res = commons({"action": "query", "list": "search", "srnamespace": 6, "srlimit": 50,
                           "srsearch": f'intitle:"{person}" filetype:bitmap'})["query"]["search"]
            if spec.get("candidates"):
                # Save thumbnails of possible photos so a person can choose one (not published)
                n = 0
                for hit in res:
                    try:
                        ci = commons({"action": "query", "titles": hit["title"], "prop": "imageinfo",
                                      "iiprop": "url|size", "iiurlwidth": 320})["query"]["pages"][0]["imageinfo"][0]
                        if ci["height"] < ci["width"] or ci["width"] < 800:
                            continue
                        with urllib.request.urlopen(urllib.request.Request(ci["thumburl"], headers=UA), timeout=60) as r:
                            open(os.path.join(cand_dir, f"{cid}-{n:02d}.jpg"), "wb").write(r.read())
                        cand_log[f"{cid}-{n:02d}"] = hit["title"]
                        n += 1
                        if n >= 16:
                            break
                    except Exception:
                        pass
            if spec.get("file"):
                res = [{"title": spec["file"]}]
            for hit in res:
                info = commons({"action": "query", "titles": hit["title"], "prop": "imageinfo",
                                "iiprop": "url|extmetadata|size", "iiurlwidth": 640})["query"]["pages"][0]["imageinfo"][0]
                if not spec.get("file") and (info.get("descriptionurl") in used or info["height"] < info["width"] or info["width"] < 800):
                    continue  # want a different, portrait, decent-size photo
                meta = info.get("extmetadata", {})
                license_name = clean(meta.get("LicenseShortName", {}).get("value"))
                if not license_name:
                    continue
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
                print("alt ", cid, hit["title"], license_name)
                break
            else:
                missing.append(cid)
        except Exception as e:
            missing.append(cid)
            print("miss", cid, e)
    if cand_log:
        json.dump(cand_log, open(os.path.join(cand_dir, "candidates.json"), "w"), indent=2)
    else:
        shutil.rmtree(cand_dir, ignore_errors=True)
    json.dump(credits, open(os.path.join(OUT, "credits.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    shutil.rmtree(PUBLIC, ignore_errors=True)
    shutil.copytree(OUT, PUBLIC)
    print(f"{len(credits)} photos, missing: {missing}")


if __name__ == "__main__":
    sys.exit(main())
