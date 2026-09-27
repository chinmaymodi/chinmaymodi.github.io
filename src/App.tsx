import { useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import About from './components/About'
import TimelineSection from './components/TimelineSection'
import ResumeSection from './components/ResumeSection'
import ProjectsSection from './components/ProjectsSection'
import Footer from './components/Footer'
import { useActiveSection } from './hooks/useActiveSection'

const TOUCH_GLOW_MS = 2000

export default function App() {
  const activeSection = useActiveSection(['about', 'timeline', 'resume', 'projects'])
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [glowLit, setGlowLit] = useState(false)
  const glowTimer = useRef<number | null>(null)

  useEffect(() => {
    const clearGlowTimer = () => {
      if (glowTimer.current !== null) {
        window.clearTimeout(glowTimer.current)
        glowTimer.current = null
      }
    }

    // Mouse and pen: the glow stays lit and follows the cursor, as before.
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      setCoords({ x: e.clientX, y: e.clientY })
      setGlowLit(true)
    }

    // Touch: light the glow where the finger landed, then let it fade out.
    const handlePointerDown = (e: PointerEvent) => {
      setCoords({ x: e.clientX, y: e.clientY })
      setGlowLit(true)

      if (e.pointerType === 'touch') {
        clearGlowTimer()
        glowTimer.current = window.setTimeout(() => {
          setGlowLit(false)
          glowTimer.current = null
        }, TOUCH_GLOW_MS)
      }
    }

    // A flick that starts as a tap should not leave the glow stuck on.
    const handleScroll = () => {
      if (glowTimer.current === null) return
      clearGlowTimer()
      setGlowLit(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('scroll', handleScroll)
      clearGlowTimer()
    }
  }, [])

  return (
    <div
      id="top"
      className="app-container"
      style={{
        // Pass pointer coordinates as CSS variables for the spotlight effect
        // @ts-ignore
        '--mouse-x': `${coords.x}px`,
        '--mouse-y': `${coords.y}px`,
      }}
    >
      {/* Brittany Chiang Spotlight Effect */}
      <div className={glowLit ? 'spotlight-overlay is-lit' : 'spotlight-overlay'} />

      {/* Sticky section nav, phones and tablets only */}
      <MobileNav activeSection={activeSection} />

      {/* Samuel Kraft Top/Bottom Fade Overlays */}
      <div className="fade-overlay-top" />
      <div className="fade-overlay-bottom" />

      <div className="layout-wrapper">
        <Sidebar activeSection={activeSection} />
        <main className="main-content">
          <About />
          <TimelineSection />
          <ResumeSection />
          <ProjectsSection />
          <Footer />
        </main>
      </div>
    </div>
  )
}
