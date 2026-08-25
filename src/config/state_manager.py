from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo
import json
from typing import Any

from config.config import get_settings


class StateManager:
    def __init__(self) -> None:
        self.SYNC_PATH = get_settings().SYNC_DATA_PATH

        self.TIMEZONE = ZoneInfo(get_settings().ZONE_INFO)

    # -----------------------------------------------------------------------------------

    @staticmethod
    def now() -> datetime:
        return datetime.now(timezone.utc)

    def local_now(self) -> datetime:
        return self.now().astimezone(self.TIMEZONE)

    @staticmethod
    def time_delta(hours: int) -> timedelta:
        return timedelta(hours=hours)

    # -----------------------------------------------------------------------------------

    def _load_state(self) -> dict[str, Any]:
        with open(self.SYNC_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    def _save_state(self, state: dict[str, Any]) -> None:
        with open(self.SYNC_PATH, "w", encoding="utf-8") as f:
            json.dump(state, f, indent=4)

    # -----------------------------------------------------------------------------------

    def _get_datetime(self, *keys: str) -> datetime | None:
        value: Any = self._load_state()

        for key in keys:
            value = value[key]

        if value is None:
            return None

        return datetime.fromisoformat(value)

    def _set_datetime(self, now: datetime, *keys: str) -> None:
        state = self._load_state()

        current: Any = state
        for key in keys[:-1]:
            current = current[key]

        current[keys[-1]] = now.isoformat()

        self._save_state(state)

    # -----------------------------------------------------------------------------------

    def RSS_STATE(self) -> datetime | None:
        return self._get_datetime("rss", "last_sync")

    def RSS_SYNC(self, now: datetime) -> None:
        self._set_datetime(now, "rss", "last_sync")



    def JOB_STATE(self) -> datetime | None:
        return self._get_datetime("job", "last_sync")

    def JOB_SYNC(self, now: datetime) -> None:
        self._set_datetime(now, "job", "last_sync")



    def PLANNER_STATE(self) -> datetime | None:
        return self._get_datetime("planner", "last_sync")

    def PLANNER_SYNC(self, now: datetime) -> None:
        self._set_datetime(now, "planner", "last_sync")



    def CODE_STATE(self) -> datetime | None:
        return self._get_datetime("code", "last_sync")

    def CODE_SYNC(self, now: datetime) -> None:
        self._set_datetime(now, "code", "last_sync")