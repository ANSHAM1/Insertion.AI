-- last_thirty_days_progress
WITH dates AS (
    SELECT CAST(DATEADD(DAY, -29, CAST(GETDATE() AS DATE)) AS DATE) AS [date]
    UNION ALL
    SELECT DATEADD(DAY, 1, [date])
    FROM dates
    WHERE [date] < CAST(GETDATE() AS DATE)
),
daily_progress AS (
    SELECT
        ds.schedule_date AS [date],
        COUNT(si.id) AS num_tasks,
        COALESCE(
            SUM(
                CASE 
                    WHEN si.completed = 1 THEN 1
                    ELSE 0
                END
            ),
            0
        ) AS completed_tasks
    FROM daily_schedule ds
    LEFT JOIN schedule_item si
        ON ds.schedule_date = si.schedule_date
    WHERE ds.schedule_date >= DATEADD(DAY, -29, CAST(GETDATE() AS DATE))
      AND ds.schedule_date <= CAST(GETDATE() AS DATE)
    GROUP BY ds.schedule_date
)
SELECT
    d.[date],
    COALESCE(p.num_tasks, 0) AS num_tasks,
    COALESCE(p.completed_tasks, 0) AS completed_tasks
FROM dates d
LEFT JOIN daily_progress p
    ON d.[date] = p.[date]
ORDER BY d.[date]
OPTION (MAXRECURSION 100);



-- schedule_overview
SELECT
    COUNT(id)                                    AS total_tasks,
    COALESCE(SUM(CAST(completed AS INT)), 0)     AS completed_tasks
FROM schedule_items;



-- completion_rate_by_weekday
SELECT
    DATENAME(WEEKDAY, ds.schedule_date)                     AS weekday,
    COUNT(si.id)                                            AS num_tasks,
    COALESCE(SUM(CAST(si.completed AS INT)), 0)             AS completed_tasks
FROM daily_schedules ds
JOIN schedule_items si ON ds.schedule_date = si.schedule_date
GROUP BY DATENAME(WEEKDAY, ds.schedule_date), DATEPART(WEEKDAY, ds.schedule_date)
ORDER BY DATEPART(WEEKDAY, ds.schedule_date);



-- schedule_streaks (gaps-and-islands via DATEADD(DAY, -ROW_NUMBER, date))
WITH daily AS (
    SELECT
        ds.schedule_date AS [date],
        COUNT(si.id) AS num_tasks,
        COALESCE(SUM(CAST(si.completed AS INT)), 0) AS completed_tasks
    FROM daily_schedules ds
    LEFT JOIN schedule_items si ON ds.schedule_date = si.schedule_date
    GROUP BY ds.schedule_date
),
flagged AS (
    SELECT
        [date],
        CASE WHEN num_tasks > 0 AND completed_tasks = num_tasks THEN 1 ELSE 0 END AS is_perfect,
        ROW_NUMBER() OVER (ORDER BY [date]) AS rn
    FROM daily
),
grouped AS (
    -- for a contiguous run of perfect days, (date - rn) is constant
    SELECT [date], DATEADD(DAY, -rn, [date]) AS grp
    FROM flagged
    WHERE is_perfect = 1
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
