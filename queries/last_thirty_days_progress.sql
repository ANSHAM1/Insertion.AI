use InsertionAI;


select 
	CAST(d.generated_at AS DATE) as date, 
	COUNT(1) as total_task, 
	SUM(CAST(completed as int)) as task_completed
from schedule_items i
left join daily_schedules d
on i.schedule_date = d.schedule_date
WHERE d.generated_at >= DATEADD(day, -30, GETDATE())
group by d.generated_at
order by d.generated_at;