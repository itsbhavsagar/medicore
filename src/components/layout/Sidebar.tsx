import { ChartSpline, Hospital, LayoutDashboard, LogOut, UsersRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

const navigationItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: ChartSpline },
  { to: '/patients', label: 'Patients', icon: UsersRound },
]

interface SidebarProps {
  onLogout?: () => void
}

export function Sidebar({ onLogout }: SidebarProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col border-r border-border bg-sidebar px-5 py-7 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Hospital className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-medium tracking-[-0.02em] text-foreground">
            MediCore
          </p>
          <p className="text-sm text-subtle">Clinical intelligence suite</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {navigationItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-r-xl border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition duration-200',
                isActive
                  ? 'border-primary bg-primary/15 text-foreground'
                  : 'text-muted hover:bg-primary-soft hover:text-foreground',
              )
            }
            to={to}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <p className="text-sm text-subtle">
          3 critical patients need review this morning.
        </p>
        <Button
          className="w-full cursor-pointer justify-center rounded-xl"
          onClick={onLogout}
          size="sm"
          variant="secondary"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
