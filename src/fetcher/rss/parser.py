from __future__ import annotations

from datetime import datetime
from typing import Any

from .models import ParsedArticle, RSSFeed


def parse_article(feed: RSSFeed, entry: dict[str, Any]) -> ParsedArticle:
    published = None

    if getattr(entry, "published_parsed", None):
        published = datetime(*entry.published_parsed[:6]) # type: ignore

    return ParsedArticle(
        feed_name    = feed.name,
        title        = entry.get("title", ""),
        url          = entry.get("link", ""),
        guid         = entry.get("id", entry.get("link", "")),
        author       = entry.get("author"),
        published_at = published,
        summary      = entry.get("summary", ""),
        content      = entry.get("content", [{}])[0].get("value", ""),
        categories   = [tag.term for tag in entry.get("tags", [])],
        tags         = feed.tags
    )