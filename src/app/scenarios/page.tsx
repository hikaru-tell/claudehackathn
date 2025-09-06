"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { scenarios } from "./data";

export default function ScenariosPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedScenario) {
      router.push(`/scenarios/${selectedScenario}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              製品シナリオを選択
            </h2>
            <p className="text-gray-600">
              分析したい製品カテゴリーを選んでください
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all ${
                  selectedScenario === scenario.id
                    ? "ring-2 ring-green-600 shadow-xl"
                    : "hover:shadow-xl"
                }`}
              >
                <div onClick={() => setSelectedScenario(scenario.id)}>
                  <div className="flex items-start space-x-4">
                    <span className="text-4xl">{scenario.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {scenario.name}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {scenario.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-semibold text-gray-700">
                            現在の素材:
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            {scenario.currentMaterial.composition}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-sm font-semibold text-gray-700">
                            主な課題:
                          </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {scenario.challenges.map((challenge, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"
                              >
                                {challenge}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              戻る
            </Button>
            <Button
              onClick={handleNext}
              disabled={!selectedScenario}
            >
              次へ進む
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}