from src.fetcher.jobs.job_apis import LeverProvider
from src.fetcher.jobs.models import JobSearchQuery


provider = LeverProvider()

jobs = provider.search(

    JobSearchQuery(
        remote_only=True,
        limit=50,
    )
)


for job in jobs:
    print(job)
    print()