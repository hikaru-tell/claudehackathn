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

export default function ProposalsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scenarioId = searchParams.get('scenario');
  const [isLoading, setIsLoading] = useState(true);
  const [proposals, setProposals] = useState<
    {
      materialName: string;
      composition: string[];
      scores: Record<string, number>;
    }[]
  >([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<{
    materialName: string;
    composition: string[];
  } | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // URLパラメータから性能要件を取得
  const performanceReqs = searchParams.get('performanceReqs')
    ? JSON.parse(searchParams.get('performanceReqs')!)
    : [];

  const scenario = scenarios.find((s) => s.id === scenarioId);

  useEffect(() => {
    // モックデータ生成（実際はAPIコール）
    const loadProposals = async () => {
      setIsLoading(true);
      // 擬似的な遅延
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const mockProposals = generateMockProposals(scenarioId || '');
      setProposals(mockProposals);
      setIsLoading(false);
    };

    if (scenarioId) {
      loadProposals();
    }
  }, [scenarioId]);

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
              <div className="inline-flex items-center space-x-3">
                <svg
                  className="animate-spin h-8 w-8 text-green-600"
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
                <span className="text-xl text-gray-700">
                  AI が最適な素材を分析中...
                </span>
              </div>
              <p className="text-gray-500 mt-4">
                データベース検索とWeb情報を統合しています
              </p>
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
              <Button onClick={() => window.print()}>レポートを印刷</Button>
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
