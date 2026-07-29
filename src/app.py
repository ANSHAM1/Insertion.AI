from datetime import date
import json

from src.graphs.scheduler.workflow import planner_graph

from src.database.connection import SessionLocal
from src.database.repository import DailyScheduleRepository, EventRepository, RssRepository

from src.config.state_manager import StateManager

from src.config.settings import get_settings

db = SessionLocal()
settings = get_settings()



state : object = {
    "date"           : date.today(),

    "app_state"      : StateManager(),

    "retries_left"   : 2,
    "already_synced" : False,

    "schedule_repo"  : DailyScheduleRepository(db),
    "event_repo"     : EventRepository(db),
    "rss_repo"       : RssRepository(db),

    "prev_schedule"  : None,
    "curr_schedule"  : None,

    "events"         : [],

    "template"       : json.loads(settings.SCHEDULE_PATH.read_text()),

    "prompt"         : "",
    "raw_response"   : ""
}

# result = planner_graph.invoke(state) # type: ignore

for step in planner_graph.stream(state): # type: ignore
    print("=" * 60)
    print(step)