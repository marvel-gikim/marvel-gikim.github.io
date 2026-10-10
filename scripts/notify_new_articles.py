"""Send a OneSignal web push for every article that is new in docs/articles.json.

Compares the current docs/articles.json with the version in the previous commit.
Needs the ONESIGNAL_REST_API_KEY secret; without it, it only prints what it would send.
"""
import json, os, subprocess, sys, urllib.request
from datetime import datetime, timezone

APP_ID = "f91c0142-927b-478b-9da6-f8e595bb42b3"
SITE = "https://marvel-gikim.github.io/"


def load(rev):
    try:
        raw = subprocess.run(["git", "show", f"{rev}:docs/articles.json"], capture_output=True, check=True, text=True).stdout
        return json.loads(raw)
    except Exception:
        return None


def main():
    before_rev = os.environ.get("BEFORE") or "HEAD~1"
    current = load("HEAD") or []
    previous = load(before_rev)
    if previous is None:
        print("No previous articles.json; not notifying (first run).")
        return 0
    known = {a["id"] for a in previous}
    new = [a for a in current if a["id"] not in known]
    if not new:
        print("No new articles.")
        return 0
    key = os.environ.get("ONESIGNAL_REST_API_KEY")
    for a in new:
        url = f"{SITE}#/article/{a['id']}"
        body = {
            "app_id": APP_ID,
            "target_channel": "push",
            "included_segments": ["Total Subscriptions"],
            "headings": {"en": "כתבה חדשה במארוול גיקים", "he": "כתבה חדשה במארוול גיקים"},
            "contents": {"en": a["titleHe"], "he": a["titleHe"]},
            "url": url,
            "chrome_web_icon": f"{SITE}brand/icon-192.png",
        }
        # Locked article: OneSignal holds the notification until the article opens
        if a.get("unlocksAt"):
            at = datetime.fromisoformat(a["unlocksAt"]).astimezone(timezone.utc)
            if at > datetime.now(timezone.utc):
                body["send_after"] = at.strftime("%Y-%m-%d %H:%M:%S GMT+0000")
        if not key:
            print("ONESIGNAL_REST_API_KEY missing; would send:", json.dumps(body, ensure_ascii=False))
            continue
        req = urllib.request.Request(
            "https://api.onesignal.com/notifications",
            data=json.dumps(body).encode(),
            headers={"Content-Type": "application/json", "Authorization": f"Key {key}"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as r:
            print("sent", a["id"], r.status, r.read().decode()[:300])
    return 0


if __name__ == "__main__":
    sys.exit(main())
