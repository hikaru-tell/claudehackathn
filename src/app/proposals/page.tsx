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
import type { ExperimentPlan } from '../api/experiment-plan/route';

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
  const [selectedProposal, setSelectedProposal] =
    useState<RecommendedMaterial | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [experimentPlan, setExperimentPlan] = useState<ExperimentPlan | null>(
    null
  );

  // State for progress management
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');

  // Get URL parameters as strings (to prevent useEffect infinite loop)
  const performanceReqsStr = searchParams.get('performanceReqs');
  const currentMaterialsStr = searchParams.get('currentMaterials');

  // Parse for display (only once outside useEffect)
  const performanceReqs = performanceReqsStr
    ? JSON.parse(performanceReqsStr)
    : [];

  const scenario = scenarios.find((s) => s.id === scenarioId);

  useEffect(() => {
    const loadProposals = async () => {
      setIsLoading(true);
      setLoadingProgress(0);
      setCurrentStep('Initializing...');

      try {
        // Parse URL parameters inside useEffect
        const currentMaterials = currentMaterialsStr
          ? JSON.parse(currentMaterialsStr)
          : null;
        const requirements = performanceReqsStr
          ? JSON.parse(performanceReqsStr)
          : [];

        // Call actual totalAI API (if materials and requirements from URL parameters)
        if (currentMaterials && requirements.length > 0) {
          // Step 1: Generating filters (0-25%)
          setCurrentStep('Generating filters...');
          setLoadingProgress(10);
          await new Promise((resolve) => setTimeout(resolve, 500));
          setLoadingProgress(25);

          // Step 2: Deep Research (25-50%)
          setCurrentStep('Deep Research in progress...');
          setLoadingProgress(30);

          // Step 3: Database search (50-75%)
          setTimeout(() => {
            setCurrentStep('Searching database...');
            setLoadingProgress(50);
          }, 1000);

          // Step 4: Total AI processing (75-100%)
          setTimeout(() => {
            setCurrentStep('Total AI integration analysis...');
            setLoadingProgress(75);
          }, 2000);

          // Actual API call
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
              setCurrentStep('Complete!');
              setLoadingProgress(100);
              await new Promise((resolve) => setTimeout(resolve, 300));
              setProposals(data.recommendations);
            } else {
              // If API succeeded but no recommended materials, use mock data
              const mockProposals = generateMockProposals(scenarioId || '');
              setProposals(mockProposals);
            }
          } else {
            // If API error, use mock data
            console.error('Total AI API error:', response.status);
            const mockProposals = generateMockProposals(scenarioId || '');
            setProposals(mockProposals);
          }
        } else {
          // If URL parameters are incomplete, use mock data
          setCurrentStep('Loading default data...');
          setLoadingProgress(50);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const mockProposals = generateMockProposals(scenarioId || '');
          setLoadingProgress(100);
          await new Promise((resolve) => setTimeout(resolve, 300));
          setProposals(mockProposals);
        }
      } catch (error) {
        console.error('Error loading proposals:', error);
        // If error, use mock data
        setCurrentStep('Recovering from error...');
        const mockProposals = generateMockProposals(scenarioId || '');
        setProposals(mockProposals);
      } finally {
        setIsLoading(false);
      }
    };

    if (scenarioId) {
      loadProposals();
    }
  }, [scenarioId, currentMaterialsStr, performanceReqsStr]); // Use strings in dependency array

  const handleProposalClick = (proposal: RecommendedMaterial) => {
    setSelectedProposal(proposal);
    setShowDialog(true);
  };

  const handleDialogConfirm = async () => {
    if (!selectedProposal) return;

    setShowDialog(false);
    setIsGeneratingReport(true);

    try {
      // Get current material information
      const currentMaterials = JSON.parse(currentMaterialsStr || '{}');
      const performanceReqs = JSON.parse(performanceReqsStr || '[]');

      const requestBody = {
        material: selectedProposal,
        currentMaterial: currentMaterials,
        requirements: performanceReqs,
      };

      console.log(
        '🧪 Generating experiment plan for:',
        selectedProposal.materialName
      );

      const response = await fetch('/api/experiment-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate experiment plan');
      }

      const data = await response.json();

      if (data.success && data.experimentPlan) {
        setExperimentPlan(data.experimentPlan);
        setShowReport(true);
      } else {
        throw new Error(data.error || 'Failed to generate experiment plan');
      }
    } catch (error) {
      console.error('Error generating experiment plan:', error);
      alert('Failed to generate experiment plan. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleCloseReport = () => {
    setShowReport(false);
    setSelectedProposal(null);
    setExperimentPlan(null);
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p>No scenario selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header information */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl">{scenario.icon}</span>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Alternative Material Proposals for {scenario.name}
                </h2>
                <p className="text-gray-600">
                  AI has analyzed optimal sustainable materials
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Card className="text-center py-12">
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Progress Step Display */}
                <div className="flex justify-between items-center mb-8">
                  <div
                    className={`flex flex-col items-center ${loadingProgress >= 0 ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${loadingProgress >= 25 ? 'bg-green-600 border-green-600 text-white' : loadingProgress >= 0 ? 'border-green-600' : 'border-gray-400'}`}
                    >
                      {loadingProgress >= 25 ? '✓' : '1'}
                    </div>
                    <span className="text-xs mt-2">Filtering</span>
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
                    <span className="text-xs mt-2">DB Search</span>
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

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>

                {/* Current step display */}
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

                {/* Progress percentage */}
                <p className="text-2xl font-bold text-green-600">
                  {loadingProgress}%
                </p>

                {/* Description text */}
                <p className="text-gray-500 text-sm">
                  {loadingProgress < 25 &&
                    'Analyzing requirements and generating filtering conditions...'}  
                  {loadingProgress >= 25 &&
                    loadingProgress < 50 &&
                    'Researching latest academic papers and practical applications...'}
                  {loadingProgress >= 50 &&
                    loadingProgress < 75 &&
                    'Searching candidate materials from organic polymer database...'}
                  {loadingProgress >= 75 &&
                    loadingProgress < 100 &&
                    'AI is integrating all results and selecting optimal materials...'}
                  {loadingProgress >= 100 && 'Analysis complete! Displaying results...'}
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* Comparison Charts */}
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

              {/* Proposal List */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Top 3 Recommended Materials
                </h3>
                {proposals.map((proposal, index) => (
                  <ProposalCard
                    key={index}
                    proposal={proposal}
                    rank={index + 1}
                    onClick={() => handleProposalClick(proposal)}
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
              Modify Requirements
            </Button>
            {!isLoading && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Create mock data for PDF analysis results
                    const analysisData = [
                      {
                        fileName:
                          'Film Specification - Product Code_ TK-FILM-2024-STD.pdf',
                        requirements: [
                          {
                            name: 'Tensile Strength',
                            value: '100',
                            unit: 'N/15mm',
                            importance: 'high',
                          },
                          {
                            name: 'Elongation',
                            value: '150',
                            unit: '%',
                            importance: 'medium',
                          },
                          {
                            name: 'Impact Strength',
                            value: '1.0',
                            unit: 'J',
                            importance: 'medium',
                          },
                          {
                            name: 'Heat Seal Strength',
                            value: '20',
                            unit: 'N/15mm',
                            importance: 'high',
                          },
                          {
                            name: 'Oxygen Transmission Rate',
                            value: '1.0',
                            unit: 'cc/m²·day·atm',
                            importance: 'high',
                          },
                          {
                            name: 'Water Vapor Transmission Rate',
                            value: '2.0',
                            unit: 'g/m²·day',
                            importance: 'high',
                          },
                          {
                            name: 'Light Blocking',
                            value: '99',
                            unit: '%',
                            importance: 'high',
                          },
                          {
                            name: 'Heat Resistance Temperature',
                            value: '120',
                            unit: '℃',
                            importance: 'high',
                          },
                          {
                            name: 'Cold Resistance Temperature',
                            value: '-20',
                            unit: '℃',
                            importance: 'medium',
                          },
                        ],
                        materials: {
                          composition: 'PET(12μm)/Al-PET(12μm)/CPP(30μm)',
                          properties: [
                            'Printability',
                            'Mechanical Strength',
                            'High Barrier Properties',
                            'Light Blocking',
                            'Heat Sealability',
                            'Oil Resistance',
                          ],
                          analysisConfidence: 'high',
                        },
                      },
                    ];

                    // Navigate to test page
                    const encodedAnalysis = encodeURIComponent(
                      JSON.stringify(analysisData)
                    );
                    router.push(`/test?analysis=${encodedAnalysis}`);
                  }}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Detailed Analysis with Materials Project
                </Button>
                <Button onClick={() => window.print()}>Print Report</Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Dialog */}
      <Dialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDialogConfirm}
        title="Generate Experiment Plan Report"
        message="Generate an AI-powered experiment plan report?"
      />

      {/* Loading while generating report */}
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
                AI is analyzing experiment plan...
              </h3>
              <p className="text-gray-600">
                Generating optimal experimental conditions and test items
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Experiment Plan Report */}
      {showReport && selectedProposal && experimentPlan && (
        <ExperimentPlanReport
          material={selectedProposal}
          experimentPlan={experimentPlan}
          onClose={handleCloseReport}
        />
      )}
    </div>
  );
}
