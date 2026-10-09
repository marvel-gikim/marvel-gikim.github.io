import { BadgeCheck, Instagram, Music2, ShieldCheck, Link2 } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"

interface Social {
  label: string
  handle: string
  url: string
  icon: "tiktok" | "instagram"
}

const PRINCIPLES = [
  { Icon: Link2, title: "כל פרט עם מקור", text: "ליד כל מידע באתר יש קישור למקור שלו, כדי שתוכלו לבדוק בעצמכם." },
  {
    Icon: BadgeCheck,
    title: "רשמי, דיווח או שמועה",
    text: "כל פרט מסומן לפי רמת האימות שלו, כדי שיהיה ברור מה אושר על ידי מארוול ומה עדיין רק דיווח או שמועה.",
  },
  {
    Icon: ShieldCheck,
    title: "בלי ציטוטים מזויפים",
    text: "ציטוט שלא מצאנו לו מקור אמין לא עולה לאתר. אם משהו מסתובב ברשת ומתברר כמזויף, נגיד את זה.",
  },
]

/** Who we are: the Marvel Gikim community behind the site. */
export function AboutPageSection({ socials }: { socials: Social[] }) {
  return (
    <section id="about-page" aria-labelledby="about-page-title" className="relative overflow-hidden border-b border-border py-24 sm:py-32">
      <span aria-hidden className="pointer-events-none absolute -end-32 top-10 size-[28rem] rounded-full bg-brand/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:px-8">
        <div>
          <SectionHeading id="about-page-title" eyebrow="על העמוד" title="מארוול גיקים: קהילת המעריצים של מארוול, בעברית" className="mb-8" />
          <div className="reveal space-y-5 text-lg leading-8 text-foreground/85">
            <p>
              מארוול גיקים הוא עמוד מעריצים בעברית לכל מי שאוהב את היקום של מארוול: הסרטים, הסדרות והקומיקס. אנחנו בטיקטוק ובאינסטגרם, ומדברים שם על
              כל מה שקורה ביקום הקולנועי של מארוול.
            </p>
            <p>
              את האתר הזה בנינו לקראת ״הנוקמים: דומסדיי״, כדי לרכז במקום אחד את כל מה שידוע על הסרט: הצוות והדמויות, הטריילרים, התמונות, הקומיקס
              שמאחוריו והעדכונים האחרונים.
            </p>
          </div>
          <div className="reveal mt-8 flex flex-wrap gap-3">
            {socials.map((s) => {
              const Icon = s.icon === "instagram" ? Instagram : Music2
              return (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 rounded-full border border-brand/50 bg-brand/10 px-5 py-2.5 font-bold text-brand-pale transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand/20"
                >
                  <Icon aria-hidden className="size-5" />
                  עקבו אחרינו ב{s.label}
                  <bdi dir="ltr" className="text-sm font-medium text-muted group-hover:text-brand-pale">
                    {s.handle}
                  </bdi>
                  <span className="sr-only">(נפתח בלשונית חדשה)</span>
                </a>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="reveal mx-auto">
            <img
              src="./brand/marvel-gikim-logo.webp"
              alt="הלוגו של מארוול גיקים"
              width={220}
              height={220}
              loading="lazy"
              className="size-44 rounded-full shadow-[0_0_90px_-10px_rgb(70_214_44/0.65)] animate-float sm:size-52"
            />
          </div>
          <ul className="flex flex-col gap-3">
            {PRINCIPLES.map(({ Icon, title, text }) => (
              <li key={title} className="reveal shine flex gap-4 rounded-[var(--radius-lg)] border border-border bg-surface/70 p-5">
                <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-brand" />
                <div>
                  <h3 className="font-black">{title}</h3>
                  <p className="mt-1 leading-7 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="reveal text-sm leading-6 text-muted">זה אתר מעריצים עצמאי. הוא לא קשור ל-Marvel או ל-Disney.</p>
        </div>
      </div>
    </section>
  )
}
