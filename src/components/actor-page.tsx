import { useEffect, useRef } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import type { CastPhoto, Character } from "@/types/content"
import { VerificationBadge } from "@/components/verification-badge"
import { SourceLink } from "@/components/source-link"
import { SmartImage } from "@/components/smart-image"
import { BrandLogo } from "@/components/brand-logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ActorPageProps {
  character: Character
  all: Character[]
  groups: Record<Character["group"], string>
  photos: Record<string, CastPhoto>
  onClose: () => void
  onOpen: (id: string) => void
}

/** Dedicated page for one actor, rendered over the site so closing returns to the same spot. */
export function ActorPage({ character: c, all, groups, photos, onClose, onOpen }: ActorPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const photo = photos[c.id]
  const index = all.findIndex((x) => x.id === c.id)
  const prev = all[(index - 1 + all.length) % all.length]
  const next = all[(index + 1) % all.length]
  const sameGroup = all.filter((x) => x.group === c.group && x.id !== c.id)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    headingRef.current?.focus()
    document.title = `${c.actorHe} · מארוול גיקים`
    return () => {
      document.title = "מארוול גיקים · הנוקמים: דומסדיי"
    }
  }, [c.id, c.actorHe])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onOpen(next.id)
      if (e.key === "ArrowRight") onOpen(prev.id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose, onOpen, next.id, prev.id])

  return (
    <div
      ref={scrollRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="actor-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-background animate-fade-in"
    >
      <div className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowRight aria-hidden />
            חזרה לאתר
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => onOpen(prev.id)} aria-label={`השחקן הקודם: ${prev.actorHe}`}>
              <ChevronRight aria-hidden />
            </Button>
            <span className="text-sm text-muted tabular-nums">
              {index + 1} / {all.length}
            </span>
            <Button variant="ghost" size="icon" onClick={() => onOpen(next.id)} aria-label={`השחקן הבא: ${next.actorHe}`}>
              <ChevronLeft aria-hidden />
            </Button>
          </div>
          <BrandLogo size={36} className="hidden sm:block" />
        </div>
      </div>

      <article key={c.id} className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14 md:py-16">
        <figure className="m-0 animate-fade-slide-in">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-brand/25 shadow-[0_40px_120px_-40px_rgb(70_214_44/0.5)]">
            <SmartImage
              src={photo?.file}
              alt={`${c.actorHe}, צילום מוויקישיתוף`}
              width={4}
              height={5}
              focus="50% 18%"
              priority
              className="w-full"
            />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
          {photo && (
            <figcaption className="mt-3 text-xs leading-5 text-muted">
              צילום: <bdi>{photo.author}</bdi> ·{" "}
              <a href={photo.licenseUrl || photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-pale underline decoration-brand/50 underline-offset-4 hover:decoration-brand-pale">
                <bdi dir="ltr">{photo.license}</bdi>
              </a>{" "}
              ·{" "}
              <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-brand-pale underline decoration-brand/50 underline-offset-4 hover:decoration-brand-pale">
                ויקישיתוף
              </a>
            </figcaption>
          )}
        </figure>

        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3 animate-fade-slide-in animation-delay-100">
            <VerificationBadge status={c.status} />
            <span className="rounded-full border border-border px-3 py-0.5 text-sm text-muted">{groups[c.group]}</span>
          </div>
          <div className="animate-fade-slide-in animation-delay-200">
            <h1 id="actor-title" ref={headingRef} tabIndex={-1} className="text-5xl leading-[1.05] font-black tracking-tight outline-none sm:text-6xl lg:text-7xl">
              {c.actorHe}
            </h1>
            <p className="mt-2 text-lg text-muted">
              <bdi dir="ltr">{c.actorEn}</bdi>
            </p>
          </div>

          {c.characterHe && (
            <div className="rounded-[var(--radius-lg)] border border-brand/25 bg-brand/8 p-5 animate-fade-slide-in animation-delay-300">
              <p className="text-sm font-bold tracking-[0.14em] text-brand">
                {c.status === "official" ? "הדמות" : c.status === "report" ? "הדמות, לפי הדיווח" : "הדמות, לפי השמועה"}
              </p>
              <p className="mt-1 text-3xl font-black text-brand-pale">{c.characterHe}</p>
              {c.characterEn && (
                <p className="mt-1 text-muted">
                  <bdi dir="ltr">{c.characterEn}</bdi>
                </p>
              )}
            </div>
          )}

          <p className="text-xl leading-9 text-foreground/90 animate-fade-slide-in animation-delay-400">{c.descriptionHe}</p>
          <SourceLink source={c.source} className="text-base animate-fade-slide-in animation-delay-500" />

          {sameGroup.length > 0 && (
            <div className="mt-4 animate-fade-slide-in animation-delay-700">
              <h2 className="mb-4 text-lg font-black">עוד מ{groups[c.group]}</h2>
              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {sameGroup.map((x) => (
                  <li key={x.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(x.id)}
                      className="group block w-full cursor-pointer overflow-hidden rounded-lg border border-border text-start transition hover:border-brand/60"
                    >
                      <SmartImage src={photos[x.id]?.file} alt="" width={4} height={5} focus="50% 18%" imgClassName="transition duration-500 group-hover:scale-105" />
                      <span className={cn("block truncate px-2 py-1.5 text-xs font-bold", "group-hover:text-brand-pale")}>{x.actorHe}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
