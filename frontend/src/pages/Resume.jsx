import { FileText } from "lucide-react";
import PageTitle from "../components/PageTitle.jsx";

const skills = ["React", "JavaScript", "Tailwind CSS", "Node.js", "Tauri", "Git"];

const projects = [
  { id: 1, name: "InsertionAI", description: "Desktop productivity dashboard for job seekers." },
  { id: 2, name: "TaskFlow", description: "Kanban-style task manager built with React." },
];

const experience = [
  { id: 1, role: "Frontend Developer", company: "Bright Path", period: "2023 — Present" },
  { id: 2, role: "Junior Developer", company: "Orbit Systems", period: "2021 — 2023" },
];

const education = [
  { id: 1, school: "State University", degree: "B.S. Computer Science", period: "2017 — 2021" },
];

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Resume() {
  return (
    <div>
      <PageTitle
        title="Resume"
        subtitle="Your professional profile"
        action={
          <button className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-hover">
            <FileText size={16} />
            Generate Resume
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Section title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent"
              >
                {skill}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Projects">
          <ul className="flex flex-col gap-3">
            {projects.map((project) => (
              <li key={project.id}>
                <p className="text-sm text-text-primary">{project.name}</p>
                <p className="mt-1 text-xs text-text-muted">{project.description}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Experience">
          <ul className="flex flex-col gap-3">
            {experience.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">{item.role}</p>
                  <p className="mt-1 text-xs text-text-muted">{item.company}</p>
                </div>
                <span className="text-xs text-text-muted">{item.period}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Education">
          <ul className="flex flex-col gap-3">
            {education.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-primary">{item.degree}</p>
                  <p className="mt-1 text-xs text-text-muted">{item.school}</p>
                </div>
                <span className="text-xs text-text-muted">{item.period}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
