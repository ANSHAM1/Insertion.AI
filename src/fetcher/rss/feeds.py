from src.fetcher.rss.models import RSSFeed

RSS_FEEDS: list[RSSFeed] = [

    # ------------------------------------------------------------------
    # AI
    # ------------------------------------------------------------------

    RSSFeed(
        name="OpenAI",
        url="https://openai.com/news/rss.xml",  # type: ignore
        category="AI",
        tags=["llm", "gpt", "research"],
    ),

    RSSFeed(
        name="Anthropic",
        url="https://www.anthropic.com/news/rss.xml",  # type: ignore
        category="AI",
        tags=["claude", "llm"],
    ),

    RSSFeed(
        name="Hugging Face",
        url="https://huggingface.co/blog/feed.xml",  # type: ignore
        category="AI",
        tags=["transformers", "ml"],
    ),

    RSSFeed(
        name="Mistral AI",
        url="https://mistral.ai/news/rss.xml",  # type: ignore
        category="AI",
        tags=["llm"],
    ),

    # ------------------------------------------------------------------
    # Python
    # ------------------------------------------------------------------

    RSSFeed(
        name="Real Python",
        url="https://realpython.com/atom.xml",  # type: ignore
        category="Python",
        tags=["python"],
    ),

    RSSFeed(
        name="Python Insider",
        url="https://feeds.feedburner.com/PythonInsider",  # type: ignore
        category="Python",
        tags=["cpython"],
    ),

    # ------------------------------------------------------------------
    # C++
    # ------------------------------------------------------------------

    RSSFeed(
        name="CppStories",
        url="https://www.cppstories.com/index.xml",  # type: ignore
        category="C++",
        tags=["cpp"],
    ),

    RSSFeed(
        name="Microsoft C++ Team",
        url="https://devblogs.microsoft.com/cppblog/feed/",  # type: ignore
        category="C++",
        tags=["cpp", "msvc"],
    ),

    # ------------------------------------------------------------------
    # Backend
    # ------------------------------------------------------------------

    RSSFeed(
        name="InfoQ Architecture",
        url="https://feed.infoq.com/architecture-design",  # type: ignore
        category="Backend",
        tags=["backend", "architecture"],
    ),

    RSSFeed(
        name="Martin Fowler",
        url="https://martinfowler.com/feed.atom",  # type: ignore
        category="Backend",
        tags=["architecture"],
    ),

    # ------------------------------------------------------------------
    # DevOps
    # ------------------------------------------------------------------

    RSSFeed(
        name="Docker",
        url="https://www.docker.com/blog/feed/",  # type: ignore
        category="DevOps",
        tags=["docker"],
    ),

    RSSFeed(
        name="Kubernetes",
        url="https://kubernetes.io/feed.xml",  # type: ignore
        category="DevOps",
        tags=["kubernetes"],
    ),

    # ------------------------------------------------------------------
    # Cyber Security
    # ------------------------------------------------------------------

    RSSFeed(
        name="The Hacker News",
        url="https://feeds.feedburner.com/TheHackersNews",  # type: ignore
        category="Cyber Security",
        tags=["security"],
    ),

    RSSFeed(
        name="Google Security",
        url="https://security.googleblog.com/atom.xml",  # type: ignore
        category="Cyber Security",
        tags=["security"],
    ),
]