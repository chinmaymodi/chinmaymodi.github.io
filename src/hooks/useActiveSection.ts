import { useEffect, useRef, useState } from 'react'

const ANCHOR_RATIO = 0.4
const BOTTOM_EPSILON = 2

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0])

  // App passes a fresh array literal on every render, so the effect must not
  // depend on the array identity or it would resubscribe on every render.
  const idsKey = sectionIds.join(',')
  const idsRef = useRef(sectionIds)
  idsRef.current = sectionIds

  useEffect(() => {
    let frame = 0

    const compute = () => {
      frame = 0
      const ids = idsRef.current
      if (ids.length === 0) return

      // The topmost section whose top edge has passed the anchor line, as long
      // as a useful slice of it is still on screen. The visibility test is what
      // makes short sections work: after an anchor jump to Resume, the Projects
      // heading is also above the anchor line, but Resume is still the section
      // actually being looked at, so it must win.
      const anchor = window.innerHeight * ANCHOR_RATIO
      const visibleFloor = Math.min(window.innerHeight * 0.15, 100)
      let current: string | null = null

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= anchor && rect.bottom > visibleFloor) {
          current = id
          break
        }
      }

      // Scrolled to the very bottom, or parked in a gap where nothing matched.
      const scrolled = window.scrollY + window.innerHeight
      const atBottom = scrolled >= document.documentElement.scrollHeight - BOTTOM_EPSILON
      if (atBottom) {
        current = ids[ids.length - 1]
      }

      // React bails out when the value is unchanged, so this is cheap to call
      // on every scroll frame.
      setActiveSection(current ?? ids[0])
    }

    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(compute)
    }

    compute()

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [idsKey])

  return activeSection
}
