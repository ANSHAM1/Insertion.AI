from email.utils import parseaddr, parsedate_to_datetime
from .models import AttachmentInfo, ParsedEmail

import base64
from typing import Any
import re



def get_headers(message: dict[str, Any]) -> dict[str, str]:
    headers = (message.get("payload", {}).get("headers", []))

    return {
        header["name"]: header["value"]
        for header in headers
    }

def get_header(message: dict[str, Any], name: str, default: str = "") -> str:
    return get_headers(message).get(name, default)



def _decode(data: str) -> str:
    if not data:
        return ""

    data += "=" * (-len(data) % 4)

    return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")



def _extract_plain_text(payload: dict[str, Any]) -> str:
    mime_type = payload.get("mimeType")

    if mime_type == "text/plain":
        body = payload.get("body", {})
        return _decode(body.get("data", ""))

    for part in payload.get("parts", []):
        text = _extract_plain_text(part)
        if text:
            return text

    return ""



def clean_email_body(body: str) -> str:
    # remove huge email lists
    body = re.sub(
        r'([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\s*,\s*){10,}',
        "[Recipient list removed]",
        body,
        flags=re.IGNORECASE,
    )

    # remove quoted replies
    body = re.split(
        r"\nOn .*? wrote:",
        body,
        maxsplit=1,
    )[0]

    return body.strip()



def get_body(message: dict[str, Any]) -> str:
    payload = message.get("payload", {})

    return _extract_plain_text(payload)



# ---------------------------------------------------------------------



def _extract_attachments(payload: dict[str, Any]) -> list[AttachmentInfo]:
    attachments: list[AttachmentInfo] = []

    def walk(part: dict[str, Any]) -> None:
        filename = part.get("filename", "")

        body = part.get("body", {})
        attachment_id = body.get("attachmentId")

        if filename and attachment_id:
            attachments.append(
                AttachmentInfo(
                    attachment_id=attachment_id,
                    filename=filename,
                    mime_type=part.get("mimeType", ""),
                    size=body.get("size", 0),
                )
            )

        for child in part.get("parts", []):
            walk(child)

    walk(payload)

    return attachments



# ---------------------------------------------------------------------



def get_message_id(message: dict[str, Any]) -> str:
    return message["id"]


def get_thread_id(message: dict[str, Any]) -> str:
    return message["threadId"]


def get_snippet(message: dict[str, Any]) -> str:
    return message.get("snippet", "")


def get_internal_date(message: dict[str, Any]) -> int:
    """
    Returns Unix timestamp in milliseconds.
    """

    return int(message["internalDate"])


def get_attachments(message: dict[str, Any]) -> list[AttachmentInfo]:
    """
    Return attachment metadata for a Gmail message.
    """

    payload = message.get("payload", {})

    return _extract_attachments(payload)



# ---------------------------------------------------------------------



def parse_email(message: dict[str, Any], account: str) -> ParsedEmail:
    sender = get_header(message, "From")

    sender_name, sender_email = parseaddr(sender)

    date_str = get_header(message, "Date")

    try:
        received_at = parsedate_to_datetime(date_str)
    except Exception:
        received_at = datetime.utcnow() # type: ignore

    return ParsedEmail(
        gmail_message_id = get_message_id(message),
        gmail_thread_id  = get_thread_id(message),
        account          = account,
        subject          = get_header(message, "Subject"),
        sender_name      = sender_name,
        sender_email     = sender_email,
        received_at      = received_at, # type: ignore
        snippet          = get_snippet(message),
        body             = clean_email_body(get_body(message)),
        attachments      = get_attachments(message),
    )