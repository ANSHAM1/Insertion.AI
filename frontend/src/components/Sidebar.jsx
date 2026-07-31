import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Mail,
  Briefcase,
  GraduationCap,
  CalendarDays,
  FileText,
  Sparkles,
} from "lucide-react";

// `hasNew` drives the small red indicator dot — swap these for real
// "unseen item" flags once each section is backed by real data.
const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, hasNew: false },
  { to: "/planner", label: "Planner", icon: CalendarClock, hasNew: false },
  { to: "/emails", label: "Emails", icon: Mail, hasNew: true },
  { to: "/jobs", label: "Jobs", icon: Briefcase, hasNew: true },
  { to: "/college-drives", label: "College Drives", icon: GraduationCap, hasNew: true },
  { to: "/calendar", label: "Calendar", icon: CalendarDays, hasNew: false },
  { to: "/resume", label: "Resume", icon: FileText, hasNew: false },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Sparkles size={18} />
        </div>
        <span className="text-sm font-semibold tracking-wide text-text-primary">
          InsertionAI
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon, hasNew }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
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
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border px-6 py-4 text-xs text-text-muted">
        v0.1.0
      </div>
    </aside>
  );
}
