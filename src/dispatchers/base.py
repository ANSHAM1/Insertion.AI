from abc import ABC, abstractmethod
from typing import Any

from config.config import get_settings
from src.config.state_manager import StateManager

from src.database.connection import SessionLocal


class InsertionAIDispatch(ABC):

    def __init__(self):
        self.db = SessionLocal()
        self.settings = get_settings()
        self.app_state = StateManager()

    @abstractmethod
    def invoke(self) -> dict[str, Any]:
        pass

    def close(self):
        self.db.close()
