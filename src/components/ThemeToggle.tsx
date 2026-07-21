import { Moon, Sun } from 'lucide-react'

interface Props {
  theme: 'light' | 'dark'
  toggle: () => void
}

export function ThemeToggle({ theme, toggle }: Props) {
  return (
    <button
      onClick={toggle}
      className="btn"
      style={{ padding: '4px 10px', fontSize: '13px', lineHeight: 1 }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
      {theme === 'dark' ? ' light' : ' dark'}
    </button>
  )
}
