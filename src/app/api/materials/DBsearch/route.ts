import { NextRequest, NextResponse } from 'next/server';
import {
  MaterialsSearchRequest,
  SustainableMaterial,
  ExtractedRequirements,
  MaterialComposition,
  MaterialRequirement,
} from '../types';

// Base URL for Materials Project API
const MP_API_BASE = 'https://api.materialsproject.org';

// Re-export type definitions (for backward compatibility)
export type { MaterialsSearchRequest, SustainableMaterial };

// Extract material properties from requirements
export function extractMaterialRequirements(
  requirements: MaterialRequirement[]
): ExtractedRequirements {
  const extracted: ExtractedRequirements = {};

  requirements.forEach((req) => {
    const value = parseFloat(req.value);

    if (req.name.includes('Tensile Strength')) {
      extracted.tensileStrength = value;
    } else if (req.name.includes('Elongation')) {
      extracted.elongation = value;
    } else if (req.name.includes('Impact Strength')) {
      extracted.impactStrength = value;
    } else if (req.name.includes('Heat Seal Strength')) {
      extracted.heatSealStrength = value;
    } else if (req.name.includes('Oxygen Permeability')) {
      extracted.oxygenPermeability = value;
    } else if (req.name.includes('Water Vapor Permeability')) {
      extracted.waterVaporPermeability = value;
    } else if (req.name.includes('Light Blocking')) {
      extracted.lightBlocking = value;
    } else if (req.name.includes('Heat Resistance')) {
      extracted.heatResistance = value;
    } else if (req.name.includes('Cold Resistance')) {
      extracted.coldResistance = value;
    }
  });

  return extracted;
}

// Organic polymer database (real packaging materials data)
export function getOrganicPolymerDatabase() {
  return [
    // Bioplastics
    {
      material_id: 'bio-001',
      formula_pretty: 'PLA (C3H4O2)n',
      name: 'Polylactic Acid',
      type: 'bioplastic',
      properties: {
        tensileStrength: 65,
        elongation: 150,
        meltingPoint: 175,
        density: 1.24,
        oxygenPermeability: 1.8,
        waterVaporPermeability: 2.5,
      },
      sustainability: {
        biodegradable: true,
        compostable: true,
        biomasContent: 100,
        carbonFootprint: 0.5,
      },
    },
    {
      material_id: 'bio-002',
      formula_pretty: 'PHA (C4H6O2)n',
      name: 'Polyhydroxyalkanoate',
      type: 'bioplastic',
      properties: {
        tensileStrength: 40,
        elongation: 200,
        meltingPoint: 165,
        density: 1.25,
        oxygenPermeability: 2.3,
        waterVaporPermeability: 3.0,
      },
      sustainability: {
        biodegradable: true,
        compostable: true,
        biomasContent: 100,
        carbonFootprint: 0.4,
      },
    },
    {
      material_id: 'bio-003',
      formula_pretty: 'PBS (C8H12O4)n',
      name: 'Polybutylene Succinate',
      type: 'bioplastic',
      properties: {
        tensileStrength: 55,
        elongation: 300,
        meltingPoint: 115,
        density: 1.26,
        oxygenPermeability: 2.0,
        waterVaporPermeability: 2.8,
      },
      sustainability: {
        biodegradable: true,
        compostable: false,
        biomasContent: 50,
        carbonFootprint: 0.7,
      },
    },
    // Recycled polymers
    {
      material_id: 'rec-001',
      formula_pretty: 'rPET (C10H8O4)n',
      name: 'Recycled PET',
      type: 'recycled',
      properties: {
        tensileStrength: 85,
        elongation: 120,
        meltingPoint: 250,
        density: 1.38,
        oxygenPermeability: 0.8,
        waterVaporPermeability: 1.5,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        recycledContent: 100,
        carbonFootprint: 0.6,
      },
    },
    {
      material_id: 'rec-002',
      formula_pretty: 'rPE (C2H4)n',
      name: 'Recycled Polyethylene',
      type: 'recycled',
      properties: {
        tensileStrength: 45,
        elongation: 400,
        meltingPoint: 135,
        density: 0.95,
        oxygenPermeability: 3.5,
        waterVaporPermeability: 0.5,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        recycledContent: 100,
        carbonFootprint: 0.5,
      },
    },
    // Bio-based polymers
    {
      material_id: 'bio-pe-001',
      formula_pretty: 'Bio-PE (C2H4)n',
      name: 'Bio-Polyethylene',
      type: 'bio-based',
      properties: {
        tensileStrength: 50,
        elongation: 450,
        meltingPoint: 135,
        density: 0.96,
        oxygenPermeability: 3.2,
        waterVaporPermeability: 0.4,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        biomasContent: 95,
        carbonFootprint: 0.3,
      },
    },
    {
      material_id: 'bio-pet-001',
      formula_pretty: 'Bio-PET (C10H8O4)n',
      name: 'Bio-PET',
      type: 'bio-based',
      properties: {
        tensileStrength: 90,
        elongation: 130,
        meltingPoint: 255,
        density: 1.39,
        oxygenPermeability: 0.7,
        waterVaporPermeability: 1.4,
      },
      sustainability: {
        biodegradable: false,
        recyclable: true,
        biomasContent: 30,
        carbonFootprint: 0.8,
      },
    },
    // Cellulose-based
    {
      material_id: 'cel-001',
      formula_pretty: 'CNF (C6H10O5)n',
      name: 'Cellulose Nanofiber',
      type: 'cellulose',
      properties: {
        tensileStrength: 150,
        elongation: 80,
        meltingPoint: 180,
        density: 1.5,
        oxygenPermeability: 0.3,
        waterVaporPermeability: 4.0,
      },
      sustainability: {
        biodegradable: true,
        compostable: true,
        biomasContent: 100,
        carbonFootprint: 0.2,
      },
    },
  ];
}

// Search organic materials database based on requirements
export function searchOrganicMaterials(
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition
): SustainableMaterial[] {
  console.log('🌱 Searching organic polymer database with requirements...');

  const organicDB = getOrganicPolymerDatabase();
  const results: SustainableMaterial[] = [];

  // Analyze current material composition
  const needsHighBarrier = requirements.oxygenPermeability < 2;
  const needsBiodegradable =
    currentMaterials.properties?.includes('Biodegradable');

  // Score each organic material
  organicDB.forEach((material) => {
    let score = 0;

    // Barrier property matching
    if (needsHighBarrier && material.properties.oxygenPermeability < 2) {
      score += 30;
    }

    // Strength matching
    if (
      Math.abs(
        material.properties.tensileStrength - requirements.tensileStrength
      ) < 20
    ) {
      score += 25;
    }

    // Sustainability matching
    if (material.sustainability.biodegradable && needsBiodegradable) {
      score += 20;
    }
    if (
      material.sustainability.biomasContent &&
      material.sustainability.biomasContent > 50
    ) {
      score += 15;
    }
    if (material.sustainability.carbonFootprint < 0.6) {
      score += 10;
    }

    // Convert to SustainableMaterial format
    const convertedMaterial: SustainableMaterial = {
      name: material.name,
      composition: material.formula_pretty,
      properties: {
        tensileStrength: material.properties.tensileStrength,
        elongation: material.properties.elongation,
        oxygenPermeability: material.properties.oxygenPermeability,
        waterVaporPermeability: material.properties.waterVaporPermeability,
        heatResistance: material.properties.meltingPoint,
        recyclability: material.sustainability.recyclable
          ? 'Fully Recyclable'
          : material.sustainability.biodegradable
            ? 'Biodegradable'
            : 'Needs Review',
        biodegradability: material.sustainability.biodegradable
          ? material.sustainability.compostable
            ? 'Compostable'
            : 'Biodegradable'
          : 'Non-biodegradable',
        carbonFootprint: material.sustainability.carbonFootprint,
      },
      sustainabilityScore: Math.min(
        95,
        70 + (material.sustainability.biomasContent || 0) * 0.25
      ),
      matchScore: Math.min(95, score),
      advantages: [
        `Material Type: ${
          material.type === 'bioplastic'
            ? 'Bioplastic'
            : material.type === 'recycled'
              ? 'Recycled Material'
              : material.type === 'bio-based'
                ? 'Bio-based Material'
                : 'Cellulose-based Material'
        }`,
        material.sustainability.biodegradable ? 'Biodegradable' : 'Recyclable',
        `Biomass Content: ${material.sustainability.biomasContent || 0}%`,
        `CO2 Emissions: ${material.sustainability.carbonFootprint} kg-CO2/kg`,
        `Density: ${material.properties.density} g/cm³`,
      ],
      considerations: [
        material.properties.meltingPoint < 150
          ? 'Low heat resistance (<150℃)'
          : null,
        material.properties.tensileStrength < 50
          ? 'Potentially low strength'
          : null,
        material.sustainability.biomasContent === 100
          ? 'Fully biomass-derived'
          : null,
      ].filter((c) => c !== null) as string[],
    };

    results.push(convertedMaterial);
  });

  // Sort by highest score
  results.sort((a, b) => b.matchScore - a.matchScore);

  console.log(
    `✅ Found ${results.length} organic materials, top match score: ${results[0]?.matchScore}`
  );

  // Log top 3 material names
  if (results.length > 0) {
    console.log(
      '🏆 Top materials:',
      results
        .slice(0, 3)
        .map((m) => m.name)
        .join(', ')
    );
  }

  return results;
}

// Search Materials Project API
export async function searchMaterialsProjectAPI(
  apiKey: string,
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition
) {
  try {
    console.log('🔍 Searching Materials Project API...');

    // Simple query for organic materials
    const searchParams = new URLSearchParams({
      _limit: '10',
      elements: 'C,H,O,N', // Basic elements of organic materials
    });

    const url = `${MP_API_BASE}/materials/core/?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Materials Project API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data || data || [];
  } catch (error) {
    console.error('Materials Project API error:', error);
    return null;
  }
}

// Main API for database search
export async function POST(req: NextRequest) {
  try {
    const body: MaterialsSearchRequest = await req.json();
    const { currentMaterials, requirements } = body;

    console.log('📊 Database search started...');
    console.log('📋 Current materials:', currentMaterials);
    console.log('📋 Requirements:', requirements);

    // Extract requirements into material properties
    const extractedRequirements = extractMaterialRequirements(requirements);
    console.log('🔍 Extracted requirements:', extractedRequirements);

    // Search from organic polymer database
    const organicMaterials = searchOrganicMaterials(
      extractedRequirements,
      currentMaterials
    );

    return NextResponse.json({
      success: true,
      materials: organicMaterials.slice(0, 5),
      source: 'Organic Polymer Database',
      metadata: {
        totalResults: organicMaterials.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Database search error:', error);
    return NextResponse.json(
      { error: 'Database search failed' },
      { status: 500 }
    );
  }
}
