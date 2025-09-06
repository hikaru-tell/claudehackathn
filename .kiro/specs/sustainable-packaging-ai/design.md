# サステナ素材置換AI for 包装 - 技術設計

## アーキテクチャ概要

Convexリアルタイムデータベースを中核とした4層アーキテクチャを採用。フロントエンドからConvexを経由してデータアクセスし、外部APIと連携して総合的な提案を生成。

```
[ユーザー]
    ↓
[フロントエンド (Next.js + Chart.js)]
    ↓ Convex Client
[Convex Database (リアルタイム同期)]
    ↓ Convex Functions
[バックエンドAPI (Next.js API Routes)]
    ↓ 並列API呼び出し
[Gemini API / OpenAI API] + [Web Search API]
```

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS (スタイリング)
  - Chart.js (レーダーチャート描画)
  - React Hook Form (フォーム管理)
  - Convex React Client (リアルタイム同期)
- **バックエンド**:
  - Convex Functions (サーバーレス関数)
  - Next.js API Routes (外部API連携)
  - TypeScript
  - Zod (バリデーション)
- **データベース**: Convex (リアルタイムNoSQL)
- **AI/LLM**: Google Gemini API (primary) / OpenAI API (fallback)
- **Web検索**: Bing Search API / Google Custom Search API
- **デプロイ**: Vercel (フロントエンド) + Convex (バックエンド)
- **開発ツール**:
  - ESLint + Prettier
  - Git/GitHub
  - Convex CLI

## コンポーネント設計

### ProductScenarioSelector

- **責務**: 製品シナリオの選択UI提供
- **インターフェース**:
  - Props: `onScenarioSelect: (scenario: Scenario) => void`
  - State: `selectedScenario: string`
- **依存関係**: シナリオデータ定義

### MaterialForm

- **責務**: 現在の素材情報と要件の表示・編集
- **インターフェース**:
  - Props: `scenario: Scenario, onSubmit: (data: FormData) => void`
  - State: フォームデータ
- **依存関係**: React Hook Form

### AIProposalGenerator

- **責務**: AI提案の生成トリガーと結果表示
- **インターフェース**:
  - Props: `formData: FormData`
  - State: `loading: boolean, proposals: Proposal[]`
- **依存関係**: Convex Functions, API Routes, LoadingSpinner

### MaterialDatabase

- **責務**: Convexデータベースからの素材情報管理
- **インターフェース**:
  - Props: `requirements: string[]`
  - State: `materials: Material[], loading: boolean`
- **依存関係**: Convex React Client, useQuery hook

### ComparisonChart

- **責務**: レーダーチャートの描画
- **インターフェース**:
  - Props: `currentMaterial: MaterialData, proposals: Proposal[]`
- **依存関係**: Chart.js

### ScoreDisplay

- **責務**: 置換可能性スコアの表示
- **インターフェース**:
  - Props: `score: number, reasoning: string`
- **依存関係**: なし

## データモデル

```typescript
// Convexスキーマ定義 (schema.ts)
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // サステナブル素材データベース
  materials: defineTable({
    name: v.string(),
    composition: v.string(),
    properties: v.array(v.string()),
    scores: v.object({
      physical: v.number(),
      environmental: v.number(),
      cost: v.number(),
      safety: v.number(),
      supply: v.number(),
    }),
    description: v.string(),
    certifications: v.array(v.string()),
    manufacturer: v.optional(v.string()),
    updatedAt: v.number(),
  }),

  // 製品シナリオ
  scenarios: defineTable({
    name: v.string(),
    currentMaterial: v.object({
      composition: v.string(),
      properties: v.array(v.string()),
    }),
    requirements: v.object({
      performance: v.array(v.string()),
      sustainability: v.array(v.string()),
    }),
  }),

  // 提案履歴
  proposals: defineTable({
    scenarioId: v.id("scenarios"),
    materials: v.array(
      v.object({
        materialId: v.optional(v.id("materials")),
        name: v.string(),
        composition: v.string(),
        scores: v.object({
          physical: v.number(),
          environmental: v.number(),
          cost: v.number(),
          safety: v.number(),
          supply: v.number(),
        }),
        totalScore: v.number(),
        reasoning: v.string(),
        source: v.string(), // "database" | "web" | "ai"
      }),
    ),
    createdAt: v.number(),
  }),
});

// TypeScriptインターフェース
interface Material {
  _id: string;
  name: string;
  composition: string;
  properties: string[];
  scores: {
    physical: number;
    environmental: number;
    cost: number;
    safety: number;
    supply: number;
  };
  description: string;
  certifications: string[];
  manufacturer?: string;
}

interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
}

interface AIProposal {
  id: string;
  materialName: string;
  composition: string;
  scores: ScoreSet;
  totalScore: number;
  reasoning: string;
  dataSources: {
    database: Material[];
    webResults: WebSearchResult[];
  };
}
```

## API 設計

### Convex Functions

#### `materials.search` (素材検索)

```typescript
// convex/materials.ts
export const search = query({
  args: {
    requirements: v.array(v.string()),
    minScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 要件に基づいて素材をフィルタリング
    return await ctx.db.query("materials")
      .filter(...)
      .collect();
  },
});
```

#### `proposals.generate` (提案生成)

```typescript
// convex/proposals.ts
export const generate = action({
  args: {
    scenarioId: v.id("scenarios"),
    requirements: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Convex DBから素材検索
    const dbMaterials = await ctx.runQuery(api.materials.search, {
      requirements: args.requirements,
    });

    // 2. Web検索実行（並列）
    const webResults = await searchWeb(args.requirements);

    // 3. LLMにコンテキストを渡して提案生成
    const aiProposals = await generateWithLLM({
      dbMaterials,
      webResults,
      requirements: args.requirements,
    });

    // 4. 結果をDBに保存
    await ctx.runMutation(api.proposals.save, {
      scenarioId: args.scenarioId,
      proposals: aiProposals,
    });

    return aiProposals;
  },
});
```

### Next.js API Routes

#### POST /api/search-web

```typescript
// Web検索APIのラッパー
export async function POST(req: Request) {
  const { query } = await req.json();

  // Bing Search APIまたはGoogle Custom Searchを呼び出し
  const results = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?q=${query}`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY,
      },
    },
  );

  return Response.json(results);
}
```

#### POST /api/generate-with-llm

```typescript
// LLM API呼び出し
export async function POST(req: Request) {
  const { context, requirements } = await req.json();

  const response = await generateProposals({
    model: "gemini-pro",
    context,
    requirements,
  });

  return Response.json(response);
}
```

## LLMプロンプト設計

```typescript
const systemPrompt = `
あなたは世界最高の包装材料コンサルタントです。
以下の情報を基に、持続可能な代替素材を提案してください：

1. データベースの素材情報
2. Webからの最新情報
3. 製品要件

回答はJSON形式で、各素材について詳細な評価と根拠を含めてください。
`;

const generatePrompt = (context: {
  scenario: ProductScenario;
  dbMaterials: Material[];
  webResults: WebSearchResult[];
}) => `
## 現在の製品情報
- 製品: ${context.scenario.name}
- 現在の素材: ${context.scenario.currentMaterial.composition}
- 必須性能: ${context.scenario.currentMaterial.properties.join(", ")}
- 目標: モノマテリアル化、環境負荷削減

## データベースの候補素材
${dbMaterials
  .map(
    (m) => `
- ${m.name}
  - 構成: ${m.composition}
  - 特性: ${m.properties.join(", ")}
  - 環境スコア: ${m.scores.environmental}/100
`,
  )
  .join("")}

## Webからの最新情報
${webResults
  .slice(0, 5)
  .map(
    (r) => `
- ${r.title}
  - ${r.snippet}
  - 出典: ${r.url}
`,
  )
  .join("")}

上記情報を総合的に判断し、最適な代替素材を3つ提案してください。
各提案には、データベース情報とWeb情報をどのように活用したか明記してください。

必ず以下のJSON形式で回答してください：
{
  "proposals": [
    {
      "material": "素材名",
      "composition": "素材構成",
      "evaluation": {
        "physical": 0-100,
        "environmental": 0-100,
        "cost": 0-100,
        "safety": 0-100,
        "supply": 0-100
      },
      "reasoning": "推奨理由と根拠",
      "sources": ["参照した情報源"]
    }
  ]
}
`;
```

## セキュリティ考慮事項

- API キーは環境変数で管理（`.env.local`）
  - `CONVEX_DEPLOYMENT`
  - `NEXT_PUBLIC_CONVEX_URL`
  - `OPENAI_API_KEY` / `GEMINI_API_KEY`
  - `BING_SEARCH_API_KEY`
- Convexのセキュリティ機能を活用
  - ビルトイン認証・認可
  - データバリデーション
  - リアルタイム同期のセキュリティ
- CORS設定で許可されたオリジンのみアクセス可能
- Rate limiting実装（1分あたり10リクエストまで）
- 入力値のサニタイゼーション（XSS対策）
- LLMレスポンスのバリデーション（Zodスキーマ）

## パフォーマンス考慮事項

- Convexのリアルタイム同期で高速なUX
- データベース検索とWeb検索の並列実行
- LLM APIレスポンスのキャッシング（Convexに保存）
- レーダーチャートの遅延レンダリング
- 画像の最適化とlazy loading
- APIリクエストのデバウンス処理
- エラー時のリトライロジック（最大3回）
- Convexのインデックスを活用した高速クエリ

## エラーハンドリング

- Convex接続エラー: オフラインモードでローカルデータ表示
- LLM APIタイムアウト: 10秒でタイムアウト、DB結果のみでフォールバック
- Web検索エラー: DB結果とAIのみで処理継続
- 無効なJSONレスポンス: デフォルト値で処理継続
- ネットワークエラー: ユーザーフレンドリーなエラーメッセージ
- Rate limit超過: 待機時間の表示
- データ不整合: Convexのバリデーションで事前防止
