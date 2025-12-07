import { invoke } from "@tauri-apps/api/core";
import { HistoryEntry } from "../entity/version";
import { saveVersion } from "./save";
import { getHistory } from "./log";

export async function restoreVersion(
  path: string,
  entry: HistoryEntry
): Promise<HistoryEntry[]> {
  // 指定コミットの状態にファイルを復元
  await invoke("git_restore", { path, commitHash: entry.hash });
  
  // 復元したことを記録
  return saveVersion(path, `「${entry.message}」の時点に戻しました`);
}