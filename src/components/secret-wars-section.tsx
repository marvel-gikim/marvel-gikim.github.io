import { useState } from "react"
import { BookOpen, Eye, Quote } from "lucide-react"
import { SECRET_WARS } from "@/data/content"
import { SectionHeading } from "@/components/section-heading"
import { SourceLink } from "@/components/source-link"
import { cn } from "@/lib/utils"

/** Full section about Jonathan Hickman's Secret Wars (2015), the comic behind the next two Avengers films. */
export function SecretWarsSection() {
  const [showSpoiler, setShowSpoiler] = useState(false)
  const sw = SECRET_WARS

  return (
    <section id="secret-wars" aria-labelledby="secret-wars-title" className="relative overflow-hidden border-y border-border bg-[radial-gradient(ellipse_at_top,rgb(70_214_44/0.10),transparent_60%),linear-gradient(180deg,#050805,#081008_50%,#050805)] py-24 sm:py-32">
      {/* Slow drifting glow, echoing Battleworld's patchwork sky */}
      <span aria-hidden className="pointer-events-none absolute -start-40 top-1/3 size-[30rem] rounded-full bg-brand/10 blur-3xl animate-float" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="secret-wars-title" eyebrow="הקומיקס שמאחורי הסרטים" title="מלחמות סודיות (2015): כשדום הפך לאל">
          {sw.introHe} <SourceLink source={sw.introSource} className="text-base" />
        </SectionHeading>

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
      </div>
    </section>
  )
}
