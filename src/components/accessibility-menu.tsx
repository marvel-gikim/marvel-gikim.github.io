import { useEffect, useRef, useState } from "react"
import { Accessibility, Contrast, FileText, Link2, Minus, Pause, Plus, RotateCcw, Type, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Prefs {
  text: 0 | 1 | 2 | 3
  contrast: boolean
  noMotion: boolean
  links: boolean
  font: boolean
}
const DEFAULTS: Prefs = { text: 0, contrast: false, noMotion: false, links: false, font: false }
const KEY = "mg-a11y"

function load(): Prefs {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }
  } catch {
    return DEFAULTS
  }
}

function apply(p: Prefs) {
  const c = document.documentElement.classList
  ;["a11y-text-1", "a11y-text-2", "a11y-text-3"].forEach((k) => c.remove(k))
  if (p.text) c.add(`a11y-text-${p.text}`)
  c.toggle("a11y-contrast", p.contrast)
  c.toggle("a11y-no-motion", p.noMotion)
  c.toggle("a11y-links", p.links)
  c.toggle("a11y-font", p.font)
}

/** Floating accessibility menu: text size, high contrast, stop animations, highlight links, readable font. */
export function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(load)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    apply(prefs)
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs))
    } catch {
      /* private mode: settings just won't be remembered */
    }
  }, [prefs])

  useEffect(() => {
    if (!open) return
    panelRef.current?.querySelector<HTMLElement>("button")?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const set = (patch: Partial<Prefs>) => setPrefs((p) => ({ ...p, ...patch }))
  const toggles: { key: "contrast" | "noMotion" | "links" | "font"; label: string; Icon: typeof Contrast }[] = [
    { key: "contrast", label: "ניגודיות גבוהה", Icon: Contrast },
    { key: "noMotion", label: "עצירת אנימציות", Icon: Pause },
    { key: "links", label: "הדגשת קישורים", Icon: Link2 },
    { key: "font", label: "גופן קריא", Icon: Type },
  ]

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="תפריט נגישות"
        title="נגישות"
        className="fixed bottom-4 left-4 z-[55] grid size-12 cursor-pointer place-items-center rounded-full bg-[#1d6fe0] text-white shadow-lg ring-2 ring-white/80 transition hover:scale-105 focus-visible:outline-white"
      >
        <Accessibility aria-hidden className="size-7" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id="a11y-panel"
          role="dialog"
          aria-label="תפריט נגישות"
          className="fixed bottom-20 left-4 z-[55] w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-border bg-background p-4 shadow-2xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-lg font-black">נגישות</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="סגירת תפריט הנגישות" className="cursor-pointer rounded-full p-1 text-muted hover:text-foreground">
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div className="mb-3 flex items-center justify-between rounded-xl border border-border p-2">
            <span className="ps-1 font-bold">גודל טקסט</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => set({ text: Math.max(0, prefs.text - 1) as Prefs["text"] })}
                disabled={prefs.text === 0}
                aria-label="הקטנת טקסט"
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus aria-hidden className="size-4" />
              </button>
              <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">
                {[100, 112, 125, 140][prefs.text]}%
              </span>
              <button
                type="button"
                onClick={() => set({ text: Math.min(3, prefs.text + 1) as Prefs["text"] })}
                disabled={prefs.text === 3}
                aria-label="הגדלת טקסט"
                className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus aria-hidden className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {toggles.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                aria-pressed={prefs[key]}
                onClick={() => set({ [key]: !prefs[key] } as Partial<Prefs>)}
                className={cn(
                  "flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-bold transition",
                  prefs[key] ? "border-brand bg-brand/15 text-brand-pale" : "border-border hover:bg-brand/8",
                )}
              >
                <Icon aria-hidden className="size-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setPrefs(DEFAULTS)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-bold text-muted hover:text-foreground"
            >
              <RotateCcw aria-hidden className="size-4" />
              איפוס
            </button>
            <a
              href="#/accessibility"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-pale underline underline-offset-4"
            >
              <FileText aria-hidden className="size-4" />
              הצהרת נגישות
            </a>
          </div>
        </div>
      )}
    </>
  )
}
