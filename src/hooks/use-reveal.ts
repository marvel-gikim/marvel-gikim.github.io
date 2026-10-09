import { useEffect } from "react"

/**
 * Adds .is-visible to every .reveal element when it scrolls into view (once).
 * Also watches the DOM, so elements rendered later (filters, async data) are revealed too.
 */
export function useReveal() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add("is-visible")
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(reveal)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target)
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    )
    const observe = (root: ParentNode) =>
      root.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el))
    observe(document)

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return
          if (n.matches(".reveal:not(.is-visible)")) io.observe(n)
          observe(n)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}
