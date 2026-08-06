-- reading_overview
SELECT
    COUNT(id) AS total_articles,
    COALESCE(SUM(CAST(is_read AS INT)), 0) AS read_articles
FROM reading_articles;



-- top_reading_sources
SELECT TOP (3)
    source,
    COUNT(id) AS total,
    COALESCE(SUM(CAST(is_read AS INT)), 0) AS [read]
FROM reading_articles
GROUP BY source
ORDER BY total DESC