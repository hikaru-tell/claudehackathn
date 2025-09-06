"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { scenarios } from "./data";

export default function ScenariosPage() {
  const router = useRouter();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (selectedScenario) {
      // TODO: Store files in context or send to API
      router.push(`/scenarios/${selectedScenario}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              製品シナリオを選択
            </h2>
            <p className="text-gray-600">
              分析したい製品カテゴリーを選んで、製品情報をアップロードしてください
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* カテゴリ選択セクション */}
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                1. カテゴリを選択
              </h3>
              <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {scenarios.map((scenario) => (
                  <Card
                    key={scenario.id}
                    className={`cursor-pointer transition-all ${
                      selectedScenario === scenario.id
                        ? "ring-2 ring-green-600 shadow-xl"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <div onClick={() => setSelectedScenario(scenario.id)}>
                      <div className="flex items-start space-x-3">
                        <span className="text-3xl">{scenario.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-800 mb-1">
                            {scenario.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {scenario.description}
                          </p>
                          
                          <div className="space-y-1">
                            <div className="text-xs">
                              <span className="font-semibold text-gray-700">
                                現在の素材:
                              </span>
                              <span className="text-gray-600 ml-1">
                                {scenario.currentMaterial.composition}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-1">
                              {scenario.challenges.map((challenge, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full"
                                >
                                  {challenge}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* ファイルアップロードセクション */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                2. 製品ファイルをアップロード（任意）
              </h3>
              <Card>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    <svg
                      className="mx-auto h-10 w-10 text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      ファイルをドラッグ＆ドロップ
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                    >
                      ファイルを選択
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, Word, Excel, CSV, テキスト, 画像
                    </p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        アップロード済み ({uploadedFiles.length})
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <svg
                                className="h-4 w-4 text-gray-400 flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-800 truncate">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
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
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex gap-2">
                      <svg
                        className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5"
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
                      <div className="text-xs text-blue-800">
                        <p className="font-semibold mb-1">アップロード可能:</p>
                        <ul className="space-y-0.5 text-blue-700">
                          <li>• 製品仕様書・技術データ</li>
                          <li>• 現在の素材詳細</li>
                          <li>• 性能要求・規格書</li>
                          <li>• コスト・製造条件</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex justify-between mt-8">
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
              分析を開始
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}