"""Download videos shared on Google Drive and prepare them for the site.

scripts/videos.json maps a key to a Google Drive file id (the part after /file/d/ in the share link).
Each video is converted to a web-friendly MP4 (H.264, up to 720p, starts playing before it fully loads)
plus a poster image, and written to public/media/video/ and docs/media/video/ as <key>.mp4 and <key>.jpg.
A video that is already there is skipped; delete its files to fetch it again.
"""
import json, os, shutil, subprocess, tempfile

import gdown

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIRS = [os.path.join(ROOT, "public", "media", "video"), os.path.join(ROOT, "docs", "media", "video")]
MAX_MB = 95  # GitHub refuses files over 100 MB


def run(*cmd):
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def main():
    cfg = json.load(open(os.path.join(ROOT, "scripts", "videos.json"), encoding="utf-8"))
    for d in OUT_DIRS:
        os.makedirs(d, exist_ok=True)
    for key, file_id in cfg.items():
        mp4 = os.path.join(OUT_DIRS[0], key + ".mp4")
        if os.path.exists(mp4):
            print("skip", key, "(already there)")
            continue
        with tempfile.TemporaryDirectory() as tmp:
            src = os.path.join(tmp, "source")
            if not gdown.download(id=file_id, output=src, quiet=False):
                raise SystemExit(f"could not download {key}: is the Drive file shared with 'anyone with the link'?")
            run("ffprobe", "-hide_banner", src)
            out = os.path.join(tmp, key + ".mp4")
            common_in = ["ffmpeg", "-hide_banner", "-y", "-i", src, "-vf", "scale=-2:'min(720,ih)'", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p"]
            common_out = ["-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", out]
            run(*common_in, "-crf", "23", *common_out)
            mb = os.path.getsize(out) / 1e6
            print(f"{key}: {mb:.1f} MB", flush=True)
            if mb > MAX_MB:
                # Too big (a long video): encode again at the bitrate that fits the limit, in two passes for an exact size
                duration = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                                                 capture_output=True, text=True, check=True).stdout.strip())
                kbps = int(MAX_MB * 0.92 * 8000 / duration) - 128
                print(f"{key}: {duration:.0f} s, re-encoding at {kbps} kb/s", flush=True)
                if kbps < 250:
                    raise SystemExit(f"{key} is too long to fit {MAX_MB} MB in good quality ({duration / 60:.0f} minutes)")
                log = os.path.join(tmp, "pass")
                run(*common_in, "-b:v", f"{kbps}k", "-pass", "1", "-passlogfile", log, "-an", "-f", "mp4", os.devnull)
                run(*common_in, "-b:v", f"{kbps}k", "-pass", "2", "-passlogfile", log, *common_out)
                mb = os.path.getsize(out) / 1e6
                print(f"{key}: {mb:.1f} MB", flush=True)
                if mb > MAX_MB:
                    raise SystemExit(f"{key} is {mb:.0f} MB after conversion, over the {MAX_MB} MB limit")
            poster = os.path.join(tmp, key + ".jpg")
            run("ffmpeg", "-hide_banner", "-y", "-ss", "2", "-i", out, "-frames:v", "1", "-q:v", "3", poster)
            for d in OUT_DIRS:
                shutil.copy(out, d)
                shutil.copy(poster, d)


if __name__ == "__main__":
    main()
