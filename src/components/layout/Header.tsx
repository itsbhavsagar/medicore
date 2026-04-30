import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "../../hooks/useNotifications";
import { useThemeStore } from "../../store/themeStore";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Toggle } from "../ui/Toggle";

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

  return (
    <header className="flex flex-col gap-5 border-b border-border px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-start gap-4">
        <Button className="lg:hidden" size="sm" variant="ghost">
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />
            operations
          </p>
          <h1 className="mt-2 text-[28px] font-medium tracking-[-0.03em] text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center gap-3 ">
        <Toggle
          aria-label="Toggle theme"
          checked={theme === "dark"}
          onClick={toggleTheme}
          className="cursor-pointer"
        />
        <Button
          className="cursor-pointer gap-2.5 "
          onClick={() => {
            setIsAlertOpen((current) => !current);
            if (!isAlertOpen) {
              markAllRead();
            }
          }}
          size="sm"
          variant="secondary"
        >
          <span className=" inline-flex! h-6 w-6 items-center justify-center rounded-full bg-primary-soft text-primary mr-4">
            <Bell className="h-3.5 w-3.5" />
          </span>
          Alerts{" "}
          {notifications.length > 0
            ? `(${unreadCount || notifications.length})`
            : ""}
        </Button>
        {isAlertOpen ? (
          <div className="absolute right-0 top-14 z-30 w-85 rounded-xl border border-border bg-surface p-4 shadow-(--app-shadow)">
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
            <div className="mt-3 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface-elevated p-3"
                    key={notification.id}
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-muted">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      className="cursor-pointer text-xs font-medium text-subtle"
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
