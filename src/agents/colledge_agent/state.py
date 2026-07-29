from typing import TypedDict
from datetime import date
from langchain_core.prompt_values import PromptValue

from src.config.state_manager import StateManager

from src.fetcher.gmail.models import ParsedEmail
from src.database.repository import EventRepository, GmailRepository, FollowUpRepository




class PlannerState(TypedDict):
    curr_date      : date
    account        : str

    app_state      : StateManager

    retries_left   : int
    already_synced : bool

    emails         : list[ParsedEmail] 

    gmail_repo     : GmailRepository
    event_repo     : EventRepository
    follow_up_repo : FollowUpRepository

    prompt         : PromptValue
    raw_response   : str