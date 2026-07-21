import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Hero() {
  return (
    <section id="hero">
      <div className="container">
        <motion.h1 className="hero-title" {...useScrollReveal()}>
          Hey there! I'm <br />
          <span className="text-color-main">Chinmay Modi</span>
        </motion.h1>
        <motion.div
          className="hero-cta"
          {...useScrollReveal(0.2)}
        >
          <a className="cta-btn cta-btn--hero" href="#about">View my work</a>
        </motion.div>
      </div>
    </section>
  )
}
