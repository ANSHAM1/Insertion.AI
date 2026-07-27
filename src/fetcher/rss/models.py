from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl



class RSSFeed(BaseModel):
    """
    Configuration for an RSS feed.
    """
    name     : str

    url      : HttpUrl

    category : str

    enabled  : bool      = True

    tags     : list[str] = Field(default_factory=list)



class ParsedArticle(BaseModel):
    """
    Normalized article returned by every RSS feed.
    """
    feed_name    : str

    title        : str

    url          : HttpUrl

    guid         : str

    author       : str | None      = None

    published_at : datetime | None = None

    summary      : str = ""

    content      : str = ""

    categories   : list[str]       = Field(default_factory=list)

    tags         : list[str]       = Field(default_factory=list)