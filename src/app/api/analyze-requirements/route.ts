import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// PDFパーサーの動的インポート
async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    // PDFファイルの場合 - 一時的にモックデータを返す
    console.log('PDF解析をスキップし、モックデータを使用します');

    // 実際のPDF内容の代わりにサンプルテキストを返す
    return `
製品仕様書
製品コード: TK-FILM-2024-STD

1. 製品概要
本製品は食品包装用の多層フィルムです。

2. 素材構成
- 外層: PET (12μm) - 印刷適性、強度
- 中間層: アルミ蒸着PET (12μm) - バリア性、遮光性
- 内層: CPP (30μm) - ヒートシール性

3. 性能要件
3.1 物理的性能
- 引張強度: 100 N/15mm以上
- 伸び率: 150%以上
- 衝撃強度: 1.0 J以上
- ヒートシール強度: 20 N/15mm以上

3.2 バリア性能
- 酸素透過率: 1.0 cc/m²・day・atm以下
- 水蒸気透過率: 2.0 g/m²・day以下
- 遮光性: 99%以上

3.3 耐性要件
- 耐熱温度: 120℃ (30分)
- 耐寒温度: -20℃
- 耐油性: サラダ油 60℃ 30日間異常なし

4. 環境要件
- リサイクル: モノマテリアル化を推進
- CO2削減: 製造時のCO2排出量を従来比20%削減
- バイオマス: 一部バイオマス由来原料の使用を検討

5. 品質管理
- 外観: 異物、汚れ、キズなきこと
- 寸法: 幅 300mm ±2mm
- 厚み: 54μm ±5%
`;
  } else {
    // その他のテキストファイル
    return await file.text();
  }
}

export async function POST(req: NextRequest) {
  console.log('AI分析APIが呼び出されました');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('ファイルが見つかりません');
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }

    console.log(`ファイル受信: ${file.name}, サイズ: ${file.size} bytes`);

    // ファイルの内容を読み取る
    const text = await extractTextFromFile(file);
    console.log(`テキスト抽出完了: ${text.length} 文字`);

    console.log('Claude APIを呼び出します...');

    // Claude APIを使って性能要件を分析
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `以下の文書から製品の性能要件と素材情報を分析して、JSONフォーマットで抽出してください。
以下の形式で出力してください：
{
  "requirements": [
    {
      "name": "要件名",
      "value": "具体的な数値や基準",
      "unit": "単位（あれば）",
      "importance": "high/medium/low"
    }
  ],
  "materials": {
    "composition": "推定される素材構成（例：PET/Al/PE）",
    "properties": ["特性1", "特性2", "特性3"],
    "analysisConfidence": "high/medium/low"
  }
}

文書内容：
${text}

以下の点を重点的に分析してください：
1. 性能要件（強度、耐久性、温度耐性、バリア性、重量、サイズ、コストなど）
2. 使用されている素材や材料の情報
3. 包装形態や構造に関する情報
4. 環境・リサイクル要件

素材構成が明記されていない場合は、要件から推定して適切な多層構造を提案してください。`,
        },
      ],
    });

    console.log('Claude API応答受信');

    // Claude の応答からJSONを抽出
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    console.log('Claude応答内容の長さ:', responseText.length);

    // JSONを解析
    let requirements;
    try {
      // JSONブロックを抽出（```json ... ``` の場合も対応）
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        requirements = JSON.parse(jsonMatch[0]);
        console.log('JSON解析成功:', requirements);
      } else {
        throw new Error('JSON形式の応答が見つかりません');
      }
    } catch (parseError) {
      console.error('JSON解析エラー:', parseError);
      console.error('応答テキスト:', responseText);
      return NextResponse.json(
        { error: '要件の解析に失敗しました', details: responseText },
        { status: 500 }
      );
    }

    console.log('分析結果を返します');
    return NextResponse.json(requirements);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
