from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow # type: ignore

from pathlib import Path

from src.config.settings import get_settings


settings = get_settings()


SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


def get_client_secret_path(account: str) -> Path:
    return settings.GMAIL_SECRETS_DIR / account / "client_secret.json"

def get_token_path(account: str) -> Path:
    return settings.GMAIL_SECRETS_DIR / account / "token.json"



def get_credentials(account: str) -> Credentials:
    """
    Authenticate a Gmail account.

    Parameters
    ----------
    account : str
        Folder name inside the secrets directory.

        Example:
            "college"
            "personal_main"
            "personal_alt"

    Folder structure
    ----------------
    secrets/
        college/
            client_secret.json
            token.json

        personal_main/
            client_secret.json
            token.json
    """

    client_secret_path = get_client_secret_path(account)
    token_path = get_token_path(account)

    if not client_secret_path.exists():
        raise FileNotFoundError(f"Client secret not found: {client_secret_path}")

    # Ensure the directory exists
    token_path.parent.mkdir(parents=True, exist_ok=True)

    creds: Credentials | None = None

    # Load saved credentials
    if token_path.exists():
        creds = Credentials.from_authorized_user_file(filename=str(token_path), scopes=SCOPES)  # type: ignore

    # Refresh expired credentials
    if (creds and creds.expired and creds.refresh_token): # type: ignore
        creds.refresh(Request())                          # type: ignore

    # First-time authentication
    if not creds or not creds.valid:
        flow = InstalledAppFlow.from_client_secrets_file(str(client_secret_path), SCOPES) # type: ignore

        creds = flow.run_local_server(port=0) # type: ignore

        token_path.write_text(creds.to_json(), encoding="utf-8") # type: ignore

    return creds # type: ignore