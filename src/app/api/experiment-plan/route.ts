import { NextRequest, NextResponse } from 'next/server';
import { DETAILED_GRADING_CRITERIA } from '@/lib/grading-criteria';

// Claude API configuration
const CLAUDE_API_KEY =
  process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

export interface ExperimentPlanRequest {
  material: {
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
  };
  currentMaterial: {
    composition: string;
    properties: string[];
  };
  requirements: Array<{
    name: string;
    value: string;
    unit?: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

export interface ExperimentPlan {
  overview: {
    title: string;
    objective: string;
    duration: string;
    budget: string;
  };
  phases: Array<{
    phase: string;
    duration: string;
    tasks: string[];
  }>;
  keyTests: Array<{
    category: string;
    tests: Array<{
      name: string;
      method: string;
      target: string;
      frequency: string;
    }>;
  }>;
  risks: Array<{
    risk: string;
    impact: string;
    mitigation: string;
  }>;
  deliverables: Array<{
    deliverable: string;
    timeline: string;
    description: string;
  }>;
}

export interface ExperimentPlanResponse {
  success: boolean;
  experimentPlan?: ExperimentPlan;
  error?: string;
  metadata?: {
    generatedAt: string;
    confidence: string;
  };
}

// Generate experiment plan with Claude-3
async function generateExperimentPlan(
  material: ExperimentPlanRequest['material'],
  currentMaterial: ExperimentPlanRequest['currentMaterial'],
  requirements: ExperimentPlanRequest['requirements']
): Promise<ExperimentPlan | null> {
  if (!CLAUDE_API_KEY) {
    console.warn('Claude API key not configured');
    return null;
  }

  const prompt = `
You are an expert in packaging material development. Based on the following information, create a detailed experimental plan.

${DETAILED_GRADING_CRITERIA}

[Recommended Material]
- Material Name: ${material.materialName}
- Composition: ${material.composition.join('/')}
- Total Score: ${material.totalScore} points
- Reason for Recommendation: ${material.reasoning}
- Features: ${material.features.join(', ')}

[Current Material]
- Composition: ${currentMaterial.composition}
- Properties: ${currentMaterial.properties.join(', ')}

[Performance Requirements]
${requirements.map((r) => `- ${r.name}: ${r.value} ${r.unit || ''} (Importance: ${r.importance})`).join('\n')}

[Detailed Evaluation Scores]
- Physical Performance: ${material.scores.physical} points
- Environmental Performance: ${material.scores.environmental} points
- Cost Efficiency: ${material.scores.cost} points
- Safety: ${material.scores.safety} points
- Supply Stability: ${material.scores.supply} points

[Instructions for Creating the Experimental Plan]
Based on the above information, create a comprehensive experimental plan to enable the transition from the current material to the recommended material.  
Consider the evaluation criteria and each score, and especially include focused verification for categories with lower scores.

Output in the following JSON format:

{
  "overview": {
    "title": "Title of the Experimental Plan",
    "objective": "Objective of the experiment and expected outcomes",
    "duration": "Overall duration (e.g., 3-6 months)",
    "budget": "Estimated budget (e.g., 5-8 million JPY)"
  },
  "phases": [
    {
      "phase": "Phase 1: Phase Name",
      "duration": "Duration",
      "tasks": [
        "Specific Task 1",
        "Specific Task 2"
      ]
    }
  ],
  "keyTests": [
    {
      "category": "Test Category",
      "tests": [
        {
          "name": "Test Name",
          "method": "Measurement Method/Standard",
          "target": "Target Value",
          "frequency": "Testing Frequency"
        }
      ]
    }
  ],
  "risks": [
    {
      "risk": "Description of Risk",
      "impact": "Level of Impact",
      "mitigation": "Mitigation Measures"
    }
  ],
  "deliverables": [
    {
      "deliverable": "Name of Deliverable",
      "timeline": "Submission Timeline",
      "description": "Detailed Description"
    }
  ]
}

[Important Considerations]
1. Include focused verification for items with scores below 70.
2. Reference standard testing methods commonly used in the packaging materials industry.
3. Define phased risk management and milestones.
4. Propose a realistic timeline and budget for practical implementation.
5. Emphasize sustainability evaluation and environmental impact assessment.

Only output the JSON. Do not include any other explanation.
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status);
      return null;
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      console.error('No content in Claude response');
      return null;
    }

    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Claude response');
      return null;
    }

    const experimentPlan = JSON.parse(jsonMatch[0]);
    return experimentPlan;
  } catch (error) {
    console.error('Error generating experiment plan:', error);
    return null;
  }
}

// Fallback experiment plan (when API is unavailable)
function getFallbackExperimentPlan(
  material: ExperimentPlanRequest['material'],
  currentMaterial: ExperimentPlanRequest['currentMaterial']
): ExperimentPlan {
  return {
    overview: {
      title: `${material.materialName} Development Experiment Plan`,
      objective: `Experiment plan and evaluation methods to achieve transition from existing materials (${currentMaterial.composition}) to ${material.materialName}`,
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
        phase: 'Phase 3: Practical Application Evaluation',
        duration: '2-3 months',
        tasks: [
          'Performance evaluation under actual packaging conditions',
          'Food safety testing',
          'Cost analysis and mass production consideration',
          'Final report preparation',
        ],
      },
    ],
    keyTests: [
      {
        category: 'Physical Performance',
        tests: [
          {
            name: 'Tensile Strength',
            method: 'JIS K7127',
            target: 'Above requirement specification value',
            frequency: 'Each phase',
          },
          {
            name: 'Barrier Performance',
            method: 'JIS K7126',
            target: 'Equal to or better than current materials',
            frequency: 'Weekly',
          },
        ],
      },
    ],
    risks: [
      {
        risk: 'Instability of raw material supply',
        impact: 'Schedule delay',
        mitigation: 'Securing multiple suppliers',
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
        timeline: 'After 4 months',
        description:
          'Optimal conditions for printing, laminating, and bag making',
      },
      {
        deliverable: 'Practical Application Proposal',
        timeline: 'After 5 months',
        description:
          'Technical, cost, and schedule proposals for mass production',
      },
      {
        deliverable: 'Final Evaluation Report',
        timeline: 'After 6 months',
        description:
          'Comprehensive evaluation of all experimental results and practical applicability',
      },
    ],
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ExperimentPlanRequest = await req.json();
    const { material, currentMaterial, requirements } = body;

    console.log('🧪 Generating experiment plan for:', material.materialName);

    // Generate experiment plan with Claude API
    const experimentPlan = await generateExperimentPlan(
      material,
      currentMaterial,
      requirements
    );

    if (!experimentPlan) {
      // Use fallback experiment plan
      const fallbackPlan = getFallbackExperimentPlan(material, currentMaterial);
      return NextResponse.json({
        success: true,
        experimentPlan: fallbackPlan,
        metadata: {
          generatedAt: new Date().toISOString(),
          confidence: 'fallback',
        },
      });
    }

    return NextResponse.json({
      success: true,
      experimentPlan,
      metadata: {
        generatedAt: new Date().toISOString(),
        confidence: 'high',
      },
    });
  } catch (error) {
    console.error('Experiment plan generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate experiment plan',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
