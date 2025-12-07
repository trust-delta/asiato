import { invoke } from "@tauri-apps/api/core";

export async function initRepository(path: string): Promise<void> {
  await invoke("git_init", { path });
}