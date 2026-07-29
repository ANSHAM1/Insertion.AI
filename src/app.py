from datetime import date

from src.agents.college_agent.workflow import college_graph

from src.config.settings import get_settings
from src.config.state_manager import StateManager

from src.database.connection import SessionLocal
from src.database.repository import (
    GmailRepository,
    EventRepository,
    JobCollegeRepository,
)


db = SessionLocal()
settings = get_settings()

app_state = StateManager()



latest_hist_id = app_state.GMAIL_STATE("college")


state : object = {
    "curr_date"       : date.today(),

    "app_state"       : app_state,

    "latest_hist_id"  : latest_hist_id,

    "emails"          : [],
    "output"          : None,

    "gmail_repo"      : GmailRepository(db),
    "event_repo"      : EventRepository(db),
    "job_colleg_repo" : JobCollegeRepository(db),

    "prompt"          : ""
}


for step in college_graph.stream(state):  # type: ignore
    print("=" * 60)
    print(step)

