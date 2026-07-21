import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <motion.h2 className="section-title" {...useScrollReveal()}>
          <span className="text-color-main">Get In Touch</span>
        </motion.h2>
        <motion.div className="contact-wrapper" {...useScrollReveal(0.2)}>
          <p className="contact-wrapper__text">
            Open to opportunities — reach out if you'd like to work together.
          </p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn--resume"
            href="mailto:chinmaymodi@gmail.com"
          >
            Send Email
          </a>
        </motion.div>
      </div>
    </section>
  )
}
