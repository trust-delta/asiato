import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";

function App() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState("セーブポイント");
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("");

  // フォルダを選択
  const selectFolder = async () => {
    const path = await open({
      directory: true,
      multiple: false,
      title: "バージョン管理するフォルダを選択",
    });
    if (path) {
      setSelectedPath(path as string);
      setStatus("フォルダを選択しました");
      try {
        const log = await invoke<string>("git_log", { path });
        setHistory(log.split("\n").filter(Boolean));
      } catch {
        setHistory([]);
      }
    }
  };

  // Git初期化
  const initRepo = async () => {
    if (!selectedPath) return;
    try {
      await invoke("git_init", { path: selectedPath });
      setStatus("✓ バージョン管理を開始しました");
    } catch (e) {
      setStatus(`エラー: ${e}`);
    }
  };

  // セーブ（add + commit）
  const save = async () => {
    if (!selectedPath) return;
    try {
      await invoke("git_add", { path: selectedPath });
      await invoke("git_commit", { path: selectedPath, message: commitMessage });
      setStatus(`✓ セーブしました: ${commitMessage}`);
      const log = await invoke<string>("git_log", { path: selectedPath });
      setHistory(log.split("\n").filter(Boolean));
    } catch (e) {
      setStatus(`エラー: ${e}`);
    }
  };

  return (
    <main className="container">
      <h1>📁 ファイルの足跡</h1>

      <section>
        <button onClick={selectFolder}>フォルダを選択</button>
        {selectedPath && (
          <p className="path">選択中: {selectedPath}</p>
        )}
      </section>

      {selectedPath && history.length === 0 && (
        <section>
          <p>このフォルダはまだバージョン管理されていません</p>
          <button onClick={initRepo}>バージョン管理を開始</button>
        </section>
      )}

      {selectedPath && (
        <section>
          <h2>💾 セーブする</h2>
          <input
            type="text"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="メモを残す（例: 第1章完成）"
          />
          <button onClick={save}>セーブ</button>
        </section>
      )}

      {history.length > 0 && (
        <section>
          <h2>📜 履歴</h2>
          <ul className="history">
            {history.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </section>
      )}

      {status && <p className="status">{status}</p>}
    </main>
  );
}

export default App;