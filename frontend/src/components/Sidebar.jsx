import { React } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  CalendarDays,
  Briefcase,
  Building2,
  Menu,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

import { useApp } from "../context/AppContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/coding", label: "Coding", icon: Code2 },
  { to: "/planner", label: "Planner", icon: CalendarDays },
  { to: "/jobs", label: "Jobs", icon: Briefcase }
];

export default function Sidebar() {
  const { lastSync, refreshAll, syncing } = useApp();

  return (
    <aside className="w-64 shrink-0 h-full flex flex-col bg-[#0f0f11] border-r border-[#232326]">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="InsertionAI Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="font-semibold text-white text-[15px]">
            Insertion.AI
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-orange-600/15 text-orange-500 font-medium border border-orange-600/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[#232326]">
        <button
          onClick={refreshAll}
          disabled={syncing}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-[#151518] border border-[#2a2a2d] hover:border-orange-500/40 hover:bg-[#1a1a1d] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center">
            <RefreshCw
              size={18}
              className={`text-orange-500 ${syncing ? "animate-spin" : ""}`}
            />
          </div>

          <div className="flex-1 text-left min-w-0">
            <p className="text-sm text-white font-medium">
              {syncing ? "Syncing..." : "Last Sync"}
            </p>

            <p className="text-xs text-gray-400 truncate">
              {syncing
                ? "Refreshing all data..."
                : lastSync
                  ? lastSync.toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "Click to sync everything"}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
