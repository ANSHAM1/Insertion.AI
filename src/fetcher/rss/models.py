from datetime import datetime
from pydantic import BaseModel, Field, HttpUrl


class RSSFeed(BaseModel):
    name     : str

    url      : HttpUrl

    category : str

    enabled  : bool      = True

    tags     : list[str] = Field(default_factory=list)



class ReadingArticleClass(BaseModel):
    title        : str

    url          : HttpUrl

    source       : str

    published_at : datetime | None = None