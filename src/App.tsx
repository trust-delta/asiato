import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import "./App.css";

// 履歴エントリの型
interface HistoryEntry {
  hash: string;
  datetime: string;
  message: string;
}

// 履歴文字列をパース（形式: "hash|datetime|message"）
const parseHistoryEntry = (line: string): HistoryEntry | null => {
  const parts = line.split("|");
  if (parts.length < 3) return null;
  return {
    hash: parts[0],
    datetime: parts[1],
    message: parts.slice(2).join("|"), // メッセージに"|"が含まれる場合に対応
  };
};

function App() {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState("セーブポイント");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
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
        const entries = log
          .split("\n")
          .filter(Boolean)
          .map(parseHistoryEntry)
          .filter((e): e is HistoryEntry => e !== null);
        setHistory(entries);
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
      const entries = log
        .split("\n")
        .filter(Boolean)
        .map(parseHistoryEntry)
        .filter((e): e is HistoryEntry => e !== null);
      setHistory(entries);
    } catch (e) {
      setStatus(`エラー: ${e}`);
    }
  };

  // この時点に戻す（restore）
  const restoreToCommit = async (entry: HistoryEntry) => {
    if (!selectedPath) return;

    // 確認ダイアログ
    const confirmed = window.confirm(
      `「${entry.message}」の時点に戻しますか？\n\n現在の変更は失われます。`
    );
    if (!confirmed) return;

    try {
      // 指定コミットの状態にファイルを復元
      await invoke("git_restore", { path: selectedPath, commitHash: entry.hash });

      // 復元したことを記録するためにコミット
      await invoke("git_add", { path: selectedPath });
      await invoke("git_commit", {
        path: selectedPath,
        message: `「${entry.message}」の時点に戻しました`,
      });

      setStatus(`✓ 「${entry.message}」の時点に戻しました`);
      const log = await invoke<string>("git_log", { path: selectedPath });
      const entries = log
        .split("\n")
        .filter(Boolean)
        .map(parseHistoryEntry)
        .filter((e): e is HistoryEntry => e !== null);
      setHistory(entries);
    } catch (e) {
      setStatus(`エラー: ${e}`);
    }
  };

  return (
    <main className="container">
      <h1>📁 Asiato</h1>

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
              <li key={i}>
                <div className="history-entry">
                  <span className="history-datetime">{entry.datetime}</span>
                  <span className="history-message">{entry.message}</span>
                </div>
                <button
                  className="restore-btn"
                  onClick={() => restoreToCommit(entry)}
                >
                  この時点に戻す
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {status && <p className="status">{status}</p>}
    </main>
  );
}

export default App;