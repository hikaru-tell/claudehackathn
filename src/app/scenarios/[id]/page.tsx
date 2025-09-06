'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { scenarios } from '../data';
import { MaterialRequirementsForm } from './MaterialRequirementsForm';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

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
  materials?: {
    composition: string;
    properties: string[];
    analysisConfidence: 'high' | 'medium' | 'low';
  };
}

interface MaterialComposition {
  composition: string;
  properties: string[];
  analysisSource?: string;
}

export default function ScenarioDetailPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [enhancedMaterial, setEnhancedMaterial] =
    useState<MaterialComposition | null>(null);

  // In Next.js 15, params is a Promise, so unwrap with use
  const resolvedParams = use(params);
  const scenario = scenarios.find((s) => s.id === resolvedParams.id);

  // Process AI analysis results
  useEffect(() => {
    const analysisParam = searchParams.get('analysis');
    console.log('Analysis parameter received:', analysisParam ? 'Yes' : 'No');

    if (analysisParam) {
      try {
        const results = JSON.parse(analysisParam) as AnalysisResult[];
        console.log('Parsed analysis results:', results);
        setAnalysisResults(results);

        // Generate material composition from AI analysis results
        if (results.length > 0) {
          const firstResult = results[0];
          const aiMaterial: MaterialComposition = {
            composition:
              firstResult.materials?.composition ||
              extractComposition(firstResult.requirements),
            properties:
              firstResult.materials?.properties ||
              extractProperties(firstResult.requirements),
            analysisSource: firstResult.fileName,
          };
          setEnhancedMaterial(aiMaterial);
        }
      } catch (error) {
        console.error('Error parsing analysis results:', error);
      }
    }
  }, [searchParams]);

  const extractComposition = (
    requirements: AnalysisResult['requirements']
  ): string => {
    // Estimate material composition from material/composition requirements
    const materialReqs = requirements.filter(
      (req) =>
        req.name.includes('material') ||
        req.name.includes('Material') ||
        req.name.includes('composition') ||
        req.name.includes('structure')
    );

    if (materialReqs.length > 0) {
      return materialReqs.map((req) => req.value).join('/');
    }

    // Return default estimated value
    return 'AI Analysis Material/Barrier Layer/Sealant Layer';
  };

  const extractProperties = (
    requirements: AnalysisResult['requirements']
  ): string[] => {
    // Extract properties from requirements
    return requirements
      .filter((req) => req.importance === 'high')
      .map((req) => `${req.name}: ${req.value}${req.unit || ''}`)
      .slice(0, 6); // Maximum 6 properties
  };

  if (!scenario) {
    return <div>Scenario not found</div>;
  }

  const handleSubmit = (data: RequirementsData) => {
    // In actual app, save data here
    console.log('Requirements submitted:', data);

    // Prepare material composition information
    const currentMaterials = {
      composition: enhancedMaterial
        ? enhancedMaterial.composition
        : scenario.currentMaterial.composition,
      properties: enhancedMaterial
        ? enhancedMaterial.properties
        : scenario.currentMaterial.properties,
    };

    // Convert performance requirements to proper format
    const formattedRequirements =
      analysisResults.length > 0
        ? analysisResults[0].requirements
        : data.performanceReqs.map((req, index) => ({
            name: req,
            value: '100', // Default value
            unit: '',
            importance: 'medium' as const,
          }));

    // Navigate to proposal screen with URL parameters
    const urlParams = new URLSearchParams({
      scenario: resolvedParams.id,
      currentMaterials: JSON.stringify(currentMaterials),
      performanceReqs: JSON.stringify(formattedRequirements),
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
          {/* Header information */}
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

          {/* Current material composition section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-gray-100 px-3 py-1 rounded-lg mr-3">
                Current
              </span>
              Existing Material Composition
            </h2>

            <Card className="bg-gray-50 border-2 border-gray-300">
              <div className="space-y-6">
                {/* Material composition details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Material Composition:{' '}
                    <span className="font-mono text-xl text-blue-600">
                      {enhancedMaterial
                        ? enhancedMaterial.composition
                        : scenario.currentMaterial.composition}
                    </span>
                    {enhancedMaterial && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        AI Analysis Result
                      </span>
                    )}
                  </h3>

                  {/* Visual representation of layer structure */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Layer Structure
                    </h4>
                    <div className="flex items-center justify-center space-x-2">
                      {(enhancedMaterial
                        ? enhancedMaterial.composition
                        : scenario.currentMaterial.composition
                      )
                        .split('/')
                        .map((layer, index) => (
                          <div key={index} className="flex items-center">
                            {index > 0 && (
                              <span className="text-gray-400 mx-2">+</span>
                            )}
                            <div
                              className={`px-4 py-2 rounded-lg border ${
                                enhancedMaterial
                                  ? 'bg-gradient-to-r from-green-100 to-green-200 border-green-300'
                                  : 'bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300'
                              }`}
                            >
                              <span
                                className={`font-mono font-semibold ${
                                  enhancedMaterial
                                    ? 'text-green-800'
                                    : 'text-blue-800'
                                }`}
                              >
                                {layer}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Properties and performance */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Functional Properties
                      </h4>
                      <div className="space-y-2">
                        {(enhancedMaterial
                          ? enhancedMaterial.properties
                          : scenario.currentMaterial.properties
                        ).map((prop, index) => (
                          <div key={index} className="flex items-center">
                            <span
                              className={`mr-2 ${enhancedMaterial ? 'text-green-500' : 'text-green-500'}`}
                            >
                              ✓
                            </span>
                            <span className="text-sm text-gray-700">
                              {prop}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        Performance Requirements
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

                {/* Upload Confirmation */}
                <div className="border-t pt-4">
                  {analysisResults.length > 0 ? (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-start">
                        <svg
                          className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="text-sm text-green-800">
                          <p className="font-semibold mb-2">AI Analysis Complete</p>
                          <div className="space-y-1">
                            {analysisResults.map((result, index) => (
                              <p key={index}>
                                • {result.fileName} (
                                {result.requirements.length} requirements extracted)
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                          If no file is uploaded, default material composition will be used
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Requirements Input Form */}
          <div className="mb-8">
            <MaterialRequirementsForm
              scenario={scenario}
              onSubmit={handleSubmit}
              analysisResults={analysisResults}
            />

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => router.push('/scenarios')}
              >
                Back to Scenario Selection
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
