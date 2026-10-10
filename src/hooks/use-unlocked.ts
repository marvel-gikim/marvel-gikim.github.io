import { useEffect, useState } from "react"

/** True once `unlocksAt` has passed (re-checks every second while locked). */
export function useUnlocked(unlocksAt?: string) {
  const target = unlocksAt ? new Date(unlocksAt).getTime() : 0
  const [now, setNow] = useState(() => Date.now())
  const unlocked = !unlocksAt || now >= target
  useEffect(() => {
    if (unlocked) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [unlocked])
  return { unlocked, msLeft: Math.max(0, target - now) }
}

/** "02:14:05" style countdown */
export function formatCountdown(ms: number) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return h >= 24 ? `${Math.floor(h / 24)} ימים ו-${h % 24} שעות` : `${pad(h)}:${pad(m)}:${pad(sec)}`
}

/** Unlock time in Israel, e.g. "16:00" or "16:00, 12 באוקטובר" */
export function unlockLabel(unlocksAt: string) {
  const d = new Date(unlocksAt)
  const time = d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" })
  const day = d.toLocaleDateString("he-IL", { day: "numeric", month: "long", timeZone: "Asia/Jerusalem" })
  const today = new Date().toLocaleDateString("he-IL", { day: "numeric", month: "long", timeZone: "Asia/Jerusalem" })
  return day === today ? time : `${time}, ${day}`
}
