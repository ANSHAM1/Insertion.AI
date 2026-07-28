import feedparser  # type: ignore[import-untyped]
from typing import Any
from datetime import datetime

from .feeds import RSS_FEEDS
from .models import RSSFeed, ReadingArticleClass



def parse_article(feed: RSSFeed, entry: dict[str, Any]) -> ReadingArticleClass:
    published: datetime = datetime.min

    if getattr(entry, "published_parsed", None):
        published = datetime(*entry.published_parsed[:6])  # type: ignore

    return ReadingArticleClass(
        title        = entry.get("title", ""),
        url          = entry.get("link", ""),
        source       = feed.name,
        published_at = published
    )


def fetch(feed: RSSFeed) -> list[ReadingArticleClass]:
    parsed = feedparser.parse(str(feed.url))  # type: ignore

    if getattr(parsed, "bozo", False):  # type: ignore
        return []

    result: list[ReadingArticleClass] = []

    for entry in getattr(parsed, "entries", []):  # type: ignore
        try:
            article = parse_article(feed, entry)
        except Exception:
            continue
        result.append(article)

    return result


def fetch_all() -> list[ReadingArticleClass]:
    result: list[ReadingArticleClass] = []

    for feed in RSS_FEEDS:
        result.extend(fetch(feed))

    return result