from sqlalchemy import and_, select, func
from sqlalchemy.orm import Session

from src.database.models import Job, JobLookup, ReadingArticle, Email, FollowUpEmail



class JobRepository:

    def __init__(self, db: Session):
        self.db = db

    def add(self, job: Job) -> bool:
        if self.exists(job.id):
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

    def update(self, job: Job, updates: dict[str, object]) -> None:
        valid_fields = Job.__table__.columns.keys()

        for field, value in updates.items():
            if field not in valid_fields:
                continue

            if value is None:
                continue

            setattr(job, field, value)

        self.db.commit()
        self.db.refresh(job)

    def exists(self, job_id: str) -> bool:
        return self.db.scalar(
            select(JobLookup).where(JobLookup.id == job_id)
            ) is not None

    def bulk_exists(self, job_ids: list[str]) -> list[str]:
        if not job_ids:
            return []

        rows = self.db.execute(
            select(JobLookup.id).where(JobLookup.id.in_(job_ids))
        ).scalars()

        return list(rows)

    def bulk_insert(self, job_ids: list[str]) -> None:
        if not job_ids:
            return

        self.db.add_all(JobLookup(id=job_id) for job_id in job_ids)
        self.db.commit()


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
        return self.db.get(ReadingArticle, article_id)



class GmailRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_duplicate(self, id : str, account : str) -> Email | None:
        return self.db.scalar(
            select(Email).where(and_(
                Email.gmail_message_id == id,
                Email.account == account
            )))

    def add(self, email: Email) -> bool:
        existing = self.find_duplicate(email.gmail_message_id, email.account)

        if existing is not None:
            return False
        
        self.db.add(email)
        self.db.commit()
        self.db.refresh(email)

        return True

    def get(self, id: int) -> Email | None:
        return self.db.get(Email, id)

    def update(self, email: Email, updates: dict[str, object]) -> None:
        valid_fields = Email.__table__.columns.keys()

        for field, value in updates.items():
            if field not in valid_fields:
                continue

            if value is None:
                continue

            setattr(email, field, value)

        self.db.commit()
        self.db.refresh(email)




class FollowUpRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_duplicate_message(self, message_id : str, account : str) -> Email | None:
        return self.db.scalar(
            select(Email).where(and_(
                Email.gmail_message_id == message_id,
                Email.account == account
            )))

    def find_duplicate_thread(self, thread_id : str, account : str) -> Email | None:
        return self.db.scalar(
            select(Email).where(and_(
                Email.gmail_message_id == thread_id,
                Email.account == account
            )))

    def add(self, email: FollowUpEmail) -> bool:
        existing = self.find_duplicate_message(email.gmail_message_id, email.account)

        if existing is not None:
            return False
        
        self.db.add(email)
        self.db.commit()
        self.db.refresh(email)

        return True

    def get(self, id: int) -> FollowUpEmail | None:
        return self.db.get(FollowUpEmail, id)

    def update(self, email: FollowUpEmail, updates: dict[str, object]) -> None:
        valid_fields = FollowUpEmail.__table__.columns.keys()

        for field, value in updates.items():
            if field not in valid_fields:
                continue

            if value is None:
                continue

            setattr(email, field, value)

        self.db.commit()
        self.db.refresh(email)