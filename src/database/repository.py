from sqlalchemy import and_, select
from sqlalchemy.orm import Session, selectinload
from datetime import datetime, time, timedelta, date
from typing import Any
from collections.abc import Iterable

from src.database.models import Job, JobLookup, ReadingArticle, Email, FollowUpEmail, Event, DailySchedule, ScheduleItem, JobCollege
from src.database.enums import RecruitmentType


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
        valid_fields = set(Job.__table__.columns.keys()) 

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



class JobCollegeRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_duplicate(self, company: str, role: str, recruitment_type: RecruitmentType | None) -> JobCollege | None:

        return self.db.scalar(
            select(JobCollege).where(
                and_(
                    JobCollege.company == company,
                    JobCollege.role == role,
                    JobCollege.recruitment_type == recruitment_type,
                )
            )
        )

    def add(self, job: JobCollege) -> bool:

        existing = self.find_duplicate(
            job.company,
            job.role,
            job.recruitment_type,
        )

        if existing is not None:
            return False

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return True

    def get(self, id: int) -> JobCollege | None:
        return self.db.get(JobCollege, id)

    def get_all(self) -> list[JobCollege]:
        return list(
            self.db.scalars(select(JobCollege)).all()
        )



class RssRepository:

    BATCH_SIZE = 1000
    
    def __init__(self, db: Session):
        self.db = db

    @staticmethod
    def _chunks(lst: list[str], size: int) -> Iterable[list[str]]:
        for i in range(0, len(lst), size):
            yield lst[i:i + size]

    def find_duplicate(self, url: str) -> ReadingArticle | None:
        return self.db.scalar(
            select(ReadingArticle).where(ReadingArticle.url == url)
        )

    def get_existing_urls(self, urls: list[str]) -> set[str]:
        if not urls:
            return set()

        existing: set[str] = set()

        for batch in self._chunks(urls, self.BATCH_SIZE):
            existing.update(
                self.db.scalars(
                    select(ReadingArticle.url).where(
                        ReadingArticle.url.in_(batch)
                    )
                ).all()
            )

        return existing

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

    def filter_new_emails(self, message_ids: list[str]) -> list[str]:
        new_message_ids: list[str] = []

        for message_id in message_ids:

            exists = self.db.scalar(
                select(Email).where(
                    Email.gmail_message_id == message_id
                )
            )

            if exists is None:
                new_message_ids.append(message_id)

        return new_message_ids


class FollowUpRepository:

    def __init__(self, db: Session):
        self.db = db

    def find_duplicate_message(self, message_id : str, account : str) -> FollowUpEmail | None:
        return self.db.scalar(
            select(FollowUpEmail).where(and_(
                FollowUpEmail.gmail_message_id == message_id,
                FollowUpEmail.account == account
            )))

    def find_duplicate_thread(self, thread_id : str, account : str) -> FollowUpEmail | None:
        return self.db.scalar(
            select(FollowUpEmail).where(and_(
                FollowUpEmail.gmail_message_id == thread_id,
                FollowUpEmail.account == account
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

    def filter_new_emails(self, message_ids: list[str]) -> list[str]:
        new_message_ids: list[str] = []

        for message_id in message_ids:
            exists = self.db.scalar(
                select(FollowUpEmail).where(
                    FollowUpEmail.gmail_message_id == message_id
                    )
                )

            if exists is None:
                new_message_ids.append(message_id)

        return new_message_ids

class EventRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_events(self, date: date) -> list[Event] | None:
        day_start = datetime.combine(date, time.min)
        day_end = day_start + timedelta(days=1)

        results = self.db.scalars(
            select(Event).where(
                Event.completed == False,
                Event.start_time < day_end,
                Event.end_time >= day_start,
            )
        ).all()

        return list(results) if results else None

    def find_duplicate(self, id : int) -> Event | None:
        return self.db.scalar(
            select(Event).where(Event.id == id)
            )

    def add(self, event : Event) -> bool:
        existing = self.find_duplicate(event.id)

        if existing is not None:
            return False
        
        self.db.add(event)
        self.db.commit()
        self.db.refresh(event)

        return True

    def get(self, id: int) -> Event | None:
        return self.db.get(Event, id)

    def update(self, event : Event, updates: dict[str, object]) -> None:
        valid_fields = set(Event.__table__.columns.keys())

        for field, value in updates.items():
            if field not in valid_fields:
                continue

            if value is None:
                continue

            setattr(event, field, value)

        self.db.commit()
        self.db.refresh(event)


class DailyScheduleRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_schedule(self, date: date) -> DailySchedule | None:
        return self.db.scalar(
            select(DailySchedule)
            .options(selectinload(DailySchedule.items))
            .where(DailySchedule.schedule_date == date)
        )

    def find_duplicate(self, date : date) -> DailySchedule | None:
        return self.db.scalar(
            select(DailySchedule).where(DailySchedule.schedule_date == date)
            )

    def add(self, schedule: DailySchedule) -> bool:
        existing = self.find_duplicate(schedule.schedule_date)

        if existing:
            return False

        self.db.add(schedule)
        self.db.commit()
        self.db.refresh(schedule)

        return True

    def get(self, date : date) -> DailySchedule | None:
        return self.db.get(DailySchedule, date)

    def update_user_reflection(self, schedule : DailySchedule, update : str) -> None:
        setattr(schedule, "user_reflection", update)

    def update_item(self, scheduleitem : ScheduleItem, updates: dict[str, Any]) -> None:
        valid_fields = set(ScheduleItem.__table__.columns.keys())

        for field, value in updates.items():
            if field not in valid_fields:
                continue

            if value is None:
                continue

            setattr(scheduleitem, field, value)

        self.db.commit()
        self.db.refresh(scheduleitem)