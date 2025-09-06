"use client";

import { Card } from "../components/Card";
import type { ExperimentPlan } from "../api/experiment-plan/route";

interface ExperimentPlanReportProps {
  material: {
    materialName: string;
    composition: string[];
  };
  experimentPlan: ExperimentPlan | null;
  onClose: () => void;
}

export function ExperimentPlanReport({
  material,
  experimentPlan,
  onClose,
}: ExperimentPlanReportProps) {
  // AI生成された実験計画データを使用
  // フォールバック用のデフォルト値を設定
  const defaultExperimentPlan = {
    overview: {
      title: `${material.materialName}の開発実験計画`,
      objective: `既存材料から${material.materialName}への移行を実現するための実験計画と評価方法`,
      duration: "3-6ヶ月",
      budget: "500-800万円",
    },
    phases: [
      {
        phase: "Phase 1: 材料調達と基礎評価",
        duration: "1ヶ月",
        tasks: [
          "原材料サプライヤーの選定と調達",
          "基礎物性の測定（引張強度、伸び、厚み等）",
          "化学組成分析とFT-IR測定",
          "DSC/TGA熱分析",
        ],
      },
      {
        phase: "Phase 2: 複合材料の配合最適化",
        duration: "2ヶ月",
        tasks: [
          `${material.composition.join("/")}の配合比率最適化`,
          "ラミネート条件の検討（温度、圧力、時間）",
          "層間接着強度の評価",
          "バリア性能の測定（酸素透過率、水蒸気透過率）",
        ],
      },
      {
        phase: "Phase 3: 加工性評価",
        duration: "1ヶ月",
        tasks: [
          "印刷適性試験（インキ密着性、耐擦性）",
          "ヒートシール性評価",
          "製袋加工テスト",
          "充填包装ラインでの適性確認",
        ],
      },
      {
        phase: "Phase 4: 実用性能評価",
        duration: "1-2ヶ月",
        tasks: [
          "保存試験（常温、加速条件）",
          "内容物との相性確認",
          "輸送シミュレーション試験",
          "消費者モニタリング調査",
        ],
      },
    ],
    keyTests: [
      {
        test: "酸素バリア性測定",
        method: "ASTM D3985",
        target: "< 1.0 cc/m²/day",
        equipment: "MOCON OX-TRAN",
      },
      {
        test: "水蒸気バリア性測定",
        method: "ASTM F1249",
        target: "< 1.0 g/m²/day",
        equipment: "MOCON PERMATRAN-W",
      },
      {
        test: "ヒートシール強度",
        method: "JIS Z0238",
        target: "> 15 N/15mm",
        equipment: "万能試験機",
      },
      {
        test: "リサイクル性評価",
        method: "社内基準",
        target: "リサイクル率 > 80%",
        equipment: "小型リサイクル実証設備",
      },
    ],
    risks: [
      {
        risk: "目標バリア性未達",
        probability: "中",
        impact: "高",
        mitigation: "コーティング材料の追加検討、多層化の検討",
      },
      {
        risk: "コスト目標超過",
        probability: "中",
        impact: "中",
        mitigation: "材料使用量の最適化、代替サプライヤーの探索",
      },
      {
        risk: "既存設備での加工不適合",
        probability: "低",
        impact: "高",
        mitigation: "早期の実機テスト、設備改造の事前検討",
      },
    ],
    deliverables: [
      {
        deliverable: "材料仕様書",
        timeline: "2ヶ月後",
        description: "最適化された材料の詳細仕様と品質基準",
      },
      {
        deliverable: "物性評価レポート",
        timeline: "3ヶ月後",
        description: "全試験項目の結果と合否判定",
      },
      {
        deliverable: "加工条件ガイドライン",
        timeline: "3ヶ月後",
        description: "印刷・ラミネート・製袋の最適条件",
      },
      {
        deliverable: "リサイクル性評価報告書",
        timeline: "4ヶ月後",
        description: "環境負荷とリサイクル性の評価結果",
      },
      {
        deliverable: "LCA分析レポート",
        timeline: "5ヶ月後",
        description: "ライフサイクル全体の環境影響評価",
      },
      {
        deliverable: "量産移行計画書",
        timeline: "6ヶ月後",
        description: "量産化に向けた技術・コスト・スケジュール提案",
      },
    ],
  };

  // AI生成データがある場合はそれを使用、なければデフォルト値を使用
  const finalExperimentPlan = experimentPlan || defaultExperimentPlan;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        {/* オーバーレイ */}
        <div className="fixed inset-0 bg-black/70" onClick={onClose} />

        {/* レポート本体 */}
        <div className="relative max-w-5xl mx-auto">
          <Card className="relative">
            {/* ヘッダー */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {finalExperimentPlan.overview.title}
                </h2>
                <p className="text-gray-600 mt-2">
                  {finalExperimentPlan.overview.objective}
                </p>
                <div className="flex gap-6 mt-4">
                  <span className="text-sm text-gray-500">
                    <strong>期間:</strong>{" "}
                    {finalExperimentPlan.overview.duration}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>予算:</strong> {finalExperimentPlan.overview.budget}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 実験フェーズ */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                実験フェーズ
              </h3>
              <div className="space-y-4">
                {finalExperimentPlan.phases.map((phase, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-gray-800">
                      {phase.phase}
                      <span className="text-sm text-gray-500 ml-2">
                        （{phase.duration}）
                      </span>
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {phase.tasks.map((task, taskIndex) => (
                        <li
                          key={taskIndex}
                          className="text-gray-600 text-sm flex items-start"
                        >
                          <span className="text-green-500 mr-2">•</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 主要試験項目 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                主要試験項目
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-gray-700">試験項目</th>
                      <th className="text-left py-2 text-gray-700">試験方法</th>
                      <th className="text-left py-2 text-gray-700">目標値</th>
                      <th className="text-left py-2 text-gray-700">使用機器</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalExperimentPlan.keyTests.map((test, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 text-gray-600">{test.test}</td>
                        <td className="py-2 text-gray-600">{test.method}</td>
                        <td className="py-2 text-gray-600 font-mono text-sm">
                          {test.target}
                        </td>
                        <td className="py-2 text-gray-600">{test.equipment}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* リスクと対策 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                リスクと対策
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {finalExperimentPlan.risks.map((risk, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {risk.risk}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">発生確率:</span>{" "}
                        <span
                          className={`font-semibold ${
                            risk.probability === "高"
                              ? "text-red-600"
                              : risk.probability === "中"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {risk.probability}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">影響度:</span>{" "}
                        <span
                          className={`font-semibold ${
                            risk.impact === "高"
                              ? "text-red-600"
                              : risk.impact === "中"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {risk.impact}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">対策:</span>{" "}
                        {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 成果物 */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">成果物</h3>
              <div className="space-y-4">
                {finalExperimentPlan.deliverables.map((deliverable, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {deliverable.deliverable}
                      </h4>
                      <span className="text-sm text-blue-600 font-medium">
                        {deliverable.timeline}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {deliverable.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                閉じる
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                PDFで保存
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
