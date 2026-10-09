import { useEffect, useRef, type ReactNode } from "react"
import { ArrowDown, Play, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface HeroInfoItem {
  label: string
  value: ReactNode
}

export interface ResponsiveHeroBannerProps {
  id?: string
  /** Small label above the title, e.g. the presenting brand */
  badge?: ReactNode
  title: string
  subtitle?: string
  primaryButton?: { label: string; href: string }
  secondaryButton?: { label: string; href: string }
  /** External ticket link, shown first and opened in a new tab */
  ticketsButton?: { label: string; href: string }
  background: { src: string; alt: string; focus?: string; width: number; height: number }
  /** Verified facts shown in a compact row */
  infoItems?: HeroInfoItem[]
  /** Extra slot under the info row (e.g. countdown) */
  aside?: ReactNode
  /** Credit / provenance line for the background image */
  imageCredit?: ReactNode
  className?: string
}

/**
 * Full-bleed cinematic hero. Adapted from the ResponsiveHeroBanner pattern:
 * background media + readability overlays + staggered fade-slide-in content.
 * The site navigation lives in SiteHeader, so this banner has no nav of its own.
 */
export function ResponsiveHeroBanner({
  id,
  badge,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  ticketsButton,
  background,
  infoItems,
  aside,
  imageCredit,
  className,
}: ResponsiveHeroBannerProps) {
  const sectionRef = useRef<HTMLElement>(null)
  // Subtle parallax: the background drifts slower than the page
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, window.innerHeight)
        sectionRef.current?.style.setProperty("--hero-shift", `${y * 0.35}px`)
        sectionRef.current?.style.setProperty("--hero-fade", `${1 - y / window.innerHeight}`)
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])
  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn("relative isolate flex min-h-[100svh] items-end overflow-hidden pt-28 pb-14 sm:pb-20", className)}
    >
      {/* Background image: shown on the visual end side on desktop, full-bleed on mobile */}
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden" style={{ transform: "translate3d(0, var(--hero-shift, 0px), 0)" }}>
        <img
          src={background.src}
          alt=""
          width={background.width}
          height={background.height}
          fetchPriority="high"
          className="absolute inset-y-0 end-0 h-full w-full animate-kenburns object-cover opacity-70 lg:w-[62%]"
          style={{ objectPosition: background.focus }}
        />
      </div>
      {/* Readability overlays + restrained emerald glow */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_left,#050805_8%,rgb(5_8_5/0.92)_42%,rgb(5_8_5/0.35)_75%,rgb(5_8_5/0.2))] max-lg:bg-[linear-gradient(to_top,#050805_18%,rgb(5_8_5/0.85)_55%,rgb(5_8_5/0.45))]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute -bottom-40 start-[-10%] size-[42rem] rounded-full bg-brand/14 blur-[120px] animate-glow-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(0_0_0/0.55)_100%)]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8" style={{ opacity: "var(--hero-fade, 1)" }}>
        <div className="max-w-3xl">
          {badge && <div className="mb-6 animate-fade-slide-in">{badge}</div>}

          <h1
            id={id ? `${id}-title` : undefined}
            className="animate-fade-slide-in animation-delay-100 text-[clamp(3.2rem,11vw,8.5rem)] leading-[0.95] font-black tracking-tight text-balance"
          >
            <span className="bg-gradient-to-b from-white via-[#e6f2e3] to-[#8fa88c] bg-clip-text text-transparent drop-shadow-[0_6px_30px_rgb(0_0_0/0.6)]">
              {title}
            </span>
          </h1>

          {subtitle && (
            <p className="mt-6 animate-fade-slide-in animation-delay-200 text-xl font-light text-foreground/90 sm:text-2xl lg:text-3xl">
              {subtitle}
            </p>
          )}

          {(primaryButton || secondaryButton || ticketsButton) && (
            <div className="mt-9 flex animate-fade-slide-in animation-delay-300 flex-col gap-3 sm:flex-row sm:flex-wrap">
              {ticketsButton && (
                <Button asChild size="lg" className="shine w-full shadow-[0_0_40px_-8px_rgb(70_214_44/0.8)] sm:w-auto">
                  <a href={ticketsButton.href} target="_blank" rel="noopener noreferrer">
                    <Ticket aria-hidden />
                    {ticketsButton.label}
                    <span className="sr-only">(נפתח בלשונית חדשה)</span>
                  </a>
                </Button>
              )}
              {primaryButton && (
                <Button asChild size="lg" variant={ticketsButton ? "outline" : "default"} className="w-full sm:w-auto">
                  <a href={primaryButton.href}>
                    <Play aria-hidden className="fill-current" />
                    {primaryButton.label}
                  </a>
                </Button>
              )}
              {secondaryButton && (
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <a href={secondaryButton.href}>
                    {secondaryButton.label}
                    <ArrowDown aria-hidden />
                  </a>
                </Button>
              )}
            </div>
          )}

          {infoItems && infoItems.length > 0 && (
            <dl className="mt-12 grid animate-fade-slide-in animation-delay-400 grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
              {infoItems.map((item) => (
                <div key={item.label} className="bg-background/80 px-5 py-4 backdrop-blur">
                  <dt className="text-xs font-bold tracking-[0.14em] text-brand">{item.label}</dt>
                  <dd className="mt-1 text-base font-bold text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {aside && <div className="mt-6 animate-fade-slide-in animation-delay-500">{aside}</div>}
        </div>
      </div>

      {imageCredit && (
        <p className="absolute bottom-4 end-4 max-w-xs text-end text-[11px] leading-4 text-muted/70 sm:end-6 lg:end-8">{imageCredit}</p>
      )}
    </section>
  )
}
