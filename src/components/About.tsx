import { motion } from 'framer-motion'
import { useScrollReveal, useSlideReveal } from '../hooks/useScrollReveal'

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <motion.h2 className="section-title" {...useScrollReveal()}>
          About <span className="text-color-main">Me</span>
        </motion.h2>
        <div className="about-wrapper">
          <motion.div
            className="about-wrapper__image col-lg-4 col-md-6 col-sm-12"
            {...useSlideReveal('left')}
          >
            <div className="about-wrapper__image-container" />
          </motion.div>
          <motion.div
            className="about-wrapper__info col-lg-8 col-md-6 col-sm-12"
            {...useSlideReveal('right', 0.1)}
          >
            <div className="about-wrapper__info-text">
              <p className="about-wrapper__info-text--important">
                Placeholder text — you will replace this with your own bio.
              </p>
              <p>
                Describe your background, what you do, what technologies you work with,
                and what you are passionate about. Keep it concise and professional.
              </p>
            </div>
            <div className="about-wrapper__info-text" style={{ marginTop: '2rem' }}>
              <span>
                <a
                  href="#!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-btn cta-btn--resume"
                >
                  Resume
                </a>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
