import { Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const links = [
  { to: '/', label: 'home' },
  { to: '/projects', label: 'projects' },
  { to: '/experience', label: 'experience' },
]

export function Header({ theme, toggleTheme }: Props) {
  const { pathname } = useLocation()

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        padding: '12px 0',
        marginBottom: 0,
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--accent-green)', textDecoration: 'none', fontSize: '13px' }}>
            chinmay@portfolio:~$
          </Link>
          <nav style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  padding: '4px 10px',
                  fontSize: '13px',
                  border: pathname === l.to ? '1px solid var(--accent)' : '1px solid transparent',
                  color: pathname === l.to ? 'var(--accent)' : 'var(--text-dim)',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <ThemeToggle theme={theme} toggle={toggleTheme} />
      </div>
    </header>
  )
}
