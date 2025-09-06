# Materials Search API

## 📁 フォルダ構造

```
/api/materials/
├── search/          # 統合検索API（メインエンドポイント）
│   └── route.ts
├── DBsearch/        # データベース検索専用API
│   └── route.ts     # 有機ポリマーDB、Materials Project API
├── GPTsearch/       # OpenAI Deep Research専用API
│   └── route.ts     # GPT-4による最新研究調査
└── README.md
```

## 🔍 各APIの役割

### 1. `/api/materials/search` (統合検索)

**メインエンドポイント** - DBとGPTの両方を使用して最適な素材を提案

```typescript
POST /api/materials/search
{
  "currentMaterials": {
    "composition": "PET(12μm)/Al-PET(12μm)/CPP(30μm)",
    "properties": ["高バリア性", "遮光性"]
  },
  "requirements": [
    {
      "name": "引張強度",
      "value": "100",
      "unit": "N/15mm",
      "importance": "high"
    }
  ]
}
```

**処理フロー:**

1. 有機ポリマーDBから検索
2. OpenAI Deep Researchで最新情報取得
3. 結果を統合して返却

### 2. `/api/materials/DBsearch` (データベース検索)

**データベース専用** - 高速な素材データベース検索

```typescript
POST / api / materials / DBsearch;
// 同じリクエスト形式
```

**データソース:**

- 有機ポリマーデータベース（8種類の包装材料）
- Materials Project API（オプション）
- PubChem API（将来実装）

### 3. `/api/materials/GPTsearch` (AI研究調査)

**GPT-4専用** - 最新の研究論文と実用化事例を調査

```typescript
POST /api/materials/GPTsearch
{
  "currentMaterials": {...},
  "requirements": [...],
  "searchQuery": "カスタム検索クエリ（オプション）"
}
```

**特徴:**

- 最新の研究トレンドを分析
- 実用化事例を収集
- 材料メーカー情報を提供

## 🚀 使用例

### 統合検索（推奨）

```javascript
const response = await fetch('/api/materials/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentMaterials: {
      composition: "PET/Al/PE",
      properties: ["高バリア性"]
    },
    requirements: [...]
  })
});
```

### DB検索のみ（高速）

```javascript
const response = await fetch("/api/materials/DBsearch", {
  method: "POST",
  // 同じボディ
});
```

### GPT検索のみ（詳細調査）

```javascript
const response = await fetch("/api/materials/GPTsearch", {
  method: "POST",
  body: JSON.stringify({
    // ... 通常のパラメータ
    searchQuery: "2024年の最新バイオプラスチック開発状況",
  }),
});
```

## 🔑 環境変数

```bash
# .env.local
MATERIALDB="your-materials-project-api-key"    # Materials Project API
OPENAI_API_KEY="your-openai-api-key"           # OpenAI GPT-4
```

## 📊 レスポンス形式

```typescript
{
  "success": true,
  "materials": [
    {
      "name": "ポリ乳酸",
      "composition": "PLA (C3H4O2)n",
      "properties": {
        "tensileStrength": 65,
        "elongation": 150,
        // ...
      },
      "sustainabilityScore": 85,
      "matchScore": 88,
      "advantages": ["生分解性", "バイオマス由来"],
      "considerations": ["耐熱性が低い"],
      "deepResearchInsights": "AI推奨: PLA"  // GPT検索時のみ
    }
  ],
  "metadata": {
    "dataSource": "Organic Polymer Database + OpenAI Deep Research",
    "totalResults": 3,
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## 🎯 使い分けガイド

| ユースケース   | 推奨API      | 理由                         |
| -------------- | ------------ | ---------------------------- |
| 通常の素材検索 | `/search`    | DBとAIの両方の知見を活用     |
| 高速検索       | `/DBsearch`  | データベースのみで高速応答   |
| 最新研究調査   | `/GPTsearch` | 最新の論文や実用化事例を調査 |
| コスト重視     | `/DBsearch`  | OpenAI APIコストを節約       |
| 精度重視       | `/search`    | 複数ソースから最適解を導出   |
