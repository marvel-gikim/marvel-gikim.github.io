import type { CastPhoto, Character } from "@/types/content"
import { SmartImage } from "@/components/smart-image"
import { cn } from "@/lib/utils"

const STATUS_DOT: Record<Character["status"], string> = {
  official: "bg-brand",
  report: "bg-report",
  rumor: "bg-rumor",
}

/** Tight photo wall of the cast. Each photo opens that actor's page. */
export function CastGallery({ cast, photos, onOpen }: { cast: Character[]; photos: Record<string, CastPhoto>; onOpen: (id: string) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {cast.map((c) => (
        <li key={c.id} className="reveal">
          <button
            type="button"
            onClick={() => onOpen(c.id)}
            className="group relative block w-full cursor-pointer overflow-hidden rounded-lg border border-transparent text-start transition duration-300 hover:z-10 hover:scale-[1.03] hover:border-brand/70 hover:shadow-[0_20px_50px_-15px_rgb(70_214_44/0.6)] focus-visible:border-brand"
            aria-label={`${c.actorHe}${c.characterHe ? `, ${c.characterHe}` : ""}. לעמוד השחקן`}
          >
            <SmartImage
              src={photos[c.id]?.file}
              alt=""
              width={4}
              height={5}
              focus="50% 18%"
              imgClassName="grayscale-[35%] transition duration-700 group-hover:scale-110 group-hover:grayscale-0"
            />
            <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 p-2.5">
              <span className="flex items-center gap-1.5">
                <span aria-hidden className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[c.status])} />
                <span className="truncate text-sm font-black">{c.actorHe}</span>
              </span>
              {c.characterHe && (
                <span className="mt-0.5 block truncate text-xs text-brand-pale/90 transition-all duration-300 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-6 sm:group-hover:opacity-100">
                  {c.characterHe}
                </span>
              )}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
