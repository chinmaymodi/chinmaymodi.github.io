import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <motion.h2 className="section-title" {...useScrollReveal()}>
          My <span className="text-color-main">Projects</span>
        </motion.h2>
        <div className="project-wrapper">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
