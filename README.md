# 📁 Asiato

**あなたのファイルは、あなたの端末だけに。**

Asiato は、非エンジニアでも使えるローカル完結のバージョン管理アプリです。
Git の強力なバージョン管理機能を、専門知識なしで使えるシンプルな UI で提供します。

## 🎯 こんな人に

- 「レポート_最終版_修正_本当の最終.docx」問題に困っている大学生
- 卒論・論文を安全に管理したい研究者
- 原稿のバージョン管理をしたいライター
- クラウドに上げたくない機密文書を扱う人

## ✨ 特徴

- **プライバシー完全保護** - クラウドに上げない、漏洩リスクゼロ
- **アカウント不要** - 個人情報不要、即使える
- **オフライン動作** - ネット環境不要、どこでも使える
- **Git ベース** - プロ仕様の堅牢なバージョン管理（でも Git を意識させない）

## 🖥️ スクリーンショット

（準備中）

## 🚀 使い方

1. フォルダを選択
2. 「バージョン管理を開始」をクリック
3. 作業したら「セーブ」ボタンを押す
4. 履歴からいつでも過去の状態に戻せる

| ユーザー向け | 裏側の Git 操作 |
|-------------|----------------|
| セーブする | commit |
| 履歴を見る | log |
| この時点に戻す | checkout / revert |
| メモを残す | commit message |

## 🛠️ 技術スタック

- **フロントエンド**: React + TypeScript
- **バックエンド**: Tauri 2.0 (Rust)
- **バージョン管理**: Git（コマンド呼び出し）

## 📦 開発環境セットアップ

### 前提条件

- Node.js 18+
- pnpm
- Rust
- Git
- Linux / macOS / Windows（WSL推奨）

### Ubuntu / WSL の場合

```bash
# システム依存パッケージ
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev

# Rust（未インストールの場合）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 起動

```bash
git clone https://github.com/trust-delta/asiato.git
cd asiato
pnpm install
pnpm tauri dev
```

## 📋 ロードマップ

- [x] フォルダ選択
- [x] Git 初期化
- [x] セーブ（commit）
- [x] 履歴表示
- [ ] この時点に戻す（checkout）
- [ ] 差分表示
- [ ] セーブ日時の表示改善
- [ ] オートセーブ機能（ON/OFF、間隔設定可能）
- [ ] 簡易エディタ内蔵（テキスト / .md 対応）
- [ ] 外部アプリ連携（.docx は Word で開く等）
- [ ] UI / UX 改善

## 📄 ライセンス

MIT

## 🙏 謝辞

- [Tauri](https://tauri.app/) - 軽量なクロスプラットフォームアプリフレームワーク
- [isomorphic-git](https://isomorphic-git.org/) - 技術調査時に参考にしました