import { invoke } from "@tauri-apps/api/core";

export async function fetchJobs() {
  const result = await invoke("run_python", {
    command: "job",
  });

  return result.items ?? [];
}

export async function generateNewJobs() {
  const result = await invoke("run_python", {
    command: "new_jobs",
  });

  return result.items ?? [];
}

export async function updateJobStatusApi(id, status) {
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