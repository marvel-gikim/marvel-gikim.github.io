import type { MouseEvent } from "react"
import { HashPage } from "@/components/hash-page"

const MAIL = "marvelgikim@gmail.com"

/** Privacy policy and copyright page, at #/legal. */
export function LegalPage() {
  return (
    <HashPage route="#/legal" title="פרטיות וזכויות יוצרים" updatedHe="10 באוקטובר 2026">
      <p>
        מארוול גיקים הוא אתר מעריצים עצמאי וללא מטרות רווח, שאינו קשור ל-<bdi dir="ltr">Marvel</bdi> או ל-<bdi dir="ltr">Disney</bdi>. בעמוד הזה מוסבר
        איזה מידע נאסף כשגולשים באתר, ומי הבעלים של התכנים שמופיעים בו.
      </p>
      <nav aria-label="תוכן העמוד" className="rounded-2xl border border-border bg-surface/60 p-5 text-base">
        <p className="mb-2 font-black">בעמוד הזה</p>
        <ul>
          <li>
            <a href="#legal-privacy" onClick={(e) => jump(e, "legal-privacy")}>מדיניות פרטיות</a>
          </li>
          <li>
            <a href="#legal-copyright" onClick={(e) => jump(e, "legal-copyright")}>זכויות יוצרים</a>
          </li>
          <li>
            <a href="#legal-removal" onClick={(e) => jump(e, "legal-removal")}>בקשה להסרת תוכן</a>
          </li>
          <li>
            <a href="#legal-contact" onClick={(e) => jump(e, "legal-contact")}>יצירת קשר</a>
          </li>
        </ul>
      </nav>

      <h2 id="legal-privacy">מדיניות פרטיות</h2>
      <h3>בקצרה</h3>
      <p>
        אין באתר הרשמה, חשבונות, טפסים או פרסומות, ואנחנו לא מבקשים מכם שם, מייל או טלפון. כל התוכן פתוח לכולם בלי הרשמה.
      </p>

      <h3>מה נשמר אצלכם בדפדפן</h3>
      <ul>
        <li>הגדרות תפריט הנגישות (למשל גודל טקסט וניגודיות), כדי שיישארו בביקור הבא. הן נשמרות רק במכשיר שלכם, ואפשר למחוק אותן בכפתור ״איפוס״.</li>
        <li>האתר לא משתמש בעוגיות משלו, ולא בכלי מעקב או סטטיסטיקה.</li>
      </ul>

      <h3>התראות על כתבות חדשות</h3>
      <ul>
        <li>
          אם בחרתם לקבל התראות, השירות <bdi dir="ltr">OneSignal</bdi> שומר מזהה של הדפדפן שלכם, כדי שיוכל לשלוח אליו התראות. הוא עשוי לשמור גם פרטים טכניים
          כלליים, כמו סוג המכשיר והדפדפן, שפה ומדינה משוערת.
        </li>
        <li>אנחנו לא מקבלים את השם, המייל או מספר הטלפון שלכם, ומשתמשים בהתראות רק כדי לעדכן על כתבות חדשות.</li>
        <li>
          אפשר להפסיק לקבל התראות בכל רגע: בהגדרות האתר בדפדפן (סמל המנעול שליד הכתובת) ← התראות ← חסימה. פרטים נוספים במדיניות הפרטיות של{" "}
          <a href="https://onesignal.com/privacy_policy" target="_blank" rel="noopener noreferrer">
            <bdi dir="ltr">OneSignal</bdi>
          </a>
          .
        </li>
      </ul>

      <h3>שירותים חיצוניים</h3>
      <ul>
        <li>
          <span className="font-bold">אחסון:</span> האתר מאוחסן ב-<bdi dir="ltr">GitHub Pages</bdi>. כמו כל שרת אינטרנט, הוא עשוי לרשום פרטים טכניים כמו כתובת{" "}
          <bdi dir="ltr">IP</bdi> לצורכי אבטחה ותפעול.{" "}
          <a href="https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">
            מדיניות הפרטיות של GitHub
          </a>
          .
        </li>
        <li>
          <span className="font-bold">סרטונים:</span> סרטונים מוטמעים מיוטיוב (במצב פרטיות מוגברת), וחלקם מתנגנים ברקע. כשסרטון נטען, יוטיוב עשויה לאסוף
          מידע לפי{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            מדיניות הפרטיות של Google
          </a>
          . סרטון האינסטגרם נטען רק אחרי שלוחצים עליו.
        </li>
        <li>
          <span className="font-bold">קישורים:</span> קישורים לאתרים אחרים (פלאנט, יוטיוב, אינסטגרם, טיקטוק, וואטסאפ ומקורות החדשות) נפתחים בלשונית חדשה. כל
          אתר כזה פועל לפי מדיניות הפרטיות שלו.
        </li>
        <li>
          <span className="font-bold">קבוצת הוואטסאפ:</span> מי שמצטרף לקבוצה רואה את מספרי הטלפון של שאר החברים בה, לפי הכללים של וואטסאפ.
        </li>
      </ul>

      <h2 id="legal-copyright">זכויות יוצרים</h2>
      <h3>התוכן שלנו</h3>
      <p>
        הכתבות, הניתוחים והטקסטים באתר נכתבו על ידי מארוול גיקים. מוזמנים לשתף קישורים אליהם. אם אתם מצטטים מכתבה, ציינו את מארוול גיקים וצרפו קישור לאתר.
      </p>
      <h3>תכנים של אחרים</h3>
      <ul>
        <li>
          כל הזכויות על הדמויות, השמות, הלוגואים, הפוסטרים, הטריילרים, הקומיקס והחומרים הרשמיים שייכות לבעליהן, ובהן <bdi dir="ltr">Marvel</bdi> ו-
          <bdi dir="ltr">Disney</bdi>. הם מופיעים באתר לצורכי מידע, דיון וביקורת של מעריצים, עם ציון המקור, ובלי שום רווח.
        </li>
        <li>
          תמונות השחקנים לקוחות מוויקישיתוף (<bdi dir="ltr">Wikimedia Commons</bdi>) ברישיונות חופשיים. ליד כל תמונה מופיעים שם הצלם והרישיון, כפי שהרישיון
          דורש.
        </li>
        <li>תמונות שפורסמו באתרים אחרים מופיעות עם קרדיט וקישור למקור, והזכויות עליהן שייכות לבעליהן.</li>
        <li>סרטונים מוטמעים מיוטיוב ומאינסטגרם ולא מועתקים, כך שהם נשארים באחריות ובבעלות של מי שפרסם אותם.</li>
      </ul>

      <h2 id="legal-removal">בקשה להסרת תוכן</h2>
      <p>
        אם יש לכם זכויות בתמונה, בטקסט או בכל חומר אחר שמופיע באתר, ואתם רוצים שנסיר אותו או שנתקן את הקרדיט, כתבו לנו. כדאי לצרף:
      </p>
      <ul>
        <li>קישור לעמוד באתר שבו מופיע החומר.</li>
        <li>תיאור קצר של החומר ושל הזכויות שלכם בו.</li>
        <li>דרך לחזור אליכם.</li>
      </ul>
      <p>נבדוק כל בקשה ונסיר או נתקן את החומר בהקדם.</p>

      <h2 id="legal-contact">יצירת קשר</h2>
      <p>
        בכל שאלה על פרטיות, זכויות יוצרים או נגישות:{" "}
        <a href={`mailto:${MAIL}`}>
          <bdi dir="ltr">{MAIL}</bdi>
        </a>{" "}
        או באינסטגרם{" "}
        <a href="https://www.instagram.com/marv.elgikim/" target="_blank" rel="noopener noreferrer">
          <bdi dir="ltr">@marv.elgikim</bdi>
        </a>
        .
      </p>
      <p>
        <a href="#/accessibility">להצהרת הנגישות</a>
      </p>
    </HashPage>
  )
}

/** In-page jump that doesn't change the #/legal address */
function jump(e: MouseEvent, id: string) {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
}
