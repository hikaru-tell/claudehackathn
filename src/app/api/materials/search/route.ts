import { NextRequest, NextResponse } from 'next/server';
import {
  searchOrganicMaterials,
  extractMaterialRequirements,
  type SustainableMaterial,
  type MaterialsSearchRequest,
} from '../DBsearch/route';
import { executeDeepResearch } from '../GPTsearch/route';

// 統合検索API - DBとGPTの両方を使用
export async function POST(req: NextRequest) {
  try {
    const body: MaterialsSearchRequest = await req.json();
    const { currentMaterials, requirements } = body;

    console.log('🚀 Integrated search started...');
    console.log('Current materials:', currentMaterials);
    console.log('Requirements:', requirements);

    let sustainableMaterials: SustainableMaterial[] = [];
    let dataSource = 'Integrated Search';

    // 要件から材料特性を抽出
    const extractedRequirements = extractMaterialRequirements(requirements);

    // 1. 有機ポリマーデータベースから検索
    console.log('🌱 Step 1: Searching organic polymer database...');
    const organicMaterials = searchOrganicMaterials(
      extractedRequirements,
      currentMaterials
    );

    if (organicMaterials.length > 0) {
      sustainableMaterials = organicMaterials.slice(0, 3);
      dataSource = 'Organic Polymer Database';
      console.log(
        `✅ Found ${sustainableMaterials.length} suitable organic materials`
      );
    }

    // 2. OpenAI Deep Research で最新研究を調査（オプション）
    if (process.env.OPENAI_API_KEY) {
      console.log('🔬 Step 2: Executing OpenAI Deep Research...');
      const deepResearch = await executeDeepResearch(
        extractedRequirements,
        currentMaterials
      );

      if (deepResearch && deepResearch.materials.length > 0) {
        console.log(
          `📚 Deep Research found ${deepResearch.materials.length} additional materials`
        );

        // Deep Research結果をメタデータに追加
        sustainableMaterials = sustainableMaterials.map((material, index) => ({
          ...material,
          deepResearchInsights: deepResearch.materials[index]
            ? `AI推奨: ${deepResearch.materials[index].name}`
            : undefined,
        }));

        // Deep Researchで見つかった新しい材料を追加
        if (deepResearch.materials.length > sustainableMaterials.length) {
          const additionalMaterials = deepResearch.materials
            .slice(sustainableMaterials.length, sustainableMaterials.length + 2)
            .map(
              (gptMaterial, index: number) =>
                ({
                  name: gptMaterial.name,
                  composition: 'AI推奨素材',
                  properties: {
                    tensileStrength: 80,
                    elongation: 150,
                    oxygenPermeability: 1.5,
                    waterVaporPermeability: 2.0,
                    heatResistance: 120,
                    recyclability: '要評価',
                    biodegradability: '要評価',
                    carbonFootprint: 0.7,
                  },
                  sustainabilityScore: 85,
                  matchScore: 80 - index * 5,
                  advantages: [
                    'OpenAI Deep Researchによる最新素材',
                    '研究開発段階の先進材料',
                    gptMaterial.confidence === 'high'
                      ? '高い実用化可能性'
                      : '実験検証が必要',
                  ],
                  considerations: [
                    '詳細な物性評価が必要',
                    '量産化技術の確立が必要',
                  ],
                  deepResearchInsights: `Source: ${gptMaterial.source}`,
                }) as SustainableMaterial
            );

          sustainableMaterials = [
            ...sustainableMaterials,
            ...additionalMaterials,
          ];
        }

        dataSource += ' + OpenAI Deep Research';

        // トレンド情報も含める
        if (deepResearch.trends && deepResearch.trends.length > 0) {
          console.log('📈 Trends identified:', deepResearch.trends.slice(0, 3));
        }
      }
    } else {
      console.log('⚠️ OpenAI API key not configured, skipping deep research');
    }

    // 3. フォールバック（材料が見つからない場合）
    if (sustainableMaterials.length === 0) {
      console.log('⚠️ No materials found, using fallback data');
      sustainableMaterials = [
        {
          name: 'バイオPET/紙/PLA複合材',
          composition: 'Bio-PET(15μm)/紙層(20μm)/PLA(20μm)',
          properties: {
            tensileStrength: 95,
            elongation: 140,
            oxygenPermeability: 1.2,
            waterVaporPermeability: 2.5,
            heatResistance: 110,
            recyclability: '単一素材分離可能',
            biodegradability: '部分的生分解性',
            carbonFootprint: 0.8,
          },
          sustainabilityScore: 85,
          matchScore: 88,
          advantages: [
            'バイオマス由来原料を50%以上使用',
            'リサイクル可能な構造',
            'CO2排出量を30%削減',
          ],
          considerations: ['耐熱性がやや低下', '材料コストが15%上昇'],
        },
      ];
      dataSource = 'Fallback Data';
    }

    // 最大5件に制限
    sustainableMaterials = sustainableMaterials.slice(0, 5);

    return NextResponse.json({
      success: true,
      materials: sustainableMaterials,
      metadata: {
        searchCriteria: {
          currentComposition: currentMaterials.composition,
          highPriorityRequirements: requirements
            .filter((r) => r.importance === 'high')
            .map((r) => r.name),
        },
        dataSource,
        totalResults: sustainableMaterials.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in integrated materials search:', error);

    // エラー時でもフォールバックデータを返す
    return NextResponse.json({
      success: true,
      materials: [
        {
          name: 'モノマテリアルPE多層構造',
          composition: 'HDPE/MDPE/LLDPE',
          properties: {
            tensileStrength: 90,
            elongation: 200,
            oxygenPermeability: 1.5,
            waterVaporPermeability: 1.8,
            heatResistance: 115,
            recyclability: '完全リサイクル可能',
            biodegradability: '非生分解性',
            carbonFootprint: 0.9,
          },
          sustainabilityScore: 82,
          matchScore: 85,
          advantages: [
            '単一素材でリサイクル性が高い',
            '既存のリサイクルインフラに対応',
          ],
          considerations: ['酸素バリア性がやや劣る'],
        },
      ],
      metadata: {
        searchCriteria: {
          currentComposition: 'Unknown',
          highPriorityRequirements: [],
        },
        dataSource: 'Error Recovery Fallback',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
