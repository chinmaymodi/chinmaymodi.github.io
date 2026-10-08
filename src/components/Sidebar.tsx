import { useState } from 'react'

interface Props {
  activeSection: string
}

export default function Sidebar({ activeSection }: Props) {
  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'resume', label: 'Resume' },
    { id: 'projects', label: 'Projects' },
  ]

  const [copied, setCopied] = useState(false)

  // Ported from Contact.tsx. The address never appears in the DOM: it exists
  // only inside this handler, decoded at click time from base64.
  const handleEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const email = atob('Y2hpbm1heW1vZGlAZ21haWwuY29t')
    navigator.clipboard.writeText(email).catch(() => {
      // Fallback for browsers without async clipboard (or denied permission):
      // hidden textarea + execCommand works everywhere.
      const ta = document.createElement('textarea')
      ta.value = email
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    })
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="portfolio-sidebar">
      <div className="sidebar-content">
        <div>
          <h1 className="sidebar-name">
            <a href="#about">Chinmay Modi</a>
          </h1>
          <p className="sidebar-bio">Programmer at heart</p>

          <nav className="sidebar-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                  >
                    <span className="nav-indicator"></span>
                    <span className="nav-text">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar-socials">
          <a href="https://linkedin.com/in/chinmaymodi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin" />
          </a>
          <a href="https://github.com/chinmaymodi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github" />
          </a>
          <a href="https://insomniargh.itch.io/" target="_blank" rel="noopener noreferrer" aria-label="Itch.io">
            <i className="fab fa-itch-io" />
          </a>
          <a href="https://twitter.com/insomniargh_" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-x-twitter" />
          </a>
          <a href="#!" onClick={handleEmail} aria-label="Email" title="Email">
            <i className="fas fa-envelope" />
          </a>
          <div className={`email-toast ${copied ? 'visible' : ''}`} role="status" aria-live="polite">
            {copied ? 'Email copied' : ''}
          </div>
        </div>
      </div>
    </header>
  )
}
