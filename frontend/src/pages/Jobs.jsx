import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  IndianRupee,
  Sparkles,
  X,
  Trash2,
  ExternalLink,
  Briefcase,
  ChevronDown,
} from "lucide-react";
import { SectionCard } from "../components/UI";

import { useApp } from "../context/AppContext";

async function openExternal(rawUrl) {
  if (!rawUrl) return;
  const url = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;

  try {
    const shell = await import("@tauri-apps/plugin-shell");
    if (shell?.open) {
      await shell.open(url);
      return;
    }
  } catch (err) {
    console.warn("Tauri shell plugin unavailable, falling back:", err);
  }

  try {
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) return;
  } catch (err) {
    console.warn("window.open failed, falling back:", err);
  }

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const STATUS_ORDER = ["FOUND", "APPLIED", "OA", "INTERVIEW", "HR", "OFFER"];

const STATUS_CONFIG = {
  FOUND: {
    label: "Found",
    classes: "bg-gray-500/15 border-gray-500/30 text-gray-300",
    dot: "bg-gray-400",
    bar: "bg-gray-400",
  },
  APPLIED: {
    label: "Applied",
    classes: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    dot: "bg-blue-400",
    bar: "bg-blue-500",
  },
  OA: {
    label: "OA",
    classes: "bg-purple-500/15 border-purple-500/30 text-purple-400",
    dot: "bg-purple-400",
    bar: "bg-purple-500",
  },
  INTERVIEW: {
    label: "Interview",
    classes: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    dot: "bg-amber-400",
    bar: "bg-amber-500",
  },
  HR: {
    label: "HR Round",
    classes: "bg-pink-500/15 border-pink-500/30 text-pink-400",
    dot: "bg-pink-400",
    bar: "bg-pink-500",
  },
  OFFER: {
    label: "Offer",
    classes: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    dot: "bg-emerald-400",
    bar: "bg-emerald-500",
  },
};

const SORT_OPTIONS = [
  { key: "posted_desc", label: "Newest first" },
  { key: "posted_asc", label: "Oldest first" },
  { key: "salary_desc", label: "Salary: High to Low" },
  { key: "salary_asc", label: "Salary: Low to High" },
  { key: "match_desc", label: "Best match" },
];

function initials(name) {
  if (!name) return "??";
  return name.trim().slice(0, 2).toUpperCase();
}

function formatSalary(min, max) {
  if (!min && !max) return "Not disclosed";
  if (min && max) return `₹${min} - ₹${max}`;
  return `₹${min ?? max}`;
}

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// Custom themed dropdown — replaces the native <select>, used only inside the popup
function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.FOUND;

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border transition-colors ${cfg.classes}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <ChevronDown
          size={12}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-40 bg-[#141416] border border-[#232326] rounded-xl shadow-xl z-20 overflow-hidden py-1"
          >
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 text-left text-sm px-3 py-2 hover:bg-white/5 transition-colors ${
                  s === status ? "text-orange-400" : "text-gray-300"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`}
                />
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function JobCard({ job, deleting, onOpen, onDelete }) {
  const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.FOUND;

  return (
    <div
      onClick={() => !deleting && onOpen(job)}
      className={`card card-hover p-4 flex items-center gap-4 flex-wrap cursor-pointer transition-opacity ${
        deleting ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <div className="w-11 h-11 rounded-xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-orange-400 font-bold shrink-0">
        {initials(job.company)}
      </div>

      <div className="flex-1 min-w-[200px] min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className="text-sm font-semibold text-white truncate max-w-[240px]"
            title={job.role}
          >
            {job.role}
          </p>
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${cfg.classes}`}
          >
            {cfg.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {job.company}
          {job.location && (
            <>
              {" "}
              • <MapPin size={11} className="inline -mt-0.5" /> {job.location}
            </>
          )}
        </p>
        {job.experience_min != null && (
          <p className="text-[11px] text-gray-600 mt-0.5 flex items-center gap-1">
            <Briefcase size={11} /> {job.experience_min}+ yrs exp
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-300">
        <IndianRupee size={13} className="text-gray-500" />
        {formatSalary(job.salary_min, job.salary_max).replace("₹", "")}
      </div>

      <span className="text-xs text-gray-600 w-16 text-right">
        {timeAgo(job.posted_at)}
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!deleting) onDelete(job.id);
        }}
        disabled={deleting}
        className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-60 transition-colors"
      >
        <Trash2 size={13} /> {deleting ? "Removing..." : "Remove"}
      </button>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-[#1f1f22] last:border-b-0">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-sm text-gray-200 text-right">{value}</span>
    </div>
  );
}

function SkillPills({ skills, tone = "default" }) {
  if (!skills || skills.length === 0) return null;
  const classes =
    tone === "missing"
      ? "bg-red-500/10 border-red-500/25 text-red-400"
      : "bg-[#1f1f22] border-[#2c2c30] text-gray-300";
  return (
    <div className="flex flex-wrap gap-1.5 mt-1.5">
      {skills.map((s) => (
        <span
          key={s}
          className={`text-[11px] px-2 py-1 rounded-md border ${classes}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function JobModal({ job, onClose, onStatusChange }) {
  if (!job) return null;
  const cfg = STATUS_CONFIG[job.status] ?? STATUS_CONFIG.FOUND;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#141416] border border-[#232326] rounded-2xl shadow-2xl"
      >
        <div className="flex items-start justify-between p-5 border-b border-[#1f1f22]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-orange-600/20 border border-orange-600/30 flex items-center justify-center text-orange-400 font-bold shrink-0">
              {initials(job.company)}
            </div>
            <div className="min-w-0">
              <p
                className="text-base font-semibold text-white truncate"
                title={job.role}
              >
                {job.role}
              </p>
              <p className="text-xs text-gray-500 truncate">{job.company}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-500 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${cfg.classes}`}
            >
              Current status
            </span>
            <StatusDropdown
              status={job.status || "FOUND"}
              onChange={(s) => onStatusChange(job.id, s)}
            />
          </div>

          {job.description && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {job.description}
              </p>
            </div>
          )}

          <div>
            <DetailRow label="Employment Type" value={job.employment_type} />
            <DetailRow label="Recruitment Type" value={job.recruitment_type} />
            <DetailRow label="Location" value={job.location} />
            <DetailRow
              label="Salary Range"
              value={formatSalary(job.salary_min, job.salary_max)}
            />
            <DetailRow
              label="Experience"
              value={
                job.experience_min != null ? `${job.experience_min}+ yrs` : null
              }
            />
            <DetailRow
              label="Posted"
              value={
                job.posted_at
                  ? new Date(job.posted_at).toLocaleDateString("en-IN")
                  : null
              }
            />
            <DetailRow
              label="Applied"
              value={
                job.applied_at
                  ? new Date(job.applied_at).toLocaleDateString("en-IN")
                  : null
              }
            />
            <DetailRow
              label="Match"
              value={
                job.matched_percentage != null
                  ? `${job.matched_percentage}%`
                  : null
              }
            />
            <DetailRow
              label="Matched Resume"
              value={job.matched_resume ?? null}
            />
          </div>

          {job.required_skills?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500">Required Skills</p>
              <SkillPills skills={job.required_skills} />
            </div>
          )}

          {job.missing_skills?.length > 0 && (
            <div>
              <p className="text-xs text-gray-500">Missing Skills</p>
              <SkillPills skills={job.missing_skills} tone="missing" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-[#1f1f22]">
          {job.apply_url ? (
            <button
              onClick={() => openExternal(job.apply_url)}
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Open Listing <ExternalLink size={13} />
            </button>
          ) : (
            <span className="text-xs text-gray-600">
              No listing link available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Jobs() {
  const { jobs, jobLoading, updateJobStatus, deleteJob, generateJobs } =
    useApp();

  // Local, optimistic mirror of context jobs. We only ever *replace* this
  // from context when context actually has a real array — never on a
  // transient null/undefined mid-refetch — so a background refetch
  // triggered by delete/generate/status-change can never blank this list
  // out or momentarily desync it from what's on screen.
  const [localJobs, setLocalJobs] = useState(jobs ?? []);
  const [deletingIds, setDeletingIds] = useState(() => new Set());

  useEffect(() => {
    if (Array.isArray(jobs)) setLocalJobs(jobs);
  }, [jobs]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("posted_desc");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleDelete = async (jobId) => {
    setDeletingIds((prev) => new Set(prev).add(jobId));
    if (selectedJob?.id === jobId) setSelectedJob(null);

    const snapshot = localJobs;
    setLocalJobs((list) => list.filter((j) => j.id !== jobId));

    try {
      await deleteJob(jobId);
    } catch (err) {
      console.error("Failed to delete job:", err);
      setLocalJobs(snapshot); // revert — deletion didn't actually happen
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateJobs();
    } catch (err) {
      console.error("Failed to generate jobs:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    const previous = localJobs;

    // Optimistic update — reflected instantly in both the card behind the
    // modal AND inside the modal itself (see modalJob below), instead of
    // only showing up once the modal is closed and reopened.
    setLocalJobs((list) =>
      list.map((j) =>
        j.id === jobId
          ? { ...j, status: newStatus, status_date: new Date().toISOString() }
          : j,
      ),
    );

    try {
      await updateJobStatus(jobId, newStatus);
    } catch (err) {
      console.error("Failed to update job status:", err);
      setLocalJobs(previous); // revert — the update didn't actually happen
    }
  };

  // Feed the modal the *live* version of the job from localJobs (falling
  // back to the raw selectedJob only if it's somehow no longer in the
  // list) instead of the frozen object captured when it was opened. This
  // is what makes status changes show up in the popup immediately.
  const modalJob = selectedJob
    ? (localJobs.find((j) => j.id === selectedJob.id) ?? selectedJob)
    : null;

  const visibleJobs = useMemo(() => {
    let list = [...localJobs];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (j) =>
          j.role?.toLowerCase().includes(q) ||
          j.company?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "ALL") {
      list = list.filter((j) => (j.status || "FOUND") === statusFilter);
    }

    list.sort((a, b) => {
      switch (sortKey) {
        case "posted_asc":
          return new Date(a.posted_at ?? 0) - new Date(b.posted_at ?? 0);
        case "salary_desc":
          return (
            (b.salary_max ?? b.salary_min ?? 0) -
            (a.salary_max ?? a.salary_min ?? 0)
          );
        case "salary_asc":
          return (
            (a.salary_min ?? a.salary_max ?? 0) -
            (b.salary_min ?? b.salary_max ?? 0)
          );
        case "match_desc":
          return (b.matched_percentage ?? 0) - (a.matched_percentage ?? 0);
        case "posted_desc":
        default:
          return new Date(b.posted_at ?? 0) - new Date(a.posted_at ?? 0);
      }
    });

    return list;
  }, [localJobs, query, statusFilter, sortKey]);

  const stats = useMemo(() => {
    const list = localJobs;

    const applied = list.filter((j) =>
      ["APPLIED", "OA", "INTERVIEW", "HR", "OFFER"].includes(j.status),
    ).length;

    const oa = list.filter((j) =>
      ["OA", "INTERVIEW", "HR", "OFFER"].includes(j.status),
    ).length;

    const interview = list.filter((j) =>
      ["INTERVIEW", "HR", "OFFER"].includes(j.status),
    ).length;

    const hr = list.filter((j) => ["HR", "OFFER"].includes(j.status)).length;

    const offers = list.filter((j) => j.status === "OFFER").length;

    return {
      total: list.length,
      applied,
      oa,
      interview,
      hr,
      offers,
    };
  }, [localJobs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">
            Find your next opportunity.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-1.5 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_4px_10px_-2px_rgba(234,88,12,0.5)] transition-all active:scale-[0.97]"
        >
          <Sparkles size={14} className={generating ? "animate-pulse" : ""} />
          {generating ? "Generating..." : "Generate New Jobs"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-[#141416] border border-[#232326] rounded-xl px-3 py-2.5 flex-1 min-w-[220px]">
              <Search size={15} className="text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jobs, roles or companies..."
                className="bg-transparent outline-none text-sm text-gray-300 placeholder:text-gray-600 flex-1"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowFilter((v) => !v);
                  setShowSort(false);
                }}
                className={`flex items-center gap-1.5 border text-sm px-3 py-2.5 rounded-xl transition-colors ${
                  statusFilter !== "ALL"
                    ? "bg-orange-600/15 border-orange-600/40 text-orange-400"
                    : "bg-[#141416] border-[#232326] text-gray-300"
                }`}
              >
                <SlidersHorizontal size={14} /> Filter
              </button>
              {showFilter && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFilter(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-[#141416] border border-[#232326] rounded-xl shadow-xl z-20 overflow-hidden py-1">
                    <button
                      onClick={() => {
                        setStatusFilter("ALL");
                        setShowFilter(false);
                      }}
                      className={`w-full text-left text-sm px-3 py-2 hover:bg-white/5 ${
                        statusFilter === "ALL"
                          ? "text-orange-400"
                          : "text-gray-300"
                      }`}
                    >
                      All Statuses
                    </button>
                    {STATUS_ORDER.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatusFilter(s);
                          setShowFilter(false);
                        }}
                        className={`w-full flex items-center gap-2 text-left text-sm px-3 py-2 hover:bg-white/5 ${
                          statusFilter === s
                            ? "text-orange-400"
                            : "text-gray-300"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`}
                        />
                        {STATUS_CONFIG[s].label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setShowSort((v) => !v);
                  setShowFilter(false);
                }}
                className="flex items-center gap-1.5 bg-[#141416] border border-[#232326] text-gray-300 text-sm px-3 py-2.5 rounded-xl"
              >
                <ArrowUpDown size={14} /> Sort
              </button>
              {showSort && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSort(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#141416] border border-[#232326] rounded-xl shadow-xl z-20 overflow-hidden py-1">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.key}
                        onClick={() => {
                          setSortKey(o.key);
                          setShowSort(false);
                        }}
                        className={`w-full text-left text-sm px-3 py-2 hover:bg-white/5 ${
                          sortKey === o.key
                            ? "text-orange-400"
                            : "text-gray-300"
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {jobLoading && visibleJobs.length === 0 ? (
              <p className="text-sm text-gray-500">Loading jobs...</p>
            ) : visibleJobs.length === 0 ? (
              <p className="text-sm text-gray-500">
                No jobs match your search.
              </p>
            ) : (
              visibleJobs.map((j) => (
                <JobCard
                  key={j.id}
                  job={j}
                  deleting={deletingIds.has(j.id)}
                  onOpen={setSelectedJob}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="card p-4 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-white leading-none tabular-nums">
                {stats.applied}
              </p>
              <p className="text-xs text-gray-500 mt-2">Total</p>
              <p className="text-xs text-gray-400">Applied</p>
            </div>

            <div className="card p-4 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-white leading-none tabular-nums">
                {stats.interview}
              </p>
              <p className="text-xs text-gray-500 mt-2">Total</p>
              <p className="text-xs text-gray-400">Interviews</p>
            </div>

            <div className="card p-4 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-orange-500 leading-none tabular-nums">
                {stats.offers}
              </p>
              <p className="text-xs text-gray-500 mt-2">Total</p>
              <p className="text-xs text-gray-400">Offers</p>
            </div>
          </div>

          <SectionCard title="Application Status">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-[#232326]">
                <span className="text-sm text-gray-400">Total Jobs</span>
                <span className="text-lg font-semibold text-white">
                  {stats.total}
                </span>
              </div>

              {[
                {
                  label: "Applied",
                  value: stats.applied,
                  color: STATUS_CONFIG.APPLIED.bar,
                },
                {
                  label: "OA",
                  value: stats.oa,
                  color: STATUS_CONFIG.OA.bar,
                },
                {
                  label: "Interview",
                  value: stats.interview,
                  color: STATUS_CONFIG.INTERVIEW.bar,
                },
                {
                  label: "HR Round",
                  value: stats.hr,
                  color: STATUS_CONFIG.HR.bar,
                },
                {
                  label: "Offer",
                  value: stats.offers,
                  color: STATUS_CONFIG.OFFER.bar,
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>

                  <div className="w-full h-1.5 bg-[#232326] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{
                        width: `${
                          stats.total ? (item.value / stats.total) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <JobModal
        job={modalJob}
        onClose={() => setSelectedJob(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
