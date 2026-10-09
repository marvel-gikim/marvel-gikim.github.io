import { useState } from "react"
import { BookOpen, Eye, Quote } from "lucide-react"
import { SECRET_WARS } from "@/data/content"
import { SectionHeading } from "@/components/section-heading"
import { SourceLink } from "@/components/source-link"
import { SmartImage } from "@/components/smart-image"
import { MediaGallery } from "@/components/media-gallery"
import { cn } from "@/lib/utils"

const LEVEL = {
  official: { label: "נאמר רשמית", chip: "border-brand/60 text-brand-pale", border: "border-brand/40" },
  fact: { label: "עובדה", chip: "border-brand/40 text-brand-pale/90", border: "border-border" },
  report: { label: "דיווח", chip: "border-report/60 text-report", border: "border-report/30" },
  interpretation: { label: "פרשנות", chip: "border-rumor/60 text-rumor", border: "border-dashed border-rumor/30" },
} as const

/** Full section about Jonathan Hickman's Secret Wars (2015), the comic behind the next two Avengers films. */
export function SecretWarsSection() {
  const [showSpoiler, setShowSpoiler] = useState(false)
  const sw = SECRET_WARS
  const mainCover = sw.covers[0]
  const pageById = (id?: string) => sw.pages.find((p) => p.id === id)

  return (
    <section id="secret-wars" aria-labelledby="secret-wars-title" className="relative overflow-hidden border-y border-border bg-[radial-gradient(ellipse_at_top,rgb(70_214_44/0.10),transparent_60%),linear-gradient(180deg,#050805,#081008_50%,#050805)] py-24 sm:py-32">
      {/* Slow drifting glow, echoing Battleworld's patchwork sky */}
      <span aria-hidden className="pointer-events-none absolute -start-40 top-1/3 size-[30rem] rounded-full bg-brand/10 blur-3xl animate-float" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid items-center gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <SectionHeading id="secret-wars-title" eyebrow="הקומיקס שמאחורי הסרטים" title="מלחמות סודיות (2015): כשדום הפך לאל" className="mb-0">
            {sw.introHe} <SourceLink source={sw.introSource} className="text-base" />
          </SectionHeading>
          <figure className="reveal m-0 mx-auto w-full max-w-[19rem] [perspective:1200px]">
            <a
              href={mainCover.source?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block animate-float"
              aria-label="העטיפה הרשמית של גיליון 1 בעמוד הגיליון ב-marvel.com (נפתח בלשונית חדשה)"
            >
              <div className="shine overflow-hidden rounded-lg border border-brand/30 shadow-[0_50px_120px_-30px_rgb(70_214_44/0.55)] transition duration-700 [transform:rotateY(-10deg)_rotateX(4deg)] group-hover:[transform:rotateY(0deg)_rotateX(0deg)]">
                <SmartImage src={mainCover.src} alt={mainCover.altHe} width={mainCover.width} height={mainCover.height} priority />
              </div>
            </a>
            <figcaption className="mt-4 text-center text-sm text-muted">
              העטיפה הרשמית של גיליון 1. {sw.coverCreditHe} © Marvel
            </figcaption>
          </figure>
        </div>

        <dl className="mb-16 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {sw.facts.map((f) => (
            <div key={f.labelHe} className="reveal shine rounded-[var(--radius-lg)] border border-brand/25 bg-surface/70 p-5">
              <dt className="text-sm text-muted">{f.labelHe}</dt>
              <dd className="mt-1 text-2xl font-black text-brand-pale sm:text-3xl"><bdi dir="ltr">{f.value}</bdi></dd>
            </div>
          ))}
        </dl>

        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <h3 className="reveal mb-8 flex items-center gap-2 text-2xl font-black">
              <BookOpen aria-hidden className="size-6 text-brand" />
              העלילה, פרק אחרי פרק
            </h3>
            <ol className="relative space-y-10 border-s border-brand/25 ps-8">
              {sw.chapters.map((c, i) => {
                const hidden = c.spoiler && !showSpoiler
                return (
                  <li key={c.id} className="reveal relative">
                    <span
                      aria-hidden
                      className="absolute -start-[2.85rem] top-0 grid size-9 place-items-center rounded-full border border-brand/50 bg-background text-sm font-black text-brand shadow-[0_0_24px_-4px_rgb(70_214_44/0.6)]"
                    >
                      {i + 1}
                    </span>
                    <h4 className="flex flex-wrap items-center gap-2 text-xl font-black">
                      {c.titleHe}
                      {c.spoiler && <span className="rounded-full border border-rumor/50 px-2.5 py-0.5 text-xs font-bold text-rumor">ספוילר</span>}
                    </h4>
                    <div className="relative mt-2">
                      <p
                        className={cn("leading-8 text-foreground/85 transition duration-700", hidden && "select-none blur-md")}
                        aria-hidden={hidden || undefined}
                      >
                        {c.textHe}
                      </p>
                      {hidden && (
                        <button
                          type="button"
                          onClick={() => setShowSpoiler(true)}
                          className="absolute inset-0 m-auto flex h-fit w-fit cursor-pointer items-center gap-2 rounded-full border border-brand/60 bg-background/90 px-4 py-2 text-sm font-bold text-brand-pale transition hover:bg-brand/15"
                        >
                          <Eye aria-hidden className="size-4" />
                          הצגת הסוף של הקומיקס
                        </button>
                      )}
                    </div>
                    {(() => {
                      const page = pageById(c.pageId)
                      if (!page) return null
                      return (
                        <figure className="m-0 mt-4 overflow-hidden rounded-[var(--radius-lg)] border border-border">
                          <SmartImage
                            src={page.src}
                            alt={hidden ? "" : page.altHe}
                            width={16}
                            height={9}
                            focus={page.focus}
                            className={cn("transition duration-700", hidden && "blur-xl")}
                            imgClassName="transition duration-[1.5s] hover:scale-105"
                          />
                          {!hidden && <figcaption className="border-t border-border bg-surface/70 px-4 py-2 text-sm text-muted">{page.captionHe} © Marvel</figcaption>}
                        </figure>
                      )
                    })()}
                    <SourceLink source={c.source} className="mt-2" />
                  </li>
                )
              })}
            </ol>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start" aria-label="הקשר לסרטים">
            <figure className="reveal m-0 overflow-hidden rounded-[var(--radius-lg)] border border-brand/30 bg-gradient-to-b from-brand-deep/40 to-surface p-7">
              <Quote aria-hidden className="size-8 text-brand" />
              <blockquote className="mt-3 text-2xl leading-[1.5] font-light">״{sw.filmLink.quoteHe}״</blockquote>
              <figcaption className="mt-4 text-sm font-bold text-brand-pale">{sw.filmLink.quoteByHe}</figcaption>
              <p className="mt-5 leading-7 text-muted">{sw.filmLink.textHe}</p>
              <SourceLink source={sw.filmLink.source} className="mt-3" />
            </figure>

            <div className="reveal rounded-[var(--radius-lg)] border border-border bg-surface/70 p-6">
              <h3 className="text-lg font-black">איך הקומיקס יצא לאור</h3>
              <p className="mt-3 leading-7 text-muted">{sw.publicationHe}</p>
              <div className="mt-3 flex flex-col gap-1.5">
                {sw.publicationSources.map((s) => (
                  <SourceLink key={s.url} source={s} />
                ))}
              </div>
            </div>

            <div className="reveal rounded-[var(--radius-lg)] border border-dashed border-white/15 bg-surface/50 p-6">
              <h3 className="text-lg font-black">רוצים לקרוא?</h3>
              <p className="mt-3 leading-7 text-muted">
                הסדרה המרכזית היא ״Secret Wars״ גיליונות 1 עד 9. סביבה יצאו סדרות משנה רבות, שכל אחת מתרחשת באחת הממלכות של עולם הקרב.
              </p>
              <SourceLink source={sw.publicationSources[1]} className="mt-3" />
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <h3 className="reveal mb-2 text-2xl font-black">{sw.why.titleHe}</h3>
          <p className="reveal mb-8 max-w-3xl text-lg leading-8 text-muted">{sw.why.introHe}</p>
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sw.why.items.map((item, i) => (
              <li key={item.id} className={cn("reveal shine flex flex-col rounded-[var(--radius-lg)] border bg-surface/70 p-6", LEVEL[item.level].border)}>
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden className="text-3xl font-black text-brand/30 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("rounded-full border px-2.5 py-0.5 text-xs font-bold", LEVEL[item.level].chip)}>{LEVEL[item.level].label}</span>
                </div>
                <h4 className="mt-3 text-lg font-black">{item.titleHe}</h4>
                <p className="mt-2 flex-1 leading-7 text-foreground/80">{item.textHe}</p>
                <SourceLink source={item.source} className="mt-3" />
              </li>
            ))}
          </ol>
          <p className="reveal mt-8 rounded-[var(--radius-lg)] border-s-4 border-brand bg-brand/8 p-5 text-lg leading-8 font-medium">{sw.why.bottomLineHe}</p>
        </div>

        <div className="mt-20">
          <h3 className="reveal mb-2 text-2xl font-black">כל 9 העטיפות הרשמיות</h3>
          <p className="reveal mb-6 text-muted">{sw.coverCreditHe} לחיצה על עטיפה מגדילה אותה.</p>
          <MediaGallery items={sw.covers} variant="covers" />
        </div>

        <div className="mt-20">
          <h3 className="reveal mb-2 text-2xl font-black">מתוך הקומיקס</h3>
          <p className="reveal mb-6 text-muted">
            עמודים מתוך הסדרה, כפי שפורסמו בכתבה הרשמית של Marvel. חלקם חושפים פרטים מהעלילה.{" "}
            <SourceLink source={sw.introSource} prefix="" />
          </p>
          <MediaGallery items={sw.pages} />
        </div>
      </div>
    </section>
  )
}
