from typing import Any

from src.dispatcher import planner, college, job, article
import sys, json

if __name__ == "__main__":

    command = sys.argv[1]

    payload: dict[Any, Any] = (
        json.loads(sys.argv[2])
        if len(sys.argv) > 2
        else {}
    )

    commands : dict[str, Any] = {
        "planner": planner,
        "planner_complete": planner,
        "planner_reflection": planner,

        "article": article,
        "planner_read_status": article,

        "college": college,
        "college_status": college,
        "college_remove": college,

        "job" : job,
        "job_status" : job,
        "job_remove" : job,
        "job_refresh" : job
    }

    if command not in commands:
        raise ValueError(f"Unknown command: {command}")

    result = commands[command](command, payload)

    print(json.dumps(result, default=str))