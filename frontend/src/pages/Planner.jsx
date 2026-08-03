import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Circle } from 'lucide-react';
import { plannerEvents, todaysPlan } from '../data/mockData';
import { SectionCard } from '../components/UI';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DATES = [27, 28, 29, 30, 31, 1, 2];
const HOURS = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'];

const colorMap = {
  orange: 'bg-orange-600/20 border-orange-600/40 text-orange-400',
  blue: 'bg-blue-600/20 border-blue-600/40 text-blue-400',
  green: 'bg-emerald-600/20 border-emerald-600/40 text-emerald-400',
  purple: 'bg-purple-600/20 border-purple-600/40 text-purple-400',
  red: 'bg-red-600/20 border-red-600/40 text-red-400',
};

export default function Planner() {
  const [tasks, setTasks] = useState(todaysPlan);

  const toggleTask = (id) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Planner</h1>
          <p className="text-gray-500 text-sm mt-1">Plan your week and stay on track.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#141416] border border-[#232326] rounded-xl overflow-hidden text-sm">
            <button className="px-3 py-2 text-gray-400 hover:text-white">Day</button>
            <button className="px-3 py-2 bg-orange-600/15 text-orange-500 font-medium">Week</button>
            <button className="px-3 py-2 text-gray-400 hover:text-white">Month</button>
          </div>
          <button className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
            <Plus size={15} /> Add Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <SectionCard className="lg:col-span-3" title={null}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400">
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-300 font-medium">27 Jul - 02 Aug 2026</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] min-w-[700px]">
              <div />
              {DAYS.map((d, i) => (
                <div key={d} className={`text-center pb-3 ${d === 'Thu' ? 'text-orange-500' : 'text-gray-400'}`}>
                  <p className="text-xs">{d}</p>
                  <p
                    className={`text-sm font-semibold w-7 h-7 mx-auto flex items-center justify-center rounded-full mt-1 ${
                      d === 'Thu' ? 'bg-orange-600 text-white' : ''
                    }`}
                  >
                    {DATES[i]}
                  </p>
                </div>
              ))}

              {HOURS.map((hour) => (
                <React.Fragment key={hour}>
                  <div className="text-[11px] text-gray-600 pr-2 py-4 text-right border-t border-[#1c1c1f]">
                    {hour}
                  </div>
                  {DAYS.map((d) => (
                    <div key={d + hour} className="relative border-t border-l border-[#1c1c1f] h-16 last:border-r" />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Simplified event chips grouped by day, shown below grid for reliability */}
          <div className="grid grid-cols-7 gap-2 mt-3">
            {DAYS.map((d) => (
              <div key={d} className="space-y-1.5">
                {(plannerEvents[d] || []).map((ev) => (
                  <div key={ev.id} className={`text-[11px] px-2 py-1.5 rounded-lg border ${colorMap[ev.color]}`}>
                    <p className="font-medium truncate">{ev.title}</p>
                    <p className="opacity-70">{ev.time}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Today's Plan">
            <div className="space-y-3">
              {tasks.map((t) => (
                <button key={t.id} onClick={() => toggleTask(t.id)} className="w-full flex items-center gap-3 text-left">
                  {t.done ? (
                    <CheckCircle2 size={17} className="text-orange-500 shrink-0" />
                  ) : (
                    <Circle size={17} className="text-gray-600 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${t.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {t.title}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 shrink-0">{t.time}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Notes">
            <textarea
              className="w-full bg-[#1a1a1c] border border-[#232326] rounded-xl p-3 text-sm text-gray-300 outline-none resize-none h-28"
              defaultValue={'Focus on consistency.\nDiscipline today, success tomorrow.'}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
