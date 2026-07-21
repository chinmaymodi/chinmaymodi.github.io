import { projects } from '../data/projects'
import { ProjectCard } from '../components/ProjectCard'

export function Projects() {
  const publicProjects = projects.filter(p => p.public)
  const privateProjects = projects.filter(p => !p.public)

  return (
    <div className="container">
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title">projects</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '24px' }}>
          <span style={{ color: 'var(--accent-amber)' }}>&#9670;</span> = non-public project
        </p>

        {privateProjects.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
              <span style={{ color: 'var(--accent-green)' }}>chinmay@portfolio</span>:~$ ls -la projects/current/
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {privateProjects.map(p => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
            <span style={{ color: 'var(--accent-green)' }}>chinmay@portfolio</span>:~$ ls -la projects/archive/
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {publicProjects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
