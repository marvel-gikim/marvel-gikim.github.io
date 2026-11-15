/** Text with **bold** parts, as written in articles. Everything else is shown as is. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-black text-foreground">{part}</strong> : part))}
    </>
  )
}

/** The same text without the ** marks (for comparisons and plain-text places) */
export const plainText = (text: string) => text.replace(/\*\*(.+?)\*\*/g, "$1")
