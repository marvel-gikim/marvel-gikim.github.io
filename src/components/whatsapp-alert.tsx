import { BellRing, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

/** Invite to the Marvel Gikim WhatsApp group, where every new article is posted. */
export function WhatsAppAlert({ href, className, compact }: { href: string; className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "reveal flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-[#25D366]/40 bg-[linear-gradient(120deg,rgb(37_211_102/0.12),transparent_60%)] p-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#25D366]/15 text-[#25D366]">
          <BellRing aria-hidden className="size-6 animate-[float_3s_ease-in-out_infinite]" />
        </span>
        <div>
          <p className="text-lg font-black">רוצים התראה על כל כתבה חדשה?</p>
          {!compact && <p className="mt-1 leading-7 text-muted">הצטרפו לקבוצת הוואטסאפ של מארוול גיקים. כל כתבה חדשה מגיעה ישר לטלפון.</p>}
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-black text-black transition hover:-translate-y-0.5 hover:brightness-110"
      >
        <MessageCircle aria-hidden className="size-5" />
        הצטרפות בוואטסאפ
        <span className="sr-only">(נפתח בלשונית חדשה)</span>
      </a>
    </div>
  )
}
