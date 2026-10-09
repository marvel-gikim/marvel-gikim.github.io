import { ExternalLink } from "lucide-react"
import type { SourceLink as Src } from "@/types/content"
import { cn } from "@/lib/utils"

export function SourceLink({ source, className, prefix = "מקור:" }: { source: Src; className?: string; prefix?: string }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("group inline-flex items-center gap-1.5 text-sm text-muted transition", className)}
    >
      {prefix && <span>{prefix}</span>}
      <bdi className="font-medium text-brand-pale underline decoration-brand/50 decoration-1 underline-offset-4 transition group-hover:text-brand group-hover:decoration-brand">
        {source.label}
      </bdi>
      <ExternalLink aria-hidden className="size-3.5" />
      <span className="sr-only">(נפתח בלשונית חדשה)</span>
    </a>
  )
}
