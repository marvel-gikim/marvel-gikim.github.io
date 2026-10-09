"""One-off: find the official trailer frame of Steve Rogers catching Mjolnir.
1) og:image of articles about that moment; 2) frames from the official trailer via yt-dlp (1 per second, contact sheets)."""
import html, io, os, re, subprocess, urllib.request, urllib.parse, glob
from PIL import Image, ImageDraw
OUT = "hunt/out2"; os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"}
PAGES = {
 "thedirect": "https://thedirect.com/article/avengers-doomsday-merch-doctor-doom-third-costume",
 "technosports": "https://technosports.co.in/doctor-dooms-third-costume-revealed-what-lord-doom/",
 "cbm-sdcc": "https://comicbookmovie.com/avengers/avengers-doomsday/avengers-doomsday-detailed-look-at-doctor-dooms-costume-at-comic-con-reveals-hidden-details-a229030",
 "yahoo-toys": "https://www.yahoo.com/entertainment/movies/articles/doctor-doom-suit-thor-helmet-155208150.html",
 "shh-toys": "https://www.superherohype.com/?p=670968",
 "shh-costume": "https://www.superherohype.com/?p=639939",
 "cbm-leaks": "https://comicbookmovie.com/avengers/avengers-doomsday/avengers-doomsday-a-fresh-wave-of-leaks-reveal-new-doctor-doom-spider-man-and-x-men-details-a228929",
 "toypeople-1": "https://www.toy-people.com/en/?p=112477",
 "toypeople-2": "https://www.toy-people.com/en/?p=104750",
 "toypeople-3": "https://www.toy-people.com/en/?p=113618",
}
log = open(f"{OUT}/log.txt", "w")
for k, u in PAGES.items():
    try:
        t = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read().decode("utf-8", "replace")
        m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', t) or re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image', t)
        img = html.unescape(m.group(1))
        data = urllib.request.urlopen(urllib.request.Request(img, headers=UA), timeout=60).read()
        im = Image.open(io.BytesIO(data)).convert("RGB"); im.thumbnail((1600, 1600)); im.save(f"{OUT}/og-{k}.jpg", quality=88)
        log.write(f"og {k} {img} {im.size}\n")
        n = 0
        for mm in re.finditer(r'<img\b[^>]*>', t):
            tag = mm.group(0)
            sm = re.search(r'\b(?:data-src|src)=["\']([^"\']+)["\']', tag)
            if not sm or sm.group(1).startswith("data:"): continue
            src = urllib.parse.urljoin(u, html.unescape(sm.group(1)))
            alt = (re.search(r'\balt=["\']([^"\']*)', tag) or [None, ""])[1]
            try:
                d2 = urllib.request.urlopen(urllib.request.Request(src, headers=UA), timeout=30).read()
                im2 = Image.open(io.BytesIO(d2)).convert("RGB")
                if min(im2.size) < 350: continue
                n += 1; im2.thumbnail((1600, 1600)); im2.save(f"{OUT}/{k}-img{n}.jpg", quality=86)
                log.write(f"  img {k}-img{n} {src} {im2.size} alt={alt[:100]}\n")
                if n >= 12: break
            except Exception:
                pass
        n = 0
        for mm in re.finditer(r'<img\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*>', t):
            src = urllib.parse.urljoin(u, html.unescape(mm.group(1)))
            alt = (re.search(r'\balt=["\']([^"\']*)', mm.group(0)) or [None, ""])[1]
            try:
                d2 = urllib.request.urlopen(urllib.request.Request(src, headers=UA), timeout=30).read()
                im2 = Image.open(io.BytesIO(d2)).convert("RGB")
                if min(im2.size) < 350: continue
                n += 1; im2.thumbnail((1600, 1600)); im2.save(f"{OUT}/{k}-img{n}.jpg", quality=86)
                log.write(f"  img {k}-img{n} {src} {im2.size} alt={alt[:100]}\n")
            except Exception as e2:
                pass
    except Exception as e:
        log.write(f"og {k} FAIL {e}\n")
if False:
    subprocess.run(["yt-dlp", "-f", "bv*[height<=1080][ext=mp4]/bv*[height<=1080]/b", "-o", "hunt/trailer.%(ext)s", "https://www.youtube.com/watch?v=irVNGjRFZGk"], check=True, timeout=600)
    vid = glob.glob("hunt/trailer.*")[0]
    os.makedirs("hunt/frames", exist_ok=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-i", vid, "-vf", "fps=2,scale=1920:-2", "-q:v", "3", "hunt/frames/f%04d.jpg"], check=True)
    frames = sorted(glob.glob("hunt/frames/*.jpg"))
    log.write(f"frames {len(frames)}\n")
    W, H, C = 320, 134, 6
    for s in range(0, len(frames), 48):
        chunk = frames[s:s + 48]
        sheet = Image.new("RGB", (W * C, (H + 16) * ((len(chunk) + C - 1) // C)), "black"); d = ImageDraw.Draw(sheet)
        for i, f in enumerate(chunk):
            im = Image.open(f); im.thumbnail((W, H)); x, y = (i % C) * W, (i // C) * (H + 16)
            sheet.paste(im, (x, y + 16)); d.text((x + 4, y + 2), f"{(s + i) / 2:.1f}s", fill="yellow")
        sheet.save(f"{OUT}/sheet-{s // 48:02d}.jpg", quality=80)
    os.makedirs(f"{OUT}/frames", exist_ok=True)
    for f in frames:  # keep full frames, compressed, so the best one can be picked later
        Image.open(f).save(f"{OUT}/frames/{os.path.basename(f)}", quality=82)

log.close()
