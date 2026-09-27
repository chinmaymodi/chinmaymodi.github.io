const links = [
  { id: 'about', label: 'About' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'resume', label: 'Resume' },
  { id: 'projects', label: 'Projects' },
]

interface MobileNavProps {
  activeSection: string
}

export default function MobileNav({ activeSection }: MobileNavProps) {
  return (
    <nav className="mobile-nav" aria-label="Section navigation">
      <a href="#top" className="mobile-nav-top" aria-label="Back to top">
        <i className="fa fa-arrow-up" aria-hidden="true" />
      </a>
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={`#${link.id}`}
              className={activeSection === link.id ? 'mobile-nav-link active' : 'mobile-nav-link'}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
