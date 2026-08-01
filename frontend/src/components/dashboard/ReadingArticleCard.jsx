import { BookOpen, ArrowUpRight } from "lucide-react";

import DashboardCard from "./DashboardCard";

export default function ReadingArticleCard({
  article,
  articleLoading,
  articleLoaded,
  updateArticleReadStatus,
}) {
  if (articleLoading) {
    return (
      <DashboardCard
        title="Reading for You"
        subtitle="Curated based on your goals"
        icon={BookOpen}
      >
        <div className="text-sm text-text-muted">Loading article...</div>
      </DashboardCard>
    );
  }

  if (!articleLoaded || !article) {
    return (
      <DashboardCard
        title="Reading for You"
        subtitle="Curated based on your goals"
        icon={BookOpen}
      >
        <div className="text-sm text-text-muted">No article available.</div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Reading for You"
      subtitle="Curated based on your goals"
      icon={BookOpen}
    >
      <div className="flex h-full flex-col justify-between gap-5">
        <div>
          <h4 className="text-sm font-semibold leading-6 text-text-primary">
            {article.title}
          </h4>

          <div className="mt-3 text-xs text-text-muted">
            <div>
              <span className="font-medium text-text-secondary">
                {article.source}
              </span>
            </div>

            <div className="mt-1">
              {new Date(article.published_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            Read Article
            <ArrowUpRight size={13} />
          </a>

          <button
            onClick={() =>
              updateArticleReadStatus(article.id, !article.is_read)
            }
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              article.is_read
                ? "bg-accent text-white"
                : "border border-border bg-surface text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {article.is_read ? "Read" : "Mark as Read"}
          </button>
        </div>
      </div>
    </DashboardCard>
  );
}
