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
                Software Developer with 4+ years of experience building scalable enterprise systems.
              </p>
              <p>
                I specialize in C#, .NET, React, and distributed architectures — modernizing legacy platforms,
                optimizing database performance, and supporting production systems in high-availability environments.
                I've worked across the stack from REST APIs and Redis caching to PostgreSQL indexing and React front-ends.
              </p>
            </div>
            <div className="about-wrapper__info-text" style={{ marginTop: '2rem' }}>
              <span>
                <a
                  href="./Chinmay_Modi_Resume_2026_April.pdf"
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
