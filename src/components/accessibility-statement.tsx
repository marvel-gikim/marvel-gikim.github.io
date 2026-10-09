import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const ROUTE = "#/accessibility"

/** Accessibility statement, shown as a full page at #/accessibility. */
export function AccessibilityStatement() {
  const [open, setOpen] = useState(() => window.location.hash === ROUTE)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === ROUTE)
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("popstate", sync)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    headingRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  const close = () => {
    window.history.replaceState(null, "", " ")
    setOpen(false)
  }

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="a11y-title" className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4 sm:px-6">
          <Button variant="outline" size="sm" onClick={close}>
            <ArrowRight aria-hidden />
            חזרה לאתר
          </Button>
        </div>
      </div>
      <article className="mx-auto max-w-3xl space-y-6 px-4 py-10 text-lg leading-9 sm:px-6">
        <h1 id="a11y-title" ref={headingRef} tabIndex={-1} className="text-4xl font-black outline-none">
          הצהרת נגישות
        </h1>
        <p>
          מארוול גיקים הוא אתר מעריצים ללא מטרות רווח. חשוב לנו שכל אחד, כולל אנשים עם מוגבלות, יוכל לקרוא את התוכן, לצפות בו ולהשתמש באתר בנוחות.
        </p>

        <h2 className="pt-2 text-2xl font-black text-brand-pale">מה עשינו באתר</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>שאפנו להתאים את האתר להנחיות הנגישות <bdi dir="ltr">WCAG 2.0</bdi> ברמה <bdi dir="ltr">AA</bdi> ולתקן הישראלי 5568.</li>
          <li>אפשר לנווט בכל האתר במקלדת. יש קישור ״דילוג לתוכן״ בתחילת העמוד, וסימון ברור של הרכיב שנמצא בפוקוס.</li>
          <li>האתר בנוי עם כותרות, אזורים ותוויות שקוראי מסך מבינים, ולתמונות יש טקסט חלופי.</li>
          <li>האתר מותאם לעברית ולכתיבה מימין לשמאל, ועובד בטלפון, בטאבלט ובמחשב.</li>
          <li>סרטונים לא מתנגנים לבד, ואם הגדרתם במכשיר ״הפחתת תנועה״, האנימציות כבויות.</li>
        </ul>

        <h2 className="pt-2 text-2xl font-black text-brand-pale">תפריט הנגישות</h2>
        <p>בפינה של המסך יש כפתור נגישות כחול. דרכו אפשר:</p>
        <ul className="list-disc space-y-2 ps-6">
          <li>להגדיל את הטקסט בשלוש מדרגות.</li>
          <li>להפעיל ניגודיות גבוהה.</li>
          <li>לעצור את כל האנימציות.</li>
          <li>להדגיש את כל הקישורים.</li>
          <li>לעבור לגופן פשוט וקריא יותר.</li>
        </ul>
        <p>ההגדרות נשמרות בדפדפן שלכם לביקור הבא.</p>

        <h2 className="pt-2 text-2xl font-black text-brand-pale">מגבלות ידועות</h2>
        <ul className="list-disc space-y-2 ps-6">
          <li>סרטונים מיוטיוב ומאינסטגרם מוטמעים מהאתרים שלהם, והנגישות שלהם (כמו כתוביות) תלויה בהם.</li>
          <li>עמודי הקומיקס ועטיפות הקומיקס הם תמונות. יש להם תיאור קצר, אבל לא תמלול מלא של הטקסט שבתוכם.</li>
          <li>חלק מהתמונות מגיעות ממקורות חיצוניים, ולכן ייתכן שהתיאור שלהן חלקי.</li>
        </ul>
        <p>אנחנו ממשיכים לשפר את הנגישות. אם נתקלתם בבעיה, נשמח לדעת ולתקן.</p>

        <h2 className="pt-2 text-2xl font-black text-brand-pale">פנייה בנושא נגישות</h2>
        <p>
          נתקלתם בבעיית נגישות או רוצים לקבל תוכן בפורמט אחר? כתבו לנו:{" "}
          <a
            href="mailto:marvelgikim@gmail.com?subject=%D7%A0%D7%92%D7%99%D7%A9%D7%95%D7%AA"
            className="font-bold text-brand-pale underline underline-offset-4"
          >
            <bdi dir="ltr">marvelgikim@gmail.com</bdi>
          </a>
          . כדאי לציין באיזה עמוד הייתה הבעיה, ומאיזה מכשיר ודפדפן גלשתם.
        </p>
        <p className="text-base text-muted">ההצהרה עודכנה לאחרונה ב-9 באוקטובר 2026.</p>
      </article>
    </div>
  )
}
