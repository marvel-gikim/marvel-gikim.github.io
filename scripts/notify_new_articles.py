"""Send a OneSignal web push for every article that is new in docs/articles.json.

Compares the current docs/articles.json with the version in the previous commit.
Needs the ONESIGNAL_REST_API_KEY secret; without it, it only prints what it would send.
"""
import json, os, subprocess, sys, urllib.request
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

APP_ID = "f91c0142-927b-478b-9da6-f8e595bb42b3"
SITE = "https://marvel-gikim.github.io/"


def load(rev):
    try:
        raw = subprocess.run(["git", "show", f"{rev}:docs/articles.json"], capture_output=True, check=True, text=True).stdout
        return json.loads(raw)
    except Exception:
        return None


def send(body):
    key = os.environ.get("ONESIGNAL_REST_API_KEY")
    if not key:
        print("ONESIGNAL_REST_API_KEY missing; would send:", json.dumps(body, ensure_ascii=False))
        return
    req = urllib.request.Request(
        "https://api.onesignal.com/notifications",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Key {key}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        print("sent", body["headings"]["he"], body.get("send_after", "now"), r.status, r.read().decode()[:200])


def push(heading, text, url, send_after=None, only_ids=None):
    body = {
        "app_id": APP_ID,
        "target_channel": "push",
        "headings": {"en": heading, "he": heading},
        "contents": {"en": text, "he": text},
        "url": url,
        "chrome_web_icon": f"{SITE}brand/icon-192.png",
    }
    if only_ids:
        body["include_subscription_ids"] = only_ids
    else:
        body["included_segments"] = ["Total Subscriptions"]
    if send_after:
        body["send_after"] = send_after
    send(body)


def unlock_time(a):
    """(utc datetime, Israel "HH:MM") if the article is still locked, else None"""
    if not a.get("unlocksAt"):
        return None
    at = datetime.fromisoformat(a["unlocksAt"])
    if at.astimezone(timezone.utc) <= datetime.now(timezone.utc):
        return None
    return at.astimezone(timezone.utc), at.astimezone(ZoneInfo("Asia/Jerusalem")).strftime("%H:%M")


def announce(a):
    """Heads-up now for a locked article: "נשמרה כתבה ל-16:00" """
    lock = unlock_time(a)
    if not lock:
        return
    teaser = f" · {a['teaserHe']}" if a.get("teaserHe") else ""
    push(f"נשמרה כתבה לשעה {lock[1]} ⏰", f"{a['titleHe']}{teaser}. היא תיפתח היום ב-{lock[1]}.", f"{SITE}#/article/{a['id']}")


def notify_article(a):
    url = f"{SITE}#/article/{a['id']}"
    lock = unlock_time(a)
    if lock:
        announce(a)  # now: "saved for 16:00"
        # at unlock time: the regular new-article notification
        push("כתבה חדשה במארוול גיקים", a["titleHe"], url, lock[0].strftime("%Y-%m-%d %H:%M:%S GMT+0000"))
    else:
        push("כתבה חדשה במארוול גיקים", a["titleHe"], url)


def main():
    # Manual run with a device id (from #push-check): send a test notification to that device only
    test_id = os.environ.get("TEST_SUBSCRIPTION_ID")
    if test_id:
        push("בדיקת התראות ✓", "אם אתם רואים את זה, ההתראות של מארוול גיקים עובדות במכשיר הזה.", SITE, only_ids=[test_id.strip()])
        return 0
    # Manual run with an article id: send only the "saved for later" heads-up for it
    only = os.environ.get("ANNOUNCE_ID")
    if only:
        for a in load("HEAD") or []:
            if a["id"] == only:
                announce(a)
                return 0
        raise SystemExit(f"article {only} not found")

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
    for a in new:
        notify_article(a)
    return 0


if __name__ == "__main__":
    sys.exit(main())
