import { useState } from "react";
import { Search, MapPin, Building2, Calendar, GraduationCap, Users } from "lucide-react";
import PageTitle from "../components/PageTitle.jsx";
import Modal from "../components/Modal.jsx";

const drives = [
  {
    id: 1,
    company: "TCS",
    role: "Software Engineer Trainee",
    college: "State University",
    driveDate: "Aug 8",
    eligibility: "B.Tech CSE/IT, 60%+",
    package: "₹4.5 LPA",
    status: "Registered",
    seats: 40,
  },
  {
    id: 2,
    company: "Infosys",
    role: "Systems Engineer",
    college: "State University",
    driveDate: "Aug 12",
    eligibility: "Any branch, no backlogs",
    package: "₹3.6 LPA",
    status: "Open",
    seats: 60,
  },
  {
    id: 3,
    company: "Amazon",
    role: "SDE Intern",
    college: "Metro Institute of Technology",
    driveDate: "Aug 15",
    eligibility: "B.Tech CSE, 75%+",
    package: "₹12 LPA",
    status: "Open",
    seats: 8,
  },
  {
    id: 4,
    company: "Wipro",
    role: "Project Engineer",
    college: "State University",
    driveDate: "Aug 3",
    eligibility: "B.Tech/B.E, 60%+",
    package: "₹3.5 LPA",
    status: "Closed",
    seats: 30,
  },
];

const statusStyles = {
  Open: "bg-success/10 text-success",
  Registered: "bg-accent-soft text-accent",
  Closed: "bg-text-muted/10 text-text-muted",
};

function DriveDetailModal({ drive, onClose }) {
  return (
    <Modal title={`${drive.role} — ${drive.company}`} onClose={onClose}>
      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[drive.status]}`}>
        {drive.status}
      </span>

      <div className="mt-5 flex flex-col gap-3 text-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          <Building2 size={15} className="text-text-muted" />
          {drive.company}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <GraduationCap size={15} className="text-text-muted" />
          {drive.college}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Calendar size={15} className="text-text-muted" />
          Drive on {drive.driveDate}
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Users size={15} className="text-text-muted" />
          {drive.seats} seats
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-text-primary">Eligibility</h3>
        <p className="mt-2 text-sm text-text-secondary">{drive.eligibility}</p>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-text-primary">Package</h3>
        <p className="mt-2 text-sm text-text-secondary">{drive.package}</p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors duration-150 hover:bg-surface-hover"
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

  const filteredDrives = drives.filter((drive) =>
    `${drive.company} ${drive.role} ${drive.college}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageTitle title="College Drives" subtitle="Placement drives happening on campus" />

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
                <p className="text-sm font-semibold text-text-primary">{drive.company}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{drive.role}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[drive.status]}`}>
                {drive.status}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-1.5 text-xs text-text-muted">
              <div className="flex items-center gap-1.5">
                <GraduationCap size={13} />
                {drive.college}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                {drive.driveDate}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} />
                {drive.package}
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

      {selectedDrive && <DriveDetailModal drive={selectedDrive} onClose={() => setSelectedDrive(null)} />}
    </div>
  );
}
