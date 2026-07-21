export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '16px 0', marginTop: '48px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-dim)' }}>
        <span>chinmay@portfolio:~$ <span className="terminal-cursor" /></span>
        <span>copying is an act of love. please copy.</span>
      </div>
    </footer>
  )
}
