import { NextRequest, NextResponse } from 'next/server';
import {
  searchOrganicMaterials,
  extractMaterialRequirements,
  type SustainableMaterial,
  type MaterialsSearchRequest,
} from '../DBsearch/route';
import { executeDeepResearch } from '../GPTsearch/route';

// Integrated search API - Uses both DB and GPT
export async function POST(req: NextRequest) {
  try {
    const body: MaterialsSearchRequest = await req.json();
    const { currentMaterials, requirements } = body;

    console.log('🚀 Integrated search started...');
    console.log('Current materials:', currentMaterials);
    console.log('Requirements:', requirements);

    let sustainableMaterials: SustainableMaterial[] = [];
    let dataSource = 'Integrated Search';

    // Extract material properties from requirements
    const extractedRequirements = extractMaterialRequirements(requirements);

    // 1. Search from organic polymer database
    console.log('🌱 Step 1: Searching organic polymer database...');
    const organicMaterials = searchOrganicMaterials(
      extractedRequirements,
      currentMaterials
    );

    if (organicMaterials.length > 0) {
      sustainableMaterials = organicMaterials.slice(0, 3);
      dataSource = 'Organic Polymer Database';
      console.log(
        `✅ Found ${sustainableMaterials.length} suitable organic materials`
      );
    }

    // 2. Investigate latest research with OpenAI Deep Research (optional)
    if (process.env.OPENAI_API_KEY) {
      console.log('🔬 Step 2: Executing OpenAI Deep Research...');
      const deepResearch = await executeDeepResearch(
        extractedRequirements,
        currentMaterials
      );

      if (deepResearch && deepResearch.materials.length > 0) {
        console.log(
          `📚 Deep Research found ${deepResearch.materials.length} additional materials`
        );

        // Add Deep Research results to metadata
        sustainableMaterials = sustainableMaterials.map((material, index) => ({
          ...material,
          deepResearchInsights: deepResearch.materials[index]
            ? `AI Recommended: ${deepResearch.materials[index].name}`
            : undefined,
        }));

        // Add new materials found by Deep Research
        if (deepResearch.materials.length > sustainableMaterials.length) {
          const additionalMaterials = deepResearch.materials
            .slice(sustainableMaterials.length, sustainableMaterials.length + 2)
            .map(
              (gptMaterial, index: number) =>
                ({
                  name: gptMaterial.name,
                  composition: 'AI Recommended Material',
                  properties: {
                    tensileStrength: 80,
                    elongation: 150,
                    oxygenPermeability: 1.5,
                    waterVaporPermeability: 2.0,
                    heatResistance: 120,
                    recyclability: 'Requires evaluation',
                    biodegradability: 'Requires evaluation',
                    carbonFootprint: 0.7,
                  },
                  sustainabilityScore: 85,
                  matchScore: 80 - index * 5,
                  advantages: [
                    'Latest materials by OpenAI Deep Research',
                    'Advanced materials in research and development stage',
                    gptMaterial.confidence === 'high'
                      ? 'High practical applicability'
                      : 'Experimental verification required',
                  ],
                  considerations: [
                    'Detailed physical property evaluation required',
                    'Need to establish mass production technology',
                  ],
                  deepResearchInsights: `Source: ${gptMaterial.source}`,
                }) as SustainableMaterial
            );

          sustainableMaterials = [
            ...sustainableMaterials,
            ...additionalMaterials,
          ];
        }

        dataSource += ' + OpenAI Deep Research';

        // Include trend information
        if (deepResearch.trends && deepResearch.trends.length > 0) {
          console.log('📈 Trends identified:', deepResearch.trends.slice(0, 3));
        }
      }
    } else {
      console.log('⚠️ OpenAI API key not configured, skipping deep research');
    }

    // 3. Fallback (when no materials are found)
    if (sustainableMaterials.length === 0) {
      console.log('⚠️ No materials found, using fallback data');
      sustainableMaterials = [
        {
          name: 'Bio-PET/Paper/PLA Composite',
          composition: 'Bio-PET(15μm)/Paper Layer(20μm)/PLA(20μm)',
          properties: {
            tensileStrength: 95,
            elongation: 140,
            oxygenPermeability: 1.2,
            waterVaporPermeability: 2.5,
            heatResistance: 110,
            recyclability: 'Single material separation possible',
            biodegradability: 'Partial biodegradability',
            carbonFootprint: 0.8,
          },
          sustainabilityScore: 85,
          matchScore: 88,
          advantages: [
            'Uses 50% or more biomass-derived raw materials',
            'Recyclable structure',
            '30% reduction in CO2 emissions',
          ],
          considerations: [
            'Slightly reduced heat resistance',
            'Material cost increased by 15%',
          ],
        },
      ];
      dataSource = 'Fallback Data';
    }

    // Limit to maximum 5 items
    sustainableMaterials = sustainableMaterials.slice(0, 5);

    return NextResponse.json({
      success: true,
      materials: sustainableMaterials,
      metadata: {
        searchCriteria: {
          currentComposition: currentMaterials.composition,
          highPriorityRequirements: requirements
            .filter((r) => r.importance === 'high')
            .map((r) => r.name),
        },
        dataSource,
        totalResults: sustainableMaterials.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in integrated materials search:', error);

    // Return fallback data even on error
    return NextResponse.json({
      success: true,
      materials: [
        {
          name: 'Mono-material PE Multi-layer Structure',
          composition: 'HDPE/MDPE/LLDPE',
          properties: {
            tensileStrength: 90,
            elongation: 200,
            oxygenPermeability: 1.5,
            waterVaporPermeability: 1.8,
            heatResistance: 115,
            recyclability: 'Fully recyclable',
            biodegradability: 'Non-biodegradable',
            carbonFootprint: 0.9,
          },
          sustainabilityScore: 82,
          matchScore: 85,
          advantages: [
            'High recyclability with single material',
            'Compatible with existing recycling infrastructure',
          ],
          considerations: ['Oxygen barrier properties are slightly inferior'],
        },
      ],
      metadata: {
        searchCriteria: {
          currentComposition: 'Unknown',
          highPriorityRequirements: [],
        },
        dataSource: 'Error Recovery Fallback',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
    });
  }
}
