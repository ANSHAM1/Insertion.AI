import { BookOpen, Clock, ArrowUpRight } from "lucide-react";

import DashboardCard from "./DashboardCard";

export default function ReadingArticleCard({
  article = {
    title: "How Top Candidates Structure a Winning Resume Summary",
    source: "Career Insights",
    readTime: "4 min read",
    excerpt:
      "A short, outcome-driven summary at the top of your resume can lift recruiter response rates significantly — here's the structure that works.",
    url: "#",
  },
}) {
  return (
    <DashboardCard
      title="Reading for You"
      subtitle="Curated based on your goals"
      icon={BookOpen}
    >
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold leading-6 text-text-primary">
            {article.title}
          </h4>

          <p className="mt-2 line-clamp-3 text-xs leading-5 text-text-muted">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex items-center gap-3 text-[11px] text-text-muted">
            <span className="font-medium text-text-secondary">
              {article.source}
            </span>

            <span className="flex items-center gap-1">
              <Clock size={12} />
              {article.readTime}
            </span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="flex shrink-0 items-center gap-1 rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Read
            <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </DashboardCard>
  );
}
