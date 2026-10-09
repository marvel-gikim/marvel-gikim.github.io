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
    <figure className="reveal relative mb-16 grid overflow-hidden rounded-[calc(var(--radius-lg)+0.25rem)] border border-brand/25 bg-[linear-gradient(120deg,rgb(18_77_10/0.35),#0b140d_55%)] grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center">
      <div className="relative flex min-w-0 flex-col justify-center gap-5 p-6 sm:p-10">
        <Quote aria-hidden className="size-10 -scale-x-100 text-brand/60" />
        <blockquote className="text-2xl leading-snug font-black text-balance sm:text-3xl lg:text-4xl">״{quoteHe}״</blockquote>
        <p className="text-sm break-words text-muted italic" lang="en" dir="ltr">“{quoteEn}”</p>
        <figcaption className="flex flex-col gap-1.5">
          <span className="text-lg font-bold text-brand-pale">{speakerHe}</span>
          <span className="text-sm leading-6 text-muted">{contextHe}</span>
          <SourceLink source={source} />
        </figcaption>
      </div>
      <div className="relative min-w-0 border-t border-border md:m-6 md:overflow-hidden md:rounded-[var(--radius-lg)] md:border md:border-border">
        <SmartImage
          src={photo?.file}
          alt="האחים אנתוני וג׳ו רוסו"
          width={photo?.width ?? 16}
          height={photo?.height ?? 9}
          focus="50% 30%"
          className="w-full"
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
