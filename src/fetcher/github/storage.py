import base64
from typing import Any, List, Dict, cast

import httpx

from src.fetcher.github.client import GithubClient


class GithubStorage:

    def __init__(self) -> None:
        self.client = GithubClient()

    def close(self) -> None:
        self.client.close()

    def exists(self, path: str) -> bool:
        try:
            self.client.get(
                f"contents/{path}",
                params={
                    "ref": self.client.branch,
                },
            )
            return True

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                return False
            raise

    def download(self, path: str) -> dict[str, Any]:
        response = self.client.get(
            f"contents/{path}",
            params={
                "ref": self.client.branch,
            },
        )

        return response.json()

    def list_directory(self, path: str) -> list[dict[str, Any]]:
        response = self.client.get(
            f"contents/{path}",
            params={
                "ref": self.client.branch,
            },
        )

        data = response.json()

        if isinstance(data, list):
            return cast(List[Dict[str, Any]], data)

        return []

    def upload(self, path: str, content: str, message: str) -> None:
        encoded = base64.b64encode(content.encode("utf-8")).decode("utf-8")

        self.client.put(
            f"contents/{path}",
            {
                "message": message,
                "content": encoded,
                "branch": self.client.branch,
            },
        )

    def update(self, path: str, content: str, sha: str, message: str) -> None:
        encoded = base64.b64encode(content.encode("utf-8")).decode("utf-8")

        self.client.put(
            f"contents/{path}",
            {
                "message": message,
                "content": encoded,
                "sha": sha,
                "branch": self.client.branch,
            },
        )

    def delete(self, path: str, sha: str, message: str) -> None:

        self.client.delete(
            f"contents/{path}",
            {
                "message": message,
                "sha": sha,
                "branch": self.client.branch,
            },
        )

    def get_sha(self, path: str) -> str:

        response = self.download(path)

        return response["sha"]

    def read_text(self, path: str) -> str:

        response = self.download(path)

        return base64.b64decode(response["content"]).decode("utf-8")