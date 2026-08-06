-- coding_overview
SELECT
    COUNT(question_id)                             AS total_attempts,
    COALESCE(AVG(CAST(score AS FLOAT)), 0.0)       AS avg_score,
    COALESCE(AVG(CAST(time_taken AS FLOAT)), 0.0)  AS avg_time_taken
FROM coding_solution;


-- coding_by_difficulty
SELECT
    difficulty,
    COUNT(question_id) AS attempts,
    COALESCE(AVG(CAST(score AS FLOAT)), 0.0) AS avg_score,
    COALESCE(AVG(CAST(time_taken AS FLOAT) / NULLIF(time_limit, 0)), 0.0) AS avg_time_efficiency
FROM coding_solution
GROUP BY difficulty
ORDER BY difficulty;


-- coding_status_breakdown
SELECT
    COALESCE(status, 'Not Attempted') AS status,
    COUNT(question_id) AS count
FROM coding_solution
GROUP BY COALESCE(status, 'Not Attempted')
ORDER BY count DESC;


-- coding_language_distribution
SELECT
    language,
    COUNT(question_id) AS count
FROM coding_solution
WHERE language IS NOT NULL
GROUP BY language
ORDER BY count DESC;


-- coding_streak (gaps-and-islands on completed_at date)
WITH daily AS (
    SELECT DISTINCT CAST(completed_at AS DATE) AS [date]
    FROM coding_solution
    WHERE completed_at IS NOT NULL
),
flagged AS (
    SELECT [date], ROW_NUMBER() OVER (ORDER BY [date]) AS rn
    FROM daily
),
grouped AS (
    SELECT [date], DATEADD(DAY, -rn, [date]) AS grp
    FROM flagged
),
streaks AS (
    SELECT grp, COUNT(*) AS streak_length, MAX([date]) AS streak_end
    FROM grouped
    GROUP BY grp
)
SELECT
    COALESCE(
        (SELECT streak_length FROM streaks WHERE streak_end = (SELECT MAX([date]) FROM daily)),
        0
    ) AS current_streak,
    COALESCE(MAX(streak_length), 0) AS best_streak
FROM streaks;


-- top_scoring_solutions
SELECT TOP (10)
    question_id, title, difficulty, score,
    RANK() OVER (ORDER BY score DESC) AS [rank]
FROM coding_solution
WHERE score IS NOT NULL
ORDER BY [rank];