import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Bell, LogOut, Moon, Sun, X } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useBanking } from "../../contexts/BankingContext";
import { useTheme } from "../../contexts/ThemeContext";

export function Header() {
  const { session, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markNotificationsRead } = useBanking();
  const [notifOpen, setNotifOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 flex-shrink-0 relative z-30">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Welcome back, <span className="text-brand">{session?.username}</span>!
        </h2>
        <p className="text-xs text-muted-foreground">{today}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          data-ocid="header.toggle"
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl hover:bg-accent"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Moon className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            data-ocid="header.notifications.button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 rounded-xl hover:bg-accent relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>

          {notifOpen && (
            <div
              data-ocid="header.notifications.popover"
              className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-xl shadow-card overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        markNotificationsRead();
                      }}
                      className="text-xs text-brand hover:text-brand/80 font-medium transition-colors"
                      data-ocid="header.notifications.mark_read_button"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                    data-ocid="header.notifications.close_button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div
                    data-ocid="header.notifications.empty_state"
                    className="px-4 py-8 text-center text-muted-foreground text-sm"
                  >
                    No notifications
                  </div>
                ) : (
                  notifications.slice(0, 10).map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        "px-4 py-3 border-b border-border/50 last:border-0 transition-colors",
                        !notif.read && "bg-brand/5",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0 mt-1.5",
                            notif.type === "transaction"
                              ? "bg-brand"
                              : notif.type === "security"
                                ? "bg-destructive"
                                : "bg-muted-foreground",
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground">
                            {notif.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          data-ocid="header.logout.button"
          onClick={logout}
          className="gap-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-medium">Logout</span>
        </Button>
      </div>
    </header>
  );
}
