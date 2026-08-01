from sqlalchemy import (Boolean, Date, DateTime, Enum as SqlEnum, String, ForeignKey, Text, Time, JSON, FLOAT, Integer)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

from datetime import date, datetime, timezone, time

from .enums import (EmploymentType, JobStatus, RecruitmentType, CodingStatus, CodingDifficulty)



class Base(DeclarativeBase):
    pass


class Job(Base):
    __tablename__ = "jobs"

    id                 : Mapped[str]                    = mapped_column(String(128), primary_key=True)

    company            : Mapped[str]                    = mapped_column(String(200), index=True)
    description        : Mapped[str | None]             = mapped_column(Text, nullable=True)
    role               : Mapped[str]                    = mapped_column(String(200), index=True)
    employment_type    : Mapped[EmploymentType | None]  = mapped_column(SqlEnum(EmploymentType), nullable=True)
    recruitment_type   : Mapped[RecruitmentType | None] = mapped_column(SqlEnum(RecruitmentType), nullable=True)
    
    location           : Mapped[str | None]             = mapped_column(String(150), nullable=True)
    salary_min         : Mapped[str | None]             = mapped_column(String(100), nullable=True)
    salary_max         : Mapped[str | None]             = mapped_column(String(100), nullable=True)
    apply_url          : Mapped[str | None]             = mapped_column(String(600), nullable=True)
    experience_min     : Mapped[int | None]             = mapped_column(nullable=True)

    posted_at          : Mapped[date | None]            = mapped_column(Date, nullable=True)
    applied_at         : Mapped[date | None]            = mapped_column(Date, nullable=True)
    status             : Mapped[JobStatus]              = mapped_column(SqlEnum(JobStatus), default=JobStatus.FOUND, index=True)
    status_date        : Mapped[date]                   = mapped_column(Date, default=lambda: datetime.now(timezone.utc).date())

    required_skills    : Mapped[list[str]]              = mapped_column(JSON, default=list, nullable=False)
    missing_skills     : Mapped[list[str]]              = mapped_column(JSON, default=list, nullable=False)

    matched_resume     : Mapped[str]                    = mapped_column(String(100), index=True)
    matched_percentage : Mapped[float]                  = mapped_column(FLOAT, nullable=False) 

    created_at         : Mapped[datetime]               = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at         : Mapped[datetime]               = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), 
                                                                        onupdate=lambda: datetime.now(timezone.utc))



class JobLookup(Base):
    __tablename__ = "job_lookups"

    id         : Mapped[str]      = mapped_column(String(200), primary_key=True)
    created_at : Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))



class CollegeDrive(Base):
    __tablename__ = "college_drives"

    drive_ref_id     : Mapped[str]                    = mapped_column(String(128), primary_key=True)

    company          : Mapped[str]                    = mapped_column(String(200), index=True)
    role             : Mapped[str]                    = mapped_column(String(200))
    description      : Mapped[str | None]             = mapped_column(Text)
    employment_type  : Mapped[EmploymentType | None]  = mapped_column(SqlEnum(EmploymentType), nullable=True)
    recruitment_type : Mapped[RecruitmentType | None] = mapped_column(SqlEnum(RecruitmentType), nullable=True)
    
    location         : Mapped[str | None]             = mapped_column(String(150), nullable=True)
    salary           : Mapped[str | None]             = mapped_column(String(100), nullable=True)
    bond             : Mapped[int | None]             = mapped_column(nullable=True)
    apply_url        : Mapped[str | None]             = mapped_column(String(600), nullable=True)

    status           : Mapped[JobStatus]              = mapped_column(SqlEnum(JobStatus), default=JobStatus.FOUND, index=True)

    drive_date       : Mapped[date | None]            = mapped_column(Date, nullable=True)
    report_time      : Mapped[time | None]            = mapped_column(Time, nullable=True)
    venue            : Mapped[str | None]             = mapped_column(String(100), nullable=True)

    skills           : Mapped[list[str]]              = mapped_column(JSON, default=list, nullable=False)

    created_at       : Mapped[datetime]               = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at       : Mapped[datetime]               = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), 
                                                                        onupdate=lambda: datetime.now(timezone.utc))



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

    start_time      : Mapped[time]            = mapped_column(Time)
    end_time        : Mapped[time]            = mapped_column(Time)

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



class CodingQuestion(Base):
    __tablename__ = "coding_questions"

    id               : Mapped[int]              = mapped_column(primary_key=True, autoincrement=True)

    question_id      : Mapped[str]              = mapped_column(String(32))
    batch_id         : Mapped[str]              = mapped_column(String(32), index=True)
    title            : Mapped[str]              = mapped_column(String(300), nullable=False)

    difficulty       : Mapped[CodingDifficulty] = mapped_column(SqlEnum(CodingDifficulty), nullable=False)
    status           : Mapped[CodingStatus]     = mapped_column(SqlEnum(CodingStatus), default=CodingStatus.ACTIVE, index=True)
    language         : Mapped[str | None]       = mapped_column(String(20), nullable=True)
    score            : Mapped[int | None]       = mapped_column(Integer, nullable=True)

    time_limit       : Mapped[int]              = mapped_column(Integer, nullable=False)   # minutes
    time_taken       : Mapped[int | None]       = mapped_column(Integer, nullable=True)    # minutes

    generated_date   : Mapped[date]             = mapped_column(Date, index=True)

    started_at       : Mapped[datetime | None]  = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at     : Mapped[datetime | None]  = mapped_column(DateTime(timezone=True), nullable=True)

    github_path      : Mapped[str]              = mapped_column(String(500), nullable=False) # solution path in github repo

    created_at       : Mapped[datetime]         = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    updated_at       : Mapped[datetime]         = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), 
                                                                onupdate=lambda: datetime.now(timezone.utc))




# from src.database.connection import engine
# Base.metadata.create_all(engine)
# print("Database initialized successfully!")