import random

from src.database.models import ReadingArticle
from src.database.repository import RssRepository

from src.fetcher.rss.rss_api import fetch_all



def generate_article(repo : RssRepository) -> None:
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