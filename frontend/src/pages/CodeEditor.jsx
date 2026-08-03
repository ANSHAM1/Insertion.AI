import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  UploadCloud,
  Settings2,
  Maximize2,
  ChevronDown,
  Terminal,
  CheckCircle2,
} from 'lucide-react';
import { codingQuestions } from '../data/mockData';
import { DifficultyBadge } from '../components/UI';
import TitleBar from '../components/TitleBar';

const LANGUAGES = ['C++', 'Java', 'Python', 'JavaScript'];

export default function CodeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = useMemo(
    () => codingQuestions.find((q) => String(q.id) === id) || codingQuestions[0],
    [id]
  );

  const [code, setCode] = useState(question.starterCode);
  const [language, setLanguage] = useState('C++');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState('description');

  const runCode = () => {
    setRunning(true);
    setOutput('');
    setTimeout(() => {
      setOutput(
        `Running ${language}...\n\n> Input: ${question.examples[0]?.input}\n> Expected Output: ${question.examples[0]?.output}\n> Your Output: ${question.examples[0]?.output}\n\n✅ Test case passed (1/1)\nRuntime: 42 ms | Memory: 14.2 MB`
      );
      setRunning(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-[#0b0b0d] text-gray-200 flex flex-col z-50">
      <TitleBar title={`InsertionAI — ${question.title}`} />
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c1c1f] bg-[#0f0f11]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/coding')}
            className="flex items-center gap-1 text-gray-400 hover:text-white text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span className="text-[#2a2a2e]">|</span>
          <span className="text-sm font-medium text-white">{question.title}</span>
          <DifficultyBadge level={question.difficulty} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            className="flex items-center gap-1.5 bg-[#1a1a1c] hover:bg-[#232326] border border-[#232326] text-gray-200 text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            <Play size={14} className="text-orange-500" /> Run
          </button>
          <button className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
            <UploadCloud size={14} /> Submit
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400">
            <Settings2 size={15} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex min-h-0">
        {/* Left panel: description */}
        <div className="w-[42%] border-r border-[#1c1c1f] flex flex-col min-h-0">
          <div className="flex items-center gap-4 px-5 pt-4 border-b border-[#1c1c1f] text-sm">
            {['description', 'submissions', 'hints'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 capitalize border-b-2 transition-colors ${
                  tab === t ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
            {tab === 'description' && (
              <>
                <div className="flex items-center gap-2 flex-wrap">
                  {question.tags.map((t) => (
                    <span key={t} className="text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                  <span className="text-[11px] text-gray-500 ml-auto">Acceptance: {question.acceptance}</span>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                  {question.description}
                </p>

                <div className="space-y-3">
                  {question.examples.map((ex, i) => (
                    <div key={i} className="bg-[#141416] border border-[#232326] rounded-xl p-3 text-sm">
                      <p className="text-gray-500 text-xs mb-1">Example {i + 1}</p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Input: </span>
                        {ex.input}
                      </p>
                      <p className="text-gray-300">
                        <span className="text-gray-500">Output: </span>
                        {ex.output}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'submissions' && (
              <div className="flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 size={16} /> Last submission: Accepted • 42ms • C++
              </div>
            )}

            {tab === 'hints' && (
              <p className="text-sm text-gray-400">
                Try using a hash map to track values you've already seen for an O(n) solution.
              </p>
            )}
          </div>
        </div>

        {/* Right panel: editor + console */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1c1c1f] bg-[#0f0f11]">
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-[#1a1a1c] border border-[#232326] text-sm text-gray-200 rounded-lg pl-3 pr-8 py-1.5 outline-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 bg-[#0b0b0d] text-gray-200 font-mono text-sm p-5 outline-none resize-none leading-relaxed"
            style={{ tabSize: 4 }}
          />

          <div className="h-44 border-t border-[#1c1c1f] flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1c1c1f] text-sm text-gray-400">
              <Terminal size={14} className="text-orange-500" /> Console
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap">
              {running ? 'Executing...' : output || 'Click "Run" to test your code against the example cases.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
