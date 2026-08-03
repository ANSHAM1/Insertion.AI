import React, { useState } from 'react';
import { Building2, CalendarClock, Globe2 } from 'lucide-react';
import { collegeDrives, driveStats } from '../data/mockData';
import { StatusPill } from '../components/UI';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'registered', label: 'Registered' },
  { key: 'past', label: 'Past' },
];

export default function CollegeDrives() {
  const [tab, setTab] = useState('upcoming');
  const drives = collegeDrives[tab] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">College Drives</h1>
          <p className="text-gray-500 text-sm mt-1">Track and register for upcoming placement drives.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="card px-4 py-3 text-center">
            <p className="text-lg font-bold text-white">{driveStats.total}</p>
            <p className="text-[11px] text-gray-500">Total</p>
          </div>
          <div className="card px-4 py-3 text-center">
            <p className="text-lg font-bold text-orange-500">{driveStats.upcoming}</p>
            <p className="text-[11px] text-gray-500">Upcoming</p>
          </div>
          <div className="card px-4 py-3 text-center">
            <p className="text-lg font-bold text-emerald-400">{driveStats.completed}</p>
            <p className="text-[11px] text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 border-b border-[#1c1c1f] text-sm">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 border-b-2 transition-colors ${
              tab === t.key ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {drives.map((d) => (
          <div key={d.id} className="card card-hover p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-600/15 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{d.company}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <CalendarClock size={12} /> {d.date}
              </p>
            </div>
            <StatusPill status={d.status} />
          </div>
        ))}
        {drives.length === 0 && (
          <div className="col-span-2 card p-8 text-center text-gray-500 text-sm flex flex-col items-center gap-2">
            <Globe2 size={22} className="text-gray-600" />
            No drives in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
