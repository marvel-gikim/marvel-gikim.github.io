import type { GalleryImage, SourceLink as Src, VerificationStatus } from "@/types/content"
import { VerificationBadge } from "@/components/verification-badge"
import { SourceLink } from "@/components/source-link"
import { SmartImage } from "@/components/smart-image"
import { cn } from "@/lib/utils"

interface RumorFeatureProps {
  titleHe: string
  status: VerificationStatus
  frames?: GalleryImage[]
  /** Short label shown on each frame */
  frameLabels?: string[]
  /** Aspect ratio of the frame tiles */
  frameAspect?: [number, number]
  sceneHe: string
  sceneSource: Src
  blocks: { titleHe: string; textHe: string; source: Src }[]
}

/** A rumor told around an official trailer moment: the frames first, then what is claimed and what doesn't fit. */
export function RumorFeature({ titleHe, status, frames = [], frameLabels = [], frameAspect = [16, 9], sceneHe, sceneSource, blocks }: RumorFeatureProps) {
  return (
    <article className="reveal mb-16 overflow-hidden rounded-[calc(var(--radius-lg)+0.25rem)] border border-rumor/30 bg-[linear-gradient(160deg,rgb(201_163_255/0.07),#0b140d_45%)]">
      {frames.length > 0 && (
      <div className={cn("grid gap-px bg-border", frames.length === 3 ? "grid-cols-3" : "sm:grid-cols-2")}>
        {frames.map((f, i) => (
          <figure key={f.id} className="group relative m-0 bg-black">
            <SmartImage src={f.src} alt={f.altHe} width={frameAspect[0]} height={frameAspect[1]} focus={f.focus} imgClassName="transition duration-[1.5s] group-hover:scale-105" />
            <span className="pointer-events-none absolute start-2 top-2 rounded-full bg-black/75 px-2.5 py-0.5 text-xs font-black text-brand-pale sm:start-3 sm:top-3">
              {frameLabels[i]}
            </span>
            <figcaption className="border-t border-border bg-surface/80 px-4 py-2 text-xs leading-5 text-muted">
              {f.provenanceNoteHe} <bdi dir="ltr">© Marvel</bdi>
            </figcaption>
          </figure>
        ))}
      </div>
      )}
      <div className="p-6 sm:p-10">
        <VerificationBadge status={status} />
        <h3 className="mt-4 text-3xl leading-tight font-black text-balance sm:text-4xl">{titleHe}</h3>
        <p className="mt-4 max-w-4xl text-lg leading-8 text-foreground/85">
          {sceneHe} <SourceLink source={sceneSource} />
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {blocks.map((b) => (
            <section key={b.titleHe} className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface/70 p-5">
              <h4 className="text-lg font-black text-rumor">{b.titleHe}</h4>
              <p className="mt-2 flex-1 leading-7 text-foreground/80">{b.textHe}</p>
              <SourceLink source={b.source} className="mt-3" />
            </section>
          ))}
        </div>
      </div>
    </article>
  )
}
