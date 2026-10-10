import { Clapperboard, Sparkles } from "lucide-react"
import { FOX_XMEN } from "@/data/content"
import type { CastPhoto } from "@/types/content"
import { SectionHeading } from "@/components/section-heading"
import { SourceLink } from "@/components/source-link"

/** Explainer: how the X-Men film rights went Marvel → Fox → Disney, and why Fox's X-Men are in Doomsday. */
export function FoxXmenSection({ photo }: { photo?: CastPhoto }) {
  const x = FOX_XMEN
  return (
    <section id="fox-xmen" aria-labelledby="fox-xmen-title" className="relative overflow-hidden border-t border-border py-24 sm:py-32">
      <span aria-hidden className="pointer-events-none absolute -end-40 top-1/4 size-[28rem] rounded-full bg-brand/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="fox-xmen-title" eyebrow="מאחורי הקלעים" title="איך האקס-מן של פוקס הגיעו ליקום של מארוול">
          {x.introHe}
        </SectionHeading>

        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ol className="relative space-y-8 border-s border-brand/25 ps-8">
            {x.steps.map((st) => (
              <li key={st.yearHe} className="reveal relative">
                <span aria-hidden className="absolute -start-[2.55rem] top-1.5 size-4 rounded-full border-2 border-brand bg-background shadow-[0_0_16px_rgb(70_214_44/0.7)]" />
                <p className="text-sm font-black tracking-wide text-brand tabular-nums">
                  <bdi dir="ltr">{st.yearHe}</bdi>
                </p>
                <h3 className="mt-1 text-xl font-black">{st.titleHe}</h3>
                <p className="mt-2 leading-8 text-foreground/85">{st.textHe}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {st.sources.map((s) => (
                    <SourceLink key={s.url} source={s} />
                  ))}
                </div>
              </li>
            ))}
          </ol>

          <aside className="order-first flex flex-col gap-6 lg:order-none lg:sticky lg:top-28 lg:self-start">
            {photo && (
              <figure className="reveal m-0 overflow-hidden rounded-[var(--radius-lg)] border border-brand/40 shadow-[0_30px_80px_-30px_rgb(70_214_44/0.5)]">
                <img
                  src={photo.file}
                  alt="שחקני סרטי האקס-מן יחד על הבמה"
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="w-full object-cover"
                />
                <figcaption className="border-t border-border bg-surface/80 px-4 py-2 text-xs leading-5 text-muted">
                  צילום: <bdi>{photo.author}</bdi> ·{" "}
                  <a href={photo.licenseUrl || photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    <bdi dir="ltr">{photo.license}</bdi>
                  </a>{" "}
                  ·{" "}
                  <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    ויקישיתוף
                  </a>
                </figcaption>
              </figure>
            )}
            <div className="reveal shine rounded-[var(--radius-lg)] border border-brand/40 bg-gradient-to-b from-brand-deep/40 to-surface p-7">
              <Sparkles aria-hidden className="size-7 text-brand" />
              <h3 className="mt-3 text-2xl font-black">{x.howHe.titleHe}</h3>
              <p className="mt-3 leading-8 text-foreground/85">{x.howHe.textHe}</p>
              <SourceLink source={x.howHe.source} className="mt-3" />
            </div>
            <div className="reveal grid grid-cols-3 gap-3 text-center">
              {[
                ["1994", "הזכויות נמכרות לפוקס"],
                ["$71.3B", "מחיר עסקת דיסני-פוקס"],
                ["2019", "האקס-מן חוזרים למארוול"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl border border-border bg-surface/70 p-3">
                  <p className="text-xl font-black text-brand-pale sm:text-2xl">
                    <bdi dir="ltr">{v}</bdi>
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">{l}</p>
                </div>
              ))}
            </div>
            <a
              href="#characters"
              className="reveal inline-flex items-center gap-2 self-start rounded-full border border-brand/50 bg-brand/10 px-5 py-2.5 font-bold text-brand-pale transition hover:bg-brand/20"
            >
              <Clapperboard aria-hidden className="size-4" />
              לשחקני האקס-מן בדומסדיי
            </a>
          </aside>
        </div>
      </div>
    </section>
  )
}
