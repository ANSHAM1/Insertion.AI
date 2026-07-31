import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";

import {
  Search,
  MapPin,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import PageTitle from "../components/PageTitle.jsx";
import Modal from "../components/Modal.jsx";

const jobs = [];

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

function Row({ title, value }) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  return (
    <div className="border-b border-border py-2">
      <div className="mb-1 text-sm font-medium text-text-secondary">
        {title}
      </div>

      <div className="text-sm text-text-primary break-words">{value}</div>
    </div>
  );
}

function JobDetailModal({ job, onClose, onDelete, onStatusChange }) {
  return (
    <Modal title={`${job.role} — ${job.company}`} onClose={onClose}>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          statusStyles[job.status] ?? "bg-text-muted/10 text-text-muted"
        }`}
      >
        {job.status}
      </span>

      <div className="mt-5 space-y-1">
        <Row title="Company" value={job.company} />

        <Row title="Role" value={job.role} />

        <Row title="Description" value={job.description} />

        <Row title="Employment Type" value={job.employment_type} />

        <Row title="Recruitment Type" value={job.recruitment_type} />

        <Row title="Location" value={job.location} />

        <Row
          title="Experience"
          value={
            job.experience_min != null ? `${job.experience_min}+ years` : null
          }
        />

        <Row
          title="Salary"
          value={
            job.salary_min || job.salary_max
              ? `${job.salary_min ?? "-"} - ${job.salary_max ?? "-"}`
              : null
          }
        />

        <Row title="Posted" value={job.posted_at} />

        <Row title="Applied" value={job.applied_at} />

        <Row
          title="Resume Match"
          value={
            job.matched_percentage != null ? `${job.matched_percentage}%` : null
          }
        />

        <Row title="Matched Resume" value={job.matched_resume} />

        {job.required_skills?.length > 0 && (
          <div className="border-b border-border py-2">
            <div className="mb-2 text-sm font-medium text-text-secondary">
              Required Skills
            </div>

            <div className="flex flex-wrap gap-2">
              {job.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-accent-soft px-3 py-1 text-xs text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {job.missing_skills?.length > 0 && (
          <div className="border-b border-border py-2">
            <div className="mb-2 text-sm font-medium text-text-secondary">
              Missing Skills
            </div>

            <div className="flex flex-wrap gap-2">
              {job.missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-500"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.apply_url && (
          <div className="border-b border-border py-2">
            <div className="mb-2 text-sm font-medium text-text-secondary">
              Apply Link
            </div>

            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="break-all text-sm text-accent underline"
            >
              {job.apply_url}
            </a>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button
          onClick={() => onStatusChange(job.id, "SAVED")}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover"
        >
          Save
        </button>

        <button
          onClick={() => onStatusChange(job.id, "APPLIED")}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover"
        >
          Apply
        </button>

        <button
          onClick={() => onDelete(job.id)}
          className="rounded-lg border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
        >
          Remove
        </button>

        <button
          onClick={onClose}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default function Jobs() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const { jobs, jobLoading, updateJobStatus, deleteJob, loadJobs } = useApp();

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = `
      ${job.company}
      ${job.role}
      ${job.location ?? ""}
  `
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageTitle
        title="Jobs"
        subtitle="Roles matched to your profile — click a row for details"
      />

      <div className="mb-5 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
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

          <button
            onClick={loadJobs}
            disabled={jobLoading}
            className="shrink-0 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {jobLoading ? "Loading..." : "Load New Jobs"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
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
              <th className="px-5 py-3 font-medium">Match</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Salary</th>
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
                <td className="px-5 py-4">
                  <div className="font-medium text-text-primary">
                    {job.company}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="text-text-primary">{job.role}</div>

                  <div className="mt-1 text-xs text-text-muted">
                    {job.employment_type}
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="font-medium text-text-primary">
                    {job.matched_percentage ?? 0}%
                  </div>

                  <div className="mt-2 h-2 w-24 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full bg-accent"
                      style={{
                        width: `${job.matched_percentage ?? 0}%`,
                      }}
                    />
                  </div>
                </td>

                <td className="px-5 py-4 text-text-muted">
                  {job.location ?? "-"}
                </td>

                <td className="px-5 py-4 text-text-muted">
                  {job.salary_min || job.salary_max
                    ? `${job.salary_min ?? "-"} - ${job.salary_max ?? "-"}`
                    : "-"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[job.status] ??
                      "bg-text-muted/10 text-text-muted"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredJobs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-6 text-center text-text-muted"
                >
                  No jobs match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onDelete={deleteJob}
          onStatusChange={updateJobStatus}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
