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
    // PDFファイルの場合
    const pdfParse = (await import('pdf-parse')).default;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    return data.text;
  } else {
    // その他のテキストファイル
    return await file.text();
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが見つかりません' },
        { status: 400 }
      );
    }

    // ファイルの内容を読み取る
    const text = await extractTextFromFile(file);
    
    // Claude APIを使って性能要件を分析
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `以下の文書から製品の性能要件を分析して、JSONフォーマットで抽出してください。
各要件について以下の形式で出力してください：
{
  "requirements": [
    {
      "name": "要件名",
      "value": "具体的な数値や基準",
      "unit": "単位（あれば）",
      "importance": "high/medium/low"
    }
  ]
}

文書内容：
${text}

重要な性能要件（強度、耐久性、温度耐性、重量、サイズ、コスト、環境基準など）を漏れなく抽出してください。`
        }
      ]
    });

    // Claude の応答からJSONを抽出
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';
    
    // JSONを解析
    let requirements;
    try {
      // JSONブロックを抽出（```json ... ``` の場合も対応）
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        requirements = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('JSON形式の応答が見つかりません');
      }
    } catch (parseError) {
      console.error('JSON解析エラー:', parseError);
      return NextResponse.json(
        { error: '要件の解析に失敗しました', details: responseText },
        { status: 500 }
      );
    }

    return NextResponse.json(requirements);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}