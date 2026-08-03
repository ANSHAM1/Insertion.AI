import { invoke } from "@tauri-apps/api/core";


export async function generatePlanner() {
  const { days = [] } = await invoke("run_python", {
    command: "planner",
  });

  return days;
}

export async function completeTask(id, completed) {
  return await invoke("run_python", {
    command: "planner_complete",
    payload: {
      id,
      completed,
    },
  });
}

export async function saveReflection(reflection) {
  return await invoke("run_python", {
    command: "planner_reflection",
    payload: {
      reflection,
    },
  });
}

