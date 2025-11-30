use std::process::Command;

// Git リポジトリを初期化
#[tauri::command]
fn git_init(path: &str) -> Result<String, String> {
    Command::new("git")
        .args(["init"])
        .current_dir(path)
        .output()
        .map_err(|e| e.to_string())
        .and_then(|output| {
            if output.status.success() {
                Ok(String::from_utf8_lossy(&output.stdout).to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        })
}

// ファイルをステージング
#[tauri::command]
fn git_add(path: &str) -> Result<String, String> {
    Command::new("git")
        .args(["add", "."])
        .current_dir(path)
        .output()
        .map_err(|e| e.to_string())
        .and_then(|output| {
            if output.status.success() {
                Ok("staged".to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        })
}

// コミット（セーブ）
#[tauri::command]
fn git_commit(path: &str, message: &str) -> Result<String, String> {
    Command::new("git")
        .args(["commit", "-m", message])
        .current_dir(path)
        .output()
        .map_err(|e| e.to_string())
        .and_then(|output| {
            if output.status.success() {
                Ok(String::from_utf8_lossy(&output.stdout).to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        })
}

// 履歴を取得
#[tauri::command]
fn git_log(path: &str) -> Result<String, String> {
    Command::new("git")
        .args(["log", "--oneline", "-20"])
        .current_dir(path)
        .output()
        .map_err(|e| e.to_string())
        .and_then(|output| {
            if output.status.success() {
                Ok(String::from_utf8_lossy(&output.stdout).to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            git_init, git_add, git_commit, git_log
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
