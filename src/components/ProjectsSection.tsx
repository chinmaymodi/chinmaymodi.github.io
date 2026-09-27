import { projects } from '../data/projects'

export default function ProjectsSection() {
  return (
    <section id="projects" className="content-section">
      <h2 className="section-heading">Projects</h2>
      <div className="projects-grid">
        {projects.map((project, i) => {
          // The whole card is the link. Primary destination is the live demo when
          // present, otherwise the source repo. Labels are spans, not nested <a>,
          // so there is no invalid anchor-in-anchor markup.
          const href = project.liveUrl || project.sourceUrl

          const cardContent = (
            <>
              <div className="project-header">
                <h3 className="project-title">{project.title}</h3>
                <div className="project-links">
                  {project.liveUrl && (
                    <span className="project-link-btn">
                      {project.liveBtnText || 'Live'} <i className="fa fa-external-link" />
                    </span>
                  )}
                  {project.sourceUrl && (
                    <span className="project-link-btn">
                      Source <i className="fa fa-github" />
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

          if (!href) {
            return <div className="project-card" key={i}>{cardContent}</div>
          }

          return (
            <a
              className="project-card project-card-link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
            >
              {cardContent}
            </a>
          )
        })}
      </div>
    </section>
  )
}
