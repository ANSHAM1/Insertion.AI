import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import {
  Search,
  MapPin,
  Building2,
  Calendar,
  GraduationCap,
  Users,
} from "lucide-react";

import PageTitle from "../components/PageTitle.jsx";
import Modal from "../components/Modal.jsx";

import { useApp } from "../context/AppContext.jsx";

const statusStyles = {
  FOUND: "bg-success/10 text-success",
  REGISTERED: "bg-accent-soft text-accent",
  APPLIED: "bg-accent-soft text-accent",
  SHORTLISTED: "bg-warning/10 text-warning",
  INTERVIEW: "bg-warning/10 text-warning",
  OFFERED: "bg-success/10 text-success",
  REJECTED: "bg-error/10 text-error",
  EXPIRED: "bg-text-muted/10 text-text-muted",
};

function Row({ title, value }) {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="flex justify-between gap-5 border-b border-border py-2 text-sm">
      <span className="font-medium text-text-secondary">{title}</span>
      <span className="text-right text-text-primary whitespace-pre-wrap">
        {String(value)}
      </span>
    </div>
  );
}

function DriveDetailModal({ drive, onClose, onDelete, onStatusChange }) {
  return (
    <Modal title={`${drive.role} — ${drive.company}`} onClose={onClose}>
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          statusStyles[drive.status] ?? "bg-text-muted/10 text-text-muted"
        }`}
      >
        {drive.status}
      </span>

      <div className="mt-5 space-y-1">
        <div className="mt-5 space-y-1">
          <Row title="Company" value={drive.company} />

          <Row title="Role" value={drive.role} />

          <Row title="Description" value={drive.description} />

          <Row title="Employment Type" value={drive.employment_type} />

          <Row title="Recruitment Type" value={drive.recruitment_type} />

          <Row title="Location" value={drive.location} />

          <Row title="Salary" value={drive.salary} />

          <Row
            title="Bond"
            value={drive.bond != null ? `${drive.bond} months` : null}
          />

          <Row title="Status" value={drive.status} />

          <Row title="Drive Date" value={drive.drive_date} />

          <Row title="Report Time" value={drive.report_time} />

          <Row title="Venue" value={drive.venue} />

          {drive.skills && drive.skills.length > 0 && (
            <div className="border-b border-border py-2">
              <div className="mb-2 text-sm font-medium text-text-secondary">
                Skills
              </div>

              <div className="flex flex-wrap gap-2">
                {drive.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-surface-hover px-3 py-1 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {drive.apply_url && (
            <div className="border-b border-border py-2">
              <div className="mb-2 text-sm font-medium text-text-secondary">
                Apply Link
              </div>

              <button
                onClick={async () => {
                  const url = drive.apply_url.startsWith("http")
                    ? drive.apply_url
                    : `https://${drive.apply_url}`;

                  await openUrl(url);
                }}
                className="break-all text-sm text-accent underline"
              >
                {drive.apply_url}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button
          onClick={() => onStatusChange(drive.id, "APPLIED")}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-surface-hover"
        >
          Apply
        </button>

        <button
          onClick={() => onDelete(drive.id)}
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

export default function CollegeDrives() {
  const [search, setSearch] = useState("");
  const [selectedDrive, setSelectedDrive] = useState(null);

  const {
    collegeDrives,
    collegeLoaded,
    collegeLoading,
    updateDriveStatus,
    deleteDrive,
  } = useApp();

  async function updateStatus(driveId, status) {
    try {
      await updateDriveStatus(driveId, status);

      if (selectedDrive?.id === driveId) {
        setSelectedDrive((prev) => ({
          ...prev,
          status,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function removeDrive(driveId) {
    if (!window.confirm("Remove this drive?")) return;

    try {
      await deleteDrive(driveId);
      setSelectedDrive(null);
    } catch (err) {
      console.error(err);
    }
  }

  const filteredDrives = [...collegeDrives]
    .sort((a, b) => {
      if (!a.drive_date && !b.drive_date)
        return a.company.localeCompare(b.company);

      if (!a.drive_date) return 1;
      if (!b.drive_date) return -1;

      return new Date(a.drive_date) - new Date(b.drive_date);
    })
    .filter((drive) =>
      [
        drive.company,
        drive.role,
        drive.location,
        drive.salary,
        drive.status,
        drive.venue,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  if (collegeLoading) {
    return (
      <div>
        <PageTitle
          title="College Drives"
          subtitle="Placement drives happening on campus"
        />

        <p className="py-8 text-center text-text-muted">Loading...</p>
      </div>
    );
  }

  if (!collegeLoaded) {
    return (
      <div>
        <PageTitle
          title="College Drives"
          subtitle="Placement drives happening on campus"
        />

        <p className="py-8 text-center text-text-muted">
          Refresh the dashboard to sync college drives.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="College Drives"
        subtitle="Placement drives happening on campus"
      />

      <div className="relative mb-5 w-full sm:w-80">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search drives..."
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredDrives.map((drive) => (
          <button
            key={drive.id}
            onClick={() => setSelectedDrive(drive)}
            className="rounded-xl border border-border bg-surface p-5 text-left transition-colors duration-150 hover:bg-surface-hover"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {drive.company}
                </p>

                <p className="mt-0.5 text-xs text-text-secondary">
                  {drive.role}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  statusStyles[drive.status] ??
                  "bg-text-muted/10 text-text-muted"
                }`}
              >
                {drive.status}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-1.5 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <GraduationCap size={13} />
                {drive.location ?? drive.venue ?? "-"}
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                {drive.drive_date ?? "TBA"}
              </div>

              <div className="flex items-center gap-1.5">
                <MapPin size={13} />
                {drive.salary ?? "Salary not specified"}
              </div>
            </div>
          </button>
        ))}

        {filteredDrives.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-text-muted">
            No drives match your search.
          </p>
        )}
      </div>

      {selectedDrive && (
        <DriveDetailModal
          drive={selectedDrive}
          onClose={() => setSelectedDrive(null)}
          onDelete={removeDrive}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}
