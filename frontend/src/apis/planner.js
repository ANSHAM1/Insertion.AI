import { invoke } from "@tauri-apps/api/core";

export async function generatePlanner() {
  const result = await invoke("run_python", {
    command: "planner",
  });

  return result.items.map((item) => ({
    id: item.sort_order,
    title: item.title,
    time: `${item.start_time} - ${item.end_time}`,
    startTime: item.start_time,
    endTime: item.end_time,
    completed: item.completed,
    note: item.note,
  }));
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
