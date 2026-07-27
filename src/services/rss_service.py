from __future__ import annotations

import random

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database.models import ReadingArticle

from src.fetcher.rss.feeds import RSS_FEEDS
from src.fetcher.rss.models import ParsedArticle
from src.fetcher.rss.parser import parse_article
from src.fetcher.rss.rss_api import RSSAPI



class RSSService:

    def __init__(self, db: Session):
        self.db = db
        self.api = RSSAPI()

    def generate_daily_article(self) -> ReadingArticle | None:
        candidates: list[ParsedArticle] = []

        for feed in RSS_FEEDS:
            if not feed.enabled:
                continue

            entries = self.api.fetch(feed)

            for entry in entries:
                article = parse_article(feed, entry)

                exists = self.db.scalar(
                    select(ReadingArticle).where(
                        ReadingArticle.url == str(article.url)
                    )
                )

                if exists:
                    continue

                candidates.append(article)

        if not candidates:
            return None

        selected = random.choice(candidates)

        row = ReadingArticle(
            title=selected.title,
            url=str(selected.url),
            source=selected.feed_name,
            published_at=selected.published_at,
        )

        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)

        return row