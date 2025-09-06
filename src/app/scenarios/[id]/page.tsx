'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { scenarios } from '../data';
import { MaterialRequirementsForm } from './MaterialRequirementsForm';

// AI生成の素材構成データの型定義
interface MaterialComposition {
  id: string;
  name: string;
  composition: string;
  properties: string[];
  sustainability: {
    recyclability: '高' | '中' | '低';
    co2Reduction: string;
    biomassContent?: string;
  };
  performance: {
    barrierLevel: '優' | '良' | '可';
    strength: '高' | '中' | '低';
    cost: '高' | '中' | '低';
  };
  recommended?: boolean;
}

interface PageProps {
  params: {
    id: string;
  };
}

// AI生成のモック素材構成データ
const getMockMaterialCompositions = (
  scenarioId: string
): MaterialComposition[] => {
  const compositionsMap: Record<string, MaterialComposition[]> = {
    'potato-chips': [
      {
        id: '1',
        name: 'モノマテリアルPP',
        composition: 'PP/PP/PP',
        properties: ['酸素バリア改良', '防湿性', 'ヒートシール性', '透明性'],
        sustainability: {
          recyclability: '高',
          co2Reduction: '30%削減',
          biomassContent: '0%',
        },
        performance: {
          barrierLevel: '良',
          strength: '中',
          cost: '中',
        },
        recommended: true,
      },
      {
        id: '2',
        name: 'バイオPET複合',
        composition: 'BioPET/EVOH/BioPET',
        properties: ['高酸素バリア', '遮光性', '防湿性', '再生可能'],
        sustainability: {
          recyclability: '中',
          co2Reduction: '45%削減',
          biomassContent: '30%',
        },
        performance: {
          barrierLevel: '優',
          strength: '高',
          cost: '高',
        },
      },
      {
        id: '3',
        name: '紙ベース複合',
        composition: '紙/バリアコート/PE',
        properties: ['生分解性', '軽量', '印刷適性', '基本バリア'],
        sustainability: {
          recyclability: '中',
          co2Reduction: '50%削減',
          biomassContent: '70%',
        },
        performance: {
          barrierLevel: '可',
          strength: '低',
          cost: '低',
        },
      },
    ],
    'frozen-food': [
      {
        id: '1',
        name: '高性能PE',
        composition: 'PE/EVOH/PE',
        properties: ['耐寒性', '電子レンジ対応', '酸素バリア', '柔軟性'],
        sustainability: {
          recyclability: '高',
          co2Reduction: '25%削減',
        },
        performance: {
          barrierLevel: '良',
          strength: '高',
          cost: '中',
        },
        recommended: true,
      },
      {
        id: '2',
        name: 'バイオナイロン複合',
        composition: 'BioPA/EVOH/PP',
        properties: ['高強度', '耐ピンホール', '酸素バリア', '耐熱性'],
        sustainability: {
          recyclability: '中',
          co2Reduction: '40%削減',
          biomassContent: '35%',
        },
        performance: {
          barrierLevel: '優',
          strength: '高',
          cost: '高',
        },
      },
    ],
    'coffee-beans': [
      {
        id: '1',
        name: '紙アルミ代替',
        composition: '紙/SiOxコート/BioPE',
        properties: ['酸素バリア', '防湿', '香り保持', 'コンポスト可能'],
        sustainability: {
          recyclability: '高',
          co2Reduction: '60%削減',
          biomassContent: '80%',
        },
        performance: {
          barrierLevel: '良',
          strength: '中',
          cost: '中',
        },
        recommended: true,
      },
      {
        id: '2',
        name: '高バリアPP',
        composition: 'PP/EVOH/PP',
        properties: ['高酸素バリア', '透明性', 'リサイクル可', '軽量'],
        sustainability: {
          recyclability: '高',
          co2Reduction: '35%削減',
        },
        performance: {
          barrierLevel: '優',
          strength: '中',
          cost: '低',
        },
      },
    ],
    'beverage-bottle': [
      {
        id: '1',
        name: '100%リサイクルPET',
        composition: 'rPET',
        properties: ['透明性', 'ガスバリア', '耐圧性', '完全リサイクル'],
        sustainability: {
          recyclability: '高',
          co2Reduction: '50%削減',
        },
        performance: {
          barrierLevel: '良',
          strength: '高',
          cost: '中',
        },
        recommended: true,
      },
      {
        id: '2',
        name: 'バイオPET30%',
        composition: 'BioPET(30%)/PET(70%)',
        properties: ['透明性', '高強度', 'ガスバリア', '部分バイオ'],
        sustainability: {
          recyclability: '高',
          co2Reduction: '20%削減',
          biomassContent: '30%',
        },
        performance: {
          barrierLevel: '優',
          strength: '高',
          cost: '中',
        },
      },
    ],
  };

  return compositionsMap[scenarioId] || [];
};

export default function ScenarioDetailPage({ params }: PageProps) {
  const router = useRouter();
  const scenario = scenarios.find((s) => s.id === params.id);
  const [requirements, setRequirements] = useState<any>(null);

  // AI生成の素材構成データを取得
  const materialCompositions = getMockMaterialCompositions(params.id);

  if (!scenario) {
    return <div>シナリオが見つかりません</div>;
  }

  const handleSubmit = (data: any) => {
    setRequirements(data);
    // 実際のアプリではここでデータを保存
    router.push(`/proposals?scenario=${params.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー情報 */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">{scenario.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {scenario.name}
                </h1>
                <p className="text-gray-600">{scenario.description}</p>
              </div>
            </div>
          </div>

          {/* 現在の素材構成セクション */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-gray-100 px-3 py-1 rounded-lg mr-3">
                現在
              </span>
              既存の素材構成
            </h2>

            <Card className="bg-gray-50 border-2 border-gray-300">
              <div className="grid md:grid-cols-2 gap-6">
                {/* 左側：素材構成と特性 */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      素材構成
                    </h3>
                    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <span className="font-mono text-lg font-bold text-gray-800">
                        {scenario.currentMaterial.composition}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      主な特性
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {scenario.currentMaterial.properties.map(
                        (prop, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white text-gray-700 border border-gray-200 rounded-full text-sm"
                          >
                            {prop}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* 右側：課題と要求事項 */}
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      現状の課題
                    </h3>
                    <div className="space-y-2">
                      {scenario.challenges.map((challenge, index) => (
                        <div key={index} className="flex items-start">
                          <span className="text-red-500 mr-2 mt-0.5">⚠️</span>
                          <span className="text-sm text-gray-700">
                            {challenge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      サステナビリティ要件
                    </h3>
                    <div className="space-y-1">
                      {scenario.requirements.sustainability.map(
                        (req, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-0.5">
                              →
                            </span>
                            <span className="text-sm text-gray-700">{req}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* AI提案の素材構成一覧 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-green-500 text-white px-3 py-1 rounded-lg mr-3">
                AI提案
              </span>
              持続可能な代替素材構成
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materialCompositions.map((material) => (
                <Card
                  key={material.id}
                  className={`relative ${material.recommended ? 'ring-2 ring-green-500' : ''}`}
                >
                  {material.recommended && (
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      推奨
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {material.name}
                  </h3>

                  <p className="font-mono text-sm text-gray-600 mb-4">
                    {material.composition}
                  </p>

                  {/* 特性タグ */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {material.properties.slice(0, 3).map((prop, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {prop}
                      </span>
                    ))}
                    {material.properties.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{material.properties.length - 3}
                      </span>
                    )}
                  </div>

                  {/* サステナビリティ指標 */}
                  <div className="border-t pt-3 mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      サステナビリティ
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">リサイクル性:</span>
                        <span
                          className={`font-semibold ${
                            material.sustainability.recyclability === '高'
                              ? 'text-green-600'
                              : material.sustainability.recyclability === '中'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {material.sustainability.recyclability}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">CO2削減:</span>
                        <span className="font-semibold text-green-600">
                          {material.sustainability.co2Reduction}
                        </span>
                      </div>
                      {material.sustainability.biomassContent && (
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">バイオマス:</span>
                          <span className="font-semibold text-green-600">
                            {material.sustainability.biomassContent}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* パフォーマンス指標 */}
                  <div className="border-t pt-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                      性能評価
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-gray-600">バリア</div>
                        <div
                          className={`text-sm font-semibold ${
                            material.performance.barrierLevel === '優'
                              ? 'text-green-600'
                              : material.performance.barrierLevel === '良'
                                ? 'text-yellow-600'
                                : 'text-orange-600'
                          }`}
                        >
                          {material.performance.barrierLevel}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">強度</div>
                        <div
                          className={`text-sm font-semibold ${
                            material.performance.strength === '高'
                              ? 'text-green-600'
                              : material.performance.strength === '中'
                                ? 'text-yellow-600'
                                : 'text-orange-600'
                          }`}
                        >
                          {material.performance.strength}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">コスト</div>
                        <div
                          className={`text-sm font-semibold ${
                            material.performance.cost === '低'
                              ? 'text-green-600'
                              : material.performance.cost === '中'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                          }`}
                        >
                          {material.performance.cost}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 要件入力フォーム */}
          <div className="max-w-4xl mx-auto">
            <MaterialRequirementsForm
              scenario={scenario}
              onSubmit={handleSubmit}
            />

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => router.push('/scenarios')}
              >
                シナリオ選択に戻る
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
