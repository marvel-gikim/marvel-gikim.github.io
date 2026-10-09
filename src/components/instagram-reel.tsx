import { useState } from "react"
import { Instagram, Play } from "lucide-react"
import type { SourceLink as Src, VerificationStatus } from "@/types/content"
import { VerificationBadge } from "@/components/verification-badge"
import { SourceLink } from "@/components/source-link"

interface InstagramReelProps {
  reelId: string
  titleHe: string
  textHe: string
  accountHe: string
  status: VerificationStatus
  sources: Src[]
}

/**
 * Official Instagram embed of a reel. Loads only after a click, so Instagram
 * scripts and cookies are not pulled in for visitors who don't watch it.
 */
export function InstagramReel({ reelId, titleHe, textHe, accountHe, status, sources }: InstagramReelProps) {
  const [loaded, setLoaded] = useState(false)
  const url = `https://www.instagram.com/reel/${reelId}/`
  return (
    <article className="reveal mb-16 grid overflow-hidden rounded-[calc(var(--radius-lg)+0.25rem)] border border-rumor/30 bg-[linear-gradient(120deg,rgb(201_163_255/0.08),#0b140d_55%)] md:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
      <div className="flex flex-col justify-center gap-4 p-6 sm:p-10">
        <VerificationBadge status={status} className="self-start" />
        <h3 className="text-2xl leading-snug font-black text-balance sm:text-3xl">{titleHe}</h3>
        <p className="text-lg leading-8 text-foreground/85">{textHe}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 self-start font-bold text-brand-pale underline decoration-brand/50 underline-offset-4 hover:decoration-brand-pale"
        >
          <Instagram aria-hidden className="size-4" />
          צפייה באינסטגרם של {accountHe} בטאב חדש
        </a>
        <div className="flex flex-col gap-1.5">
          {sources.map((s) => (
            <SourceLink key={s.url} source={s} />
          ))}
        </div>
      </div>
      <div className="relative border-t border-border bg-black md:border-s md:border-t-0">
        {loaded ? (
          <iframe
            src={`${url}embed/`}
            title={titleHe}
            className="block h-[38rem] w-full"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="group flex h-[38rem] w-full cursor-pointer flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_40%,rgb(201_163_255/0.18),transparent_65%)] text-center"
          >
            <span className="grid size-20 place-items-center rounded-full border border-rumor/60 bg-black/60 transition duration-300 group-hover:scale-110 group-hover:border-rumor">
              <Play aria-hidden className="size-8 translate-x-0.5 fill-current text-rumor" />
            </span>
            <span className="font-bold">טעינת הסרטון מאינסטגרם</span>
            <span className="max-w-60 text-sm text-muted">הסרטון נטען מאינסטגרם רק אחרי לחיצה</span>
          </button>
        )}
      </div>
    </article>
  )
}
