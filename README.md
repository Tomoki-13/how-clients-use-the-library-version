# how-clients-use-the-library-version
## 準備

```bash
# リポジトリをクローン
git clone <repository-url>
cd how-clients-use-the-library-version
# 依存関係をインストール
npm install
```

## データセットの収集
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

## 収集したデータセットをもとにライブラリの移行遷移を収集
### src/analyze_versionディレクトリ内のindex.tsをパスを変えて実行
```bash
# ディレクトリ移動
cd src/analyze_version
# データセット収集を実行(index.ts内のデータセット部分のパスを変更してください)
# パスには、dataset/libnameの直下に出力されたデータセットのパスを設定
ts-node index.ts
```
