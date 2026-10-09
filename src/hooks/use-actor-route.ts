import { useCallback, useEffect, useState } from "react"

function readId(prefix: string) {
  return window.location.hash.startsWith(prefix) ? decodeURIComponent(window.location.hash.slice(prefix.length)) : null
}

/**
 * Tiny hash router for overlay pages (#/actor/<id>, #/article/<id>). Works on static hosting (GitHub Pages).
 * Opening pushes a history entry, so the browser Back button returns to the same scroll position.
 */
export function useHashRoute(prefix: string, fallbackHash: `#${string}`) {
  const readActor = useCallback(() => readId(prefix), [prefix])
  const [actorId, setActorId] = useState<string | null>(readActor)

  useEffect(() => {
    const sync = () => setActorId(readActor())
    window.addEventListener("popstate", sync)
    window.addEventListener("hashchange", sync)
    return () => {
      window.removeEventListener("popstate", sync)
      window.removeEventListener("hashchange", sync)
    }
  }, [readActor])

  const openActor = useCallback((id: string) => {
    if (readActor() === id) return
    const replace = readActor() !== null // moving between actors shouldn't stack history entries
    const state = { fromSite: true, scrollY: window.scrollY }
    if (replace) window.history.replaceState(state, "", prefix + encodeURIComponent(id))
    else window.history.pushState(state, "", prefix + encodeURIComponent(id))
    setActorId(id)
  }, [prefix, readActor])

  const closeActor = useCallback(() => {
    if (window.history.state?.fromSite) {
      window.history.back()
    } else {
      // Landed directly on a page: go to its section instead
      window.history.replaceState(null, "", fallbackHash)
      setActorId(null)
      document.querySelector(fallbackHash)?.scrollIntoView()
    }
  }, [fallbackHash])

  return { actorId, openActor, closeActor }
}

/** Actor pages: #/actor/<id>, closing falls back to the cast section. */
export const useActorRoute = () => useHashRoute("#/actor/", "#characters")
