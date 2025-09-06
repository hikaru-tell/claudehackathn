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
あなたは包装材料の専門研究者です。以下の条件で最新の研究論文と実用化事例を調査してください。

【現在の素材】
- 構成: ${composition || '不明'}
- 特性: ${properties?.join(', ') || '不明'}

【性能要件】
${performanceReqs.join('\n')}

【調査項目】
1. 2020年以降の最新素材研究トレンド
2. サステナブル包装材料の実用化事例
3. バイオプラスチック・生分解性材料の最新開発状況
4. リサイクル可能な単一素材化技術
5. 代替素材の性能比較データ

【特に重視する点】
- カーボンニュートラル達成への貢献
- 食品包装としての安全性認証
- 大量生産可能性とコスト競争力
- 既存設備での加工適合性

【回答形式】
以下の形式で整理して回答してください：

1. 推奨素材TOP3
   - 素材名:
   - 製造メーカー:
   - 主要物性値:
   - 価格帯:
   - 導入事例:
   - 引用元: [論文名/報告書名, 著者/機関, 年]

2. 技術トレンド
   - 最新の研究開発動向
   - 今後の展望
   - 引用元情報

3. 実装上の考慮事項
   - 技術的課題
   - コスト面の課題
   - 規制・認証要件

4. 引用文献リスト
   各材料について必ず以下の情報を含めてください：
   - 文献タイトル
   - 著者/研究機関
   - 発表年
   - URL（あれば）
   - 文献タイプ（論文/特許/企業レポート/ウェブサイト）

具体的な材料名、製造メーカー、物性データ、そして必ず情報源を含めて回答してください。
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
