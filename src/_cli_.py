from typing import Any

from src.dispatcher import planner, planner_complete, planner_reflection
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
        "planner_complete": planner_complete,
        "planner_reflection" : planner_reflection
    }

    if command not in commands:
        raise ValueError(f"Unknown command: {command}")

    result = commands[command](payload)

    print(json.dumps(result, default=str))