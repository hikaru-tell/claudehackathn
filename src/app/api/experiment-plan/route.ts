import { NextRequest, NextResponse } from 'next/server';
import { DETAILED_GRADING_CRITERIA } from '@/lib/grading-criteria';

// Claude API設定
const CLAUDE_API_KEY =
  process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

export interface ExperimentPlanRequest {
  material: {
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
  };
  currentMaterial: {
    composition: string;
    properties: string[];
  };
  requirements: Array<{
    name: string;
    value: string;
    unit?: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

export interface ExperimentPlan {
  overview: {
    title: string;
    objective: string;
    duration: string;
    budget: string;
  };
  phases: Array<{
    phase: string;
    duration: string;
    tasks: string[];
  }>;
  keyTests: Array<{
    category: string;
    tests: Array<{
      name: string;
      method: string;
      target: string;
      frequency: string;
    }>;
  }>;
  risks: Array<{
    risk: string;
    impact: string;
    mitigation: string;
  }>;
  deliverables: Array<{
    deliverable: string;
    timeline: string;
    description: string;
  }>;
}

export interface ExperimentPlanResponse {
  success: boolean;
  experimentPlan?: ExperimentPlan;
  error?: string;
  metadata?: {
    generatedAt: string;
    confidence: string;
  };
}

// Claude-3で実験計画を生成
async function generateExperimentPlan(
  material: ExperimentPlanRequest['material'],
  currentMaterial: ExperimentPlanRequest['currentMaterial'],
  requirements: ExperimentPlanRequest['requirements']
): Promise<ExperimentPlan | null> {
  if (!CLAUDE_API_KEY) {
    console.warn('Claude API key not configured');
    return null;
  }

  const prompt = `
あなたは包装材料開発の専門家です。以下の情報に基づいて、詳細な実験計画を作成してください。

${DETAILED_GRADING_CRITERIA}

【推奨素材】
- 素材名: ${material.materialName}
- 構成: ${material.composition.join('/')}
- 総合評価: ${material.totalScore}点
- 推奨理由: ${material.reasoning}
- 特徴: ${material.features.join(', ')}

【現在の素材】
- 構成: ${currentMaterial.composition}
- 特性: ${currentMaterial.properties.join(', ')}

【性能要件】
${requirements.map((r) => `- ${r.name}: ${r.value} ${r.unit || ''} (重要度: ${r.importance})`).join('\n')}

【評価スコア詳細】
- 物理的性能: ${material.scores.physical}点
- 環境性能: ${material.scores.environmental}点
- コスト効率: ${material.scores.cost}点
- 安全性: ${material.scores.safety}点
- 供給安定性: ${material.scores.supply}点

【実験計画作成指示】
上記の情報に基づいて、現在の素材から推奨素材への移行を実現するための包括的な実験計画を作成してください。
評価基準と各スコアを考慮し、特に低いスコアの項目については重点的な検証を含めてください。

以下のJSON形式で出力してください：

{
  "overview": {
    "title": "実験計画のタイトル",
    "objective": "実験の目的と期待される成果",
    "duration": "全体の期間（例：3-6ヶ月）",
    "budget": "予想予算（例：500-800万円）"
  },
  "phases": [
    {
      "phase": "Phase 1: フェーズ名",
      "duration": "期間",
      "tasks": [
        "具体的なタスク1",
        "具体的なタスク2"
      ]
    }
  ],
  "keyTests": [
    {
      "category": "テストカテゴリ",
      "tests": [
        {
          "name": "テスト名",
          "method": "測定方法・規格",
          "target": "目標値",
          "frequency": "実施頻度"
        }
      ]
    }
  ],
  "risks": [
    {
      "risk": "リスク内容",
      "impact": "影響度",
      "mitigation": "対策"
    }
  ],
  "deliverables": [
    {
      "deliverable": "成果物名",
      "timeline": "提出時期",
      "description": "詳細説明"
    }
  ]
}

【重要な考慮点】
1. スコアが低い項目（70点未満）については重点的な検証を含める
2. 実際の包装材料業界の標準的な試験方法を参考にする
3. 段階的なリスク管理とマイルストーンを設定
4. 実用化に向けた現実的なタイムラインと予算を提案
5. サステナビリティ評価と環境負荷測定を重視

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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
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
      return null;
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      console.error('No content in Claude response');
      return null;
    }

    // JSONを抽出
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Claude response');
      return null;
    }

    const experimentPlan = JSON.parse(jsonMatch[0]);
    return experimentPlan;
  } catch (error) {
    console.error('Error generating experiment plan:', error);
    return null;
  }
}

// フォールバック実験計画（API使用不可時）
function getFallbackExperimentPlan(
  material: ExperimentPlanRequest['material'],
  currentMaterial: ExperimentPlanRequest['currentMaterial']
): ExperimentPlan {
  return {
    overview: {
      title: `${material.materialName}の開発実験計画`,
      objective: `既存材料（${currentMaterial.composition}）から${material.materialName}への移行を実現するための実験計画と評価方法`,
      duration: '3-6ヶ月',
      budget: '500-800万円',
    },
    phases: [
      {
        phase: 'Phase 1: 材料調達と基礎評価',
        duration: '1ヶ月',
        tasks: [
          '原材料サプライヤーの選定と調達',
          '基礎物性の測定（引張強度、伸び、厚み等）',
          '化学組成分析とFT-IR測定',
          'DSC/TGA熱分析',
        ],
      },
      {
        phase: 'Phase 2: 複合材料の配合最適化',
        duration: '2ヶ月',
        tasks: [
          `${material.composition.join('/')}の配合比率最適化`,
          'ラミネート条件の検討（温度、圧力、時間）',
          '層間接着強度の評価',
          'バリア性能の測定（酸素透過率、水蒸気透過率）',
        ],
      },
      {
        phase: 'Phase 3: 実用化評価',
        duration: '2-3ヶ月',
        tasks: [
          '実際の包装条件での性能評価',
          '食品安全性試験',
          'コスト分析と量産化検討',
          '最終レポート作成',
        ],
      },
    ],
    keyTests: [
      {
        category: '物理的性能',
        tests: [
          {
            name: '引張強度',
            method: 'JIS K7127',
            target: '要件仕様値以上',
            frequency: '各フェーズ',
          },
          {
            name: 'バリア性能',
            method: 'JIS K7126',
            target: '現行材料同等以上',
            frequency: '週次',
          },
        ],
      },
    ],
    risks: [
      {
        risk: '原材料供給の不安定性',
        impact: 'スケジュール遅延',
        mitigation: '複数サプライヤーの確保',
      },
    ],
    deliverables: [
      {
        deliverable: '材料仕様書',
        timeline: '2ヶ月後',
        description: '最適化された材料の詳細仕様と品質基準',
      },
      {
        deliverable: '物性評価レポート',
        timeline: '3ヶ月後',
        description: '全試験項目の結果と合否判定',
      },
      {
        deliverable: '加工条件ガイドライン',
        timeline: '4ヶ月後',
        description: '印刷・ラミネート・製袋の最適条件',
      },
      {
        deliverable: '実用化提案書',
        timeline: '5ヶ月後',
        description: '量産化に向けた技術・コスト・スケジュール提案',
      },
      {
        deliverable: '最終評価レポート',
        timeline: '6ヶ月後',
        description: '全実験結果と実用化可能性の総合評価',
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ExperimentPlanRequest = await req.json();
    const { material, currentMaterial, requirements } = body;

    console.log('🧪 Generating experiment plan for:', material.materialName);

    // Claude APIで実験計画を生成
    const experimentPlan = await generateExperimentPlan(
      material,
      currentMaterial,
      requirements
    );

    if (!experimentPlan) {
      // フォールバック実験計画を使用
      const fallbackPlan = getFallbackExperimentPlan(material, currentMaterial);
      return NextResponse.json({
        success: true,
        experimentPlan: fallbackPlan,
        metadata: {
          generatedAt: new Date().toISOString(),
          confidence: 'fallback',
        },
      });
    }

    return NextResponse.json({
      success: true,
      experimentPlan,
      metadata: {
        generatedAt: new Date().toISOString(),
        confidence: 'high',
      },
    });
  } catch (error) {
    console.error('Experiment plan generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate experiment plan',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
