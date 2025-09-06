'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Scenario } from '../data';

interface RequirementsData {
  scenarioId: string;
  performanceReqs: string[];
  sustainabilityReqs: string[];
  additionalNotes: string;
}

interface AnalysisResult {
  fileName: string;
  requirements: Array<{
    name: string;
    value: string;
    unit?: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

interface MaterialRequirementsFormProps {
  scenario: Scenario;
  onSubmit: (data: RequirementsData) => void;
  analysisResults?: AnalysisResult[];
}

export function MaterialRequirementsForm({
  scenario,
  onSubmit,
  analysisResults = [],
}: MaterialRequirementsFormProps) {
  const [performanceReqs, setPerformanceReqs] = useState(
    scenario.requirements.performance
  );
  const [sustainabilityReqs, setSustainabilityReqs] = useState(
    scenario.requirements.sustainability
  );
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // AI分析結果を反映
  useEffect(() => {
    if (analysisResults.length > 0) {
      const aiRequirements = analysisResults.flatMap((result) =>
        result.requirements.map(
          (req) => `${req.name}: ${req.value}${req.unit || ''}`
        )
      );

      // 性能要件として高重要度のものを追加
      const highImportanceReqs = analysisResults.flatMap((result) =>
        result.requirements
          .filter((req) => req.importance === 'high')
          .map((req) => `${req.name}: ${req.value}${req.unit || ''}`)
      );

      if (highImportanceReqs.length > 0) {
        setPerformanceReqs((prev) => [...prev, ...highImportanceReqs]);
      }

      // ファイル名を記録
      if (analysisResults[0]) {
        setUploadedFileName(analysisResults[0].fileName);
      }
    }
  }, [analysisResults]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/analyze-requirements', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('分析に失敗しました');
      }

      const data = await response.json();

      // AIが抽出した要件をフォームに反映
      if (data.requirements && Array.isArray(data.requirements)) {
        const newPerformanceReqs: string[] = [];
        const newSustainabilityReqs: string[] = [];

        data.requirements.forEach((req: any) => {
          const reqText = req.unit
            ? `${req.name}: ${req.value} ${req.unit}`
            : `${req.name}: ${req.value}`;

          // 環境関連の要件はサステナビリティ要件に分類
          if (
            req.name.includes('環境') ||
            req.name.includes('リサイクル') ||
            req.name.includes('CO2') ||
            req.name.includes('エネルギー')
          ) {
            newSustainabilityReqs.push(reqText);
          } else {
            newPerformanceReqs.push(reqText);
          }
        });

        // 既存の要件に追加（重複を避ける）
        setPerformanceReqs([
          ...new Set([...performanceReqs, ...newPerformanceReqs]),
        ]);
        setSustainabilityReqs([
          ...new Set([...sustainabilityReqs, ...newSustainabilityReqs]),
        ]);
      }
    } catch (error) {
      console.error('ファイル分析エラー:', error);
      alert('ファイルの分析に失敗しました。もう一度お試しください。');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requirementsData = {
      scenarioId: scenario.id,
      performanceReqs,
      sustainabilityReqs,
      additionalNotes,
    };

    onSubmit(requirementsData);
  };

  return (
    <Card title="要件設定">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 性能要件 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            性能要件
          </label>
          <div className="space-y-2">
            {performanceReqs.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <input
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const newReqs = [...performanceReqs];
                    newReqs[index] = e.target.value;
                    setPerformanceReqs(newReqs);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newReqs = performanceReqs.filter(
                      (_, i) => i !== index
                    );
                    setPerformanceReqs(newReqs);
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setPerformanceReqs([...performanceReqs, '']);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg border-2 border-dashed border-green-300 hover:border-green-400 transition-colors w-full"
            >
              <span className="text-lg">+</span>
              <span>性能要件を追加</span>
            </button>
          </div>
        </div>

        {/* サステナビリティ要件 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            サステナビリティ要件
          </label>
          <div className="space-y-2">
            {sustainabilityReqs.map((req, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <input
                  type="text"
                  value={req}
                  onChange={(e) => {
                    const newReqs = [...sustainabilityReqs];
                    newReqs[index] = e.target.value;
                    setSustainabilityReqs(newReqs);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newReqs = sustainabilityReqs.filter(
                      (_, i) => i !== index
                    );
                    setSustainabilityReqs(newReqs);
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  削除
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setSustainabilityReqs([...sustainabilityReqs, '']);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg border-2 border-dashed border-green-300 hover:border-green-400 transition-colors w-full"
            >
              <span className="text-lg">+</span>
              <span>サステナビリティ要件を追加</span>
            </button>
          </div>
        </div>

        {/* 追加要件 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            追加要件・備考
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="その他の要件や制約事項があれば入力してください..."
          />
        </div>

        <Button type="submit" className="w-full">
          AI提案を生成する
        </Button>
      </form>
    </Card>
  );
}
