# how-clients-use-the-library-version
## 説明
ライブラリ開発者が 自分のライブラリのどのバージョンを各クライアントが利用しているか を把握できるツールです。

-----

## 準備
```bash
# リポジトリをクローン
git clone <repository-url>
cd how-clients-use-the-library-version
# 依存関係をインストール
npm install
```
-----

## データの収集
### src/colllect_datesetディレクトリ内のindex.tsを実行
```bash
# .env ファイルを作成
cp .env.example .env
```
次に、`.env`ファイルを開いて，`your_github_token_here`の箇所にあなたのトークンを記載
```bash
# ディレクトリ移動
cd src/colllect_dateset
# データセット収集を実行 
# index.ts内のlibraryToSearchにライブラリ名を設定
# 同じく，numberOfReposに収集するクライアント数を設定
ts-node index.ts
```
dataset/libnameのディレクトリの直下にデータセットが出力されます

-----

## 収集したデータセットをもとにライブラリのバージョン変更履歴を収集
### src/analyze_versionディレクトリ内のindex.tsをパスを変えて実行
```bash
# ディレクトリ移動
cd src/analyze_version
# データセット収集を実行(index.ts内のデータセット部分のパスを変更してください)
# パスには、dataset/libnameの直下に出力されたデータセットのパスを設定
ts-node index.ts
```

-----

## プロジェクトのディレクトリ構成

```
src/
├── analyze_version              // バージョン変更履歴の分析モジュール
│   ├── __tests__                // テストファイル群
│   ├── coreModule               // バージョン分析の中核ロジック
│   ├── gitOperation             // Git操作関連のモジュール (クローン、コミットチェックアウトなど)
│   ├── index.ts                 // バージョン分析処理のメインエントリポイント
│   ├── types                    // 型定義ファイル
│   └── utils                    // 共通ユーティリティ関数
└── colllect_dateset             // クライアントリポジトリのデータ収集モジュール
    ├── index.ts                 // データ収集処理のメインエントリポイント
    ├── module                   // 収集ロジック
    └── types                    // 型定義ファイル
```

-----

## 技術スタック

  * **言語関係**: TypeScript / Node.js
  * **コア依存関係**: `axios` (HTTP通信), `dotenv` (環境変数)
  * **テスト**: `jest`, `ts-jest`。
-----
