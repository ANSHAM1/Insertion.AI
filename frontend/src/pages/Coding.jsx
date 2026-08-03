import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Trophy, Award, Target, Timer, Play } from 'lucide-react';
import { codingStats, recentSubmissions, codingQuestions } from '../data/mockData';
import { SectionCard, DifficultyBadge, StatusPill } from '../components/UI';

function StatBox({ icon: Icon, value, label }) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <Icon size={16} className="text-orange-500" />
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

export default function Coding() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Coding Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Sharpen your skills, one problem at a time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox icon={Target} value={codingStats.problemsSolved} label="Problems Solved" />
        <StatBox icon={Flame} value={`${codingStats.streak} days`} label="Streak" />
        <StatBox icon={Trophy} value={codingStats.rank} label="LeetCode Rank" />
        <StatBox icon={Award} value={codingStats.contests} label="Contests Participated" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Problems" className="lg:col-span-2">
          <div className="space-y-2">
            {codingQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => navigate(`/coding/${q.id}`)}
                className="w-full flex items-center justify-between gap-4 bg-[#1a1a1c] hover:bg-[#212124] border border-[#232326] rounded-xl px-4 py-3 text-left transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm text-gray-100 font-medium truncate">{q.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <DifficultyBadge level={q.difficulty} />
                    {q.tags.map((t) => (
                      <span key={t} className="text-[11px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500 hidden sm:block">{q.acceptance}</span>
                  <StatusPill status={q.status} />
                  <Play size={16} className="text-orange-500" />
                </div>
              </button>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Recent Submissions">
            <div className="space-y-3">
              {recentSubmissions.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-gray-200">{s.problem}</p>
                    <p className="text-xs text-gray-600">
                      {s.language} • {s.time}
                    </p>
                  </div>
                  <StatusPill status={s.status} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Focus Timer" icon={Timer}>
            <div className="flex flex-col items-center py-2">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#232326" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#ff6a1a"
                    strokeWidth="6"
                    strokeDasharray="276.4"
                    strokeDashoffset="60"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                  45:00
                </span>
              </div>
              <button className="mt-4 bg-orange-600 hover:bg-orange-500 text-white text-sm px-6 py-2 rounded-xl transition-colors">
                Start Focus
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-[#232326]">
              <p className="text-xs text-gray-500 mb-1">Today's Goal</p>
              <p className="text-sm text-gray-200 mb-2">Solve 3 Problems • 2/3 Completed</p>
              <div className="w-full h-1.5 bg-[#232326] rounded-full overflow-hidden">
                <div className="h-full accent-gradient" style={{ width: '66%' }} />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
