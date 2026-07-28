import random

from src.database.models import ReadingArticle
from src.database.repository import RssRepository

from src.fetcher.rss.rss_api import fetch_all

from src.config.state_manager import StateManager



def generate_daily_article(state : StateManager, repo : RssRepository) -> ReadingArticle:
        now = state.now()
        last_sync = state.RSS_STATE()

        if (last_sync and now - last_sync < state.time_delta(1)):
            return ReadingArticle()

        parsed = fetch_all()

        urls = [str(article.url) for article in parsed]

        existing_urls: set[str] = set(repo.get_existing_urls(urls))

        new_articles = [
            article
            for article in parsed
            if article.url not in existing_urls
        ]

        if new_articles:
            selected = random.choice(new_articles)

            row = ReadingArticle(
                title        = selected.title,
                url          = str(selected.url),
                source       = selected.source,
                published_at = selected.published_at
            )

            repo.add(row)

            state.RSS_SYNC(now)

            return row

        row : ReadingArticle | None = repo.get_random_article()
        if row:
            return row
        return ReadingArticle()