import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useThemeStore } from "../../store/themeStore";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";
import { useSidebarStore } from "../../store/sidebarStore";

interface HeaderProps {
  title: string;
  subtitle: string;
  userName: string;
}

export function Header({ subtitle, title, userName }: HeaderProps) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { dismiss, markAllRead, notifications } = useNotifications();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggle);
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const openSidebar = useSidebarStore((state) => state.open);

  return (
    <header className="flex flex-col gap-3 sm:gap-5 border-b border-border px-3 py-4 sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-start gap-2 sm:gap-4">
        <Button
          className="lg:hidden shrink-0"
          size="sm"
          variant="ghost"
          onClick={openSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs sm:text-sm font-medium text-muted">
            <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
            <span className="truncate">operations</span>
          </p>
          <h1 className="mt-1 sm:mt-2 text-lg sm:text-2xl md:text-[28px] font-medium tracking-[-0.03em] text-foreground line-clamp-2 sm:line-clamp-none">
            {title}
          </h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted line-clamp-2 sm:line-clamp-none">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-2 sm:gap-3 justify-end">
        <Toggle
          aria-label="Toggle theme"
          checked={theme === "dark"}
          onClick={toggleTheme}
          className="cursor-pointer shrink-0"
        />

        <Button
          className="cursor-pointer relative min-h-9 sm:min-h-10 px-2.5 sm:px-3"
          onClick={() => {
            setIsAlertOpen((current) => !current);
            if (!isAlertOpen) {
              markAllRead();
            }
          }}
          size="sm"
          variant="secondary"
        >
          <span className="relative inline-flex items-center justify-center">
            <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </span>
        </Button>

        {isAlertOpen ? (
          <div className="absolute right-0 top-12 sm:top-14 z-30 w-72 sm:w-85 rounded-xl border border-border bg-surface p-3 sm:p-4 shadow-(--app-shadow)">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">
                Notifications
              </p>
              <Button
                className="cursor-pointer"
                onClick={() => setIsAlertOpen(false)}
                size="sm"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 max-h-64 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    className="flex items-start justify-between gap-2 sm:gap-3 rounded-xl border border-border bg-surface-elevated p-2 sm:p-3"
                    key={notification.id}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-2">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs sm:text-sm text-muted line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      className="cursor-pointer text-xs font-medium text-subtle shrink-0"
                      onClick={() => dismiss(notification.id)}
                      type="button"
                    >
                      Dismiss
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No alerts right now.</p>
              )}
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2">
          <Avatar className="h-10 w-10 text-xs" name={userName} />
          <div>
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-subtle">Care coordinator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
