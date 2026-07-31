import { useState } from "react";
import { Search, MapPin, Building2, Calendar, DollarSign, ExternalLink } from "lucide-react";
import PageTitle from "../components/PageTitle.jsx";
import Modal from "../components/Modal.jsx";

const jobs = [
  {
    id: 1,
    company: "Vercel",
    role: "Frontend Engineer",
    matchScore: 92,
    priority: "High",
    location: "Remote",
    status: "Applied",
    salary: "$120k – $150k",
    posted: "Jul 25",
    deadline: "Aug 10",
    description:
      "Build and maintain performant, accessible interfaces for the Vercel dashboard. Work closely with design and platform teams to ship features used by millions of developers.",
    requirements: [
      "3+ years of experience with React",
      "Strong understanding of web performance",
      "Comfortable working in a fast-paced, remote-first team",
    ],
  },
  {
    id: 2,
    company: "Acme Corp",
    role: "Product Designer",
    matchScore: 81,
    priority: "Medium",
    location: "New York, NY",
    status: "Interviewing",
    salary: "$95k – $115k",
    posted: "Jul 22",
    deadline: "Aug 5",
    description:
      "Own end-to-end design for Acme's core product surfaces, from early concepts to polished, shippable flows.",
    requirements: [
      "Portfolio showing shipped product work",
      "Proficiency in Figma",
      "Experience partnering directly with engineers",
    ],
  },
  {
    id: 3,
    company: "Nova Labs",
    role: "React Developer",
    matchScore: 88,
    priority: "High",
    location: "Remote",
    status: "Saved",
    salary: "$110k – $135k",
    posted: "Jul 20",
    deadline: "Aug 15",
    description:
      "Join a small team building the next generation of Nova's internal tooling using React and TypeScript.",
    requirements: [
      "Solid grasp of modern React patterns",
      "Experience with component libraries",
      "Good written communication for async work",
    ],
  },
  {
    id: 4,
    company: "Bright Path",
    role: "UI Engineer",
    matchScore: 74,
    priority: "Low",
    location: "Austin, TX",
    status: "Saved",
    salary: "$90k – $105k",
    posted: "Jul 18",
    deadline: "Aug 1",
    description:
      "Translate design specs into pixel-accurate, responsive UI for Bright Path's education platform.",
    requirements: [
      "2+ years of frontend experience",
      "Strong CSS and layout fundamentals",
      "Attention to visual detail",
    ],
  },
  {
    id: 5,
    company: "Orbit Systems",
    role: "Frontend Developer",
    matchScore: 95,
    priority: "High",
    location: "Remote",
    status: "Applied",
    salary: "$125k – $150k",
    posted: "Jul 15",
    deadline: "Aug 12",
    description:
      "Help build Orbit's customer-facing analytics dashboard, working with charts, tables, and real-time data.",
    requirements: [
      "Experience with data-heavy UIs",
      "Familiarity with charting libraries",
      "Comfortable owning features independently",
    ],
  },
];

const priorityStyles = {
  High: "bg-danger/10 text-danger",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-text-muted/10 text-text-muted",
};

const statusStyles = {
  Saved: "bg-text-muted/10 text-text-muted",
  Applied: "bg-accent-soft text-accent",
  Interviewing: "bg-success/10 text-success",
};

const statusFilters = ["All", "Saved", "Applied", "Interviewing"];

function JobDetailModal({ job, onClose }) {
  return (
    <Modal title={`${job.role} @ ${job.company}`} onClose={onClose} width="max-w-2xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[job.status]}`}>
          {job.status}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[job.priority]}`}>
          {job.priority} priority
        </span>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
          {job.matchScore}% match
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin size={15} className="text-text-muted" />
          {job.location}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <DollarSign size={15} className="text-text-muted" />
          {job.salary}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Building2 size={15} className="text-text-muted" />
          {job.company}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Calendar size={15} className="text-text-muted" />
          Posted {job.posted}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Calendar size={15} className="text-danger" />
          Deadline {job.deadline}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary">About the role</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{job.description}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-text-primary">Requirements</h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {job.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors duration-150 hover:bg-surface-hover"
        >
          Close
        </button>
        <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover">
          <ExternalLink size={15} />
          View posting
        </button>
      </div>
    </Modal>
  );
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = `${job.company} ${job.role}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageTitle title="Jobs" subtitle="Roles matched to your profile — click a row for details" />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-80">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors duration-150 ${
                statusFilter === filter
                  ? "bg-accent-soft text-accent"
                  : "bg-surface text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-text-secondary">
              <th className="px-5 py-3 font-medium">Company</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Match Score</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="cursor-pointer border-b border-border last:border-none hover:bg-surface-hover"
              >
                <td className="px-5 py-3 text-text-primary">{job.company}</td>
                <td className="px-5 py-3 text-text-secondary">{job.role}</td>
                <td className="px-5 py-3 text-text-primary">{job.matchScore}%</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[job.priority]}`}>
                    {job.priority}
                  </span>
                </td>
                <td className="px-5 py-3 text-text-muted">{job.location}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[job.status]}`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredJobs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-6 text-center text-text-muted">
                  No jobs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
}
