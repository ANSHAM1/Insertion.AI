from datetime import datetime, date

from src.fetcher.job.models import JobClass
from src.fetcher.job.job_apis import AdzunaProvider



def fetch_jobs(last_sync : datetime | None) -> list[JobClass]:

    adzuna : AdzunaProvider = AdzunaProvider()

    if not last_sync:
        return adzuna.search_jobs(max_days_old=7, limit=20)

    max_days_old = max(1, min((date.today() - last_sync).days, 5))

    return adzuna.search_jobs(max_days_old=max_days_old, limit=20,)