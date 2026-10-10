# מארוול גיקים · אתר הנוקמים: דומסדיי

הוראות עבודה לקלוד (ולכל מי שממשיך לתחזק את האתר). קראו את כל הקובץ לפני שינוי.

## מה זה
אתר מעריצים בעברית (RTL) של קהילת **מארוול גיקים** לקראת "הנוקמים: דומסדיי" (בכורה בארה״ב: 18.12.2026).
- כתובת: https://marvel-gikim.github.io
- מאגר: `marvel-gikim/marvel-gikim.github.io`, ענף `main`. GitHub Pages מגיש את התיקייה `docs/` (Deploy from branch: main /docs).
- רשתות: טיקטוק "Marvel Gikim" (שם המשתמש המדויק עוד לא ידוע; הקישור כרגע הוא חיפוש), אינסטגרם `@marv.elgikim`, קבוצת וואטסאפ (ב-`WHATSAPP_URL`).
- מייל לבקשות הסרה: marvelgikim@gmail.com (מופיע בתחתית האתר).

## איך עובדים עם בעל האתר
- **לכתוב לו רק בעברית**, בשפה פשוטה. הוא לא מתכנת.
- **לא להמציא עובדות, ציטוטים או קישורים.** כל פרט צריך מקור (`SourceLink`) ורמת אימות: `official` (רשמי), `report` (דיווח), `rumor` (שמועה). ציטוט שלא נמצא לו מקור אמין לא עולה (דוגמה: הציטוט ה"הרסני" של דאוני התברר כמזויף והוסר).
- כתבות שהוא שולח: לשמור על המילים שלו. מותר לתקן כתיב/פיסוק ולחלק לפסקאות ולכותרות משנה, ולספר לו מה תוקן.
- כשהוא מחליט שתמונה "רשמית", מכבדים את ההחלטה שלו.
- תמונות שחקנים: רק ברישיון חופשי (ויקישיתוף) עם קרדיט. תמונות רשמיות/מאתרים אחרים: עם קרדיט ומקור. לא להוסיף פרסומות או מכירות (אתר ללא מטרות רווח).
- עיצוב: כהה, ירוק קולנועי (`--color-brand`), גופן Heebo, אנימציות עדינות. לבדוק במובייל (390px) ובמחשב, בלי גלילה אופקית.

## מבנה הקוד
- Vite 6 + React 18 + TypeScript + Tailwind 4 (`@tailwindcss/vite`), רכיבים בסגנון shadcn (Radix), אייקונים `lucide-react`.
- **כל התוכן נמצא ב-`src/data/content.ts`**: מקורות (`S`), תפריט (`NAV_LINKS`), הסרט (`FILM`), גלריה (`GALLERY`), טריילרים (`TRAILERS`), שחקנים (`CHARACTERS`), עדכונים (`NEWS`), שאלות נפוצות (`FAQ`), הקומיקס (`SECRET_WARS`), שמועות וציטוטים, כרטיסים (`TICKETS`, פלאנט), וואטסאפ (`WHATSAPP_URL`), וכתבות (`MY_ARTICLES`).
- טיפוסים: `src/types/content.ts`. סדר החלקים בעמוד: `src/App.tsx`.
- דפים "פנימיים" בניתוב hash: `#/actor/<id>` (עמוד שחקן), `#/article/<id>` (כתבה). `#push-check` פותח חלון בדיקת התראות.
- תמונות סטטיות ב-`public/` (מועתקות ל-`docs/` בבנייה).

## נגישות
- תפריט נגישות צף (כפתור כחול בפינה): `src/components/accessibility-menu.tsx`. מוסיף מחלקות `a11y-*` ל-`<html>` (מוגדרות בסוף `src/index.css`) ושומר ב-localStorage.
- הצהרת נגישות: `src/components/accessibility-statement.tsx`, בכתובת `#/accessibility` (קישור בתחתית האתר). פניות: marvelgikim@gmail.com. לעדכן את תאריך ההצהרה כשמשנים משהו מהותי.
- עמוד "פרטיות וזכויות יוצרים": `src/components/legal-page.tsx`, בכתובת `#/legal` (קישור בתחתית). אם מוסיפים שירות חיצוני חדש (סטטיסטיקה, טפסים, פרסומות וכו׳), חייבים לעדכן את העמוד ואת התאריך בו.
- בכל רכיב חדש: טקסט חלופי לתמונות, תוויות לכפתורים עם אייקון בלבד, ניווט במקלדת.

## בנייה ופרסום
```bash
npm install          # פעם אחת
npm run typecheck
npm run build        # כותב את האתר ל-docs/ (מוחק ובונה מחדש)
git add -A && git commit -m "..." && git push origin main
```
GitHub Pages מתעדכן תוך כדקה. **תמיד לבנות לפני push**, כי האתר החי הוא `docs/` ולא `src/`.
לפני push כדאי `git pull --no-rebase origin main`: פעולות GitHub מבצעות commit משלהן (תמונות).

## הוספת כתבה ("הכתבות שלי")
מוסיפים אובייקט **בראש** המערך `MY_ARTICLES` ב-`src/data/content.ts`:
- `id` (באנגלית, קבוע; הוא חלק מהקישור), `titleHe`, `excerptHe`, `publishedAt` (YYYY-MM-DD), `bodyHe` (מערך פסקאות).
- בתוך `bodyHe`: שורה שמתחילה ב-`"## "` היא כותרת משנה; שורה שמתחילה ב-`"!! "` היא ספוילר מוסתר.
- אופציונלי: `backgroundVideoId` (מזהה סרטון יוטיוב שמתנגן מושתק ברקע הכותרת, עם כפתור עצירה), `status` (`rumor`/`report`/`official`), `tagsHe`, `cover` ({ src, altHe, creditHe, focus }), `postUrl` + `postLabelHe`.
- תמונת כתבה: לשים ב-`public/media/articles/` (webp), או תמונה ממוזערת של יוטיוב דרך `scripts/media.json` (ראו למטה).
- **אחרי push, התראת דפדפן נשלחת אוטומטית** לכל המנויים (ראו "התראות").

## התראות (OneSignal)
- App ID: `f91c0142-927b-478b-9da6-f8e595bb42b3`. האתחול ב-`index.html`, ה-Service Worker ב-`public/OneSignalSDKWorker.js`, manifest ב-`public/manifest.webmanifest` (נדרש לאייפון).
- כפתורים: `src/components/notify-button.tsx` (בפתיחה, בכותרת, בחלק הכתבות ובסוף כתבה). מטפל באייפון בלי מסך בית, בדפדפן פנימי של אפליקציות, בחסימה ובחוסם פרסומות.
- הבנייה כותבת `docs/articles.json`. ה-workflow `notify-new-articles.yml` משווה לגרסה הקודמת ושולח push לכל כתבה חדשה (`scripts/notify_new_articles.py`).
- הסוד `ONESIGNAL_REST_API_KEY` שמור ב-GitHub Secrets של המאגר. **לעולם לא לבקש אותו בצ'אט ולא לכתוב אותו בקוד.**
- התראות יוצאות רק על כתבות חדשות, לא על שינויים אחרים באתר.

## איסוף תמונות (אין גישה ישירה לאינטרנט מסביבת קלוד)
פעולת GitHub `fetch-cast-photos.yml` רצה כשמשנים את הקבצים ב-`scripts/` ומבצעת commit לתמונות:
- `scripts/cast.json`: תמונות שחקנים מוויקיפדיה (רישיון חופשי בלבד) → `docs/cast/` + `credits.json`.
- `scripts/alt_photos.json`: תמונה שנייה ושונה לציטוטים ולכתבות (`<id>-alt`). אפשר `{"person": "...", "candidates": true}` כדי לקבל אפשרויות לבחירה בתיקייה `candidates/`, ואז `{"person": "...", "file": "File:..."}` כדי לקבע.
- `scripts/media.json`: תמונות ממוזערות + כותרות של סרטוני יוטיוב, ו-og:image של עמודים רשמיים → `docs/media/fetched/`.
- `scripts/comic.json` + `fetch_comic.py`: עטיפות ועמודים של Secret Wars (2015) מ-marvel.com.
האתר טוען את `credits.json` ו-`fetched.json` בזמן ריצה (עם `cache: "no-cache"`).

## דברים פתוחים
- שם המשתמש המדויק בטיקטוק (כדי שהקישור יוביל לפרופיל ולא לחיפוש).
- האיור החתום בכתבה "הטריילר השני": למצוא את האמן ולתת קרדיט, או להחליף בתמונה רשמית.
- הכתבה על ויז׳ן קווסט אומרת "בעוד 4 וחצי ימים" (נכון עד 14.10.2026); לעדכן אחרי הבכורה.
- ענף זמני `frame-hunt` במאגר (לא בשימוש, אפשר למחוק).
