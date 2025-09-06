import { NextRequest, NextResponse } from 'next/server';
import {
  MaterialComposition,
  MaterialRequirement,
  SearchResponse,
  SustainableMaterial,
  DeepResearchResult,
} from '../types';
import { DETAILED_GRADING_CRITERIA } from '@/lib/grading-criteria';

// Claude API設定
const CLAUDE_API_KEY =
  process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

// 推奨素材の型定義（proposals/mockDataの形式に合わせる）
export interface RecommendedMaterial {
  materialName: string;
  composition: string[];
  scores: {
    physical: number;
    environmental: number;
    cost: number;
    safety: number;
    supply: number;
  };
  totalScore: number;
  reasoning: string;
  features: string[];
  dataSources: string[];
}

export interface TotalAIRequest {
  currentMaterials: MaterialComposition;
  requirements: MaterialRequirement[];
}

export interface TotalAIResponse {
  success: boolean;
  recommendations: RecommendedMaterial[];
  analysisDetails: {
    dbSearchResults: number;
    gptSearchResults: number;
    confidenceLevel: string;
    timestamp: string;
  };
  error?: string;
}

// DBsearchとGPTsearchを並行実行
async function executeSearches(
  currentMaterials: MaterialComposition,
  requirements: MaterialRequirement[]
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const searchPayload = {
    currentMaterials,
    requirements,
  };

  // 並行実行
  const [dbSearchResponse, gptSearchResponse] = await Promise.allSettled([
    fetch(`${baseUrl}/api/materials/DBsearch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchPayload),
    }),
    fetch(`${baseUrl}/api/materials/GPTsearch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchPayload),
    }),
  ]);

  // 結果を処理
  let dbResults: SustainableMaterial[] = [];
  let gptResults: DeepResearchResult | null = null;

  if (dbSearchResponse.status === 'fulfilled' && dbSearchResponse.value.ok) {
    const dbData: SearchResponse = await dbSearchResponse.value.json();
    dbResults = dbData.materials || [];
  }

  if (gptSearchResponse.status === 'fulfilled' && gptSearchResponse.value.ok) {
    const gptData: SearchResponse = await gptSearchResponse.value.json();
    gptResults = gptData.result || null;
  }

  return { dbResults, gptResults };
}

// Claude-3 Opusで統合分析
async function analyzeWithClaude(
  dbResults: SustainableMaterial[],
  gptResults: DeepResearchResult | null,
  currentMaterials: MaterialComposition,
  requirements: MaterialRequirement[]
): Promise<RecommendedMaterial[]> {
  if (!CLAUDE_API_KEY) {
    console.warn('Claude API key not configured, using fallback analysis');
    return fallbackAnalysis(dbResults, gptResults);
  }

  const prompt = `
あなたは包装材料の専門家です。以下の検索結果を統合・分析して、最適な推奨素材TOP3を選定してください。

${DETAILED_GRADING_CRITERIA}

【現在の素材構成】
${currentMaterials.composition}
特性: ${currentMaterials.properties.join(', ')}

【性能要件】
${requirements.map((r) => `- ${r.name}: ${r.value} ${r.unit || ''} (重要度: ${r.importance})`).join('\n')}

【データベース検索結果】
${dbResults
  .map(
    (m, i) => `
${i + 1}. ${m.name} (${m.composition})
- マッチスコア: ${m.matchScore}
- サステナビリティスコア: ${m.sustainabilityScore}
- 利点: ${m.advantages.join(', ')}
- 考慮事項: ${m.considerations.join(', ')}
`
  )
  .join('\n')}

【GPT深層研究結果】
${
  gptResults
    ? `
発見された材料: ${gptResults.materials.map((m) => m.name).join(', ')}
技術トレンド: ${gptResults.trends.slice(0, 3).join(', ')}
考慮事項: ${gptResults.considerations.slice(0, 3).join(', ')}
`
    : '深層研究結果なし'
}

【指示】
上記の評価基準に従って、検索結果を総合的に分析し、推奨素材TOP3を以下のJSON形式で出力してください。
各素材について、データベース検索とGPT研究の両方の観点から評価し、A-D評価基準に基づいて適切なスコアを付与してください。

{
  "recommendations": [
    {
      "materialName": "素材名",
      "composition": ["構成要素1", "構成要素2"],
      "scores": {
        "physical": 85,  // 物理的性能 (0-100, A=85-100, B=70-84, C=55-69, D=0-54)
        "environmental": 90,  // 環境性能 (0-100, 同上)
        "cost": 75,  // コスト効率 (0-100, 同上)
        "safety": 95,  // 安全性 (0-100, 同上)
        "supply": 80  // 供給安定性 (0-100, 同上)
      },
      "totalScore": 85,  // 総合スコア (0-100, A-D評価基準に従って算出)
      "reasoning": "選定理由の詳細説明",
      "features": ["特徴1", "特徴2", "特徴3", "特徴4"],
      "dataSources": ["Convexデータベース", "最新Web情報", "AI分析"]
    }
  ]
}

【重要】
- 各項目のスコアは必ずA-D評価基準（A:85-100, B:70-84, C:55-69, D:0-54）に従って算出してください
- 総合スコアは各項目の重み付け平均で計算し、同じ評価基準を適用してください
- 評価の根拠を推奨理由に明記してください

JSONのみを出力し、他の説明は含めないでください。
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-20250514',
        max_tokens: 3000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status);
      return fallbackAnalysis(dbResults, gptResults);
    }

    const data = await response.json();
    const content = data.content[0]?.text || '';

    // JSONを抽出してパース
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.recommendations || [];
    }
  } catch (error) {
    console.error('Claude analysis error:', error);
  }

  return fallbackAnalysis(dbResults, gptResults);
}

// フォールバック分析（Claude APIが使えない場合）
function fallbackAnalysis(
  dbResults: SustainableMaterial[],
  gptResults: DeepResearchResult | null
): RecommendedMaterial[] {
  const recommendations: RecommendedMaterial[] = [];

  // DBの結果から上位3つを選択
  const topDbResults = dbResults.slice(0, 3);

  topDbResults.forEach((material, index) => {
    // GPT結果から関連する材料を探す
    const relatedGptMaterial = gptResults?.materials.find(
      (gm) =>
        gm.name.toLowerCase().includes(material.name.toLowerCase()) ||
        material.name.toLowerCase().includes(gm.name.toLowerCase())
    );

    // スコア計算
    const physicalScore = Math.min(
      95,
      70 + (material.properties.tensileStrength || 0) * 0.3
    );
    const environmentalScore = material.sustainabilityScore;
    const costScore = 80 - index * 5; // 順位が下がるごとにコストスコアを下げる
    const safetyScore = 90; // デフォルト値
    const supplyScore = relatedGptMaterial ? 85 : 75;

    const totalScore = Math.round(
      (physicalScore +
        environmentalScore +
        costScore +
        safetyScore +
        supplyScore) /
        5
    );

    // 特徴の生成
    const features: string[] = [];
    if (material.properties.biodegradability?.includes('生分解')) {
      features.push('生分解性');
    }
    if (material.properties.recyclability?.includes('リサイクル')) {
      features.push('リサイクル可能');
    }
    if (material.sustainabilityScore > 80) {
      features.push('高サステナビリティ');
    }
    if (
      material.properties.carbonFootprint &&
      material.properties.carbonFootprint < 1
    ) {
      features.push('低炭素');
    }

    // データソースの設定
    const dataSources = ['Convexデータベース'];
    if (relatedGptMaterial) {
      dataSources.push('最新Web情報');
      if (relatedGptMaterial.confidence === 'high') {
        dataSources.push('AI深層分析');
      }
    }

    recommendations.push({
      materialName: material.name,
      composition: material.composition.split(/[\/,]/).map((c) => c.trim()),
      scores: {
        physical: Math.round(physicalScore),
        environmental: Math.round(environmentalScore),
        cost: Math.round(costScore),
        safety: Math.round(safetyScore),
        supply: Math.round(supplyScore),
      },
      totalScore,
      reasoning:
        material.advantages.slice(0, 2).join('。') +
        '。' +
        (material.considerations[0] || ''),
      features,
      dataSources,
    });
  });

  return recommendations;
}

// メインのPOSTハンドラ
export async function POST(req: NextRequest) {
  try {
    const body: TotalAIRequest = await req.json();
    const { currentMaterials, requirements } = body;

    console.log('🤖 Total AI analysis started...');
    console.log('📋 Current materials:', currentMaterials);
    console.log('📋 Requirements:', requirements);

    // 1. DBsearchとGPTsearchを並行実行
    const { dbResults, gptResults } = await executeSearches(
      currentMaterials,
      requirements
    );

    console.log(`✅ DB Search: ${dbResults.length} results`);
    console.log(`✅ GPT Search: ${gptResults ? 'Complete' : 'Failed'}`);

    // 2. Claude-3 Opusで統合分析
    const recommendations = await analyzeWithClaude(
      dbResults,
      gptResults,
      currentMaterials,
      requirements
    );

    console.log(`🎯 Generated ${recommendations.length} recommendations`);

    // 3. レスポンスを返す
    const response: TotalAIResponse = {
      success: true,
      recommendations: recommendations.slice(0, 3), // TOP3のみ返す
      analysisDetails: {
        dbSearchResults: dbResults.length,
        gptSearchResults: gptResults?.materials.length || 0,
        confidenceLevel: recommendations.length > 0 ? 'high' : 'low',
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Total AI analysis error:', error);
    return NextResponse.json(
      {
        success: false,
        recommendations: [],
        analysisDetails: {
          dbSearchResults: 0,
          gptSearchResults: 0,
          confidenceLevel: 'error',
          timestamp: new Date().toISOString(),
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      } as TotalAIResponse,
      { status: 500 }
    );
  }
}
