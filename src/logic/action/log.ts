import { invoke } from "@tauri-apps/api/core";
import { HistoryEntry, parseHistoryEntry } from "../entity/version";

export async function getHistory(path: string): Promise<HistoryEntry[]> {
  const log = await invoke<string>("git_log", { path });
  return log
    .split("\n")
    .filter(Boolean)
    .map(parseHistoryEntry)
    .filter((e): e is HistoryEntry => e !== null);
}