from pydantic import BaseModel
from datetime import datetime



class AttachmentInfo(BaseModel):
    attachment_id : str
    filename      : str
    mime_type     : str
    size          : int


class ParsedEmail(BaseModel):
    gmail_message_id : str
    gmail_thread_id  : str

    account          : str

    subject          : str

    sender_name      : str
    sender_email     : str

    recipient        : str

    received_at      : datetime

    snippet          : str
    body             : str

    attachments      : list[AttachmentInfo]