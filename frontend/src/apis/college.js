import { invoke } from "@tauri-apps/api/core";


export async function extractCollegeDrives() {
  const result = await invoke("run_python", {
    command: "college",
  });

  return result.items;
}


export async function updateCollegeDriveStatus(driveRefId, status) {
  return invoke("run_python", {
    command: "college_status",
    payload: {
      drive_ref_id: driveRefId,
      status,
    },
  });
}

export async function removeCollegeDrive(driveRefId) {
  return invoke("run_python", {
    command: "college_remove",
    payload: {
      drive_ref_id: driveRefId,
    },
  });
}