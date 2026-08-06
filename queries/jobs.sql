-- job_status_funnel
SELECT status, COUNT(id) AS count
FROM jobs
GROUP BY status
ORDER BY COUNT(id) DESC;



-- job_match_quality_per_resume
SELECT
    COUNT(id) AS total_jobs,
    COALESCE(SUM(CAST(matched_resume AS INT)), 0) AS matched_jobs,
    COALESCE(AVG(matched_percentage), 0.0) AS avg_match_percentage
FROM jobs
WHERE matched_resume IS  NOT NULL
GROUP BY matched_resume



-- top_companies_by_volume
SELECT *
FROM (
    SELECT
        company,
        COUNT(id) AS num_jobs,
        AVG(matched_percentage) AS avg_match,
        DENSE_RANK() OVER (ORDER BY COUNT(id) DESC) AS [rank]
    FROM jobs
    GROUP BY company
) ranked
WHERE [rank] <= 10
ORDER BY [rank];



-- best_fit_jobs
SELECT TOP (10) *
FROM (
    SELECT
        id, company, role,
        (COALESCE(matched_percentage, 0)
         + COALESCE(compensation_value_score, 0)
         + COALESCE(flexibility_score, 0)
         + COALESCE(growth_score, 0)) AS composite_score,
        RANK() OVER (
            ORDER BY (COALESCE(matched_percentage, 0)
                     + COALESCE(compensation_value_score, 0)
                     + COALESCE(flexibility_score, 0)
                     + COALESCE(growth_score, 0)) DESC
        ) AS [rank]
    FROM jobs
) ranked
ORDER BY [rank];



-- job_match_distribution (quartiles via NTILE)
SELECT
    bucket,
    COUNT(*)                    AS num_jobs,
    MIN(matched_percentage)     AS min_match,
    MAX(matched_percentage)     AS max_match
FROM (
    SELECT
        id, matched_percentage,
        NTILE(4) OVER (ORDER BY matched_percentage DESC) AS bucket
    FROM jobs
    WHERE matched_percentage IS NOT NULL
) t
GROUP BY bucket
ORDER BY bucket;



-- missing_skills_frequency
-- Requires missing_skills to be stored as JSON text (NVARCHAR) so OPENJSON can explode it.
SELECT TOP (15)
    skill.[value] AS skill,
    COUNT(*) AS count
FROM jobs j
CROSS APPLY OPENJSON(j.missing_skills) AS skill
GROUP BY skill.[value]
ORDER BY count DESC;