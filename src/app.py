from src.fetcher.jobs.job_apis import HirebaseProvider
from src.fetcher.jobs.models import Job, JobSearchFilter

from src.config.settings import get_settings

HIREBASE_API_KEY = get_settings().HIREBASE_API_KEY

api : HirebaseProvider = HirebaseProvider(HIREBASE_API_KEY)

filter : JobSearchFilter = JobSearchFilter()

li : list[Job] = api.search_jobs(filter)


for l in li:
    print(l)
    print()

