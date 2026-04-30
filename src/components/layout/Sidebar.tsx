import {
  ChartSpline,
  Hospital,
  LayoutDashboard,
  LogOut,
  UsersRound,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSidebarStore } from "../../store/sidebarStore";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";

const navigationItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analytics", label: "Analytics", icon: ChartSpline },
  { to: "/patients", label: "Patients", icon: UsersRound },
];

interface SidebarProps {
  onLogout?: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const { isOpen, close } = useSidebarStore();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-68 flex-col border-r border-border bg-sidebar px-5 py-7 backdrop-blur-xl transition-transform duration-200 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0 flex" : "-translate-x-full flex",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary shrink-0">
              <Hospital className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-medium tracking-[-0.02em] text-foreground">
                MediCore
              </p>
              <p className="text-sm text-subtle">Clinical intelligence suite</p>
            </div>
          </div>
          <Button
            className="lg:hidden shrink-0"
            onClick={close}
            size="sm"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 space-y-1">
          {navigationItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-r-xl border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition duration-200",
                  isActive
                    ? "border-primary bg-primary/15 text-foreground"
                    : "text-muted hover:bg-primary-soft hover:text-foreground",
                )
              }
              onClick={close}
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
            className="w-full flex items-center justify-center gap-2.5 rounded-xl cursor-pointer"
            onClick={onLogout}
            size="sm"
            variant="secondary"
          >
            <span className="inline-flex! h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary mr-4">
              <LogOut className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center">Sign out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
