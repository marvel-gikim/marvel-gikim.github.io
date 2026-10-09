import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { inAppBrowserName, isIOS, isStandalone, withOneSignal } from "@/lib/push"

/**
 * Diagnostic panel for notifications, opened with the address …/#push-check.
 * Lets community members send a screenshot that shows why notifications don't work on their device.
 */
export function PushCheck() {
  const [open, setOpen] = useState(() => window.location.hash === "#push-check")
  const [sdk, setSdk] = useState<string>("בטעינה…")
  const [optedIn, setOptedIn] = useState<string>("—")

  useEffect(() => {
    const onHash = () => setOpen(window.location.hash === "#push-check")
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  useEffect(() => {
    if (!open) return
    let done = false
    withOneSignal((os) => {
      done = true
      setSdk(os.Notifications.isPushSupported() ? "נטענה ✓ (הדפדפן תומך)" : "נטענה, אבל הדפדפן לא תומך בהתראות ✗")
      setOptedIn(os.User.PushSubscription.optedIn ? "כן ✓" : "לא")
    })
    const t = window.setTimeout(() => !done && setSdk("לא נטענה ✗ (חוסם פרסומות או בעיית רשת)"), 8000)
    return () => window.clearTimeout(t)
  }, [open])

  if (!open) return null
  const perm = typeof Notification === "undefined" ? "לא קיים בדפדפן הזה ✗" : { granted: "מאושר ✓", denied: "חסום ✗", default: "עוד לא נשאל" }[Notification.permission]
  const app = inAppBrowserName()
  const rows: [string, string][] = [
    ["מערכת ההתראות", sdk],
    ["הרשאת התראות", perm],
    ["רשום לקבלת התראות", optedIn],
    ["נפתח מתוך אפליקציה", app ? `כן, ${app} ✗` : "לא ✓"],
    ["אייפון", isIOS() ? (isStandalone() ? "כן, נפתח ממסך הבית ✓" : "כן, לא ממסך הבית ✗") : "לא"],
    ["Service Worker", "serviceWorker" in navigator ? "נתמך ✓" : "לא נתמך ✗"],
  ]
  return (
    <div role="dialog" aria-label="בדיקת התראות" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-2xl border border-brand/50 bg-background/95 p-5 text-sm shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-base font-black">בדיקת התראות</p>
        <button type="button" onClick={() => { history.replaceState(null, "", " "); setOpen(false) }} aria-label="סגירה" className="cursor-pointer text-muted hover:text-foreground">
          <X className="size-5" />
        </button>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd className="font-bold">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs break-all text-muted" dir="ltr">
        {navigator.userAgent}
      </p>
      <p className="mt-2 text-xs text-muted">צלמו את המסך ושלחו למארוול גיקים.</p>
    </div>
  )
}
