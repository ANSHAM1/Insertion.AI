import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, MapPin, IndianRupee, Bookmark } from 'lucide-react';
import { jobs, jobStats } from '../data/mockData';
import { SectionCard } from '../components/UI';

const TABS = ['All Jobs', 'Applied', 'Saved', 'Recommended'];

export default function Jobs() {
  const [tab, setTab] = useState('All Jobs');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Jobs</h1>
        <p className="text-gray-500 text-sm mt-1">Find your next opportunity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-[#141416] border border-[#232326] rounded-xl px-3 py-2.5 flex-1 min-w-[220px]">
              <Search size={15} className="text-gray-500" />
              <input
                placeholder="Search jobs, roles or companies..."
                className="bg-transparent outline-none text-sm text-gray-300 placeholder:text-gray-600 flex-1"
              />
            </div>
            <button className="flex items-center gap-1.5 bg-[#141416] border border-[#232326] text-gray-300 text-sm px-3 py-2.5 rounded-xl">
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button className="flex items-center gap-1.5 bg-[#141416] border border-[#232326] text-gray-300 text-sm px-3 py-2.5 rounded-xl">
              <ArrowUpDown size={14} /> Sort
            </button>
          </div>

          <div className="flex items-center gap-5 border-b border-[#1c1c1f] text-sm">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 border-b-2 transition-colors ${
                  tab === t ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {jobs.map((j) => (
              <div
                key={j.id}
                className="card card-hover p-4 flex items-center gap-4 flex-wrap"
              >
                <div className={`w-11 h-11 rounded-xl ${j.logoColor} flex items-center justify-center text-white font-bold shrink-0`}>
                  {j.logoText}
                </div>
                <div className="flex-1 min-w-[180px]">
                  <p className="text-sm font-semibold text-white">{j.title}</p>
                  <p className="text-xs text-gray-500">
                    {j.company} • <MapPin size={11} className="inline -mt-0.5" /> {j.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <IndianRupee size={13} className="text-gray-500" />
                  {j.salary.replace('₹', '')}
                </div>
                <span className="text-xs text-gray-600 w-16 text-right">{j.posted}</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500">
                  <Bookmark size={15} />
                </button>
                <button className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                  Apply
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 text-center">
              <p className="text-xl font-bold text-white">{jobStats.applied}</p>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
              <p className="text-xs text-gray-400 mt-0.5">Applied</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xl font-bold text-white">{jobStats.interviews}</p>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
              <p className="text-xs text-gray-400 mt-0.5">Interviews</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xl font-bold text-orange-500">{jobStats.offers}</p>
              <p className="text-xs text-gray-500 mt-1">This Month</p>
              <p className="text-xs text-gray-400 mt-0.5">Offers</p>
            </div>
          </div>

          <SectionCard title="Application Status">
            <div className="space-y-3">
              {[
                { label: 'Applied', value: 18, color: 'bg-blue-500' },
                { label: 'Interviewing', value: 5, color: 'bg-orange-500' },
                { label: 'Offers', value: 2, color: 'bg-emerald-500' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{s.label}</span>
                    <span>{s.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#232326] rounded-full overflow-hidden">
                    <div className={`h-full ${s.color}`} style={{ width: `${(s.value / 18) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
