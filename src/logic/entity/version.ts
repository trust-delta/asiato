// 履歴エントリの型
export interface HistoryEntry {
  hash: string;
  datetime: string;
  message: string;
}

// 履歴文字列をパース（形式: "hash|datetime|message"）
export const parseHistoryEntry = (line: string): HistoryEntry | null => {
  const parts = line.split("|");
  if (parts.length < 3) return null;
  return {
    hash: parts[0],
    datetime: parts[1],
    message: parts.slice(2).join("|"), // メッセージに"|"が含まれる場合に対応
  };
};