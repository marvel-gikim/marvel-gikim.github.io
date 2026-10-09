import { useEffect, useState } from "react"
import { Bell, BellOff, BellRing, Check, Share } from "lucide-react"
import { isIOS, isStandalone, withOneSignal } from "@/lib/push"
import { cn } from "@/lib/utils"

type State = "loading" | "ready" | "subscribed" | "denied" | "ios-install" | "unsupported" | "blocked"

/** "Get notified about new articles" button, backed by OneSignal web push. */
export function NotifyButton({ className }: { className?: string }) {
  const [state, setState] = useState<State>("loading")

  useEffect(() => {
    // iPhone/iPad only allow web push from a site added to the home screen
    if (isIOS() && !isStandalone()) {
      setState("ios-install")
      return
    }
    if (typeof Notification !== "undefined" && Notification.permission === "denied") {
      setState("denied")
      return
    }
    let alive = true
    withOneSignal((os) => {
      if (!alive) return
      if (!os.Notifications.isPushSupported()) return setState("unsupported")
      const sync = () => setState(os.Notifications.permission && os.User.PushSubscription.optedIn !== false ? "subscribed" : "ready")
      sync()
      os.Notifications.addEventListener("permissionChange", sync)
    })
    // SDK didn't load (ad blocker or offline)
    const t = window.setTimeout(() => alive && setState((s) => (s === "loading" ? "blocked" : s)), 8000)
    return () => {
      alive = false
      window.clearTimeout(t)
    }
  }, [])

  const subscribe = () =>
    withOneSignal(async (os) => {
      await os.Notifications.requestPermission()
      if (os.Notifications.permission) {
        await os.User.PushSubscription.optIn()
        setState("subscribed")
      } else if (typeof Notification !== "undefined" && Notification.permission === "denied") {
        setState("denied")
      }
    })

  const base = "inline-flex items-center gap-2 rounded-full px-6 py-3 font-black transition"

  if (state === "subscribed") {
    return (
      <p className={cn(base, "border border-brand/50 bg-brand/10 text-brand-pale", className)} role="status">
        <Check aria-hidden className="size-5" />
        ההתראות פעילות. נעדכן אתכם על כל כתבה חדשה
      </p>
    )
  }
  if (state === "ios-install") {
    return (
      <p className={cn("flex items-start gap-2 rounded-2xl border border-border bg-surface/70 px-4 py-3 text-sm leading-6 text-muted", className)}>
        <Share aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
        <span>
          באייפון: לחצו על כפתור השיתוף בדפדפן, בחרו ״הוספה למסך הבית״, ופתחו את האתר מהאייקון. שם יופיע הכפתור לקבלת התראות.
        </span>
      </p>
    )
  }
  if (state === "denied") {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-muted", className)}>
        <BellOff aria-hidden className="size-4" />
        ההתראות חסומות בדפדפן. אפשר להפעיל אותן מחדש בהגדרות האתר בדפדפן.
      </p>
    )
  }
  if (state === "blocked") {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-muted", className)}>
        <BellOff aria-hidden className="size-4" />
        לא הצלחנו לטעון את מערכת ההתראות. אם יש לכם חוסם פרסומות, נסו לכבות אותו לאתר הזה.
      </p>
    )
  }
  if (state === "unsupported") {
    return (
      <p className={cn("flex items-center gap-2 text-sm text-muted", className)}>
        <BellOff aria-hidden className="size-4" />
        הדפדפן הזה לא תומך בהתראות. נסו בכרום, באדג׳ או בפיירפוקס.
      </p>
    )
  }
  return (
    <button
      type="button"
      onClick={subscribe}
      disabled={state === "loading"}
      className={cn(
        base,
        "group cursor-pointer bg-brand text-primary-foreground shadow-[0_0_40px_-8px_rgb(70_214_44/0.8)] hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-70",
        className,
      )}
    >
      {state === "loading" ? <Bell aria-hidden className="size-5" /> : <BellRing aria-hidden className="size-5 transition group-hover:rotate-12" />}
      קבלו התראה על כל כתבה חדשה
    </button>
  )
}
