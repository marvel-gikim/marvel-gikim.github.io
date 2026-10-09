"""One-off: find the official trailer frame of Steve Rogers catching Mjolnir.
1) og:image of articles about that moment; 2) frames from the official trailer via yt-dlp (1 per second, contact sheets)."""
import html, io, os, re, subprocess, urllib.request, glob
from PIL import Image, ImageDraw
OUT = "hunt/out"; os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"}
PAGES = {
 "popverse": "https://www.thepopverse.com/movies-avengers-doomsday-chris-evans-steve-rogers-reveal-still-worthy-captain-america-thor-mjolnir",
 "fpj": "https://www.freepressjournal.in/entertainment/avengers-doomsday-trailer-teases-steve-rogers-lifting-mjlnir-once-again-how-captain-america-wields-thors-hammer",
 "pinkvilla": "https://www.pinkvilla.com/entertainment/hollywood/avengers-doomsday-trailer-chris-evans-returns-to-wield-mjolnir-after-robert-downey-jrs-ruthless-doctor-doom-creates-havoc-1404442",
 "inquirer": "https://entertainment.inquirer.net/677803/avengers-doomsday-first-trailer-reveals-mcus-biggest-crossover-yet",
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
    except Exception as e:
        log.write(f"og {k} FAIL {e}\n")
try:
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
except Exception as e:
    log.write(f"yt FAIL {e}\n")
log.close()
