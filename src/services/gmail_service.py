from src.fetcher.gmail.gmail_api import GmailAPI
from src.fetcher.gmail.models import ParsedEmail
from src.fetcher.gmail.parser import parse_email

from typing import Any



def get_new_message_ids(history: dict[str, Any]) -> tuple[set[str], str]:
    message_ids: set[str] = set()

    for record in history.get("history", []):
        for added in record.get("messagesAdded", []):
            message_ids.add(added["message"]["id"])

    latest_history_id = history["historyId"]

    return message_ids, latest_history_id



def get_latest_history_id(messages: list[dict[str, Any]]) -> str:
    if not messages:
        return ""

    return str(
        max(
            int(message["historyId"])
            for message in messages
        )
    )



def get_ids_from(messages: list[dict[str, Any]]) -> list[str]:
    return [message["id"] for message in messages]



def fetch_emails(account : str, history_id : str) -> tuple[list[ParsedEmail], list[str], str]:

    gmail_api = GmailAPI(account)

    if history_id == "":

        query = ("newer_than:5d " "-category:promotions " "-category:social " "-in:spam " "-in:trash")

        messages = gmail_api.get_messages(query)

        latest_history_id = get_latest_history_id(messages)

        new_ids = get_ids_from(messages)

    else:
        
        history = gmail_api.get_mailbox_history(history_id)

        new_ids, latest_history_id = get_new_message_ids(history)

        messages : list[dict[str, Any]] = []

        for message_id in new_ids:
            messages.append(gmail_api.get_message(message_id))


    emails : list[ParsedEmail] = []

    for message in messages:
        emails.append(parse_email(message, account))

    return emails, list(new_ids), latest_history_id