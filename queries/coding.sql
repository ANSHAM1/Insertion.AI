-- current month heat map
WITH RECURSIVE dates AS (
    SELECT DATE_FORMAT(CURDATE(), '%Y-%m-01') AS day

    UNION ALL

    SELECT DATE_ADD(day, INTERVAL 1 DAY)
    FROM dates
    WHERE day < CURDATE()
),

daily_attempts AS (
    SELECT
        DATE(completed_at) AS day,
        COUNT(DISTINCT CONCAT(question_id, '|', DATE(completed_at))) AS attempts
    FROM coding_solution
    WHERE completed_at IS NOT NULL
      AND completed_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      AND completed_at <= NOW()
    GROUP BY DATE(completed_at)
)

SELECT
    d.day,
    COALESCE(a.attempts, 0) AS attempts
FROM dates d
LEFT JOIN daily_attempts a
    ON d.day = a.day
ORDER BY d.day;


-- coding_by_difficulty_last_30_days
WITH per_attempt AS (
    SELECT
        DATE(completed_at) AS attempt_date,
        question_id,
        difficulty,
        AVG(score) AS avg_score,
        AVG(time_taken) AS avg_time
    FROM coding_solution
    WHERE completed_at IS NOT NULL
      AND completed_at >= CURDATE() - INTERVAL 29 DAY
    GROUP BY
        DATE(completed_at),
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



-- solved_attempt_per_difficulty
SELECT
    difficulty,
    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failed_attempts,
    COUNT() AS total_attempts 
FROM coding_solution
GROUP BY
    difficulty



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
    SELECT DISTINCT
        CAST(completed_at AS DATE) AS activity_date
    FROM coding_solution
    WHERE completed_at IS NOT NULL
),
numbered AS (
    SELECT
        activity_date,
        ROW_NUMBER() OVER (
            ORDER BY activity_date
        ) AS rn
    FROM daily
),
streak_groups AS (
    SELECT
        activity_date,
        DATEADD(
            DAY,
            -CAST(rn AS INT),
            activity_date
        ) AS grp
    FROM numbered
),
streaks AS (
    SELECT
        MIN(activity_date) AS start_date,
        MAX(activity_date) AS end_date,
        COUNT(*) AS streak_length
    FROM streak_groups
    GROUP BY grp
),
latest_activity AS (
    SELECT MAX(activity_date) AS last_date
    FROM daily
)
SELECT
    CASE
        WHEN DATEDIFF(
            DAY,
            latest_activity.last_date,
            CAST(GETDATE() AS DATE)
        ) <= 1
        THEN (
            SELECT streak_length
            FROM streaks
            WHERE end_date = latest_activity.last_date
        )
        ELSE 0
    END AS current_streak,

    COALESCE(
        MAX(streak_length),
        0
    ) AS best_streak

FROM streaks
CROSS JOIN latest_activity
GROUP BY latest_activity.last_date;



-- top_scoring_solutions
SELECT TOP (10)
    question_id, title, difficulty, score,
    RANK() OVER (ORDER BY score DESC) AS [rank]
FROM coding_solution
WHERE score IS NOT NULL
ORDER BY [rank];