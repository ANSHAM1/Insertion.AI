import { invoke } from "@tauri-apps/api/core";


export async function extractDashboard() {
  const result = await invoke("run_python", {
    command: "dashboard",
  });

  return result;
}
