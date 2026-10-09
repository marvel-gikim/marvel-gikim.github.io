import { BellRing, MessageCircle } from "lucide-react"
import { NotifyButton } from "@/components/notify-button"
import { cn } from "@/lib/utils"

/** "Know first" card: browser notifications for new articles, with the WhatsApp group as an alternative. */
export function WhatsAppAlert({ href, className }: { href: string; className?: string }) {
  return (
    <div
      className={cn(
        "reveal flex flex-col gap-5 rounded-[var(--radius-lg)] border border-brand/40 bg-[linear-gradient(120deg,rgb(70_214_44/0.12),transparent_60%)] p-6 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
          <BellRing aria-hidden className="size-6 animate-float" />
        </span>
        <div>
          <p className="text-lg font-black">רוצים לדעת ראשונים על כל כתבה חדשה?</p>
          <p className="mt-1 leading-7 text-muted">הפעילו התראות, וכל כתבה חדשה תקפוץ לכם בטלפון או במחשב, גם כשהאתר סגור.</p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 lg:items-end">
        <NotifyButton />
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#25D366] underline decoration-[#25D366]/40 underline-offset-4 hover:decoration-[#25D366]"
        >
          <MessageCircle aria-hidden className="size-4" />
          או הצטרפו לקבוצת הוואטסאפ
          <span className="sr-only">(נפתח בלשונית חדשה)</span>
        </a>
      </div>
    </div>
  )
}
