from config.config import get_settings


def get_github_headers() -> dict[str, str]:
    settings = get_settings()

    if not settings.GITHUB_TOKEN:
        raise RuntimeError("GITHUB_TOKEN is not configured.")

    return {
        "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }