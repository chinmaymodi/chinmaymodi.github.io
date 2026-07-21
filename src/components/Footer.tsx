import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div className="social-links" {...useScrollReveal()}>
          <a href="#!" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-linkedin" />
          </a>
          <a href="#!" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-github" />
          </a>
          <a href="#!" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-twitter" />
          </a>
        </motion.div>
        <hr />
        <motion.p className="footer__text" {...useScrollReveal(0.1)}>
          Built by{' '}
          <a href="#!" target="_blank" rel="noopener noreferrer">
            Chinmay Modi
          </a>{' '}
          &middot; 2026
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
