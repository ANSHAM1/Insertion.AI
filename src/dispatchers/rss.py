from datetime import date
from typing import Any

from src.database.repository import RssRepository
from src.database.models import ReadingArticle

from .base import InsertionAIDispatch


class RssDispatch(InsertionAIDispatch):

    def _helper(self, feed: ReadingArticle) -> dict[str, Any]:

        if not feed:
            return {}

        return {
                "id"           : feed.id,
                "title"        : feed.title,
                "link"         : feed.url,
                "source"       : feed.source,
                "published_at" : feed.published_at,
                "is_read"      : feed.is_read,
        } 

    def invoke(self):

        repo = RssRepository(self.db)

        feed = repo.get_by_date(date.today())
        if feed is None:
            raise ValueError("Task not found.")

        return self._helper(feed)

    def read_status(self, id : int, status : bool) -> None:

        repo = RssRepository(self.db)

        feed = repo.get(id)
        if feed is None:
            raise ValueError("Task not found.")
        
        feed.is_read = status
        repo.commit()


def article(command: str, payload: dict[Any, Any]):
    app = RssDispatch()

    try:
        if command == "article":
            return app.invoke()

        elif command == "article_read_status":
            app.read_status(
                payload["id"],
                payload["completed"],
            )
            return None

        raise ValueError(f"Unknown planner command: {command}")

    finally:
        app.close()
