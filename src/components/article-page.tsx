import { useEffect, useRef } from "react"
import { ArrowRight, Clock, ExternalLink } from "lucide-react"
import type { MyArticle } from "@/types/content"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { readingMinutes } from "@/components/my-articles-section"
import { formatHebrewDate } from "@/lib/utils"

/** Full-screen reader for one of our articles. Closing returns to the same spot on the site. */
export function ArticlePage({ article: a, onClose }: { article: MyArticle; onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    headingRef.current?.focus()
    document.title = `${a.titleHe} · מארוול גיקים`
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      document.title = "מארוול גיקים · הנוקמים: דומסדיי"
      window.removeEventListener("keydown", onKey)
    }
  }, [a.titleHe, onClose])

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="article-title" className="fixed inset-0 z-50 overflow-y-auto bg-background animate-fade-in">
      <div className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowRight aria-hidden />
            חזרה לאתר
          </Button>
          <BrandLogo size={36} />
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        <p className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted animate-fade-slide-in">
          <span className="font-bold text-brand">מארוול גיקים</span>
          <time dateTime={a.publishedAt}>{formatHebrewDate(a.publishedAt)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {readingMinutes(a)} דק׳ קריאה
          </span>
        </p>
        <h1 id="article-title" ref={headingRef} tabIndex={-1} className="text-4xl leading-tight font-black text-balance outline-none sm:text-5xl animate-fade-slide-in animation-delay-100">
          {a.titleHe}
        </h1>
        <p className="mt-5 text-xl leading-9 text-foreground/80 animate-fade-slide-in animation-delay-200">{a.excerptHe}</p>

        {a.cover && (
          <figure className="m-0 mt-10 animate-fade-slide-in animation-delay-300">
            <img src={a.cover.src} alt={a.cover.altHe} className="w-full rounded-[var(--radius-lg)] border border-border" />
            {a.cover.creditHe && <figcaption className="mt-2 text-xs text-muted">{a.cover.creditHe}</figcaption>}
          </figure>
        )}

        <div className="mt-10 space-y-6 text-lg leading-9 text-foreground/90">
          {a.bodyHe.map((p, i) =>
            p.startsWith("## ") ? (
              <h2 key={i} className="pt-4 text-2xl font-black text-brand-pale">
                {p.slice(3)}
              </h2>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </div>

        {a.postUrl && (
          <a
            href={a.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-12 inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand/10 px-5 py-2.5 font-bold text-brand-pale transition hover:bg-brand/20"
          >
            <ExternalLink aria-hidden className="size-4" />
            לסרטון שלנו על הכתבה
          </a>
        )}
      </article>
    </div>
  )
}
