import { useState } from "react";
import { Search } from "lucide-react";
import PageTitle from "../components/PageTitle.jsx";

const emails = [
  { id: 1, sender: "Acme Corp Recruiting", subject: "Interview confirmation for Frontend role", date: "Jul 30", status: "Unread" },
  { id: 2, sender: "Nova Labs", subject: "Following up on your application", date: "Jul 29", status: "Read" },
  { id: 3, sender: "LinkedIn", subject: "You have 5 new job matches", date: "Jul 29", status: "Unread" },
  { id: 4, sender: "Bright Path HR", subject: "Offer letter attached", date: "Jul 28", status: "Read" },
  { id: 5, sender: "Vercel Careers", subject: "Thanks for applying", date: "Jul 27", status: "Read" },
];

const statusStyles = {
  Unread: "bg-accent-soft text-accent",
  Read: "bg-text-muted/10 text-text-muted",
};

export default function Emails() {
  const [search, setSearch] = useState("");

  const filteredEmails = emails.filter((email) =>
    `${email.sender} ${email.subject}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageTitle title="Emails" subtitle="Messages related to your job search" />

      <div className="relative mb-5 w-full sm:w-80">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emails..."
          className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-text-secondary">
              <th className="px-5 py-3 font-medium">Sender</th>
              <th className="px-5 py-3 font-medium">Subject</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmails.map((email) => (
              <tr
                key={email.id}
                className="border-b border-border last:border-none hover:bg-surface-hover"
              >
                <td className="px-5 py-3 text-text-primary">{email.sender}</td>
                <td className="px-5 py-3 text-text-secondary">{email.subject}</td>
                <td className="px-5 py-3 text-text-muted">{email.date}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[email.status]}`}>
                    {email.status}
                  </span>
                </td>
              </tr>
            ))}

            {filteredEmails.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-text-muted">
                  No emails match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
