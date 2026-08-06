-- current month heat map
WITH RECURSIVE dates AS (
    SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') AS day

    UNION ALL

    SELECT DATE_ADD(day, INTERVAL 1 DAY)
    FROM dates
    WHERE day < LAST_DAY(CURDATE())
),

daily_attempts AS (
    SELECT
        generated_date,
        COUNT(DISTINCT CONCAT(question_id, '|', generated_date)) AS attempts
    FROM coding_solution
    WHERE generated_date BETWEEN DATE_FORMAT(CURDATE(), '%Y-%m-01')
                            AND LAST_DAY(CURDATE())
    GROUP BY generated_date
)

SELECT
    d.day,
    COALESCE(a.attempts, 0) AS attempts
FROM dates d
LEFT JOIN daily_attempts a
    ON d.day = a.generated_date
ORDER BY d.day;



-- coding_by_difficulty_last_30_days
WITH per_attempt AS (
    SELECT
        generated_date,
        question_id,
        difficulty,
        AVG(score) AS avg_score,
        AVG(time_taken) AS avg_time
    FROM coding_solution
    WHERE generated_date >= CURDATE() - INTERVAL 29 DAY
    GROUP BY
        generated_date,
        question_id,
        difficulty
)

SELECT
    COALESCE(difficulty, 'OVERALL') AS difficulty,
    COUNT(*) AS unique_attempts,
    ROUND(AVG(avg_score), 2) AS avg_score,
    ROUND(AVG(avg_time), 2) AS avg_time_taken_minutes
FROM per_attempt
GROUP BY difficulty WITH ROLLUP;



-- average_failed_attempt_per_primary_key(difficult, question, generated_date)
SELECT
    difficulty,
    ROUND(AVG(failed_attempts), 2) AS avg_failing_attempts
FROM (
    SELECT
        generated_date,
        question_id,
        difficulty,
        SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failed_attempts
    FROM coding_solution
    GROUP BY
        generated_date,
        question_id,
        difficulty
) AS attempts
GROUP BY difficulty
ORDER BY FIELD(difficulty, 'EASY', 'MEDIUM', 'HARD');



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