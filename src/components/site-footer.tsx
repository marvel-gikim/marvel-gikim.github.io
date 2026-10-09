import { ExternalLink, Instagram, MessageCircle, Music2 } from "lucide-react"
import type { NavLink } from "@/types/content"
import { BrandLogo } from "@/components/brand-logo"
import { formatHebrewDate } from "@/lib/utils"

interface SiteFooterProps {
  links: NavLink[]
  lastReviewed: string
  socials: { label: string; handle: string; url: string; icon: "instagram" | "tiktok" | "whatsapp" }[]
}

export function SiteFooter({ links, lastReviewed, socials }: SiteFooterProps) {
  return (
    <footer className="relative border-t border-border bg-surface/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <BrandLogo size={64} />
            <div>
              <p className="text-2xl font-black">מארוול גיקים</p>
              <p className="text-sm text-muted">קהילת המעריצים של מארוול</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted">אתר מעריצים עצמאי. אינו אתר רשמי של Marvel או Disney.</p>
        </div>

        <nav aria-label="ניווט בכותרת התחתונה">
          <p className="mb-3 text-sm font-bold text-brand">ניווט</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-foreground/85 underline decoration-brand/30 underline-offset-4 transition hover:text-brand-pale hover:decoration-brand">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {socials.length > 0 && (
          <div>
            <p className="mb-3 text-sm font-bold text-brand">עקבו אחרינו</p>
            <ul className="flex flex-col gap-3">
              {socials.map((s) => {
                const Icon = s.icon === "instagram" ? Instagram : s.icon === "whatsapp" ? MessageCircle : Music2
                return (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 rounded-full border border-brand/40 bg-brand/8 py-2 ps-2 pe-5 font-bold transition hover:border-brand hover:bg-brand/15 hover:shadow-[0_0_30px_-8px_rgb(70_214_44/0.7)]"
                    >
                      <span className="grid size-9 place-items-center rounded-full bg-brand text-primary-foreground transition group-hover:scale-110">
                        <Icon aria-hidden className="size-4.5" />
                      </span>
                      <span>
                        {s.label} · <bdi dir="ltr" className="text-brand-pale">{s.handle}</bdi>
                      </span>
                      <ExternalLink aria-hidden className="size-3.5 text-muted" />
                      <span className="sr-only"> (נפתח בלשונית חדשה)</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted/80 sm:px-6 lg:px-8">
          עודכן לאחרונה: <time dateTime={lastReviewed}>{formatHebrewDate(lastReviewed)}</time> · התוכן נבדק ידנית. אין באתר עדכון חי.
        </p>
      </div>
    </footer>
  )
}
