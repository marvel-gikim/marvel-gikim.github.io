import { useCallback, useEffect, useState } from "react"

const PREFIX = "#/actor/"

function readActor() {
  return window.location.hash.startsWith(PREFIX) ? decodeURIComponent(window.location.hash.slice(PREFIX.length)) : null
}

/**
 * Tiny hash router for actor pages (#/actor/<id>). Works on static hosting (GitHub Pages).
 * Opening pushes a history entry, so the browser Back button returns to the same scroll position.
 */
export function useActorRoute() {
  const [actorId, setActorId] = useState<string | null>(readActor)

  useEffect(() => {
    const sync = () => setActorId(readActor())
    window.addEventListener("popstate", sync)
    window.addEventListener("hashchange", sync)
    return () => {
      window.removeEventListener("popstate", sync)
      window.removeEventListener("hashchange", sync)
    }
  }, [])

  const openActor = useCallback((id: string) => {
    if (readActor() === id) return
    const replace = readActor() !== null // moving between actors shouldn't stack history entries
    const state = { fromSite: true, scrollY: window.scrollY }
    if (replace) window.history.replaceState(state, "", PREFIX + encodeURIComponent(id))
    else window.history.pushState(state, "", PREFIX + encodeURIComponent(id))
    setActorId(id)
  }, [])

  const closeActor = useCallback(() => {
    if (window.history.state?.fromSite) {
      window.history.back()
    } else {
      // Landed directly on an actor page: go to the cast section instead
      window.history.replaceState(null, "", "#characters")
      setActorId(null)
      document.getElementById("characters")?.scrollIntoView()
    }
  }, [])

  return { actorId, openActor, closeActor }
}
