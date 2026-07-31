import { invoke } from "@tauri-apps/api/core";

export async function extractJobs() {
  const result = await invoke("run_python", {
    command: "job",
  });

  return result.items ?? [];
}

export async function refreshJobs() {
  const result = await invoke("run_python", {
    command: "job_refresh",
  });

  return result.items ?? [];
}

export async function updateJobStatus(id, status) {
  await invoke("run_python", {
    command: "job_status",
    payload: {
      id,
      status,
    },
  });
}

export async function removeJob(id) {
  await invoke("run_python", {
    command: "job_remove",
    payload: {
      id,
    },
  });
}