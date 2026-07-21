import { ExternalLink } from 'lucide-react'
import type { Project } from '../data/projects'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent)' }}>
          {project.public ? null : <span style={{ color: 'var(--accent-amber)', marginRight: '6px' }}>&#9670;</span>}
          {project.title}
        </h3>
        {project.year && (
          <span style={{ fontSize: '12px', color: 'var(--text-dim)', flexShrink: 0 }}>{project.year}</span>
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '12px', lineHeight: 1.7 }}>
        {project.description}
      </p>

      {project.highlights && project.highlights.length > 0 && (
        <ul style={{ fontSize: '13px', color: 'var(--text-dim)', marginBottom: '12px', paddingLeft: '18px', lineHeight: 1.8 }}>
          {project.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {project.tech.map(t => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      {project.links && project.links.length > 0 && (
        <div style={{ display: 'flex', gap: '12px' }}>
          {project.links.map(link => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ fontSize: '12px', padding: '4px 10px' }}
            >
              <ExternalLink size={12} />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
