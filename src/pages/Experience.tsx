import { experiences, education } from '../data/experience'

export function Experience() {
  return (
    <div className="container">
      <section style={{ marginBottom: '48px' }}>
        <h2 className="section-title">experience</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {experiences.map((e, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <div>
                  <span style={{ color: 'var(--accent-amber)' }}>$</span>{' '}
                  <span style={{ fontWeight: 600 }}>{e.role}</span>
                  <span style={{ color: 'var(--text-dim)' }}> @ {e.organization}</span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-dim)', flexShrink: 0 }}>{e.period}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.7, paddingLeft: '14px' }}>
                {e.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">education</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {education.map((e, i) => (
            <div key={i} style={{
              border: '1px solid var(--border)',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              <div>
                <span style={{ color: 'var(--accent-purple)' }}>&#8227;</span>{' '}
                <span style={{ fontWeight: 600 }}>{e.degree}</span>
                <span style={{ color: 'var(--text-dim)' }}> — {e.school}</span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', flexShrink: 0 }}>{e.period}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
