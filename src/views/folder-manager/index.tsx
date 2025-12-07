import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { HistoryEntry } from "../../logic/entity/version";
import { initRepository } from "../../logic/action/init";
import { getHistory } from "../../logic/action/log";
import { saveVersion } from "../../logic/action/save";
import { restoreVersion } from "../../logic/action/restore";

import "./styles.css";

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
        const log = await getHistory(path);
        setHistory(log);
      } catch {
        setHistory([]);
      }
    }
  };

  // Git初期化
  const initRepo = async () => {
    if (!selectedPath) return;
    try {
      await initRepository(selectedPath)
      setStatus("✓ バージョン管理を開始しました");
    } catch (e) {
      setStatus(`エラー: ${e}`);
    }
  };

  // セーブ（add + commit）
  const save = async () => {
    if (!selectedPath) return;
    try {
      await saveVersion(selectedPath, commitMessage);
      setStatus(`✓ セーブしました: ${commitMessage}`);
      const log = await getHistory(selectedPath);
      setHistory(log);
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
      await restoreVersion(selectedPath, entry);
      setStatus(`✓ 「${entry.message}」の時点に戻しました`);
      const log = await getHistory(selectedPath);
      setHistory(log);
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