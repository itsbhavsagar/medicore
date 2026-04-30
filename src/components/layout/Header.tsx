import { Bell, Menu } from 'lucide-react'
import { useThemeStore } from '../../store/themeStore'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'
import { Toggle } from '../ui/Toggle'

interface HeaderProps {
  title: string
  subtitle: string
  userName: string
}

export function Header({ subtitle, title, userName }: HeaderProps) {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggle)

  return (
    <header className="flex flex-col gap-5 border-b border-border px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-start gap-4">
        <Button className="lg:hidden" size="sm" variant="ghost">
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">
            Operations
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Toggle
          aria-label="Toggle theme"
          checked={theme === 'dark'}
          onClick={toggleTheme}
        />
        <Button size="sm" variant="secondary">
          <Bell className="h-4 w-4" />
          Alerts
        </Button>
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-3 py-2">
          <Avatar className="h-10 w-10 rounded-xl text-xs" name={userName} />
          <div>
            <p className="text-sm font-semibold text-foreground">{userName}</p>
            <p className="text-xs text-subtle">Care coordinator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
