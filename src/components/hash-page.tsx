import { useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/** Full-screen text page shown when the address ends with the given hash (e.g. #/legal). */
export function HashPage({ route, title, updatedHe, children }: { route: `#/${string}`; title: string; updatedHe: string; children: ReactNode }) {
  const [open, setOpen] = useState(() => window.location.hash === route)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === route)
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("popstate", sync)
    }
  }, [route])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    headingRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const close = () => {
    window.history.replaceState(null, "", " ")
    setOpen(false)
  }

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={`${route.slice(2)}-title`} className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6">
          <Button variant="outline" size="sm" onClick={close}>
            <ArrowRight aria-hidden />
            חזרה לאתר
          </Button>
        </div>
      </div>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 text-lg leading-9 sm:px-6 [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-brand-pale [&_h3]:pt-2 [&_h3]:text-xl [&_h3]:font-black [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6 [&_a]:font-bold [&_a]:text-brand-pale [&_a]:underline [&_a]:underline-offset-4">
        <h1 id={`${route.slice(2)}-title`} ref={headingRef} tabIndex={-1} className="text-4xl font-black text-balance outline-none">
          {title}
        </h1>
        {children}
        <p className="text-base text-muted">עודכן לאחרונה: {updatedHe}</p>
      </article>
    </div>
  )
}
