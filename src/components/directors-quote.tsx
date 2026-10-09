import { Quote } from "lucide-react"
import type { CastPhoto, SourceLink as Src } from "@/types/content"
import { SmartImage } from "@/components/smart-image"
import { SourceLink } from "@/components/source-link"

interface DirectorsQuoteProps {
  quoteHe: string
  quoteEn: string
  speakerHe: string
  contextHe: string
  source: Src
  photo?: CastPhoto
}

/** Editorial pull quote with a freely-licensed photo of the directors. */
export function DirectorsQuote({ quoteHe, quoteEn, speakerHe, contextHe, source, photo }: DirectorsQuoteProps) {
  return (
    <figure className="reveal relative mb-16 grid overflow-hidden rounded-[calc(var(--radius-lg)+0.25rem)] border border-brand/25 bg-[linear-gradient(120deg,rgb(18_77_10/0.35),#0b140d_55%)] md:grid-cols-[minmax(0,1fr)_17rem]">
      <div className="relative flex flex-col justify-center gap-5 p-7 sm:p-10">
        <Quote aria-hidden className="size-10 -scale-x-100 text-brand/60" />
        <blockquote className="text-2xl leading-snug font-black text-balance sm:text-3xl lg:text-4xl">״{quoteHe}״</blockquote>
        <p className="text-sm text-muted italic" lang="en" dir="ltr">“{quoteEn}”</p>
        <figcaption className="flex flex-col gap-1.5">
          <span className="text-lg font-bold text-brand-pale">{speakerHe}</span>
          <span className="text-sm leading-6 text-muted">{contextHe}</span>
          <SourceLink source={source} />
        </figcaption>
      </div>
      <div className="relative min-h-64 border-t border-border md:border-t-0 md:border-s">
        <SmartImage
          src={photo?.file}
          alt="האחים אנתוני וג׳ו רוסו"
          width={photo?.width ?? 4}
          height={photo?.height ?? 5}
          focus="50% 25%"
          className="h-full w-full md:absolute md:inset-0 md:aspect-auto!"
        />
        {photo && (
          <p className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/85 to-transparent px-3 pt-6 pb-2 text-[11px] text-muted">
            האחים רוסו · צילום: <bdi>{photo.author}</bdi> ·{" "}
            <a href={photo.licenseUrl || photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              <bdi dir="ltr">{photo.license}</bdi>
            </a>{" "}
            ·{" "}
            <a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
              ויקישיתוף
            </a>
          </p>
        )}
      </div>
    </figure>
  )
}
