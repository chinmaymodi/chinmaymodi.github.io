import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { timeline } from '../data/experience'

export default function Timeline() {
  return (
    <section id="timeline">
      <div className="container">
        <motion.h2 className="section-title" {...useScrollReveal()}>
          Professional <span className="text-color-main">Timeline</span>
        </motion.h2>
        <div className="timeline-track">
          <div className="timeline-line" />
          {timeline.map((item, i) => (
            <motion.div
              className={`timeline-block timeline-block--${item.type}`}
              key={i}
              {...useScrollReveal(i * 0.1)}
            >
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-content__title">{item.role}</div>
                <div className="timeline-content__sub">
                  {item.company} &middot; {item.period}
                </div>
                <div className="timeline-content__desc">{item.description}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}