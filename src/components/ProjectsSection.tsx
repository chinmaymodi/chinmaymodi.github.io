import { projects } from '../data/projects'
import ProjectNote from './ProjectNote'

export default function ProjectsSection() {
  return (
    <section id="projects" className="content-section">
      <h2 className="section-heading">Projects</h2>
      <div className="projects-grid">
        {projects.map((project, i) => {
          // The card body is the link. The attribution note sits outside the
          // anchor so its own links stay valid instead of nesting anchors.
          const href = project.liveUrl || project.sourceUrl

          const cardContent = (
            <>
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <div className="project-links">
                  {project.liveUrl && (
                    <span className="project-link-btn">
                      {project.liveBtnText || 'Live'} <i className="fas fa-external-link-alt" />
                    </span>
                  )}
                  {project.sourceUrl && (
                    <span className="project-link-btn">
                      Source <i className="fab fa-github" />
                    </span>
                  )}
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <ul className="project-tags">
                {project.tags.map((tag, t) => (
                  <li key={t} className="project-tag">{tag}</li>
                ))}
              </ul>
            </>
          )

          return (
            <div className="project-card" key={i}>
              {href ? (
                <a
                  className="project-card-body"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cardContent}
                </a>
              ) : (
                <div className="project-card-body">{cardContent}</div>
              )}
              {project.note && <ProjectNote segments={project.note} />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
