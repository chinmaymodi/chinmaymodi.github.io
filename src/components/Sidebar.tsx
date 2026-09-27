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

  return (
    <header className="portfolio-sidebar">
      <div className="sidebar-content">
        <div>
          <h1 className="sidebar-name">
            <a href="#about">Chinmay Modi</a>
          </h1>
          <h2 className="sidebar-title">Product Engineer</h2>
          <p className="sidebar-bio">Programmer at heart.</p>

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
            <i className="fa fa-linkedin" />
          </a>
          <a href="https://github.com/chinmaymodi" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fa fa-github" />
          </a>
          <a href="https://insomniargh.itch.io/" target="_blank" rel="noopener noreferrer" aria-label="Itch.io">
            <i className="fa fa-gamepad" />
          </a>
          <a href="https://twitter.com/insomniargh_" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fa fa-twitter" />
          </a>
        </div>
      </div>
    </header>
  )
}
