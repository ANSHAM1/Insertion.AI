from datetime import datetime, timezone, timedelta
import json

from src.config.settings import get_settings


class StateManager:
    def __init__(self) -> None:
        self.SYNC_PATH = get_settings().SYNC_DATA_PATH

    @staticmethod
    def now() -> datetime:
        return datetime.now(timezone.utc)

    @staticmethod
    def time_delta(h : int) -> timedelta:
        return timedelta(hours=h)


    def RSS_STATE(self) -> datetime:
        with open(self.SYNC_PATH, "r", encoding="utf-8") as f:
            state = json.load(f)

        return state["rss"]["last_sync"]

    def RSS_SYNC(self, now : datetime = now()) -> None:
        with open(self.SYNC_PATH, "r", encoding="utf-8") as f:
            state = json.load(f)

        state["rss"]["last_sync"] = now


    def JOB_STATE(self) -> datetime:
        with open(self.SYNC_PATH, "r", encoding="utf-8") as f:
            state = json.load(f)

        return state["job"]["adzuna_last_sync"]

    def JOB_SYNC(self, now : datetime = now()) -> None:
        with open(self.SYNC_PATH, "r", encoding="utf-8") as f:
            state = json.load(f)

        state["job"]["adzuna_last_sync"] = now