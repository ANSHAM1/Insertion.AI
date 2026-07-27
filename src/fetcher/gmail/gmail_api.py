from googleapiclient.discovery import build  # type: ignore[import]

from typing import Any

from .auth import get_credentials


class GmailAPI:
    """
    Thin wrapper around the Gmail API.
    """

    def __init__(self, account: str):
        self.account = account
        self.service: Any = build("gmail", "v1", credentials=get_credentials(account))


    def search_messages(self, query: str, max_results: int = 100) -> list[str]:
        """
        Search Gmail using Gmail search syntax.

        Example:
            newer_than:1d
            is:unread
            from:linkedin.com
            category:primary
        """

        response = (self.service.users().messages().list(userId="me", q=query, maxResults=max_results).execute())

        messages = response.get("messages", [])

        return [m["id"] for m in messages]


    def get_message(self, message_id: str, format: str = "full") -> dict[str, Any]:
        """
        Retrieve a Gmail message.

        format:
            minimal
            metadata
            full
            raw
        """

        return (
            self.service.users().messages().get(userId="me", id=message_id, format=format).execute()
        )
    

    def get_messages(self, query: str, max_results: int = 100) -> list[dict[str, Any]]:
        """
        Search and download all matching emails.
        """

        ids = self.search_messages(query=query, max_results=max_results)

        return [self.get_message(message_id) for message_id in ids]