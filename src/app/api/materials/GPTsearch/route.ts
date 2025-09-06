import { NextRequest, NextResponse } from 'next/server';
import {
  ExtractedRequirements,
  MaterialComposition,
  MaterialRequirement,
  DeepResearchResult,
  DeepResearchMaterial,
  MaterialCitation,
} from '../types';

// OpenAI API設定
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface GPTSearchRequest {
  currentMaterials: MaterialComposition;
  requirements: MaterialRequirement[];
  searchQuery?: string;
}

// OpenAI Deep Research プロンプト生成
export function generateDeepResearchPrompt(
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition,
  customQuery?: string
): string {
  const { composition, properties } = currentMaterials;

  // 要件をテキスト化
  const performanceReqs = [];
  if (requirements.tensileStrength) {
    performanceReqs.push(`引張強度: ${requirements.tensileStrength} N/15mm`);
  }
  if (requirements.oxygenPermeability) {
    performanceReqs.push(
      `酸素透過率: ${requirements.oxygenPermeability} cc/m²·day·atm以下`
    );
  }
  if (requirements.waterVaporPermeability) {
    performanceReqs.push(
      `水蒸気透過率: ${requirements.waterVaporPermeability} g/m²·day以下`
    );
  }
  if (requirements.heatResistance) {
    performanceReqs.push(`耐熱温度: ${requirements.heatResistance}℃以上`);
  }

  // カスタムクエリがある場合はそれを優先
  if (customQuery) {
    return customQuery;
  }

  const prompt = `
You are a specialized researcher in packaging materials. Please investigate the latest research papers and practical implementation cases under the following conditions:

[Current Material]
- Composition: ${composition || 'Unknown'}
- Properties: ${properties?.join(', ') || 'Unknown'}

[Performance Requirements]
${performanceReqs.join('\n')}

[Research Items]
1. Latest material research trends since 2020
2. Practical cases of sustainable packaging materials
3. Latest developments in bioplastics and biodegradable materials
4. Technologies for recyclable mono-material packaging
5. Performance comparison data of alternative materials

[Key Focus Points]
- Contribution to achieving carbon neutrality
- Safety certifications for food packaging
- Mass production feasibility and cost competitiveness
- Compatibility with existing processing equipment

[Response Format]
Please organize your answer in the following format:

1. Top 3 Recommended Materials
   - Material Name:
   - Manufacturer:
   - Key Physical Properties:
   - Price Range:
   - Implementation Cases:
   - References: [Paper/Report Title, Author/Institution, Year]

2. Technology Trends
   - Latest research and development directions
   - Future outlook
   - Reference information

3. Implementation Considerations
   - Technical challenges
   - Cost-related challenges
   - Regulatory and certification requirements

4. Reference List
   For each material, be sure to include:
   - Title of the document
   - Author/Research Institution
   - Publication Year
   - URL (if available)
   - Document type (Paper/Patent/Corporate Report/Website)

Please provide concrete material names, manufacturers, physical property data, and always include sources of information.
`;

  console.log(
    '🧠 Generated Deep Research Prompt (preview):',
    prompt.substring(0, 200) + '...'
  );
  return prompt;
}

// Deep Research結果をパース
export function parseDeepResearchResult(
  researchText: string
): DeepResearchResult {
  const materials: DeepResearchMaterial[] = [];
  const trends: string[] = [];
  const considerations: string[] = [];
  const citations: MaterialCitation[] = [];

  // セクションごとに分割
  const sections = researchText.split(/\n(?=\d\.)/);

  sections.forEach((section) => {
    // 推奨素材の抽出（引用元情報付き）
    if (section.includes('推奨素材') || section.includes('TOP')) {
      const materialBlocks = section.split(/素材名[:：]/);

      materialBlocks.forEach((block) => {
        if (block.trim()) {
          const lines = block.split('\n');
          const materialName = lines[0]?.trim();

          if (materialName && !materialName.includes('推奨素材')) {
            // 引用元を探す
            const citationMatch = block.match(
              /引用元[:：]?\s*\[?([^\]\n]+)\]?/
            );
            const materialCitations: MaterialCitation[] = [];

            if (citationMatch) {
              const citationText = citationMatch[1];
              // 簡易的な引用解析
              const citationParts = citationText
                .split(',')
                .map((s) => s.trim());

              if (citationParts.length >= 2) {
                materialCitations.push({
                  title: citationParts[0],
                  authors: citationParts[1],
                  year: parseInt(citationParts[2]) || new Date().getFullYear(),
                  type: 'paper',
                });
              }
            }

            materials.push({
              name: materialName.split(/[,、]/)[0].trim(),
              source: 'OpenAI Deep Research',
              confidence: 'high',
              citations:
                materialCitations.length > 0 ? materialCitations : undefined,
            });
          }
        }
      });
    }

    // 技術トレンドの抽出
    if (section.includes('トレンド') || section.includes('動向')) {
      const trendLines = section
        .split('\n')
        .filter((line) => line.includes('-') || line.includes('・'));
      trends.push(
        ...trendLines.map((line) => line.replace(/^[-・]\s*/, '').trim())
      );
    }

    // 考慮事項の抽出
    if (section.includes('考慮') || section.includes('課題')) {
      const considerationLines = section
        .split('\n')
        .filter((line) => line.includes('-') || line.includes('・'));
      considerations.push(
        ...considerationLines.map((line) =>
          line.replace(/^[-・]\s*/, '').trim()
        )
      );
    }

    // 引用文献リストの抽出
    if (section.includes('引用文献') || section.includes('文献リスト')) {
      const citationLines = section.split('\n').slice(1);

      citationLines.forEach((line) => {
        if (line.trim() && !line.startsWith('#')) {
          // 各種パターンで引用を解析
          const patterns = [
            // パターン1: "タイトル" (著者, 年)
            /"([^"]+)"\s*\(([^,]+),\s*(\d{4})\)/,
            // パターン2: タイトル, 著者, 年
            /^([^,]+),\s*([^,]+),\s*(\d{4})/,
            // パターン3: [1] タイトル - 著者 (年)
            /\[\d+\]\s*([^-]+)\s*-\s*([^(]+)\s*\((\d{4})\)/,
          ];

          for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
              citations.push({
                title: match[1].trim(),
                authors: match[2].trim(),
                year: parseInt(match[3]),
                type: line.includes('特許')
                  ? 'patent'
                  : line.includes('レポート')
                    ? 'report'
                    : 'paper',
              });
              break;
            }
          }
        }
      });
    }
  });

  // 材料名のパターンマッチング（追加）
  const materialPatterns = [
    /(?:PLA|PBS|PHA|PBAT|PCL|TPS|PHB|P3HB|P4HB)/gi,
    /(?:バイオ|リサイクル|再生|Bio-)(?:PET|PE|PP|PA)/gi,
    /(?:セルロース|キチン|デンプン|アルギン酸)(?:系|ベース)?/gi,
    /(?:ポリ乳酸|ポリヒドロキシアルカノエート|ポリブチレンサクシネート)/gi,
  ];

  materialPatterns.forEach((pattern) => {
    const matches = researchText.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        if (!materials.some((m) => m.name === match)) {
          materials.push({
            name: match,
            source: 'OpenAI Deep Research (Pattern Match)',
            confidence: 'medium',
          });
        }
      });
    }
  });

  // URL抽出
  const urlPattern = /https?:\/\/[^\s]+/g;
  const urlMatches = researchText.match(urlPattern);
  if (urlMatches) {
    urlMatches.forEach((url) => {
      // 既存の引用にURLを追加
      const urlDomain = new URL(url).hostname;
      const existingCitation = citations.find(
        (c) =>
          !c.url &&
          (c.title?.toLowerCase().includes(urlDomain.split('.')[0]) ||
            c.authors?.toLowerCase().includes(urlDomain.split('.')[0]))
      );

      if (existingCitation) {
        existingCitation.url = url;
      } else {
        // 新しい引用として追加
        citations.push({
          title: `Online Resource: ${urlDomain}`,
          url: url,
          type: 'website',
          year: new Date().getFullYear(),
        });
      }
    });
  }

  return {
    materials,
    trends,
    considerations,
    citations,
    fullText: researchText,
    timestamp: new Date().toISOString(),
  };
}

// OpenAI APIでDeep Research実行
export async function executeDeepResearch(
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition,
  customQuery?: string
): Promise<DeepResearchResult | null> {
  if (!OPENAI_API_KEY) {
    console.log('⚠️ OpenAI API key not configured, skipping deep research');
    return null;
  }

  try {
    console.log('🔬 Starting OpenAI Deep Research...');
    const prompt = generateDeepResearchPrompt(
      requirements,
      currentMaterials,
      customQuery
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a materials science expert specializing in sustainable packaging materials. Provide detailed, accurate, and up-to-date information based on recent research and industry developments. Always respond in Japanese.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    const researchResult = data.choices[0]?.message?.content;

    console.log('✅ Deep Research completed');

    // 研究結果を構造化データに変換
    return parseDeepResearchResult(researchResult);
  } catch (error) {
    console.error('Deep Research error:', error);
    return null;
  }
}

// GPT検索のメインAPI
export async function POST(req: NextRequest) {
  try {
    const body: GPTSearchRequest = await req.json();
    const { currentMaterials, requirements, searchQuery } = body;

    console.log('🤖 GPT search started...');

    // 要件を簡易的に抽出
    const extractedRequirements: ExtractedRequirements = {};
    requirements.forEach((req) => {
      const value = parseFloat(req.value);
      if (req.name.includes('引張強度'))
        extractedRequirements.tensileStrength = value;
      if (req.name.includes('酸素透過率'))
        extractedRequirements.oxygenPermeability = value;
      if (req.name.includes('水蒸気透過率'))
        extractedRequirements.waterVaporPermeability = value;
      if (req.name.includes('耐熱温度'))
        extractedRequirements.heatResistance = value;
    });

    // Deep Research実行
    const researchResult = await executeDeepResearch(
      extractedRequirements,
      currentMaterials,
      searchQuery
    );

    if (!researchResult) {
      return NextResponse.json(
        {
          error: 'OpenAI API not available',
          message: 'Please configure OPENAI_API_KEY in environment variables',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      result: researchResult,
      metadata: {
        prompt:
          generateDeepResearchPrompt(
            extractedRequirements,
            currentMaterials,
            searchQuery
          ).substring(0, 500) + '...',
        model: 'gpt-4-turbo-preview',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('GPT search error:', error);
    return NextResponse.json(
      {
        error: 'GPT search failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
