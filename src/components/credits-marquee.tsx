import type { Character } from "@/types/content"

/** Cinematic end-credits style ticker of the confirmed cast. Decorative: hidden from screen readers. */
export function CreditsMarquee({ cast }: { cast: Character[] }) {
  const names = cast.filter((c) => c.status === "official")
  const row = (
    <ul className="flex shrink-0 items-center gap-10 pe-10">
      {names.map((c) => (
        <li key={c.id} className="flex items-center gap-10 whitespace-nowrap">
          <span className="text-lg font-black tracking-tight text-foreground/80 sm:text-xl">{c.actorHe}</span>
          <span aria-hidden className="size-1.5 rotate-45 bg-brand/70" />
        </li>
      ))}
    </ul>
  )
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-border bg-surface/60 py-5 [mask-image:linear-gradient(to_left,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  )
}
