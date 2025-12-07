import { invoke } from "@tauri-apps/api/core";
import { HistoryEntry } from "../entity/version";
import { getHistory } from "./log";

export async function saveVersion(
  path: string,
  message: string
): Promise<HistoryEntry[]> {
  await invoke("git_add", { path });
  await invoke("git_commit", { path, message });
  return getHistory(path);
}