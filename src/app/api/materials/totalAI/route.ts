import { NextRequest, NextResponse } from "next/server";
import {
  MaterialComposition,
  MaterialRequirement,
  SearchResponse,
  SustainableMaterial,
  DeepResearchResult,
} from "../types";
import { DETAILED_GRADING_CRITERIA } from "@/lib/grading-criteria";

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
  requirements: MaterialRequirement[],
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const searchPayload = {
    currentMaterials,
    requirements,
  };

  // 並行実行
  const [dbSearchResponse, gptSearchResponse] = await Promise.allSettled([
    fetch(`${baseUrl}/api/materials/DBsearch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchPayload),
    }),
    fetch(`${baseUrl}/api/materials/GPTsearch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchPayload),
    }),
  ]);

  // 結果を処理
  let dbResults: SustainableMaterial[] = [];
  let gptResults: DeepResearchResult | null = null;

  if (dbSearchResponse.status === "fulfilled" && dbSearchResponse.value.ok) {
    const dbData: SearchResponse = await dbSearchResponse.value.json();
    dbResults = dbData.materials || [];
  }

  if (gptSearchResponse.status === "fulfilled" && gptSearchResponse.value.ok) {
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
  requirements: MaterialRequirement[],
): Promise<RecommendedMaterial[]> {
  if (!CLAUDE_API_KEY) {
    console.warn("Claude API key not configured, using fallback analysis");
    return fallbackAnalysis(dbResults, gptResults);
  }

  const prompt = `
You are a packaging materials expert. Please integrate and analyze the following search results to select the TOP 3 recommended materials.

${DETAILED_GRADING_CRITERIA}

[Current Material Composition]
${currentMaterials.composition}
Properties: ${currentMaterials.properties.join(", ")}

[Performance Requirements]
${requirements.map((r) => `- ${r.name}: ${r.value} ${r.unit || ""} (Importance: ${r.importance})`).join("\n")}

[Database Search Results]
${dbResults
  .map(
    (m, i) => `
${i + 1}. ${m.name} (${m.composition})
- Match Score: ${m.matchScore}
- Sustainability Score: ${m.sustainabilityScore}
- Advantages: ${m.advantages.join(", ")}
- Considerations: ${m.considerations.join(", ")}
`,
  )
  .join("\n")}

[GPT In-Depth Research Results]
${
  gptResults
    ? `
Discovered Materials: ${gptResults.materials.map((m) => m.name).join(", ")}
Technology Trends: ${gptResults.trends.slice(0, 3).join(", ")}
Considerations: ${gptResults.considerations.slice(0, 3).join(", ")}
`
    : "No in-depth research results"
}

[Instructions]
Based on the above evaluation criteria, comprehensively analyze the search results and output the TOP 3 recommended materials in the following JSON format.
For each material, evaluate from both the database search and GPT research perspectives, and assign appropriate scores according to the A-D evaluation criteria.

{
  "recommendations": [
    {
      "materialName": "Material Name",
      "composition": ["Component1", "Component2"],
      "scores": {
        "physical": 85,  // Physical performance (0-100, A=85-100, B=70-84, C=55-69, D=0-54)
        "environmental": 90,  // Environmental performance (0-100, same scale)
        "cost": 75,  // Cost efficiency (0-100, same scale)
        "safety": 95,  // Safety (0-100, same scale)
        "supply": 80  // Supply stability (0-100, same scale)
      },
      "totalScore": 85,  // Overall score (0-100, calculated using weighted average, same A-D scale)
      "reasoning": "Detailed reasoning for selection",
      "features": ["Feature1", "Feature2", "Feature3", "Feature4"],
      "dataSources": ["Convex Database", "Latest Web Information", "AI Analysis"]
    }
  ]
}

[Important]
- Each score must strictly follow the A-D evaluation criteria (A:85-100, B:70-84, C:55-69, D:0-54).
- The total score must be calculated using the weighted average of each category and follow the same evaluation scale.
- Clearly state the rationale for the recommendation in the reasoning section.

Only output the JSON. Do not include any other explanation.
`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-20250514",
        max_tokens: 3000,
        temperature: 0.7,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Claude API error:", response.status);
      return fallbackAnalysis(dbResults, gptResults);
    }

    const data = await response.json();
    const content = data.content[0]?.text || "";

    // JSONを抽出してパース
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.recommendations || [];
    }
  } catch (error) {
    console.error("Claude analysis error:", error);
  }

  return fallbackAnalysis(dbResults, gptResults);
}

// フォールバック分析（Claude APIが使えない場合）
function fallbackAnalysis(
  dbResults: SustainableMaterial[],
  gptResults: DeepResearchResult | null,
): RecommendedMaterial[] {
  const recommendations: RecommendedMaterial[] = [];

  // DBの結果から上位3つを選択
  const topDbResults = dbResults.slice(0, 3);

  topDbResults.forEach((material, index) => {
    // GPT結果から関連する材料を探す
    const relatedGptMaterial = gptResults?.materials.find(
      (gm) =>
        gm.name.toLowerCase().includes(material.name.toLowerCase()) ||
        material.name.toLowerCase().includes(gm.name.toLowerCase()),
    );

    // スコア計算
    const physicalScore = Math.min(
      95,
      70 + (material.properties.tensileStrength || 0) * 0.3,
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
        5,
    );

    // 特徴の生成
    const features: string[] = [];
    if (material.properties.biodegradability?.includes("生分解")) {
      features.push("生分解性");
    }
    if (material.properties.recyclability?.includes("リサイクル")) {
      features.push("リサイクル可能");
    }
    if (material.sustainabilityScore > 80) {
      features.push("高サステナビリティ");
    }
    if (
      material.properties.carbonFootprint &&
      material.properties.carbonFootprint < 1
    ) {
      features.push("低炭素");
    }

    // データソースの設定
    const dataSources = ["Convexデータベース"];
    if (relatedGptMaterial) {
      dataSources.push("最新Web情報");
      if (relatedGptMaterial.confidence === "high") {
        dataSources.push("AI深層分析");
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
        material.advantages.slice(0, 2).join("。") +
        "。" +
        (material.considerations[0] || ""),
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

    console.log("🤖 Total AI analysis started...");
    console.log("📋 Current materials:", currentMaterials);
    console.log("📋 Requirements:", requirements);

    // 1. DBsearchとGPTsearchを並行実行
    const { dbResults, gptResults } = await executeSearches(
      currentMaterials,
      requirements,
    );

    console.log(`✅ DB Search: ${dbResults.length} results`);
    console.log(`✅ GPT Search: ${gptResults ? "Complete" : "Failed"}`);

    // 2. Claude-3 Opusで統合分析
    const recommendations = await analyzeWithClaude(
      dbResults,
      gptResults,
      currentMaterials,
      requirements,
    );

    console.log(`🎯 Generated ${recommendations.length} recommendations`);

    // 3. レスポンスを返す
    const response: TotalAIResponse = {
      success: true,
      recommendations: recommendations.slice(0, 3), // TOP3のみ返す
      analysisDetails: {
        dbSearchResults: dbResults.length,
        gptSearchResults: gptResults?.materials.length || 0,
        confidenceLevel: recommendations.length > 0 ? "high" : "low",
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Total AI analysis error:", error);
    return NextResponse.json(
      {
        success: false,
        recommendations: [],
        analysisDetails: {
          dbSearchResults: 0,
          gptSearchResults: 0,
          confidenceLevel: "error",
          timestamp: new Date().toISOString(),
        },
        error: error instanceof Error ? error.message : "Unknown error",
      } as TotalAIResponse,
      { status: 500 },
    );
  }
}
