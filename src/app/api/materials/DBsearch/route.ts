import { NextRequest, NextResponse } from 'next/server';
import {
  MaterialsSearchRequest,
  SustainableMaterial,
  ExtractedRequirements,
  MaterialComposition,
  MaterialRequirement,
} from '../types';

// Materials Project APIのベースURL
const MP_API_BASE = 'https://api.materialsproject.org';

// 型定義を再エクスポート（後方互換性のため）
export type { MaterialsSearchRequest, SustainableMaterial };

// 要件から材料特性を抽出
export function extractMaterialRequirements(
  requirements: MaterialRequirement[]
): ExtractedRequirements {
  const extracted: ExtractedRequirements = {};

  requirements.forEach((req) => {
    const value = parseFloat(req.value);

    if (req.name.includes('引張強度')) {
      extracted.tensileStrength = value;
    } else if (req.name.includes('伸び率')) {
      extracted.elongation = value;
    } else if (req.name.includes('衝撃強度')) {
      extracted.impactStrength = value;
    } else if (req.name.includes('ヒートシール強度')) {
      extracted.heatSealStrength = value;
    } else if (req.name.includes('酸素透過率')) {
      extracted.oxygenPermeability = value;
    } else if (req.name.includes('水蒸気透過率')) {
      extracted.waterVaporPermeability = value;
    } else if (req.name.includes('遮光性')) {
      extracted.lightBlocking = value;
    } else if (req.name.includes('耐熱温度')) {
      extracted.heatResistance = value;
    } else if (req.name.includes('耐寒温度')) {
      extracted.coldResistance = value;
    }
  });

  return extracted;
}

// 有機ポリマーデータベース（実際の包装材料データ）
export function getOrganicPolymerDatabase() {
  return [
    // バイオプラスチック
    {
      material_id: 'bio-001',
      formula_pretty: 'PLA (C3H4O2)n',
      name: 'ポリ乳酸',
      type: 'bioplastic',
      properties: {
        tensileStrength: 65,
        elongation: 150,
        meltingPoint: 175,
        density: 1.24,
        oxygenPermeability: 1.8,
        waterVaporPermeability: 2.5,
      },
      sustainability: {
        biodegradable: true,
        compostable: true,
        biomasContent: 100,
        carbonFootprint: 0.5,
      },
    },
    {
      material_id: 'bio-002',
      formula_pretty: 'PHA (C4H6O2)n',
      name: 'ポリヒドロキシアルカノエート',
      type: 'bioplastic',
      properties: {
        tensileStrength: 40,
        elongation: 200,
        meltingPoint: 165,
        density: 1.25,
        oxygenPermeability: 2.3,
        waterVaporPermeability: 3.0,
      },
      sustainability: {
        biodegradable: true,
        compostable: true,
        biomasContent: 100,
        carbonFootprint: 0.4,
      },
    },
    {
      material_id: 'bio-003',
      formula_pretty: 'PBS (C8H12O4)n',
      name: 'ポリブチレンサクシネート',
      type: 'bioplastic',
      properties: {
        tensileStrength: 55,
        elongation: 300,
        meltingPoint: 115,
        density: 1.26,
        oxygenPermeability: 2.0,
        waterVaporPermeability: 2.8,
      },
      sustainability: {
        biodegradable: true,
        compostable: false,
        biomasContent: 50,
        carbonFootprint: 0.7,
      },
    },
    // リサイクル可能ポリマー
    {
      material_id: 'rec-001',
      formula_pretty: 'rPET (C10H8O4)n',
      name: 'リサイクルPET',
      type: 'recycled',
      properties: {
        tensileStrength: 85,
        elongation: 120,
        meltingPoint: 250,
        density: 1.38,
        oxygenPermeability: 0.8,
        waterVaporPermeability: 1.5,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        recycledContent: 100,
        carbonFootprint: 0.6,
      },
    },
    {
      material_id: 'rec-002',
      formula_pretty: 'rPE (C2H4)n',
      name: 'リサイクルポリエチレン',
      type: 'recycled',
      properties: {
        tensileStrength: 45,
        elongation: 400,
        meltingPoint: 135,
        density: 0.95,
        oxygenPermeability: 3.5,
        waterVaporPermeability: 0.5,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        recycledContent: 100,
        carbonFootprint: 0.5,
      },
    },
    // バイオベースポリマー
    {
      material_id: 'bio-pe-001',
      formula_pretty: 'Bio-PE (C2H4)n',
      name: 'バイオポリエチレン',
      type: 'bio-based',
      properties: {
        tensileStrength: 50,
        elongation: 450,
        meltingPoint: 135,
        density: 0.96,
        oxygenPermeability: 3.2,
        waterVaporPermeability: 0.4,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        biomasContent: 95,
        carbonFootprint: 0.3,
      },
    },
    {
      material_id: 'bio-pet-001',
      formula_pretty: 'Bio-PET (C10H8O4)n',
      name: 'バイオPET',
      type: 'bio-based',
      properties: {
        tensileStrength: 90,
        elongation: 130,
        meltingPoint: 255,
        density: 1.39,
        oxygenPermeability: 0.7,
        waterVaporPermeability: 1.4,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        biomasContent: 30,
        carbonFootprint: 0.8,
      },
    },
    // セルロース系
    {
      material_id: 'cel-001',
      formula_pretty: 'CNF (C6H10O5)n',
      name: 'セルロースナノファイバー',
      type: 'cellulose',
      properties: {
        tensileStrength: 150,
        elongation: 80,
        meltingPoint: 180,
        density: 1.5,
        oxygenPermeability: 0.3,
        waterVaporPermeability: 4.0,
      },
      sustainability: {
        biodegradable: true,
        compostable: true,
        biomasContent: 100,
        carbonFootprint: 0.2,
      },
    },
  ];
}

// 有機材料データベースから要件に基づいて検索
export function searchOrganicMaterials(
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition
): SustainableMaterial[] {
  console.log('🌱 Searching organic polymer database with requirements...');

  const organicDB = getOrganicPolymerDatabase();
  const results: SustainableMaterial[] = [];

  // 現在の素材構成を分析
  const needsHighBarrier = requirements.oxygenPermeability < 2;
  const needsBiodegradable = currentMaterials.properties?.includes('生分解性');

  // 各有機材料をスコアリング
  organicDB.forEach((material) => {
    let score = 0;

    // バリア性のマッチング
    if (needsHighBarrier && material.properties.oxygenPermeability < 2) {
      score += 30;
    }

    // 強度のマッチング
    if (
      Math.abs(
        material.properties.tensileStrength - requirements.tensileStrength
      ) < 20
    ) {
      score += 25;
    }

    // サステナビリティのマッチング
    if (material.sustainability.biodegradable && needsBiodegradable) {
      score += 20;
    }
    if (
      material.sustainability.biomasContent &&
      material.sustainability.biomasContent > 50
    ) {
      score += 15;
    }
    if (material.sustainability.carbonFootprint < 0.6) {
      score += 10;
    }

    // SustainableMaterial形式に変換
    const convertedMaterial: SustainableMaterial = {
      name: material.name,
      composition: material.formula_pretty,
      properties: {
        tensileStrength: material.properties.tensileStrength,
        elongation: material.properties.elongation,
        oxygenPermeability: material.properties.oxygenPermeability,
        waterVaporPermeability: material.properties.waterVaporPermeability,
        heatResistance: material.properties.meltingPoint,
        recyclability: material.sustainability.recyclable
          ? '完全リサイクル可能'
          : material.sustainability.biodegradable
            ? '生分解性'
            : '要検討',
        biodegradability: material.sustainability.biodegradable
          ? material.sustainability.compostable
            ? 'コンポスト可能'
            : '生分解性'
          : '非生分解性',
        carbonFootprint: material.sustainability.carbonFootprint,
      },
      sustainabilityScore: Math.min(
        95,
        70 + (material.sustainability.biomasContent || 0) * 0.25
      ),
      matchScore: Math.min(95, score),
      advantages: [
        `材料タイプ: ${
          material.type === 'bioplastic'
            ? 'バイオプラスチック'
            : material.type === 'recycled'
              ? 'リサイクル材料'
              : material.type === 'bio-based'
                ? 'バイオベース材料'
                : 'セルロース系材料'
        }`,
        material.sustainability.biodegradable
          ? '生分解性あり'
          : 'リサイクル可能',
        `バイオマス含有率: ${material.sustainability.biomasContent || 0}%`,
        `CO2排出量: ${material.sustainability.carbonFootprint} kg-CO2/kg`,
        `密度: ${material.properties.density} g/cm³`,
      ],
      considerations: [
        material.properties.meltingPoint < 150
          ? '耐熱性が低い（150℃未満）'
          : null,
        material.properties.tensileStrength < 50 ? '強度が低い可能性' : null,
        material.sustainability.biomasContent === 100
          ? '完全バイオマス由来'
          : null,
      ].filter((c) => c !== null) as string[],
    };

    results.push(convertedMaterial);
  });

  // スコアの高い順にソート
  results.sort((a, b) => b.matchScore - a.matchScore);

  console.log(
    `✅ Found ${results.length} organic materials, top match score: ${results[0]?.matchScore}`
  );

  // トップ3の材料名をログ出力
  if (results.length > 0) {
    console.log(
      '🏆 Top materials:',
      results
        .slice(0, 3)
        .map((m) => m.name)
        .join(', ')
    );
  }

  return results;
}

// Materials Project API検索
export async function searchMaterialsProjectAPI(
  apiKey: string,
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition
) {
  try {
    console.log('🔍 Searching Materials Project API...');

    // シンプルなクエリで有機材料を検索
    const searchParams = new URLSearchParams({
      _limit: '10',
      elements: 'C,H,O,N', // 有機材料の基本元素
    });

    const url = `${MP_API_BASE}/materials/core/?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Materials Project API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data || data || [];
  } catch (error) {
    console.error('Materials Project API error:', error);
    return null;
  }
}

// データベース検索のメインAPI
export async function POST(req: NextRequest) {
  try {
    const body: MaterialsSearchRequest = await req.json();
    const { currentMaterials, requirements } = body;

    console.log('📊 Database search started...');
    console.log('📋 Current materials:', currentMaterials);
    console.log('📋 Requirements:', requirements);

    // 要件から材料特性を抽出
    const extractedRequirements = extractMaterialRequirements(requirements);
    console.log('🔍 Extracted requirements:', extractedRequirements);

    // 有機ポリマーデータベースから検索
    const organicMaterials = searchOrganicMaterials(
      extractedRequirements,
      currentMaterials
    );

    return NextResponse.json({
      success: true,
      materials: organicMaterials.slice(0, 5),
      source: 'Organic Polymer Database',
      metadata: {
        totalResults: organicMaterials.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Database search error:', error);
    return NextResponse.json(
      { error: 'Database search failed' },
      { status: 500 }
    );
  }
}
