from sqlalchemy import and_, select
from sqlalchemy.orm import Session, selectinload
from datetime import datetime, time, timedelta, date
from typing import Any
from collections.abc import Iterable

from src.database.models import Job, JobLookup, ReadingArticle, Email, FollowUpEmail, Event, DailySchedule, ScheduleItem, CollegeDrive



class Repository:

    def __init__(self, db: Session) -> None:
        self.db = db

    def add(self, obj: Any) -> None:
        self.db.add(obj)

    def add_all(self, objs: list[Any]) -> None:
        self.db.add_all(objs)

    def commit(self) -> None:
        self.db.commit()

    def rollback(self) -> None:
        self.db.rollback()

    def flush(self) -> None:
        self.db.flush()

    def refresh(self, obj: Any) -> None:
        self.db.refresh(obj)

    def delete(self, obj: Any) -> None:
        self.db.delete(obj)

    def delete_all(self, objs: list[Any]) -> None:
        for obj in objs:
            self.db.delete(obj)



class JobRepository(Repository):

    def get(self, job_id: int) -> Job | None:
        return self.db.get(Job, job_id)

    def exists(self, job_id: str) -> bool:
        return self.db.scalar(
            select(JobLookup).where(JobLookup.id == job_id)
        ) is not None

    def bulk_exists(self, job_ids: list[str]) -> list[str]:
        if not job_ids:
            return []

        return list(
            self.db.scalars(
                select(JobLookup.id).where(JobLookup.id.in_(job_ids))
            ).all()
        )

    def bulk_insert(self, job_ids: list[str]) -> None:
        if not job_ids:
            return

        self.add_all([
            JobLookup(id=job_id)
            for job_id in job_ids
        ])

    def update(self, job: Job, updates: dict[str, Any]) -> None:
        valid_fields = set(Job.__table__.columns.keys())

        for field, value in updates.items():
            if field in valid_fields and value is not None:
                setattr(job, field, value)

        self.commit()
        self.refresh(job)



class CollegeDriveRepository(Repository):

    def find_duplicate(self, drive_id : str) -> CollegeDrive | None:
        return self.db.scalar(
            select(CollegeDrive).where(CollegeDrive.drive_ref_id == drive_id))

    def get(self, drive_id: str) -> CollegeDrive | None:
        return self.db.get(CollegeDrive, drive_id)

    def get_all(self) -> list[CollegeDrive]:
        return list(self.db.scalars(select(CollegeDrive)).all())

    def add_if_not_exists(self, drive: CollegeDrive) -> bool:
        if self.find_duplicate(drive.drive_ref_id):
            return False

        self.add(drive)
        return True



class RssRepository(Repository):

    BATCH_SIZE = 1000

    @staticmethod
    def _chunks(lst: list[str], size: int) -> Iterable[list[str]]:
        for i in range(0, len(lst), size):
            yield lst[i:i + size]

    def get(self, article_id: int) -> ReadingArticle | None:
        return self.db.get(ReadingArticle, article_id)

    def find_duplicate(self, url: str) -> ReadingArticle | None:
        return self.db.scalar(
            select(ReadingArticle).where(
                ReadingArticle.url == url
            ))

    def get_existing_urls(self, urls: list[str]) -> set[str]:
        if not urls:
            return set()

        existing: set[str] = set()

        for batch in self._chunks(urls, self.BATCH_SIZE):
            existing.update(
                self.db.scalars(
                    select(ReadingArticle.url).where(
                        ReadingArticle.url.in_(batch)
                    )).all()
                )

        return existing

    def add_if_not_exists(self, article: ReadingArticle) -> bool:
        if self.find_duplicate(article.url):
            return False

        self.add(article)
        return True



class GmailRepository(Repository):

    def get(self, id: int) -> Email | None:
        return self.db.get(Email, id)

    def find_duplicate(self, gmail_message_id: str, account: str) -> Email | None:
        return self.db.scalar(
            select(Email).where(
                and_(
                    Email.gmail_message_id == gmail_message_id,
                    Email.account == account,
                )))

    def add_if_not_exists(self, email: Email) -> bool:
        if self.find_duplicate(email.gmail_message_id, email.account):
            return False

        self.add(email)
        return True

    def filter_new_emails(self, message_ids: list[str]) -> list[str]:
        if not message_ids:
            return []

        existing = set(
            self.db.scalars(
                select(Email.gmail_message_id).where(
                    Email.gmail_message_id.in_(message_ids)
                )).all()
            )

        return [message_id for message_id in message_ids if message_id not in existing]



class FollowUpRepository(Repository):

    def get(self, id: int) -> FollowUpEmail | None:
        return self.db.get(FollowUpEmail, id)

    def find_duplicate_message(self, gmail_message_id: str, account: str) -> FollowUpEmail | None:
        return self.db.scalar(
            select(FollowUpEmail).where(
                and_(
                    FollowUpEmail.gmail_message_id == gmail_message_id,
                    FollowUpEmail.account == account,
                )))

    def find_duplicate_thread(self, thread_id: str, account: str) -> FollowUpEmail | None:
        return self.db.scalar(
            select(FollowUpEmail).where(
                and_(
                    FollowUpEmail.gmail_thread_id == thread_id,
                    FollowUpEmail.account == account,
                )))

    def add_if_not_exists(self, email: FollowUpEmail) -> bool:
        if self.find_duplicate_message(email.gmail_message_id, email.account):
            return False

        self.add(email)
        return True

    def filter_new_emails(self, message_ids: list[str]) -> list[str]:
        if not message_ids:
            return []

        existing = set(
            self.db.scalars(
                select(FollowUpEmail.gmail_message_id).where(
                    FollowUpEmail.gmail_message_id.in_(message_ids)
                )).all()
            )

        return [message_id for message_id in message_ids if message_id not in existing]



class EventRepository(Repository):

    def get(self, id: int) -> Event | None:
        return self.db.get(Event, id)

    def get_events(self, date: date) -> list[Event]:
        day_start = datetime.combine(date, time.min)
        day_end = day_start + timedelta(days=1)

        return list(
            self.db.scalars(
                select(Event).where(
                    Event.completed == False,
                    Event.start_time < day_end,
                    Event.end_time >= day_start,
                )).all()
            )

    def update(self, event: Event, updates: dict[str, Any]) -> None:
        valid_fields = set(Event.__table__.columns.keys())

        for field, value in updates.items():
            if field in valid_fields and value is not None:
                setattr(event, field, value)

        self.commit()
        self.refresh(event)



class DailyScheduleRepository(Repository):

    def get(self, date: date) -> DailySchedule | None:
        return self.db.get(DailySchedule, date)

    def get_schedule(self, date: date) -> DailySchedule | None:
        return self.db.scalar(
            select(DailySchedule).options(selectinload(DailySchedule.items)).where(DailySchedule.schedule_date == date))

    def find_duplicate(self, date: date) -> DailySchedule | None:
        return self.db.scalar(
            select(DailySchedule).where(
                DailySchedule.schedule_date == date
            ))

    def add_if_not_exists(self, schedule: DailySchedule) -> bool:
        if self.find_duplicate(schedule.schedule_date):
            return False

        self.add(schedule)
        return True

    def update_user_reflection(self, schedule: DailySchedule, reflection: str) -> None:
        schedule.user_reflection = reflection

    def update_item(self, schedule_item: ScheduleItem, updates: dict[str, Any]) -> None:
        valid_fields = set(ScheduleItem.__table__.columns.keys())

        for field, value in updates.items():
            if field in valid_fields and value is not None:
                setattr(schedule_item, field, value)

        self.commit()
        self.refresh(schedule_item)