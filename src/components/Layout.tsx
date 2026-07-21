import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

interface Props {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export function Layout({ theme, toggleTheme }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main style={{ flex: 1, paddingTop: '40px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
