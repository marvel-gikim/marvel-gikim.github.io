import { useEffect, useRef, useState, type ReactNode } from "react"
import { ArrowRight, Clock, ExternalLink, Eye, Lock, Pause, Play, Volume2, VolumeX } from "lucide-react"
import type { MyArticle } from "@/types/content"
import { BrandLogo } from "@/components/brand-logo"
import { VerificationBadge } from "@/components/verification-badge"
import { WhatsAppAlert } from "@/components/whatsapp-alert"
import { WHATSAPP_URL } from "@/data/content"
import { Button } from "@/components/ui/button"
import { readingMinutes, Teaser } from "@/components/my-articles-section"
import { formatCountdown, unlockLabel, useUnlocked } from "@/hooks/use-unlocked"
import { formatHebrewDate } from "@/lib/utils"

/** Full-screen reader for one of our articles. Closing returns to the same spot on the site. */
export function ArticlePage({ article: a, onClose }: { article: MyArticle; onClose: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { unlocked, msLeft } = useUnlocked(a.unlocksAt)

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

  const header = (
    <>
        <p className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted animate-fade-slide-in">
        {a.status && <VerificationBadge status={a.status} />}
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
      {a.bodyHe[0] !== a.excerptHe && (
        <p className="mt-5 text-xl leading-9 text-foreground/80 animate-fade-slide-in animation-delay-200">{a.excerptHe}</p>
      )}

    </>
  )

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

      {!unlocked && a.unlocksAt ? (
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
          <span className="grid size-20 place-items-center rounded-full border border-brand/60 bg-surface text-brand animate-float">
            <Lock aria-hidden className="size-9" />
          </span>
          <h1 id="article-title" ref={headingRef} tabIndex={-1} className="text-4xl font-black outline-none sm:text-5xl">
            הכתבה תיפתח ב-{unlockLabel(a.unlocksAt)}
          </h1>
          <p className="text-xl text-muted">
            עוד <span className="font-black text-brand-pale tabular-nums">{formatCountdown(msLeft)}</span>
          </p>
          {a.teaserHe && <Teaser text={a.teaserHe} />}
          <p className="text-muted">אפשר להישאר בעמוד: הכתבה תיפתח כאן לבד ברגע שהזמן יגיע.</p>
        </div>
      ) : (
      <>
      {a.backgroundVideoId && <VideoHero videoId={a.backgroundVideoId} poster={a.cover?.src}>{header}</VideoHero>}

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
        {!a.backgroundVideoId && header}

        {a.teaserHe && (
          <div className="mt-8">
            <Teaser text={a.teaserHe} />
          </div>
        )}

        {a.videoId && (
          <div className="mt-6 aspect-video overflow-hidden rounded-[var(--radius-lg)] border border-brand/40 bg-black shadow-[0_30px_80px_-30px_rgb(70_214_44/0.5)]">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${a.videoId}?rel=0&modestbranding=1&playsinline=1&hl=he`}
              title={a.titleHe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="size-full"
            />
          </div>
        )}

        {a.cover && !a.backgroundVideoId && !a.videoId && (
          <figure className="m-0 mt-10 animate-fade-slide-in animation-delay-300">
            <img
              src={a.cover.src}
              alt={a.cover.altHe}
              style={a.cover.focus ? { objectPosition: a.cover.focus } : undefined}
              className="aspect-video w-full rounded-[var(--radius-lg)] border border-border object-cover"
            />
            {a.cover.creditHe && <figcaption className="mt-2 text-xs text-muted">{a.cover.creditHe}</figcaption>}
          </figure>
        )}

        <div className="mt-10 space-y-6 text-lg leading-9 text-foreground/90">
          {a.bodyHe.map((p, i) =>
            p.startsWith("## ") ? (
              <h2 key={i} className="pt-4 text-2xl font-black text-brand-pale">
                {p.slice(3)}
              </h2>
            ) : p.startsWith("!! ") ? (
              <Spoiler key={i} text={p.slice(3)} />
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
            {a.postLabelHe ?? "לסרטון שלנו על הכתבה"}
          </a>
        )}
        <WhatsAppAlert href={WHATSAPP_URL} className="mt-14" />
      </article>
      </>
      )}
    </div>
  )
}

/** Paragraph hidden behind a blur until the reader chooses to see it. */
function Spoiler({ text }: { text: string }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="relative">
      <p className={shown ? "transition duration-700" : "select-none blur-md transition duration-700"} aria-hidden={!shown || undefined}>
        {text}
      </p>
      {!shown && (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="absolute inset-0 m-auto flex h-fit w-fit cursor-pointer items-center gap-2 rounded-full border border-rumor/60 bg-background/90 px-4 py-2 text-sm font-bold text-rumor transition hover:bg-rumor/10"
        >
          <Eye aria-hidden className="size-4" />
          הצגת הספוילר
        </button>
      )}
    </div>
  )
}

/**
 * Article header over a muted, looping YouTube video (embedded from YouTube, not copied).
 * Has a pause button; starts paused only when the accessibility menu's "stop animations" is on.
 */
function VideoHero({ videoId, poster, children }: { videoId: string; poster?: string; children: ReactNode }) {
  // Plays by default; only the site's own "stop animations" accessibility option starts it paused
  const prefersStill = document.documentElement.classList.contains("a11y-no-motion")
  const [playing, setPlaying] = useState(!prefersStill)
  const [muted, setMuted] = useState(true)
  const frameRef = useRef<HTMLIFrameElement>(null)
  // Browsers only allow autoplay without sound; the visitor turns sound on with a click (YouTube IFrame API commands)
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
  const command = (func: string, args: unknown[] = []) =>
    frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*")
  const toggleSound = () => {
    if (!playing) setPlaying(true)
    const next = !muted
    setMuted(next)
    // Give a freshly mounted player a moment before sending commands
    window.setTimeout(() => {
      if (next) command("mute")
      else {
        command("unMute")
        command("setVolume", [80])
        command("playVideo")
      }
    }, playing ? 0 : 1500)
  }
  return (
    <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden border-b border-border bg-black">
      {poster && <img src={poster} alt="" aria-hidden className="absolute inset-0 -z-20 size-full object-cover opacity-70" />}
      {playing && (
        <iframe
          ref={frameRef}
          src={src}
          title="סרטון רקע"
          aria-hidden
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[56.25vw] min-h-full w-screen min-w-[177.78svh] -translate-x-1/2 -translate-y-1/2 scale-110"
        />
      )}
      <span aria-hidden className="absolute inset-0 -z-[5] bg-gradient-to-t from-background via-background/60 to-black/30" />
      <div className="mx-auto w-full max-w-3xl px-4 pt-24 pb-10 sm:px-6">{children}</div>
      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        className="absolute top-20 right-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-black/60 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-black/80"
      >
        {muted ? <VolumeX aria-hidden className="size-4" /> : <Volume2 aria-hidden className="size-4" />}
        {muted ? "הפעלת סאונד" : "השתקה"}
      </button>
      <button
        type="button"
        onClick={() => {
          setPlaying((p) => !p)
          setMuted(true)
        }}
        aria-label={playing ? "עצירת סרטון הרקע" : "הפעלת סרטון הרקע"}
        className="absolute top-20 left-4 grid size-10 cursor-pointer place-items-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
      >
        {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
      </button>
    </section>
  )
}
