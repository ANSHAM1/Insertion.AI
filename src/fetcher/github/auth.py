from dataclasses import dataclass

from src.config.settings import get_settings


@dataclass(slots=True, frozen=True)
class GithubAuth:
    token: str

    @property
    def headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        }


def get_github_auth() -> GithubAuth:
    settings = get_settings()

    if not settings.GITHUB_TOKEN:
        raise RuntimeError("GITHUB_TOKEN is not configured.")

    return GithubAuth(
        token=settings.GITHUB_TOKEN,
    )