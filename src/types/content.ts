/** How well a piece of content is backed by a source. */
export type VerificationStatus = "official" | "report" | "rumor"

export interface SourceLink {
  /** Short Hebrew label shown in the UI, e.g. "Marvel.com" */
  label: string
  url: string
}

export interface FilmInfo {
  titleHe: string
  titleEn: string
  /** ISO date of the theatrical release */
  releaseDate: string
  releaseRegionHe: string
  directorsEn: string[]
  studioEn: string
  synopsisHe: string
  synopsisSource: SourceLink
  sequel: { titleHe: string; titleEn: string; releaseDate: string; source: SourceLink }
  sources: SourceLink[]
}

export interface Character {
  id: string
  actorEn: string
  actorHe: string
  /** Only set when the role itself is confirmed by a source */
  characterHe?: string
  characterEn?: string
  descriptionHe: string
  group: "doom" | "avengers" | "fantastic-four" | "thunderbolts" | "x-men" | "wakanda-talokan" | "spider-man" | "tva"
  status: VerificationStatus
  source: SourceLink
  image?: GalleryImage
}

export interface Trailer {
  id: string
  titleHe: string
  /** ISO date */
  /** Unknown for some regional spots */
  publishedAt?: string
  descriptionHe: string
  status: VerificationStatus
  source: SourceLink
  /** YouTube ID of the official Marvel Entertainment upload (supplied by the site owner from the official channel) */
  youtubeId?: string
}

export type MediaKind = "poster" | "key-art" | "still" | "trailer-frame" | "trailer-thumbnail" | "comic-cover" | "comic-page"

export interface GalleryImage {
  id: string
  /** Public path or URL. Missing = not obtained yet, a fallback is shown. */
  src?: string
  width: number
  height: number
  altHe: string
  captionHe: string
  kind: MediaKind
  /** official = from an official Marvel/Disney source; unverified = origin not confirmed */
  provenance: "official" | "unverified"
  provenanceNoteHe: string
  source?: SourceLink
  /** Trailer timestamp, e.g. "1:42" */
  timestamp?: string
  /** CSS object-position used to avoid awkward crops */
  focus?: string
  /** Key in media/fetched.json (downloaded by the GitHub Action); fills src/size at runtime */
  remoteKey?: string
}

export interface NewsItem {
  id: string
  titleHe: string
  summaryHe: string
  /** ISO date */
  publishedAt: string
  status: VerificationStatus
  source: SourceLink
}

export interface FaqItem {
  id: string
  questionHe: string
  answerHe: string
  source?: SourceLink
}

/** A freely-licensed portrait from Wikimedia Commons (see scripts/fetch_cast_photos.py) */
export interface CastPhoto {
  file: string
  width: number
  height: number
  author: string
  license: string
  licenseUrl: string
  sourceUrl: string
}

export interface NavLink {
  label: string
  href: `#${string}`
}

export interface ComicChapter {
  id: string
  titleHe: string
  textHe: string
  source: SourceLink
  spoiler?: boolean
  /** id of an image in SECRET_WARS.pages shown with this chapter */
  pageId?: string
}

/** An article written by Marvel Gikim */
export interface MyArticle {
  id: string
  titleHe: string
  /** One or two sentences shown on the card */
  excerptHe: string
  /** ISO date */
  publishedAt: string
  /** Paragraphs of the article; "## " starts a sub-heading, "!! " marks a spoiler (hidden until clicked) */
  bodyHe: string[]
  cover?: { src: string; altHe: string; creditHe?: string; focus?: string }
  /** YouTube video id played muted in the background of the article header */
  backgroundVideoId?: string
  /** Verification label, when the article is about a rumor or report */
  status?: VerificationStatus
  /** Optional link to the matching TikTok / Instagram post or a video */
  postUrl?: string
  /** Button text for postUrl (default: "לסרטון שלנו על הכתבה") */
  postLabelHe?: string
  tagsHe?: string[]
}
