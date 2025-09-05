# ローカルフィードバック記録コマンド

ユーザーからのローカル専用フィードバックを `.claude/feedbacks.local.md` に記録するコマンドです。

## 使用方法

```
/feedback-local {フィードバック内容}
```

## 動作

1. 受け取ったフィードバック内容を `.claude/feedbacks.local.md` に追記
2. 日付とともに整理された形式で記録
3. ローカル環境専用の設定や個人的な設定を記録

## 例

```
/feedback-local このプロジェクトではポート3001を使用する
```

上記のコマンドを実行すると、ローカル専用のフィードバック内容が記録されます。

## 処理内容

```markdown
### YYYY-MM-DD: [タイトル]

- **内容**: {フィードバック内容}
- **適用**: {適用方法の説明}
```

の形式で `.claude/feedbacks.local.md` に追記します。

## 通常のフィードバックとの違い

- `/feedback`: 全環境共通の一般的なフィードバック → `.claude/feedbacks.md`
- `/feedback-local`: ローカル環境専用のフィードバック → `.claude/feedbacks.local.md`
