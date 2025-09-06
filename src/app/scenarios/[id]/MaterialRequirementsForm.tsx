"use client";

import { useState, useEffect } from "react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Scenario } from "../data";

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
    importance: "high" | "medium" | "low";
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
    scenario.requirements.performance,
  );
  const [sustainabilityReqs, setSustainabilityReqs] = useState(
    scenario.requirements.sustainability,
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Reflect AI analysis results
  useEffect(() => {
    if (analysisResults.length > 0) {
      const aiRequirements = analysisResults.flatMap((result) =>
        result.requirements.map(
          (req) => `${req.name}: ${req.value}${req.unit || ""}`,
        ),
      );

      // Add high importance requirements as performance requirements
      const highImportanceReqs = analysisResults.flatMap((result) =>
        result.requirements
          .filter((req) => req.importance === "high")
          .map((req) => `${req.name}: ${req.value}${req.unit || ""}`),
      );

      if (highImportanceReqs.length > 0) {
        setPerformanceReqs((prev) => [...prev, ...highImportanceReqs]);
      }

      // Record file name
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
      formData.append("file", file);

      const response = await fetch("/api/analyze-requirements", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();

      // Reflect AI-extracted requirements in the form
      if (data.requirements && Array.isArray(data.requirements)) {
        const newPerformanceReqs: string[] = [];
        const newSustainabilityReqs: string[] = [];

        data.requirements.forEach((req: any) => {
          const reqText = req.unit
            ? `${req.name}: ${req.value} ${req.unit}`
            : `${req.name}: ${req.value}`;

          // Classify environment-related requirements as sustainability requirements
          if (
            req.name.includes("environment") ||
            req.name.includes("Environment") ||
            req.name.includes("recycl") ||
            req.name.includes("Recycl") ||
            req.name.includes("CO2") ||
            req.name.includes("energy") ||
            req.name.includes("Energy")
          ) {
            newSustainabilityReqs.push(reqText);
          } else {
            newPerformanceReqs.push(reqText);
          }
        });

        // Add to existing requirements (avoid duplicates)
        setPerformanceReqs([
          ...new Set([...performanceReqs, ...newPerformanceReqs]),
        ]);
        setSustainabilityReqs([
          ...new Set([...sustainabilityReqs, ...newSustainabilityReqs]),
        ]);
      }
    } catch (error) {
      console.error("File analysis error:", error);
      alert("Failed to analyze file. Please try again.");
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
    <Card title="Requirements Setup">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Performance Requirements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Performance Requirements
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
                      (_, i) => i !== index,
                    );
                    setPerformanceReqs(newReqs);
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setPerformanceReqs([...performanceReqs, ""]);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg border-2 border-dashed border-green-300 hover:border-green-400 transition-colors w-full"
            >
              <span className="text-lg">+</span>
              <span>Add Performance Requirement</span>
            </button>
          </div>
        </div>

        {/* Sustainability Requirements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sustainability Requirements
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
                      (_, i) => i !== index,
                    );
                    setSustainabilityReqs(newReqs);
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setSustainabilityReqs([...sustainabilityReqs, ""]);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg border-2 border-dashed border-green-300 hover:border-green-400 transition-colors w-full"
            >
              <span className="text-lg">+</span>
              <span>Add Sustainability Requirement</span>
            </button>
          </div>
        </div>

        {/* Additional Requirements */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Additional Requirements & Notes
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter any other requirements or constraints..."
          />
        </div>

        <Button type="submit" className="w-full">
          Generate AI Proposals
        </Button>
      </form>
    </Card>
  );
}
