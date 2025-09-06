'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Requirement {
  name: string;
  value: string;
  unit?: string;
  importance: 'high' | 'medium' | 'low';
}

interface Materials {
  composition: string;
  properties: string[];
  analysisConfidence: string;
}

interface AnalysisResult {
  fileName: string;
  requirements: Requirement[];
  materials: Materials;
}

interface SustainableMaterial {
  name: string;
  composition: string;
  properties: {
    tensileStrength?: number;
    elongation?: number;
    oxygenPermeability?: number;
    waterVaporPermeability?: number;
    heatResistance?: number;
    recyclability?: string;
    biodegradability?: string;
    carbonFootprint?: number;
  };
  sustainabilityScore: number;
  matchScore: number;
  advantages: string[];
  considerations: string[];
}

export default function TestPage() {
  const searchParams = useSearchParams();
  const [analysisData, setAnalysisData] = useState<AnalysisResult[]>([]);
  const [sustainableMaterials, setSustainableMaterials] = useState<
    SustainableMaterial[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('Loading...');

  useEffect(() => {
    // URLパラメータから分析データを取得
    const analysisParam = searchParams.get('analysis');
    if (analysisParam) {
      try {
        // まず直接JSONパースを試みる（既にデコードされている場合）
        let parsed;
        try {
          parsed = JSON.parse(analysisParam);
        } catch {
          // パースできない場合はデコードしてから再度パース
          try {
            const decoded = decodeURIComponent(analysisParam);
            parsed = JSON.parse(decoded);
          } catch {
            // それでもダメな場合は二重デコードを試みる
            const decoded = decodeURIComponent(
              decodeURIComponent(analysisParam)
            );
            parsed = JSON.parse(decoded);
          }
        }

        setAnalysisData(parsed);
        console.log('Parsed analysis data:', parsed);
        setError(null); // エラーをクリア
      } catch (e) {
        console.error('Failed to parse analysis data:', e);
        console.log('Using default mock data instead');

        // デフォルトのモックデータを設定
        const defaultAnalysis = [
          {
            fileName: 'フィルム規格書 - 製品コード_ TK-FILM-2024-STD.pdf',
            requirements: [
              {
                name: '引張強度',
                value: '100',
                unit: 'N/15mm',
                importance: 'high' as const,
              },
              {
                name: '伸び率',
                value: '150',
                unit: '%',
                importance: 'medium' as const,
              },
              {
                name: '衝撃強度',
                value: '1.0',
                unit: 'J',
                importance: 'medium' as const,
              },
              {
                name: 'ヒートシール強度',
                value: '20',
                unit: 'N/15mm',
                importance: 'high' as const,
              },
              {
                name: '酸素透過率',
                value: '1.0',
                unit: 'cc/m²・day・atm',
                importance: 'high' as const,
              },
              {
                name: '水蒸気透過率',
                value: '2.0',
                unit: 'g/m²・day',
                importance: 'high' as const,
              },
              {
                name: '遮光性',
                value: '99',
                unit: '%',
                importance: 'high' as const,
              },
              {
                name: '耐熱温度',
                value: '120',
                unit: '℃',
                importance: 'high' as const,
              },
              {
                name: '耐寒温度',
                value: '-20',
                unit: '℃',
                importance: 'medium' as const,
              },
            ],
            materials: {
              composition: 'PET(12μm)/Al-PET(12μm)/CPP(30μm)',
              properties: [
                '印刷適性',
                '機械的強度',
                '高バリア性',
                '遮光性',
                'ヒートシール性',
                '耐油性',
              ],
              analysisConfidence: 'high',
            },
          },
        ];

        setAnalysisData(defaultAnalysis);
        setError(
          'URLパラメータからのデータ読み込みに失敗したため、デフォルトデータを使用しています'
        );
      }
    } else {
      // analysisパラメータがない場合もデフォルトデータを設定
      const defaultAnalysis = [
        {
          fileName: 'フィルム規格書 - 製品コード_ TK-FILM-2024-STD.pdf',
          requirements: [
            {
              name: '引張強度',
              value: '100',
              unit: 'N/15mm',
              importance: 'high' as const,
            },
            {
              name: '伸び率',
              value: '150',
              unit: '%',
              importance: 'medium' as const,
            },
            {
              name: '酸素透過率',
              value: '1.0',
              unit: 'cc/m²・day・atm',
              importance: 'high' as const,
            },
            {
              name: '水蒸気透過率',
              value: '2.0',
              unit: 'g/m²・day',
              importance: 'high' as const,
            },
            {
              name: '遮光性',
              value: '99',
              unit: '%',
              importance: 'high' as const,
            },
            {
              name: '耐熱温度',
              value: '120',
              unit: '℃',
              importance: 'high' as const,
            },
          ],
          materials: {
            composition: 'PET(12μm)/Al-PET(12μm)/CPP(30μm)',
            properties: ['高バリア性', '遮光性', 'ヒートシール性'],
            analysisConfidence: 'high',
          },
        },
      ];
      setAnalysisData(defaultAnalysis);
    }
  }, [searchParams]);

  useEffect(() => {
    if (analysisData.length > 0) {
      fetchSustainableMaterials();
    }
  }, [analysisData]);

  const fetchSustainableMaterials = async () => {
    setLoading(true);
    try {
      // タイムアウトを設定（3秒）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('Request timeout, using mock data');
      }, 3000);

      const response = await fetch('/api/materials/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentMaterials: analysisData[0]?.materials,
          requirements: analysisData[0]?.requirements,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Failed to fetch sustainable materials');
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.materials && data.materials.length > 0) {
        setSustainableMaterials(data.materials);
        setDataSource(data.metadata?.dataSource || 'Materials Project API');
      } else {
        // データが空の場合はモックデータを使用
        setSustainableMaterials(getMockSustainableMaterials());
        setDataSource('Mock Data (Empty Response)');
      }
    } catch (error) {
      console.error('Error fetching sustainable materials:', error);
      // エラー時はすぐにモックデータを表示
      setSustainableMaterials(getMockSustainableMaterials());
      setDataSource('Mock Data (Fallback)');
    } finally {
      setLoading(false);
    }
  };

  const getMockSustainableMaterials = (): SustainableMaterial[] => {
    return [
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
          '必要な物理的性能を維持',
        ],
        considerations: [
          '耐熱性がやや低下（120℃→110℃）',
          '材料コストが15%上昇',
        ],
      },
      {
        name: 'モノマテリアルPE多層構造',
        composition: 'HDPE(20μm)/MDPE(15μm)/LLDPE(20μm)',
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
          '優れた水蒸気バリア性',
          'コスト競争力あり',
        ],
        considerations: [
          '酸素バリア性がやや劣る',
          '遮光性の確保に工夫が必要',
          'バイオマス由来ではない',
        ],
      },
      {
        name: 'セルロースナノファイバー強化バイオプラスチック',
        composition: 'CNF-PBS(25μm)/EVOH(5μm)/CNF-PBS(25μm)',
        properties: {
          tensileStrength: 110,
          elongation: 130,
          oxygenPermeability: 0.8,
          waterVaporPermeability: 2.2,
          heatResistance: 105,
          recyclability: '化学的リサイクル可能',
          biodegradability: '生分解性',
          carbonFootprint: 0.6,
        },
        sustainabilityScore: 90,
        matchScore: 83,
        advantages: [
          '優れた生分解性',
          '最も低いカーボンフットプリント',
          '高強度・高バリア性',
          '100%バイオマス由来可能',
        ],
        considerations: [
          '新技術のため供給体制が限定的',
          '材料コストが30%上昇',
          '耐熱性が要求仕様を下回る可能性',
        ],
      },
    ];
  };

  const getPropertyColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  // エラーがある場合でも、データがあれば表示を続ける

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">サステナブル素材候補</h1>

        {/* エラー通知バナー */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        {/* 現在の素材情報 */}
        {analysisData.length > 0 && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">現在の素材構成</h2>
            <div className="space-y-2">
              <p className="text-gray-700">
                <span className="font-medium">構成：</span>
                {analysisData[0].materials.composition}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">特性：</span>
                {analysisData[0].materials.properties.join('、')}
              </p>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-3">主要な性能要件</h3>
            <div className="grid grid-cols-2 gap-3">
              {analysisData[0].requirements
                .filter((req) => req.importance === 'high')
                .map((req, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{req.name}：</span>
                    <span className="text-gray-600">
                      {req.value}
                      {req.unit && ` ${req.unit}`}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* サステナブル素材候補 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">代替素材の提案</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            sustainableMaterials.map((material, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {material.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{material.composition}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-2xl font-bold ${getPropertyColor(
                        material.sustainabilityScore
                      )}`}
                    >
                      {material.sustainabilityScore}%
                    </div>
                    <div className="text-sm text-gray-500">
                      サステナビリティスコア
                    </div>
                    <div className="text-lg font-semibold text-blue-600 mt-2">
                      {material.matchScore}%
                    </div>
                    <div className="text-sm text-gray-500">要件適合度</div>
                  </div>
                </div>

                {/* 物性値 */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded">
                  <div>
                    <span className="text-sm text-gray-600">引張強度：</span>
                    <span className="font-medium">
                      {material.properties.tensileStrength} N/15mm
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">伸び率：</span>
                    <span className="font-medium">
                      {material.properties.elongation}%
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">酸素透過率：</span>
                    <span className="font-medium">
                      {material.properties.oxygenPermeability} cc/m²·day·atm
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      水蒸気透過率：
                    </span>
                    <span className="font-medium">
                      {material.properties.waterVaporPermeability} g/m²·day
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">耐熱温度：</span>
                    <span className="font-medium">
                      {material.properties.heatResistance}℃
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">CO2排出量：</span>
                    <span className="font-medium">
                      {material.properties.carbonFootprint} kg-CO2/kg
                    </span>
                  </div>
                </div>

                {/* 環境特性 */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded">
                    <span className="text-sm font-semibold text-green-800">
                      リサイクル性：
                    </span>
                    <span className="text-sm text-green-700 ml-2">
                      {material.properties.recyclability}
                    </span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded">
                    <span className="text-sm font-semibold text-blue-800">
                      生分解性：
                    </span>
                    <span className="text-sm text-blue-700 ml-2">
                      {material.properties.biodegradability}
                    </span>
                  </div>
                </div>

                {/* 利点と考慮事項 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">利点</h4>
                    <ul className="space-y-1">
                      {material.advantages.map((adv, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-green-500 mr-2">✓</span>
                          {adv}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">
                      考慮事項
                    </h4>
                    <ul className="space-y-1">
                      {material.considerations.map((con, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="text-orange-500 mr-2">!</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Materials Project API情報 */}
        <div className="mt-12 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">データソース情報</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                ソース:
              </span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  dataSource.includes('Real Data')
                    ? 'bg-green-100 text-green-800'
                    : dataSource.includes('Mock')
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                }`}
              >
                {dataSource}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {dataSource.includes('Real Data')
                ? 'Materials Project APIから実際のデータを取得しました。'
                : dataSource.includes('Mock')
                  ? 'デモ用のサンプルデータを表示しています。'
                  : 'AI分析により最適な素材を提案しています。'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              素材候補数: {sustainableMaterials.length}件
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
