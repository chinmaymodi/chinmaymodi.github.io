import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { experiences } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <motion.h2 className="section-title" {...useScrollReveal()}>
          Where I've <span className="text-color-main">Worked</span>
        </motion.h2>
        <div className="exp-wrapper">
          {experiences.map((item, i) => (
            <motion.div
              className="exp-wrapper__item"
              key={i}
              {...useScrollReveal(i * 0.1)}
            >
              <div className="exp-wrapper__item-title">{item.role}</div>
              <div className="exp-wrapper__item-sub">
                {item.company} &middot; {item.period}
              </div>
              <div className="exp-wrapper__item-desc">{item.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
