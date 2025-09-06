'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProposalCard } from './ProposalCard';
import { ComparisonChart } from './ComparisonChart';
import { SustainabilityChart } from './SustainabilityChart';
import { Dialog } from './Dialog';
import { ExperimentPlanReport } from './ExperimentPlanReport';
import { scenarios } from '../scenarios/data';
import { generateMockProposals } from './mockData';

interface RecommendedMaterial {
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

export default function ProposalsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scenarioId = searchParams.get('scenario');
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState<RecommendedMaterial[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{
    materialName: string;
    composition: string[];
  } | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // 進捗管理用のstate
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');

  // URLパラメータを文字列として取得（useEffectの無限ループを防ぐため）
  const performanceReqsStr = searchParams.get('performanceReqs');
  const currentMaterialsStr = searchParams.get('currentMaterials');

  // 表示用にパース（useEffectの外で一度だけ）
  const performanceReqs = performanceReqsStr
    ? JSON.parse(performanceReqsStr)
    : [];

  const scenario = scenarios.find((s) => s.id === scenarioId);

  useEffect(() => {
    const loadProposals = async () => {
      setIsLoading(true);
      setLoadingProgress(0);
      setCurrentStep('初期化中...');

      try {
        // URLパラメータをuseEffect内でパース
        const currentMaterials = currentMaterialsStr
          ? JSON.parse(currentMaterialsStr)
          : null;
        const requirements = performanceReqsStr
          ? JSON.parse(performanceReqsStr)
          : [];

        // 実際のtotalAI APIを呼び出す（URLパラメータから材料と要件がある場合）
        if (currentMaterials && requirements.length > 0) {
          // ステップ1: フィルタリング生成中 (0-25%)
          setCurrentStep('フィルタリング生成中...');
          setLoadingProgress(10);
          await new Promise((resolve) => setTimeout(resolve, 500));
          setLoadingProgress(25);

          // ステップ2: Deep Research中 (25-50%)
          setCurrentStep('Deep Research中...');
          setLoadingProgress(30);

          // ステップ3: DB検索中 (50-75%)
          setTimeout(() => {
            setCurrentStep('データベース検索中...');
            setLoadingProgress(50);
          }, 1000);

          // ステップ4: Total AI稼働中 (75-100%)
          setTimeout(() => {
            setCurrentStep('Total AI 統合分析中...');
            setLoadingProgress(75);
          }, 2000);

          // 実際のAPI呼び出し
          const response = await fetch('/api/materials/totalAI', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentMaterials,
              requirements,
            }),
          });

          setLoadingProgress(90);

          if (response.ok) {
            const data = await response.json();
            setLoadingProgress(95);

            if (data.success && data.recommendations.length > 0) {
              setCurrentStep('完了！');
              setLoadingProgress(100);
              await new Promise((resolve) => setTimeout(resolve, 300));
              setProposals(data.recommendations);
            } else {
              // APIが成功したが推奨素材がない場合、モックデータを使用
              const mockProposals = generateMockProposals(scenarioId || '');
              setProposals(mockProposals);
            }
          } else {
            // APIエラーの場合、モックデータを使用
            console.error('Total AI API error:', response.status);
            const mockProposals = generateMockProposals(scenarioId || '');
            setProposals(mockProposals);
          }
        } else {
          // URLパラメータが不完全な場合、モックデータを使用
          setCurrentStep('デフォルトデータ読み込み中...');
          setLoadingProgress(50);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const mockProposals = generateMockProposals(scenarioId || '');
          setLoadingProgress(100);
          await new Promise((resolve) => setTimeout(resolve, 300));
          setProposals(mockProposals);
        }
      } catch (error) {
        console.error('Error loading proposals:', error);
        // エラーの場合、モックデータを使用
        setCurrentStep('エラー回復中...');
        const mockProposals = generateMockProposals(scenarioId || '');
        setProposals(mockProposals);
      } finally {
        setIsLoading(false);
      }
    };

    if (scenarioId) {
      loadProposals();
    }
  }, [scenarioId, currentMaterialsStr, performanceReqsStr]); // 文字列を依存配列に使用

  const handleProposalClick = (proposal: {
    materialName: string;
    composition: string[];
  }) => {
    setSelectedProposal(proposal);
    setShowDialog(true);
  };

  const handleDialogConfirm = async () => {
    setShowDialog(false);
    setIsGeneratingReport(true);

    // AI分析のモック（2秒の遅延）
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsGeneratingReport(false);
    setShowReport(true);
  };

  const handleCloseReport = () => {
    setShowReport(false);
    setSelectedProposal(null);
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>シナリオが選択されていません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* ヘッダー情報 */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl">{scenario.icon}</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {scenario.name} の代替素材提案
                </h2>
                <p className="text-gray-600">
                  AIが最適なサステナブル素材を分析しました
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Card className="text-center py-12">
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* プログレスステップ表示 */}
                <div className="flex justify-between items-center mb-8">
                  <div
                    className={`flex flex-col items-center ${loadingProgress >= 0 ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${loadingProgress >= 25 ? 'bg-green-600 border-green-600 text-white' : loadingProgress >= 0 ? 'border-green-600' : 'border-gray-400'}`}
                    >
                      {loadingProgress >= 25 ? '✓' : '1'}
                    </div>
                    <span className="text-xs mt-2">フィルタリング</span>
                  </div>
                  <div
                    className={`flex-1 h-0.5 ${loadingProgress >= 25 ? 'bg-green-600' : 'bg-gray-300'}`}
                  />

                  <div
                    className={`flex flex-col items-center ${loadingProgress >= 25 ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${loadingProgress >= 50 ? 'bg-green-600 border-green-600 text-white' : loadingProgress >= 25 ? 'border-green-600' : 'border-gray-400'}`}
                    >
                      {loadingProgress >= 50 ? '✓' : '2'}
                    </div>
                    <span className="text-xs mt-2">Deep Research</span>
                  </div>
                  <div
                    className={`flex-1 h-0.5 ${loadingProgress >= 50 ? 'bg-green-600' : 'bg-gray-300'}`}
                  />

                  <div
                    className={`flex flex-col items-center ${loadingProgress >= 50 ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${loadingProgress >= 75 ? 'bg-green-600 border-green-600 text-white' : loadingProgress >= 50 ? 'border-green-600' : 'border-gray-400'}`}
                    >
                      {loadingProgress >= 75 ? '✓' : '3'}
                    </div>
                    <span className="text-xs mt-2">DB検索</span>
                  </div>
                  <div
                    className={`flex-1 h-0.5 ${loadingProgress >= 75 ? 'bg-green-600' : 'bg-gray-300'}`}
                  />

                  <div
                    className={`flex flex-col items-center ${loadingProgress >= 75 ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${loadingProgress >= 100 ? 'bg-green-600 border-green-600 text-white' : loadingProgress >= 75 ? 'border-green-600' : 'border-gray-400'}`}
                    >
                      {loadingProgress >= 100 ? '✓' : '4'}
                    </div>
                    <span className="text-xs mt-2">Total AI</span>
                  </div>
                </div>

                {/* プログレスバー */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>

                {/* 現在のステップ表示 */}
                <div className="flex items-center justify-center space-x-3">
                  {loadingProgress < 100 && (
                    <svg
                      className="animate-spin h-6 w-6 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <span className="text-xl font-semibold text-gray-700">
                    {currentStep}
                  </span>
                </div>

                {/* 進捗パーセンテージ */}
                <p className="text-2xl font-bold text-green-600">
                  {loadingProgress}%
                </p>

                {/* 説明文 */}
                <p className="text-gray-500 text-sm">
                  {loadingProgress < 25 &&
                    '要件を分析してフィルタリング条件を生成しています...'}
                  {loadingProgress >= 25 &&
                    loadingProgress < 50 &&
                    '最新の研究論文と実用化事例を調査しています...'}
                  {loadingProgress >= 50 &&
                    loadingProgress < 75 &&
                    '有機ポリマーデータベースから候補材料を検索しています...'}
                  {loadingProgress >= 75 &&
                    loadingProgress < 100 &&
                    'AIが全ての結果を統合分析し、最適な素材を選定しています...'}
                  {loadingProgress >= 100 && '分析完了！結果を表示します...'}
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* 比較チャート */}
              <div className="mb-8">
                <div className="grid lg:grid-cols-2 gap-6">
                  <ComparisonChart
                    currentMaterial={scenario.currentMaterial}
                    proposals={proposals}
                    performanceReqs={performanceReqs}
                  />
                  <SustainabilityChart
                    currentMaterial={scenario.currentMaterial}
                    proposals={proposals}
                    performanceReqs={performanceReqs}
                  />
                </div>
              </div>

              {/* 提案リスト */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  推奨素材 TOP 3
                </h3>
                {proposals.map((proposal, index) => (
                  <ProposalCard
                    key={index}
                    proposal={proposal}
                    rank={index + 1}
                    onClick={() =>
                      handleProposalClick({
                        materialName: proposal.materialName,
                        composition: proposal.composition,
                      })
                    }
                  />
                ))}
              </div>
            </>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => router.push(`/scenarios/${scenarioId}`)}
            >
              要件を修正する
            </Button>
            {!isLoading && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    // PDF分析結果のモックデータを作成
                    const analysisData = [
                      {
                        fileName:
                          'フィルム規格書 - 製品コード_ TK-FILM-2024-STD.pdf',
                        requirements: [
                          {
                            name: '引張強度',
                            value: '100',
                            unit: 'N/15mm',
                            importance: 'high',
                          },
                          {
                            name: '伸び率',
                            value: '150',
                            unit: '%',
                            importance: 'medium',
                          },
                          {
                            name: '衝撃強度',
                            value: '1.0',
                            unit: 'J',
                            importance: 'medium',
                          },
                          {
                            name: 'ヒートシール強度',
                            value: '20',
                            unit: 'N/15mm',
                            importance: 'high',
                          },
                          {
                            name: '酸素透過率',
                            value: '1.0',
                            unit: 'cc/m²・day・atm',
                            importance: 'high',
                          },
                          {
                            name: '水蒸気透過率',
                            value: '2.0',
                            unit: 'g/m²・day',
                            importance: 'high',
                          },
                          {
                            name: '遮光性',
                            value: '99',
                            unit: '%',
                            importance: 'high',
                          },
                          {
                            name: '耐熱温度',
                            value: '120',
                            unit: '℃',
                            importance: 'high',
                          },
                          {
                            name: '耐寒温度',
                            value: '-20',
                            unit: '℃',
                            importance: 'medium',
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

                    // testページへ遷移
                    const encodedAnalysis = encodeURIComponent(
                      JSON.stringify(analysisData)
                    );
                    router.push(`/test?analysis=${encodedAnalysis}`);
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Materials Projectで詳細分析
                </Button>
                <Button onClick={() => window.print()}>レポートを印刷</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ダイアログ */}
      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDialogConfirm}
        title="実験計画レポートを生成"
        message="AIによる実験計画レポートを生成しますか？"
      />

      {/* レポート生成中のローディング */}
      {isGeneratingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <Card className="p-8 max-w-md">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                AI が実験計画を分析中...
              </h3>
              <p className="text-gray-600">
                最適な実験条件とテスト項目を生成しています
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* 実験計画レポート */}
      {showReport && selectedProposal && (
        <ExperimentPlanReport
          material={selectedProposal}
          onClose={handleCloseReport}
        />
      )}
    </div>
  );
}
