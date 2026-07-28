from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from src.config.settings import get_settings



DATABASE_URL = get_settings().DATABASE_URL


engine = create_engine(
    DATABASE_URL,
    future=True,
    echo=False,
)


SessionLocal : sessionmaker[Session] = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def get_session() -> Session:
    return SessionLocal()