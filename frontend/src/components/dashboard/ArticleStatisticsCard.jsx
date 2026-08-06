import { SectionCard } from "../UI";
import { BookOpen, ArrowUpRight } from "lucide-react";

export default function ArticleStatisticsCard({
  article,
  updateArticleStatus,
  reading_overview,
  top_reading_sources = [],
}) {
  if (!article) {
    return (
      <SectionCard title="Reading for You" icon={BookOpen}>
        <div className="py-6 text-sm text-gray-500">No article available.</div>
      </SectionCard>
    );
  }

  const totalArticles = reading_overview?.total_articles ?? 0;
  const readArticles = reading_overview?.read_articles ?? 0;

  const completion =
    totalArticles === 0 ? 0 : Math.round((readArticles * 100) / totalArticles);

  return (
    <SectionCard title="Reading for You" icon={BookOpen}>
      <div className="space-y-4">
        {/* Article */}

        <div>
          <h3 className="text-sm font-semibold text-white leading-6">
            {article.title}
          </h3>

          <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
            <span>{article.source}</span>

            <span>{new Date(article.published_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md border border-[#232326] bg-[#141416] p-2.5">
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Progress
            </div>

            <div className="mt-1 text-lg font-bold text-orange-500">
              {readArticles}/{totalArticles}
            </div>

            <div className="text-[11px] text-gray-500">Articles Read</div>
          </div>

          <div className="rounded-md border border-[#232326] bg-[#141416] p-2.5">
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              Completion
            </div>

            <div className="mt-1 text-lg font-bold text-emerald-400">
              {completion}%
            </div>

            <div className="text-[11px] text-gray-500">Read Rate</div>
          </div>
        </div>

        {/* Top Sources */}

        <div>
          <div className="mb-2 text-[10px] uppercase tracking-wide text-gray-500">
            Top Sources
          </div>

          <div className="space-y-1.5">
            {top_reading_sources.length === 0 ? (
              <p className="text-xs text-gray-500">
                No source statistics available.
              </p>
            ) : (
              top_reading_sources.map((source) => (
                <div
                  key={source.source}
                  className="flex items-center justify-between rounded-md border border-[#232326] bg-[#141416] px-3 py-2"
                >
                  <span className="text-xs text-gray-200 truncate">
                    {source.source}
                  </span>

                  <span className="text-[11px] text-gray-500">
                    {source.read_articles}/{source.total_articles}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}

        <div className="flex items-center justify-between border-t border-[#232326] pt-3">
          <a
            href={article.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md bg-orange-600 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-orange-500 transition"
          >
            Read
            <ArrowUpRight size={12} />
          </a>

          <button
            onClick={() => updateArticleStatus(article.id, !article.is_read)}
            className={`rounded-md px-2.5 py-1.5 text-[11px] font-medium transition ${
              article.is_read
                ? "bg-emerald-600 text-white"
                : "border border-[#232326] bg-[#141416] text-gray-300 hover:bg-[#1a1a1d]"
            }`}
          >
            {article.is_read ? "Read" : "Mark Read"}
          </button>
        </div>
      </div>
    </SectionCard>
  );
}