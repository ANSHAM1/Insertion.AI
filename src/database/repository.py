from sqlalchemy import and_, select, func
from sqlalchemy.orm import Session

from src.database.models import Job, ReadingArticle



class JobRepository:

    def __init__(self, db: Session):
        self.db = db

    def add(self, job: Job) -> bool:
        existing = self.find_duplicate(job)

        if existing:
            return False

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return True

    def get(self, job_id: int) -> Job | None:
        return self.db.get(Job, job_id)

    def delete(self, job_id: int) -> bool:
        job = self.get(job_id)
        if job:
            self.db.delete(job_id)
            self.db.commit()
            return True
        
        return False

    def find_duplicate(self, job: Job) -> Job | None:
        if job.apply_url:
            existing = self.db.scalar(
                select(Job).where(Job.apply_url == job.apply_url)
            )
            if existing:
                return existing

        return self.db.scalar(
            select(Job).where(
                and_(
                    Job.company == job.company,
                    Job.role == job.role,
                    Job.location == job.location,
                )
            )
        )

    def update(self, job: Job, updates: dict[str, object]) -> Job:
        valid_fields = Job.__table__.columns.keys()

        for field, value in updates.items():
            if field not in valid_fields:
                continue

            if value is None:
                continue

            setattr(job, field, value)

        self.db.commit()
        self.db.refresh(job)

        return job



class RssRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_duplicate(self, url : str) -> ReadingArticle | None:
        return self.db.scalar(
            select(ReadingArticle).where(
                ReadingArticle.url == url
            )
        )

    def get_random_article(self) -> ReadingArticle | None:
        return self.db.scalar(
            select(ReadingArticle)
            .order_by(func.newid())      
            .limit(1)
        )

    def get_existing_urls(self, urls: list[str]) -> set[str]:
        rows = self.db.scalars(
            select(ReadingArticle.url).where(
                ReadingArticle.url.in_(urls)
            )
        )

        return set(rows)

    def add(self, article: ReadingArticle) -> bool:
        existing = self.find_duplicate(article.url)

        if existing is not None:
            return False
        
        self.db.add(article)
        self.db.commit()
        self.db.refresh(article)

        return True

    def get(self, article_id: int) -> ReadingArticle | None:
        return self.db.get(
            ReadingArticle,
            article_id,
        )