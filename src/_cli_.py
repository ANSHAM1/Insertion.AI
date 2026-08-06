from typing import Any

from src.dispatcher import planner, job, article, evaluator, generator
from src.dashboard import dashboard

from src.dispatchers.run_code_dispatch import code_runner

import sys, json

if __name__ == "__main__":

    command = sys.argv[1]

    payload: dict[Any, Any] = (
        json.loads(sys.argv[2])
        if len(sys.argv) > 2
        else {}
    )

    commands : dict[str, Any] = {
        "planner"            : planner,
        "planner_complete"   : planner,
        "planner_reflection" : planner,

        "article"             : article,
        "planner_read_status" : article,

        "job"        : job,
        "job_status" : job,
        "job_remove" : job,
        "new_jobs"   : job,

        "refresh_questions" : generator,
        "generator"         : generator,

        "code_runner" : code_runner,
        "evaluator"   : evaluator,

        "dashboard" : dashboard
    }

    if command not in commands:
        raise ValueError(f"Unknown command: {command}")

    result = commands[command](command, payload)

    print(json.dumps(result, default=str))