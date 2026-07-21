import { MotionProps } from 'framer-motion'

export function useScrollReveal(delay = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, delay },
  }
}

export function useSlideReveal(direction: 'left' | 'right', delay = 0): MotionProps {
  const x = direction === 'left' ? -40 : 40
  return {
    initial: { opacity: 0, x },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, delay },
  }
}
