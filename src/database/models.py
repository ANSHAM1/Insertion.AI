from sqlalchemy import (Index, Boolean, Date, DateTime, Enum as SqlEnum, String, ForeignKey, Text, text)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from datetime import date, datetime, timezone

from .enums import (EmailAccount, EmploymentType, JobStatus, RecruitmentType, EventType, EventSource)



class Base(DeclarativeBase):
    pass


class Job(Base):
    __tablename__ = "jobs"

    __table_args__ = (
        Index("uq_apply_url", "apply_url", unique=True, mssql_where=text("apply_url IS NOT NULL")),
        Index("idx_company_role_location", "company", "role", "location")
    )

    id                 : Mapped[int]                    = mapped_column(primary_key=True)

    company            : Mapped[str]                    = mapped_column(String(200), index=True)
    description        : Mapped[str | None]             = mapped_column(Text, nullable=True)
    role               : Mapped[str]                    = mapped_column(String(200), index=True)
    employment_type    : Mapped[EmploymentType | None]  = mapped_column(SqlEnum(EmploymentType), nullable=True)

    recruitment_type   : Mapped[RecruitmentType | None] = mapped_column(SqlEnum(RecruitmentType), nullable=True)
    
    location           : Mapped[str | None]             = mapped_column(String(150), nullable=True)
    salary             : Mapped[str | None]             = mapped_column(String(100), nullable=True)
    bond               : Mapped[int | None]             = mapped_column(nullable=True)
    apply_url          : Mapped[str | None]             = mapped_column(String(600), nullable=True)
    experience_min     : Mapped[int | None]             = mapped_column(nullable=True)

    recruiter_name     : Mapped[str | None]             = mapped_column(String(150), nullable=True)
    recruiter_email    : Mapped[str | None]             = mapped_column(String(200), nullable=True, index=True)

    applied_at         : Mapped[date | None]            = mapped_column(Date, nullable=True)
    status             : Mapped[JobStatus]              = mapped_column(SqlEnum(JobStatus), default=JobStatus.FOUND, index=True)
    status_date        : Mapped[date]                   = mapped_column(Date, default=lambda: datetime.now(timezone.utc).date())
    next_event_date    : Mapped[date | None]            = mapped_column(Date, nullable=True, index=True)

    resume_tailored    : Mapped[bool]                   = mapped_column(Boolean, default=False)
    resume_path        : Mapped[str | None]             = mapped_column(String(400), nullable=True)

    emails             : Mapped[list["Email"]]          = relationship(back_populates="job", cascade="all, delete-orphan")
    events             : Mapped[list["Event"]]          = relationship(back_populates="job", cascade="all, delete-orphan")

    created_at         : Mapped[datetime]               = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at         : Mapped[datetime]               = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), 
                                                                        onupdate=lambda: datetime.now(timezone.utc))


class Email(Base):
    __tablename__ = "emails"

    gmail_message_id : Mapped[str]              = mapped_column(String(128), primary_key=True)
    job_id           : Mapped[int | None]       = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True, index=True)

    gmail_thread_id  : Mapped[str | None]       = mapped_column(String(128), nullable=True, index=True)
    account          : Mapped[EmailAccount]     = mapped_column(SqlEnum(EmailAccount))

    detected_status  : Mapped[JobStatus | None] = mapped_column(SqlEnum(JobStatus), nullable=True, index=True)

    subject          : Mapped[str | None]       = mapped_column(String(300), nullable=True)
    sender_name      : Mapped[str | None]       = mapped_column(String(250), nullable=True)
    sender_email     : Mapped[str]              = mapped_column(String(250))
    received_at      : Mapped[datetime]         = mapped_column(DateTime(timezone=True), index=True)

    ai_processed     : Mapped[bool]             = mapped_column(Boolean, default=False)
    summary          : Mapped[str | None]       = mapped_column(String(1000), nullable=True)

    job              : Mapped["Job | None"]     = relationship(back_populates="emails")
    
    created_at       : Mapped[datetime]         = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class Event(Base):
    __tablename__ = "events"

    id            : Mapped[int]             = mapped_column(primary_key=True)
    job_id        : Mapped[int | None]      = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=True, index=True)

    title         : Mapped[str]             = mapped_column(String(250))
    description   : Mapped[str | None]      = mapped_column(String(1000), nullable=True)

    event_type    : Mapped[EventType]       = mapped_column(SqlEnum(EventType), index=True)

    start_time    : Mapped[datetime]        = mapped_column(DateTime(timezone=True))
    end_time      : Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    completed     : Mapped[bool]            = mapped_column(Boolean, default=False, index=True)

    source        : Mapped[EventSource]     = mapped_column(SqlEnum(EventSource))

    job           : Mapped["Job | None"]    = relationship(back_populates="events")

    created_at    : Mapped[datetime]        = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at    : Mapped[datetime]        = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class DailySchedule(Base):
    __tablename__ = "daily_schedules"

    schedule_date   : Mapped[date]                 = mapped_column(Date, default=lambda: date.today(), primary_key=True)

    user_reflection : Mapped[str | None]           = mapped_column(String(1000), nullable=True)

    items           : Mapped[list["ScheduleItem"]] = relationship(back_populates="schedule", cascade="all, delete-orphan")

    generated_at    : Mapped[datetime]             = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ScheduleItem(Base):
    __tablename__ = "schedule_items"

    id              : Mapped[int]             = mapped_column(primary_key=True)
    schedule_date   : Mapped[Date]            = mapped_column(ForeignKey("daily_schedules.schedule_date", ondelete="CASCADE"), index=True)

    title           : Mapped[str]             = mapped_column(String(150))

    start_time      : Mapped[datetime]        = mapped_column(DateTime(timezone=True))
    end_time        : Mapped[datetime]        = mapped_column(DateTime(timezone=True))

    sort_order      : Mapped[int]             = mapped_column()
    completed       : Mapped[bool]            = mapped_column(Boolean, default=False)

    note            : Mapped[str | None]      = mapped_column(String(500), nullable=True)

    schedule        : Mapped["DailySchedule"] = relationship(back_populates="items")



class ReadingArticle(Base):
    __tablename__ = "reading_articles"

    id           : Mapped[int]             = mapped_column(primary_key=True, autoincrement=True)

    title        : Mapped[str]             = mapped_column(String(500), nullable=False)

    url          : Mapped[str]             = mapped_column(String(1000), unique=True, nullable=False)

    source       : Mapped[str]             = mapped_column(String(100), nullable=False)

    published_at : Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    is_read      : Mapped[bool]            = mapped_column(default=False)

    created_at   : Mapped[datetime]        = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))








# from src.database.connection import engine
# Base.metadata.create_all(engine)
# print("Database initialized successfully!")