# Asiato Logic Specification

> ローカル完結のバージョン管理アプリ

## Core（誰が）

- user: アプリの利用者（ローカルアプリなので単一ユーザー）
- system: 自動処理（将来のオートセーブ等）

## Entity（何を）

- unmanaged-folder: バージョン管理されていないフォルダ
- managed-folder: バージョン管理中のフォルダ（.git存在）
- version: セーブされた時点（hash, datetime, message を持つ）

## Actions（どうする → 結果）

### user

- user が unmanaged-folder を select → 選択状態になる
- user が managed-folder を select → 選択状態になる, version一覧取得
- user が unmanaged-folder を init → managed-folder になる
- user が managed-folder を save（message付き）→ version作成
- user が version を restore → managed-folder がその時点に戻る, 復元version作成

### system

- （将来）system が managed-folder を autosave → version作成

## 網羅性チェック

|                    | unmanaged-folder | managed-folder | version |
|--------------------|------------------|----------------|---------|
| user               | select, init     | select, save   | restore |
| system             | -                | (autosave)     | -       |

## コードとの対応

| Action | logic/action | 実装状態 |
|--------|--------------|----------|
| select + 履歴取得 | log.ts (getHistory) | ✅ |
| init | init.ts (initRepository) | ✅ |
| save | save.ts (saveVersion) | ✅ |
| restore | restore.ts (restoreVersion) | ✅ |
| autosave | - | ⬜ 将来実装 |

## ロードマップとの対応

| ロードマップ項目 | Action | 状態 |
|------------------|--------|------|
| フォルダ選択 | select | ✅ |
| Git初期化 | init | ✅ |
| セーブ | save | ✅ |
| 履歴表示 | select (履歴取得) | ✅ |
| この時点に戻す | restore | ✅ |
| 差分表示 | （未定義） | ⬜ |
| オートセーブ | autosave | ⬜ |