import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const handleEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const email = atob('Y2hpbm1heW1vZGlAZ21haWwuY29t')
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    window.location.href = 'mailto:' + email
  }

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
            className="cta-btn cta-btn--resume"
            href="#!"
            onClick={handleEmail}
          >
            {copied ? 'Copied Email!' : 'Send Email'}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
