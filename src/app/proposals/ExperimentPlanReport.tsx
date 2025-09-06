'use client';

import { Card } from '../components/Card';
import type { ExperimentPlan } from '../api/experiment-plan/route';

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
  // Use AI-generated experiment plan data
  // Set fallback default values
  const defaultExperimentPlan = {
    overview: {
      title: `${material.materialName} Development Experiment Plan`,
      objective: `Experiment plan and evaluation methods to achieve transition from existing materials to ${material.materialName}`,
      duration: '3-6 months',
      budget: '$50,000-80,000',
    },
    phases: [
      {
        phase: 'Phase 1: Material Procurement and Basic Evaluation',
        duration: '1 month',
        tasks: [
          'Selection and procurement of raw material suppliers',
          'Measurement of basic physical properties (tensile strength, elongation, thickness, etc.)',
          'Chemical composition analysis and FT-IR measurement',
          'DSC/TGA thermal analysis',
        ],
      },
      {
        phase: 'Phase 2: Composite Material Formulation Optimization',
        duration: '2 months',
        tasks: [
          `Optimization of ${material.composition.join('/')} blend ratio`,
          'Investigation of lamination conditions (temperature, pressure, time)',
          'Evaluation of interlayer adhesive strength',
          'Measurement of barrier performance (oxygen transmission rate, water vapor transmission rate)',
        ],
      },
      {
        phase: 'Phase 3: Processability Evaluation',
        duration: '1 month',
        tasks: [
          'Printing suitability test (ink adhesion, rub resistance)',
          'Heat seal performance evaluation',
          'Bag making processing test',
          'Suitability confirmation on filling packaging line',
        ],
      },
      {
        phase: 'Phase 4: Practical Performance Evaluation',
        duration: '1-2 months',
        tasks: [
          'Storage test (room temperature, accelerated conditions)',
          'Compatibility confirmation with contents',
          'Transportation simulation test',
          'Consumer monitoring survey',
        ],
      },
    ],
    keyTests: [
      {
        test: 'Oxygen Barrier Measurement',
        method: 'ASTM D3985',
        target: '< 1.0 cc/m²/day',
        equipment: 'MOCON OX-TRAN',
      },
      {
        test: 'Water Vapor Barrier Measurement',
        method: 'ASTM F1249',
        target: '< 1.0 g/m²/day',
        equipment: 'MOCON PERMATRAN-W',
      },
      {
        test: 'Heat Seal Strength',
        method: 'JIS Z0238',
        target: '> 15 N/15mm',
        equipment: 'Universal Testing Machine',
      },
      {
        test: 'Recyclability Evaluation',
        method: 'Internal Standards',
        target: 'Recycling Rate > 80%',
        equipment: 'Small-scale Recycling Demonstration Equipment',
      },
    ],
    risks: [
      {
        risk: 'Failure to achieve target barrier properties',
        probability: 'Medium',
        impact: 'High',
        mitigation:
          'Additional consideration of coating materials, consideration of multilayering',
      },
      {
        risk: 'Cost target exceeded',
        probability: 'Medium',
        impact: 'Medium',
        mitigation:
          'Optimization of material usage, search for alternative suppliers',
      },
      {
        risk: 'Processing incompatibility with existing equipment',
        probability: 'Low',
        impact: 'High',
        mitigation:
          'Early actual machine testing, preliminary consideration of equipment modification',
      },
    ],
    deliverables: [
      {
        deliverable: 'Material Specification',
        timeline: 'After 2 months',
        description:
          'Detailed specifications and quality standards for optimized materials',
      },
      {
        deliverable: 'Physical Properties Evaluation Report',
        timeline: 'After 3 months',
        description: 'Results of all test items and pass/fail judgment',
      },
      {
        deliverable: 'Processing Conditions Guidelines',
        timeline: 'After 3 months',
        description:
          'Optimal conditions for printing, laminating, and bag making',
      },
      {
        deliverable: 'Recyclability Evaluation Report',
        timeline: 'After 4 months',
        description:
          'Evaluation results of environmental impact and recyclability',
      },
      {
        deliverable: 'LCA Analysis Report',
        timeline: 'After 5 months',
        description: 'Environmental impact assessment of the entire lifecycle',
      },
      {
        deliverable: 'Mass Production Transition Plan',
        timeline: 'After 6 months',
        description:
          'Technical, cost, and schedule proposals for mass production',
      },
    ],
  };

  // Use AI-generated data if available, otherwise use default values
  const finalExperimentPlan = experimentPlan || defaultExperimentPlan;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/70" onClick={onClose} />

        {/* Report Body */}
        <div className="relative max-w-5xl mx-auto">
          <Card className="relative">
            {/* Header */}
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
                    <strong>Duration:</strong>{' '}
                    {finalExperimentPlan.overview.duration}
                  </span>
                  <span className="text-sm text-gray-500">
                    <strong>Budget:</strong>{' '}
                    {finalExperimentPlan.overview.budget}
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

            {/* Experiment Phases */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Experiment Phases
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

            {/* Key Test Items */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Key Test Items
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-gray-700">
                        Test Item
                      </th>
                      <th className="text-left py-2 text-gray-700">
                        Test Method
                      </th>
                      <th className="text-left py-2 text-gray-700">
                        Target Value
                      </th>
                      <th className="text-left py-2 text-gray-700">
                        Equipment
                      </th>
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

            {/* Risks and Countermeasures */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Risks and Countermeasures
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {finalExperimentPlan.risks.map((risk, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      {risk.risk}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Probability:</span>{' '}
                        <span
                          className={`font-semibold ${
                            risk.probability === 'High'
                              ? 'text-red-600'
                              : risk.probability === 'Medium'
                                ? 'text-yellow-600'
                                : 'text-green-600'
                          }`}
                        >
                          {risk.probability}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Impact:</span>{' '}
                        <span
                          className={`font-semibold ${
                            risk.impact === 'High'
                              ? 'text-red-600'
                              : risk.impact === 'Medium'
                                ? 'text-yellow-600'
                                : 'text-green-600'
                          }`}
                        >
                          {risk.impact}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Mitigation:</span>{' '}
                        {risk.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Deliverables
              </h3>
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save as PDF
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
