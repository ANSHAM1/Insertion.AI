from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from config.config import get_settings



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