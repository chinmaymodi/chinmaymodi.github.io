import { useState } from 'react'
import { motion } from 'framer-motion'
import { useSlideReveal } from '../hooks/useScrollReveal'
import type { Project } from '../data/projects'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  const { title, description, tags, imageUrl, liveUrl, sourceUrl, reverse } = project
  const [imgError, setImgError] = useState(false)

  return (
    <div className="row">
      <motion.div
        className={
          'col-lg-4 col-sm-12' +
          (reverse ? ' order-lg-2' : '') +
          (!reverse ? '' : '')
        }
        style={reverse ? { marginLeft: 'auto' } : undefined}
        {...useSlideReveal(reverse ? 'right' : 'left')}
      >
        <div className="project-wrapper__text">
          <h3 className="project-wrapper__text-title">{title}</h3>
          {tags.length > 0 && (
            <p style={{ marginBottom: '1.2rem', color: '#666', fontSize: '1.3rem' }}>
              {tags.join(' · ')}
            </p>
          )}
          <p>{description}</p>
          <div className="project-wrapper__text-btns" style={{ marginTop: '2rem' }}>
            {liveUrl !== '#!' && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn cta-btn--hero"
                style={{ marginRight: '1rem' }}
              >
                Live
              </a>
            )}
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn cta-btn--hero"
            >
              Source
            </a>
          </div>
        </div>
      </motion.div>
      {imageUrl && !imgError && (
        <motion.div
          className={
            'col-lg-8 col-sm-12' +
            (reverse ? ' order-lg-1' : '')
          }
          {...useSlideReveal(reverse ? 'left' : 'right', 0.1)}
        >
          <div className="project-wrapper__image">
            <motion.a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <img
                className="thumbnail"
                src={imageUrl}
                alt={title}
                width="649"
                height="auto"
                onError={() => setImgError(true)}
              />
            </motion.a>
          </div>
        </motion.div>
      )}
    </div>
  )
}
