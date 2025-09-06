"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { scenarios } from "../data";
import { MaterialRequirementsForm } from "./MaterialRequirementsForm";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ScenarioDetailPage({ params }: PageProps) {
  const router = useRouter();
  const scenario = scenarios.find((s) => s.id === params.id);
  const [requirements, setRequirements] = useState<any>(null);

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
        <div className="max-w-4xl mx-auto">
          {/* シナリオ詳細 */}
          <Card className="mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <span className="text-5xl">{scenario.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {scenario.name}
                </h2>
                <p className="text-gray-600">{scenario.description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  現在の素材構成
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-mono text-lg text-gray-800 mb-2">
                    {scenario.currentMaterial.composition}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.currentMaterial.properties.map((prop, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white text-gray-700 text-sm rounded-full border"
                      >
                        {prop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  改善が必要な課題
                </h3>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {scenario.challenges.map((challenge, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-red-500">⚠️</span>
                        <span className="text-gray-700">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 要件入力フォーム */}
          <MaterialRequirementsForm
            scenario={scenario}
            onSubmit={handleSubmit}
          />

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => router.push("/scenarios")}
            >
              シナリオ選択に戻る
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}