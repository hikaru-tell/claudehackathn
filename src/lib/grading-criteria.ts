/**
 * Material Grading Criteria
 * Define 4-level grading system: A, B, C, D
 */

export interface GradingCriteria {
  grade: 'A' | 'B' | 'C' | 'D';
  label: string;
  description: string;
  scoreRange: {
    min: number;
    max: number;
  };
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

export const GRADING_CRITERIA: GradingCriteria[] = [
  {
    grade: 'A',
    label: 'Excellent',
    description:
      'Material with outstanding performance and sustainability. Highly rated at the practical level.',
    scoreRange: { min: 85, max: 100 },
    color: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
    },
  },
  {
    grade: 'B',
    label: 'Good',
    description:
      'Material with good performance and sustainability. Promising for practical application.',
    scoreRange: { min: 70, max: 84 },
    color: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
  },
  {
    grade: 'C',
    label: 'Fair',
    description:
      'Material with standard performance and sustainability. Has room for improvement.',
    scoreRange: { min: 55, max: 69 },
    color: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
    },
  },
  {
    grade: 'D',
    label: 'Needs Improvement',
    description:
      'Material with significant issues in performance and sustainability. Requires major improvement.',
    scoreRange: { min: 0, max: 54 },
    color: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
    },
  },
];

/**
 * Convert score to grading criteria
 */
export function scoreToGrade(score: number): GradingCriteria {
  for (const criteria of GRADING_CRITERIA) {
    if (score >= criteria.scoreRange.min && score <= criteria.scoreRange.max) {
      return criteria;
    }
  }
  // Default is D
  return GRADING_CRITERIA[3];
}

/**
 * Detailed grading criteria (for AI analysis)
 */
export const DETAILED_GRADING_CRITERIA = `
# Material Grading Criteria (Grades A-D)

## Grade A (85-100): Excellent
- **Performance**: Significantly exceeds required specifications
- **Sustainability**: High recyclability, low environmental impact, strong contribution to carbon neutrality
- **Practicality**: Easy processing with existing equipment, cost-competitive
- **Safety**: Certified for high safety, applicable to food packaging
- **Future Potential**: Already adopted in the market, expected to spread further

## Grade B (70-84): Good
- **Performance**: Meets requirements, with some superior properties
- **Sustainability**: Good recyclability and environmental benefits
- **Practicality**: Requires partial equipment modification, reasonable cost
- **Safety**: Basic safety certifications obtained
- **Future Potential**: Development progressing toward practical use

## Grade C (55-69): Fair
- **Performance**: Meets minimum requirements, but needs improvement
- **Sustainability**: Lower impact than conventional materials, but limited potential
- **Practicality**: Requires investment and process changes, cost concerns
- **Safety**: Basic safety ensured, but further validation needed
- **Future Potential**: At R&D stage, commercialization timeline unclear

## Grade D (0-54): Needs Improvement
- **Performance**: Fails to meet requirements or significantly underperforms
- **Sustainability**: Limited environmental benefits
- **Practicality**: Requires major investment, lacks cost competitiveness
- **Safety**: Safety concerns present, additional certification needed
- **Future Potential**: At basic research stage, no clear path to commercialization

## Weighting of Evaluation Items
1. **Performance Match** (30%): Alignment with required specifications
2. **Sustainability Score** (35%): Environmental impact, recyclability
3. **Practicality** (20%): Cost, processability, supply stability
4. **Safety** (10%): Food safety, regulatory compliance
5. **Future Potential** (5%): Technology maturity, market adoption

Based on these criteria, each material should be comprehensively evaluated and assigned a grade from A to D.
`;
