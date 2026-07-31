use serde_json::Value;
use tokio::process::Command;

#[tauri::command]
async fn run_python(command: String, payload: Option<Value>) -> Result<Value, String> {

    let payload_json = payload.unwrap_or(Value::Null).to_string();

    let output = Command::new("uv")
        .args([
            "run",
            "python",
            "-m",
            "src._cli_",
            &command,
            &payload_json,
        ])
        .current_dir("../..")
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }

    serde_json::from_slice(&output.stdout)
        .map_err(|e| e.to_string())
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            run_python
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}