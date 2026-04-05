import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  MessageCircle,
  PiggyBank,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type React from "react";
import { useAuth } from "../../contexts/AuthContext";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    to: "/dashboard",
  },
  {
    label: "Transactions",
    icon: <ArrowLeftRight className="w-5 h-5" />,
    to: "/transactions",
  },
  { label: "Savings", icon: <PiggyBank className="w-5 h-5" />, to: "/savings" },
  {
    label: "Support",
    icon: <MessageCircle className="w-5 h-5" />,
    to: "/support",
  },
  {
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    to: "/settings",
  },
  {
    label: "Admin Panel",
    icon: <ShieldCheck className="w-5 h-5" />,
    to: "/admin",
    adminOnly: true,
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const { isAdmin, session } = useAuth();
  const location = useLocation();

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-full transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-5 border-b border-sidebar-border",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-brand" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-foreground leading-tight truncate">
              Chase Microfinance
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">Bank</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={`nav.${item.label.toLowerCase().replace(" ", "_")}.link`}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-sidebar-accent text-brand shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <span className={cn(isActive ? "text-brand" : "")}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-4 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-brand">
                {session?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">
                {session?.username}
              </p>
              <p className="text-xs text-sidebar-foreground/50 capitalize">
                {session?.role}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onToggleCollapse}
        className="flex items-center justify-center py-3 border-t border-sidebar-border text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </aside>
  );
}
