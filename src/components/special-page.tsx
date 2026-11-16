import { HashPage } from "@/components/hash-page"
import { WhatsAppAlert } from "@/components/whatsapp-alert"
import { SPECIAL_VIDEOS, WHATSAPP_URL } from "@/data/content"
import { formatHebrewDate } from "@/lib/utils"

/** The "ספיישל" page, at #/special: special videos, newest first. */
export function SpecialPage() {
  const latest = SPECIAL_VIDEOS[0]
  return (
    <HashPage route="#/special" title="ספיישל" updatedHe={latest ? formatHebrewDate(latest.publishedAt) : ""}>
      {SPECIAL_VIDEOS.map((v) => (
        <section key={v.id} aria-labelledby={`special-${v.id}-title`} className="space-y-4">
          <h2 id={`special-${v.id}-title`}>{v.titleHe}</h2>
          <video
            controls
            playsInline
            preload="metadata"
            poster={v.poster}
            aria-labelledby={`special-${v.id}-title`}
            className="aspect-video w-full rounded-[var(--radius-lg)] border border-border bg-black"
          >
            <source src={v.src} type="video/mp4" />
            הדפדפן לא מצליח להציג את הסרטון. <a href={v.src}>לצפייה בסרטון</a>
          </video>
          {v.descriptionHe && <p>{v.descriptionHe}</p>}
        </section>
      ))}
      <WhatsAppAlert href={WHATSAPP_URL} className="!mt-12" />
    </HashPage>
  )
}
