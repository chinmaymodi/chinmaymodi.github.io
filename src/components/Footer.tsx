import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div className="social-links" {...useScrollReveal()}>
          <a href="https://linkedin.com/in/chinmaymodi" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-linkedin" />
          </a>
          <a href="https://github.com/chinmaymodi" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-github" />
          </a>
          <a href="https://insomniargh.itch.io/" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-gamepad" />
          </a>
          <a href="https://twitter.com/insomniargh_" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-twitter" />
          </a>
        </motion.div>
        <hr />
        <motion.p className="footer__text" {...useScrollReveal(0.1)}>
          Built by{' '}
          <a href="https://github.com/chinmaymodi/chinmaymodi.github.io" target="_blank" rel="noopener noreferrer">
            Chinmay Modi
          </a>{' '}
          &middot; 2026 &middot; Template by{' '}
          <a href="https://github.com/cobiwave/simplefolio" target="_blank" rel="noopener noreferrer">
            Simplefolio
          </a>
        </motion.p>
        <motion.div className="back-to-top" {...useScrollReveal(0.2)}>
          <a href="#hero">
            <i className="fa fa-arrow-up" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </footer>
  )
}
