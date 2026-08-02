from typing import Any

import httpx

from src.config.settings import get_settings
from src.fetcher.github.auth import get_github_headers

class GithubClient:

    BASE_URL = "https://api.github.com"

    def __init__(self) -> None:
        settings = get_settings()
        auth = get_github_headers()

        self.owner = settings.GITHUB_OWNER
        self.repo = settings.GITHUB_REPO
        self.branch = settings.GITHUB_BRANCH

        self.client = httpx.Client(
            base_url=self.BASE_URL,
            headers=auth,
            timeout=30,
        )

    def close(self) -> None:
        self.client.close()

    def _url(self, path: str) -> str:
        return f"/repos/{self.owner}/{self.repo}/{path}"


    def get(self, path: str, **kwargs: Any) -> httpx.Response:
        response = self.client.get(
            self._url(path),
            **kwargs,
        )
        response.raise_for_status()
        return response

    def put(self, path: str, json: dict[str, Any]) -> httpx.Response:
        response = self.client.put(
            self._url(path),
            json=json,
        )

        response.raise_for_status()
        return response

    def recursive_tree(self) -> list[dict[str, Any]]:
        response = self.get(
            f"git/trees/{self.branch}",
            params={
                "recursive": "1",
            },
        )

        return response.json()["tree"]