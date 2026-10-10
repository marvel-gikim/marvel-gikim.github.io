"""Print delivery stats of the latest OneSignal notifications (no secrets printed).
Run from the "Notify subscribers" workflow (manual run)."""
import json, os, urllib.request

APP_ID = "f91c0142-927b-478b-9da6-f8e595bb42b3"
key = os.environ.get("ONESIGNAL_REST_API_KEY")
if not key:
    raise SystemExit("ONESIGNAL_REST_API_KEY missing")
req = urllib.request.Request(
    f"https://api.onesignal.com/notifications?app_id={APP_ID}&limit=5",
    headers={"Authorization": f"Key {key}", "Accept": "application/json"},
)
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.load(r)
except urllib.error.HTTPError as e:
    raise SystemExit(f"HTTP {e.code}: {e.read().decode()[:400]}")
print("total notifications:", data.get("total_count"))
for n in data.get("notifications", []):
    print(json.dumps({
        "title": (n.get("contents") or {}).get("he") or (n.get("contents") or {}).get("en"),
        "segments": n.get("included_segments"),
        "successful": n.get("successful"),
        "failed": n.get("failed"),
        "errored": n.get("errored"),
        "remaining": n.get("remaining"),
        "converted": n.get("converted"),
        "received": n.get("received"),
        "web": (n.get("platform_delivery_stats") or {}).get("chrome_web_push") or (n.get("platform_delivery_stats") or {}).get("web_push"),
    }, ensure_ascii=False))
