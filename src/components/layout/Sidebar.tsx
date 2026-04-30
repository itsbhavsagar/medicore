import {
  ActivitySquare,
  ChartSpline,
  Hospital,
  LayoutDashboard,
  LogOut,
  UsersRound,
} from 'lucide-react'
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
    <aside className="sticky top-0 hidden h-screen w-[280px] shrink-0 flex-col border-r border-border bg-sidebar px-6 py-8 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--app-primary),var(--app-accent))] text-white shadow-[0_20px_40px_rgba(99,102,241,0.24)]">
          <Hospital className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-[-0.03em] text-foreground">
            MediCore
          </p>
          <p className="text-sm text-subtle">Clinical intelligence suite</p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        {navigationItems.map(({ icon: Icon, label, to }) => (
          <NavLink
            key={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition duration-200',
                isActive
                  ? 'bg-primary text-white shadow-[0_18px_36px_rgba(99,102,241,0.24)]'
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

      <div className="mt-auto rounded-[28px] border border-border bg-surface-elevated p-5 shadow-[var(--app-shadow)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <ActivitySquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Operational pulse</p>
            <p className="text-sm text-subtle">3 critical patients need review</p>
          </div>
        </div>

        <Button
          className="mt-5 w-full justify-center"
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
