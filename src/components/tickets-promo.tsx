import { useState } from "react"
import { Play, Ticket } from "lucide-react"
import { SourceLink } from "@/components/source-link"
import type { SourceLink as Src } from "@/types/content"

interface TicketsPromoProps {
  href: string
  youtubeId: string
  videoTitle: string
  videoSource: Src
}

/** Ticket call-to-action for Planet Cinema, built around Marvel's official "Doom Tickets" spot. */
export function TicketsPromo({ href, youtubeId, videoTitle, videoSource }: TicketsPromoProps) {
  const [playing, setPlaying] = useState(false)
  return (
    <section id="tickets" aria-labelledby="tickets-title" className="relative overflow-hidden border-b border-border bg-[radial-gradient(ellipse_at_center,rgb(70_214_44/0.14),transparent_65%)] py-20 sm:py-24">
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-14 lg:px-8">
        <div className="reveal min-w-0">
          <div className="relative aspect-video overflow-hidden rounded-[var(--radius-lg)] border border-brand/40 bg-black shadow-[0_40px_120px_-30px_rgb(70_214_44/0.6)]">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&hl=he`}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 size-full"
              />
            ) : (
              <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 cursor-pointer" aria-label={`ניגון: ${videoTitle}`}>
                <img
                  src={`https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`}
                  onError={(e) => {
                    e.currentTarget.src = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
                  }}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-0 m-auto grid size-20 place-items-center rounded-full bg-brand text-primary-foreground shadow-[0_0_60px_-5px_rgb(70_214_44/0.9)] transition duration-300 group-hover:scale-110">
                  <Play aria-hidden className="size-8 translate-x-0.5 fill-current" />
                </span>
                <span className="absolute start-4 bottom-3 rounded-full bg-black/70 px-3 py-1 text-sm font-bold">{videoTitle}</span>
              </button>
            )}
          </div>
          <SourceLink source={videoSource} className="mt-3" />
        </div>

        <div className="reveal flex flex-col items-start gap-5">
          <p className="flex items-center gap-2 text-sm font-bold tracking-[0.18em] text-brand">
            <Ticket aria-hidden className="size-4" />
            כרטיסים
          </p>
          <h2 id="tickets-title" className="text-4xl leading-[1.1] font-black text-balance sm:text-5xl">
            רוצים לראות את דומסדיי על המסך הכי גדול?
          </h2>
          <p className="text-lg leading-8 text-foreground/85">
            כרטיסים להקרנות <bdi dir="ltr">Infinity Vision</bdi> של ״הנוקמים: דומסדיי״ זמינים באתר של פלאנט. ההמלצה שלנו: להזמין מראש ולבחור מקומות טובים.
          </p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="shine group inline-flex items-center gap-3 rounded-full bg-brand px-8 py-4 text-lg font-black text-primary-foreground shadow-[0_0_50px_-8px_rgb(70_214_44/0.9)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            <Ticket aria-hidden className="size-6 transition group-hover:-rotate-12" />
            קנו כרטיסים בפלאנט
            <span className="sr-only">(נפתח בלשונית חדשה)</span>
          </a>
          <p className="text-sm text-muted">הקישור נפתח בלשונית חדשה, באתר של פלאנט.</p>
        </div>
      </div>
    </section>
  )
}
