import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Code2,
  Briefcase,
  GraduationCap,
  FileText,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

// `hasNew` drives the small red indicator dot — swap these for real
// "unseen item" flags once each section is backed by real data.
const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, hasNew: false },
  { to: "/planner", label: "Planner", icon: CalendarClock, hasNew: false },
  { to: "/coding", label: "Coding", icon: Code2, hasNew: false },
  { to: "/jobs", label: "Jobs", icon: Briefcase, hasNew: true },
  { to: "/college-drives", label: "College Drives", icon: GraduationCap, hasNew: true },
  { to: "/resume", label: "Resume", icon: FileText, hasNew: false },
];

const STORAGE_KEY = "sidebar-collapsed";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore storage errors (e.g. private mode)
    }
  }, [collapsed]);

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out ${
        collapsed ? "w-[76px]" : "w-60"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-6 py-6 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Sparkles size={18} />
        </div>

        {!collapsed && (
          <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-text-primary">
            InsertionAI
          </span>
        )}
      </div>

      <nav className={`flex flex-1 flex-col gap-1 ${collapsed ? "px-3" : "px-3"}`}>
        {navItems.map(({ to, label, icon: Icon, hasNew }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                collapsed ? "justify-center px-0 py-2.5" : ""
              } ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`
            }
          >
            <span className="relative shrink-0">
              <Icon size={17} strokeWidth={2} />
              {hasNew && (
                <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-danger" />
              )}
            </span>
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((prev) => !prev)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`mx-3 mb-3 flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-text-secondary transition-colors duration-150 hover:bg-surface-hover hover:text-text-primary ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        {!collapsed && <span>Collapse</span>}
      </button>

      {!collapsed && (
        <div className="border-t border-border px-6 py-4 text-xs text-text-muted">
          v0.1.0
        </div>
      )}
    </aside>
  );
}
