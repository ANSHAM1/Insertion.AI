from __future__ import annotations

import feedparser  # type: ignore[import-untyped]

from .models import RSSFeed



class RSSAPI:
    """
    Thin wrapper around RSS feeds.

    Responsibilities:
        - Download RSS feed
        - Parse XML
        - Return raw entries
    """

    def fetch(self, feed: RSSFeed) -> list[dict[str, str]]:
        """
        Download a single RSS feed.

        Returns:
            Raw RSS entries.
        """

        parsed = feedparser.parse(str(feed.url)) # type: ignore

        if parsed.bozo: # type: ignore
            # Invalid XML / network error
            return []

        return parsed.entries # type: ignore


    def fetch_all(self, feeds: list[RSSFeed]) -> dict[str, list[dict[str, str]]]:
        """
        Download multiple feeds.

        Returns:
            {
                "OpenAI": [...],
                "Anthropic": [...]
            }
        """

        result: dict[str, list[dict[str, str]]] = {}

        for feed in feeds:
            result[feed.name] = self.fetch(feed)

        return result