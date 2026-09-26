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
                Product Engineer specializing in high-performance systems and data-driven applications.
              </p>
              <p>
                Programmer at heart, builder by trade.
              </p>
              <p>
                I bridge the gap between complex backend infrastructure and intuitive user experiences, building end-to-end solutions that solve real business problems.
              </p>
              <p>
                I enjoy solving complex algorithmic puzzles and architecting systems that are as maintainable as they are performant.
              </p>
            </div>
            <div className="about-wrapper__info-text" style={{ marginTop: '2rem' }}>
              <span>
                <a
                  href="./assets/Chinmay_Modi_Resume_2026_September.pdf"
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
