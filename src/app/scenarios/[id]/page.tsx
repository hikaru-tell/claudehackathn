'use client';

import { useRouter } from 'next/navigation';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { scenarios } from '../data';
import { MaterialRequirementsForm } from './MaterialRequirementsForm';

interface PageProps {
  params: {
    id: string;
  };
}

interface RequirementsData {
  scenarioId: string;
  performanceReqs: string[];
  sustainabilityReqs: string[];
  additionalNotes: string;
}

export default function ScenarioDetailPage({ params }: PageProps) {
  const router = useRouter();
  const scenario = scenarios.find((s) => s.id === params.id);

  if (!scenario) {
    return <div>シナリオが見つかりません</div>;
  }

  const handleSubmit = (data: RequirementsData) => {
    // 実際のアプリではここでデータを保存
    console.log('Requirements submitted:', data);

    // 性能要件をURLパラメータに含めて提案画面に遷移
    const urlParams = new URLSearchParams({
      scenario: params.id,
      performanceReqs: JSON.stringify(data.performanceReqs),
      sustainabilityReqs: JSON.stringify(data.sustainabilityReqs),
      additionalNotes: data.additionalNotes,
    });

    router.push(`/proposals?${urlParams.toString()}`);
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
              <div className="space-y-6">
                {/* 素材構成の詳細 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    素材構成:{' '}
                    <span className="font-mono text-xl text-blue-600">
                      {scenario.currentMaterial.composition}
                    </span>
                  </h3>

                  {/* 層構造の視覚的表現 */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      層構造
                    </h4>
                    <div className="flex items-center justify-center space-x-2">
                      {scenario.currentMaterial.composition
                        .split('/')
                        .map((layer, index) => (
                          <div key={index} className="flex items-center">
                            {index > 0 && (
                              <span className="text-gray-400 mx-2">+</span>
                            )}
                            <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg border border-blue-300">
                              <span className="font-mono font-semibold text-blue-800">
                                {layer}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* 特性と性能 */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        機能特性
                      </h4>
                      <div className="space-y-2">
                        {scenario.currentMaterial.properties.map(
                          (prop, index) => (
                            <div key={index} className="flex items-center">
                              <span className="text-green-500 mr-2">✓</span>
                              <span className="text-sm text-gray-700">
                                {prop}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        性能要求
                      </h4>
                      <div className="space-y-2">
                        {scenario.requirements.performance.map((req, index) => (
                          <div key={index} className="flex items-center">
                            <span className="text-blue-500 mr-2">◆</span>
                            <span className="text-sm text-gray-700">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* アップロード確認 */}
                <div className="border-t pt-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm text-blue-800">
                        アップロードされた情報はこちらですか？
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* 要件入力フォーム */}
          <div className="mb-8">
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
