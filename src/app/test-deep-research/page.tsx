'use client';

import { useState } from 'react';
import { Card } from '@/app/components/Card';

export default function TestDeepResearch() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [customQuery, setCustomQuery] = useState('');
  const [testMode, setTestMode] = useState<'preset' | 'custom'>('preset');

  // プリセットのテストデータ
  const presetTestData = {
    currentMaterials: {
      composition: 'PET(12μm)/Al-PET(12μm)/CPP(30μm)',
      properties: ['高バリア性', '高遮光性', '優れたヒートシール性'],
    },
    requirements: [
      {
        name: '引張強度',
        value: '100',
        unit: 'N/15mm',
        importance: 'high' as const,
      },
      {
        name: '酸素透過率',
        value: '1.0',
        unit: 'cc/m²·day·atm',
        importance: 'high' as const,
      },
      {
        name: '水蒸気透過率',
        value: '2.0',
        unit: 'g/m²·day',
        importance: 'high' as const,
      },
      {
        name: '耐熱温度',
        value: '120',
        unit: '℃',
        importance: 'high' as const,
      },
    ],
  };

  const runDeepResearch = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const requestBody =
        testMode === 'custom'
          ? { ...presetTestData, searchQuery: customQuery }
          : presetTestData;

      console.log('📤 Sending request:', requestBody);

      const response = await fetch('/api/materials/GPTsearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      console.log('📥 Received response:', data);
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const runIntegratedSearch = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('🔄 Running integrated search...');

      const response = await fetch('/api/materials/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(presetTestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      console.log('✅ Integrated search result:', data);
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Deep Research API テスト</h1>

      {/* 環境変数チェック */}
      <Card className="mb-6 p-4 bg-blue-50">
        <h2 className="text-lg font-semibold mb-2">📋 環境変数設定ガイド</h2>
        <p className="text-sm text-gray-600 mb-2">
          Deep Researchを使用するには、`.env.local`に以下を設定してください：
        </p>
        <code className="block bg-gray-100 p-2 rounded text-sm">
          OPENAI_API_KEY="sk-..."
        </code>
      </Card>

      {/* テストモード選択 */}
      <Card className="mb-6 p-4">
        <h2 className="text-lg font-semibold mb-4">テストモード</h2>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              value="preset"
              checked={testMode === 'preset'}
              onChange={(e) =>
                setTestMode(e.target.value as 'preset' | 'custom')
              }
              className="mr-2"
            />
            <span>プリセットクエリ（コーヒー豆包装材料）</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="custom"
              checked={testMode === 'custom'}
              onChange={(e) =>
                setTestMode(e.target.value as 'preset' | 'custom')
              }
              className="mr-2"
            />
            <span>カスタムクエリ</span>
          </label>
        </div>

        {testMode === 'custom' && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              カスタム検索クエリ:
            </label>
            <textarea
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="例: 2024年の最新バイオプラスチック技術で、食品包装に使える材料を教えてください"
              className="w-full p-2 border rounded h-24 text-sm"
            />
          </div>
        )}
      </Card>

      {/* テストボタン */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={runDeepResearch}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? '🔄 処理中...' : '🔬 Deep Research実行'}
        </button>

        <button
          onClick={runIntegratedSearch}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '🔄 処理中...' : '🔍 統合検索実行'}
        </button>
      </div>

      {/* エラー表示 */}
      {error && (
        <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <h3 className="text-red-700 font-semibold mb-2">❌ エラー</h3>
          <p className="text-red-600 text-sm">{error}</p>
          {error.includes('API key') && (
            <p className="text-sm mt-2 text-gray-600">
              OpenAI
              APIキーが設定されていません。`.env.local`を確認してください。
            </p>
          )}
        </Card>
      )}

      {/* 結果表示 */}
      {result && (
        <div className="space-y-6">
          {/* Deep Research結果 */}
          {result.result && (
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">
                🤖 Deep Research結果
              </h3>

              {/* 見つかった材料 */}
              <div className="mb-6">
                <h4 className="font-semibold mb-2">
                  📦 推奨材料 ({result.result.materials?.length || 0}件)
                </h4>
                <div className="space-y-2">
                  {result.result.materials?.map(
                    (material: any, idx: number) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">{material.name}</div>
                        <div className="text-sm text-gray-600">
                          信頼度: {material.confidence} | ソース:{' '}
                          {material.source}
                        </div>
                        {material.citations &&
                          material.citations.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              📚 引用: {material.citations[0].title}
                              {material.citations[0].year &&
                                ` (${material.citations[0].year})`}
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* トレンド */}
              {result.result.trends?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">📈 技術トレンド</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.result.trends
                      .slice(0, 5)
                      .map((trend: string, idx: number) => (
                        <li key={idx} className="text-sm">
                          {trend}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* 考慮事項 */}
              {result.result.considerations?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">⚠️ 考慮事項</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {result.result.considerations
                      .slice(0, 5)
                      .map((consideration: string, idx: number) => (
                        <li key={idx} className="text-sm">
                          {consideration}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* プロンプト（デバッグ用） */}
              {result.metadata?.prompt && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600">
                    🔍 使用されたプロンプト（クリックで表示）
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                    {result.metadata.prompt}
                  </pre>
                </details>
              )}

              {/* 引用文献リスト */}
              {result.result.citations?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">
                    📚 引用文献・データソース
                  </h4>
                  <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
                    {result.result.citations.map(
                      (citation: any, idx: number) => (
                        <div
                          key={idx}
                          className="text-sm mb-2 pb-2 border-b last:border-b-0"
                        >
                          <span className="font-medium">[{idx + 1}]</span>{' '}
                          {citation.title}
                          {citation.authors && ` - ${citation.authors}`}
                          {citation.year && ` (${citation.year})`}
                          {citation.url && (
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 text-blue-600 hover:underline"
                            >
                              🔗
                            </a>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* 統合検索結果 */}
          {result.materials && (
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">
                🎯 材料提案 ({result.materials.length}件)
              </h3>
              <div className="text-sm text-gray-600 mb-4">
                データソース: {result.metadata?.dataSource || 'Unknown'}
              </div>

              <div className="space-y-4">
                {result.materials.map((material: any, idx: number) => (
                  <div key={idx} className="border p-4 rounded">
                    <h4 className="font-semibold text-lg">{material.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {material.composition}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div>
                        サステナビリティスコア: {material.sustainabilityScore}%
                      </div>
                      <div>マッチスコア: {material.matchScore}%</div>
                    </div>

                    {material.deepResearchInsights && (
                      <div className="p-2 bg-blue-50 rounded text-sm mb-3">
                        💡 {material.deepResearchInsights}
                      </div>
                    )}

                    <div className="text-sm">
                      <div className="text-green-700">
                        ✅ {material.advantages?.slice(0, 2).join(' / ')}
                      </div>
                      {material.considerations?.length > 0 && (
                        <div className="text-orange-600">
                          ⚠️ {material.considerations[0]}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* 生データ表示 */}
          <details className="mt-6">
            <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
              📊 レスポンス全体（JSON）
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
