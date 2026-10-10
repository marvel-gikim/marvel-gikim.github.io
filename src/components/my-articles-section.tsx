import { ArrowLeft, Clock, Feather, Instagram, Lock, MessageCircle, Music2 } from "lucide-react"
import type { MyArticle } from "@/types/content"
import { SectionHeading } from "@/components/section-heading"
import { VerificationBadge } from "@/components/verification-badge"
import { WhatsAppAlert } from "@/components/whatsapp-alert"
import { WHATSAPP_URL } from "@/data/content"
import { formatHebrewDate } from "@/lib/utils"
import { formatCountdown, unlockLabel, useUnlocked } from "@/hooks/use-unlocked"

/** Rough reading time in minutes (Hebrew ~200 words per minute) */
export const readingMinutes = (a: MyArticle) => Math.max(1, Math.round(a.bodyHe.join(" ").split(/\s+/).length / 200))

interface Social {
  label: string
  url: string
  icon: "tiktok" | "instagram" | "whatsapp"
}

/** "My articles": long-form pieces written by Marvel Gikim. Each card opens the full article. */
export function MyArticlesSection({ articles, onOpen, socials }: { articles: MyArticle[]; onOpen: (id: string) => void; socials: Social[] }) {
  const [featured, ...rest] = articles
  return (
    <section id="my-articles" aria-labelledby="my-articles-title" className="relative overflow-hidden border-t border-border py-24 sm:py-32">
      <span aria-hidden className="pointer-events-none absolute -start-40 top-20 size-[30rem] rounded-full bg-brand/8 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="my-articles-title" eyebrow="הכתבות שלי" title="כתבות מקוריות של מארוול גיקים">
          ניתוחים, תיאוריות ודעות שכתבנו בעצמנו. כאן זה כבר לא רק חדשות, אלא מה שאנחנו חושבים.
        </SectionHeading>

        <WhatsAppAlert href={WHATSAPP_URL} className="mb-8" />

        {!featured ? (
          <div className="reveal shine flex flex-col items-center gap-5 rounded-[calc(var(--radius-lg)+0.25rem)] border border-dashed border-brand/40 bg-surface/60 px-6 py-14 text-center">
            <span className="grid size-16 place-items-center rounded-full border border-brand/50 bg-brand/10 text-brand animate-float">
              <Feather aria-hidden className="size-7" />
            </span>
            <h3 className="text-2xl font-black">הכתבות הראשונות בדרך</h3>
            <p className="max-w-xl text-lg leading-8 text-muted">בקרוב יעלו כאן הכתבות שלנו על דומסדיי ועל היקום של מארוול. בינתיים, עקבו אחרינו כדי לא לפספס.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon === "instagram" ? Instagram : s.icon === "whatsapp" ? MessageCircle : Music2
                return (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand/10 px-5 py-2.5 font-bold text-brand-pale transition hover:border-brand hover:bg-brand/20"
                  >
                    <Icon aria-hidden className="size-5" />
                    {s.label}
                  </a>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <ArticleCard article={featured} onOpen={onOpen} featured />
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} onOpen={onOpen} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ArticleCard({ article: a, onOpen, featured }: { article: MyArticle; onOpen: (id: string) => void; featured?: boolean }) {
  const { unlocked, msLeft } = useUnlocked(a.unlocksAt)
  if (!unlocked && a.unlocksAt) {
    return (
      <article className={featured ? "reveal lg:col-span-3" : "reveal"}>
        <div className="relative grid min-h-64 place-items-center overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-brand/50 bg-surface p-8 text-center">
          {a.cover && <img src={a.cover.src} alt="" aria-hidden className="absolute inset-0 size-full scale-110 object-cover opacity-25 blur-xl" />}
          <div className="relative flex flex-col items-center gap-3">
            <span className="grid size-16 place-items-center rounded-full border border-brand/60 bg-background/80 text-brand animate-float">
              <Lock aria-hidden className="size-7" />
            </span>
            <p className="text-sm font-bold tracking-[0.18em] text-brand">כתבה נעולה</p>
            {a.teaserHe && <Teaser text={a.teaserHe} />}
            <p className="text-3xl font-black sm:text-4xl">תיפתח ב-{unlockLabel(a.unlocksAt)}</p>
            <p className="text-lg text-muted" aria-live="off">
              עוד <span className="font-black text-brand-pale tabular-nums">{formatCountdown(msLeft)}</span>
            </p>
          </div>
        </div>
      </article>
    )
  }
  return (
    <article className={featured ? "reveal lg:col-span-3" : "reveal"}>
      <button
        type="button"
        onClick={() => onOpen(a.id)}
        className={`group shine grid h-full w-full cursor-pointer overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface text-start transition duration-300 hover:-translate-y-1 hover:border-brand/60 hover:shadow-[0_30px_80px_-30px_rgb(70_214_44/0.5)] ${featured && a.cover ? "lg:grid-cols-[1.2fr_1fr]" : ""}`}
      >
        {a.cover && (
          <span className={`relative block overflow-hidden ${featured ? "aspect-video lg:aspect-auto lg:min-h-80" : "aspect-video"}`}>
            <img
              src={a.cover.src}
              alt={a.cover.altHe}
              loading="lazy"
              style={a.cover.focus ? { objectPosition: a.cover.focus } : undefined}
              className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105"
            />
          </span>
        )}
        <span className={`flex flex-col gap-3 p-6 ${featured ? "sm:p-10" : ""}`}>
          <span className="flex flex-wrap items-center gap-3 text-sm text-muted">
            {a.status && <VerificationBadge status={a.status} />}
            <time dateTime={a.publishedAt}>{formatHebrewDate(a.publishedAt)}</time>
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3.5" />
              {readingMinutes(a)} דק׳ קריאה
            </span>
          </span>
          {a.teaserHe && <Teaser text={a.teaserHe} />}
          <span className={`font-black text-balance ${featured ? "text-3xl leading-tight sm:text-4xl" : "text-xl"}`}>{a.titleHe}</span>
          <span className="leading-7 text-muted">{a.excerptHe}</span>
          {a.tagsHe && a.tagsHe.length > 0 && (
            <span className="flex flex-wrap gap-2">
              {a.tagsHe.map((t) => (
                <span key={t} className="rounded-full border border-brand/30 px-2.5 py-0.5 text-xs font-bold text-brand-pale">
                  {t}
                </span>
              ))}
            </span>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 font-bold text-brand-pale">
            לקריאת הכתבה
            <ArrowLeft aria-hidden className="size-4 transition group-hover:-translate-x-1" />
          </span>
        </span>
      </button>
    </article>
  )
}

/** Small highlighted label (e.g. "מבט חדש על NYCC") */
export function Teaser({ text }: { text: string }) {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/60 bg-brand/15 px-3.5 py-1 text-sm font-black text-brand-pale shadow-[0_0_24px_-6px_rgb(70_214_44/0.7)]">
      <span aria-hidden className="size-2 animate-pulse rounded-full bg-brand" />
      <bdi>{text}</bdi>
    </span>
  )
}
