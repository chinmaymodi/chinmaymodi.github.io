import { Download, ExternalLink } from 'lucide-react'
import { skills } from '../data/experience'

export function Home() {
  return (
    <div className="container">
      <section style={{ marginBottom: '64px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '8px' }}>
            <span style={{ color: 'var(--accent-green)' }}>chinmay@portfolio</span>:~$ cat about.md
          </div>
          <pre style={{
            border: '1px solid var(--border)',
            padding: '20px',
            fontSize: '13px',
            lineHeight: 1.8,
            color: 'var(--text)',
            overflow: 'auto',
          }}>
{`  name:         Chinmay Modi
  role:         Software Developer
  shell:        C# / Python / TypeScript
  location:     Chicago, IL (willing to relocate)
  status:       Open to work
  interests:    full-stack dev, ML, game dev, quant finance`}
          </pre>
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '16px' }}>
          I build things for the web, the terminal, and occasionally for fun.
          Professional experience in C# and Quintiq. Strong affinity for Python
          and the TypeScript ecosystem. Currently exploring ML-driven stock
          market simulation and game development.
        </p>

        <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.8, marginBottom: '24px' }}>
          I learn by building — every project on this site started as something
          I didn't know how to do.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="./assets/files/2026%20Resume%20-%20Chinmay%20Modi.pdf" target="_blank" className="btn btn-primary">
            <Download size={14} />
            resume.pdf
          </a>
          <a href="https://github.com/chinmaymodi" target="_blank" rel="noopener noreferrer" className="btn">
            <ExternalLink size={14} />
            github
          </a>
          <a href="https://linkedin.com/in/chinmaymodi" target="_blank" rel="noopener noreferrer" className="btn">
            <ExternalLink size={14} />
            linkedin
          </a>
        </div>
      </section>

      <section>
        <h2 className="section-title">skills</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {skills.map(s => (
            <div key={s.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span>{s.name}</span>
                <span style={{ color: 'var(--text-dim)' }}>{s.level}%</span>
              </div>
              <div style={{ height: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <div style={{ width: `${s.level}%`, height: '100%', background: 'var(--accent)' }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
