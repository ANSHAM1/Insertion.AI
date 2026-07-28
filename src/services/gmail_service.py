from src.database.repository import GmailRepository
from src.database.models import Email

from src.fetcher.gmail.gmail_api import GmailAPI
from src.fetcher.gmail.models import ParsedEmail

from src.config.state_manager import StateManager
from datetime import datetime



class GmailService:

    def __init__(self, repository: GmailRepository, account : str) -> None:
        self.gmail = GmailAPI(account)
        self.repo = repository
        self.state = StateManager()
        self.account = account

    def fetch_emails(self) -> list[ParsedEmail]:
        now = self.state.now()
        last_sync = self.state.JOB_STATE()

        if (last_sync and now - last_sync < self.state.time_delta(1)):
            return []

        custom : str = "newer_than:5d"
        
        query  : str = (
            f"{custom} "
            "-category:promotions "
            "-category:social "
            "-in:spam "
            "-in:trash"
        )

        if last_sync == None:
            custom = "newer_than:10d"
        else:
            if now - last_sync > self.state.time_delta(5 * 24):
                custom = "newer_than:5d"
            else:
                custom = f"after:{int(last_sync.timestamp())}"


        emails: list[ParsedEmail] = []

        messages = self.gmail.get_messages(query)
        for message in messages:


            raw_received = message.get("received_at", None)
            if isinstance(raw_received, datetime):
                received_at_val = raw_received
            else:
                try:
                    if isinstance(raw_received, (int, float)):
                        received_at_val = datetime.fromtimestamp(int(raw_received))
                    elif isinstance(raw_received, str) and raw_received:
                        received_at_val = datetime.fromisoformat(raw_received)
                    else:
                        received_at_val = now
                except Exception:
                    received_at_val = now

            emails.append(
                ParsedEmail(
                    gmail_message_id = message.get("gmail_message_id", "") or "",
                    gmail_thread_id  = message.get("gmail_thread_id", "") or "",
                    account          = message.get("account", self.account) or self.account,
                    subject          = message.get("subject", "") or "",
                    sender_name      = message.get("sender_name", "") or "",
                    sender_email     = message.get("sender_email", "") or "",
                    recipient        = message.get("recipient", "") or "",
                    received_at      = received_at_val,
                    snippet          = message.get("snippet", "") or "",
                    body             = message.get("body", "") or "",
                    attachments      = message.get("attachments", []) or [],
                )
            )

        self.state.MAIL_SYNC(self.account, now)

        return emails

    def store_emails(self, emails: list[Email]) -> None:
        for email in emails:
            self.repo.add(email)