import { NextRequest, NextResponse } from 'next/server';
import {
  ExtractedRequirements,
  MaterialComposition,
  MaterialRequirement,
  DeepResearchResult,
  DeepResearchMaterial,
  MaterialCitation,
} from '../types';

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export interface GPTSearchRequest {
  currentMaterials: MaterialComposition;
  requirements: MaterialRequirement[];
  searchQuery?: string;
}

// Generate OpenAI Deep Research prompt
export function generateDeepResearchPrompt(
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition,
  customQuery?: string
): string {
  const { composition, properties } = currentMaterials;

  // Convert requirements to text
  const performanceReqs = [];
  if (requirements.tensileStrength) {
    performanceReqs.push(
      `Tensile Strength: ${requirements.tensileStrength} N/15mm`
    );
  }
  if (requirements.oxygenPermeability) {
    performanceReqs.push(
      `Oxygen Permeability: ${requirements.oxygenPermeability} cc/m²·day·atm or less`
    );
  }
  if (requirements.waterVaporPermeability) {
    performanceReqs.push(
      `Water Vapor Permeability: ${requirements.waterVaporPermeability} g/m²·day or less`
    );
  }
  if (requirements.heatResistance) {
    performanceReqs.push(
      `Heat Resistance Temperature: ${requirements.heatResistance}°C or higher`
    );
  }

  // Prioritize custom query if available
  if (customQuery) {
    return customQuery;
  }

  const prompt = `
You are a specialized researcher in packaging materials. Please investigate the latest research papers and practical implementation cases under the following conditions:

[Current Material]
- Composition: ${composition || 'Unknown'}
- Properties: ${properties?.join(', ') || 'Unknown'}

[Performance Requirements]
${performanceReqs.join('\n')}

[Research Items]
1. Latest material research trends since 2020
2. Practical cases of sustainable packaging materials
3. Latest developments in bioplastics and biodegradable materials
4. Technologies for recyclable mono-material packaging
5. Performance comparison data of alternative materials

[Key Focus Points]
- Contribution to achieving carbon neutrality
- Safety certifications for food packaging
- Mass production feasibility and cost competitiveness
- Compatibility with existing processing equipment

[Response Format]
Please organize your answer in the following format:

1. Top 3 Recommended Materials
   - Material Name:
   - Manufacturer:
   - Key Physical Properties:
   - Price Range:
   - Implementation Cases:
   - References: [Paper/Report Title, Author/Institution, Year]

2. Technology Trends
   - Latest research and development directions
   - Future outlook
   - Reference information

3. Implementation Considerations
   - Technical challenges
   - Cost-related challenges
   - Regulatory and certification requirements

4. Reference List
   For each material, be sure to include:
   - Title of the document
   - Author/Research Institution
   - Publication Year
   - URL (if available)
   - Document type (Paper/Patent/Corporate Report/Website)

Please provide concrete material names, manufacturers, physical property data, and always include sources of information.
`;

  console.log(
    '🧠 Generated Deep Research Prompt (preview):',
    prompt.substring(0, 200) + '...'
  );
  return prompt;
}

// Parse Deep Research results
export function parseDeepResearchResult(
  researchText: string
): DeepResearchResult {
  const materials: DeepResearchMaterial[] = [];
  const trends: string[] = [];
  const considerations: string[] = [];
  const citations: MaterialCitation[] = [];

  // Split by sections
  const sections = researchText.split(/\n(?=\d\.)/);

  sections.forEach((section) => {
    // Extract recommended materials (with citation information)
    if (section.includes('Recommended Materials') || section.includes('TOP')) {
      const materialBlocks = section.split(/Material Name[:：]/);

      materialBlocks.forEach((block) => {
        if (block.trim()) {
          const lines = block.split('\n');
          const materialName = lines[0]?.trim();

          if (materialName && !materialName.includes('Recommended Materials')) {
            // Search for citations
            const citationMatch = block.match(
              /References?[:：]?\s*\[?([^\]\n]+)\]?/
            );
            const materialCitations: MaterialCitation[] = [];

            if (citationMatch) {
              const citationText = citationMatch[1];
              // Simple citation parsing
              const citationParts = citationText
                .split(',')
                .map((s) => s.trim());

              if (citationParts.length >= 2) {
                materialCitations.push({
                  title: citationParts[0],
                  authors: citationParts[1],
                  year: parseInt(citationParts[2]) || new Date().getFullYear(),
                  type: 'paper',
                });
              }
            }

            materials.push({
              name: materialName.split(/[,、]/)[0].trim(),
              source: 'OpenAI Deep Research',
              confidence: 'high',
              citations:
                materialCitations.length > 0 ? materialCitations : undefined,
            });
          }
        }
      });
    }

    // Extract technology trends
    if (section.includes('Trends') || section.includes('Technology Trends')) {
      const trendLines = section
        .split('\n')
        .filter((line) => line.includes('-') || line.includes('・'));
      trends.push(
        ...trendLines.map((line) => line.replace(/^[-・]\s*/, '').trim())
      );
    }

    // Extract considerations
    if (section.includes('Considerations') || section.includes('Challenges')) {
      const considerationLines = section
        .split('\n')
        .filter((line) => line.includes('-') || line.includes('・'));
      considerations.push(
        ...considerationLines.map((line) =>
          line.replace(/^[-・]\s*/, '').trim()
        )
      );
    }

    // Extract reference list
    if (section.includes('References') || section.includes('Reference List')) {
      const citationLines = section.split('\n').slice(1);

      citationLines.forEach((line) => {
        if (line.trim() && !line.startsWith('#')) {
          // Parse citations with various patterns
          const patterns = [
            // Pattern 1: "Title" (Author, Year)
            /"([^"]+)"\s*\(([^,]+),\s*(\d{4})\)/,
            // Pattern 2: Title, Author, Year
            /^([^,]+),\s*([^,]+),\s*(\d{4})/,
            // Pattern 3: [1] Title - Author (Year)
            /\[\d+\]\s*([^-]+)\s*-\s*([^(]+)\s*\((\d{4})\)/,
          ];

          for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
              citations.push({
                title: match[1].trim(),
                authors: match[2].trim(),
                year: parseInt(match[3]),
                type: line.includes('Patent')
                  ? 'patent'
                  : line.includes('Report')
                    ? 'report'
                    : 'paper',
              });
              break;
            }
          }
        }
      });
    }
  });

  // Material name pattern matching (additional)
  const materialPatterns = [
    /(?:PLA|PBS|PHA|PBAT|PCL|TPS|PHB|P3HB|P4HB)/gi,
    /(?:Bio|Recycled|Regenerated|Bio-)(?:PET|PE|PP|PA)/gi,
    /(?:Cellulose|Chitin|Starch|Alginate)(?:-based|\s+based)?/gi,
    /(?:Polylactic\s+Acid|Polyhydroxyalkanoate|Polybutylene\s+Succinate)/gi,
  ];

  materialPatterns.forEach((pattern) => {
    const matches = researchText.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        if (!materials.some((m) => m.name === match)) {
          materials.push({
            name: match,
            source: 'OpenAI Deep Research (Pattern Match)',
            confidence: 'medium',
          });
        }
      });
    }
  });

  // Extract URLs
  const urlPattern = /https?:\/\/[^\s]+/g;
  const urlMatches = researchText.match(urlPattern);
  if (urlMatches) {
    urlMatches.forEach((url) => {
      // Add URL to existing citations
      const urlDomain = new URL(url).hostname;
      const existingCitation = citations.find(
        (c) =>
          !c.url &&
          (c.title?.toLowerCase().includes(urlDomain.split('.')[0]) ||
            c.authors?.toLowerCase().includes(urlDomain.split('.')[0]))
      );

      if (existingCitation) {
        existingCitation.url = url;
      } else {
        // Add as new citation
        citations.push({
          title: `Online Resource: ${urlDomain}`,
          url: url,
          type: 'website',
          year: new Date().getFullYear(),
        });
      }
    });
  }

  return {
    materials,
    trends,
    considerations,
    citations,
    fullText: researchText,
    timestamp: new Date().toISOString(),
  };
}

// Execute Deep Research with OpenAI API
export async function executeDeepResearch(
  requirements: ExtractedRequirements,
  currentMaterials: MaterialComposition,
  customQuery?: string
): Promise<DeepResearchResult | null> {
  if (!OPENAI_API_KEY) {
    console.log('⚠️ OpenAI API key not configured, skipping deep research');
    return null;
  }

  try {
    console.log('🔬 Starting OpenAI Deep Research...');
    const prompt = generateDeepResearchPrompt(
      requirements,
      currentMaterials,
      customQuery
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content:
              'You are a materials science expert specializing in sustainable packaging materials. Provide detailed, accurate, and up-to-date information based on recent research and industry developments. Always respond in English.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', response.status, errorData);
      return null;
    }

    const data = await response.json();
    const researchResult = data.choices[0]?.message?.content;

    console.log('✅ Deep Research completed');

    // Convert research results to structured data
    return parseDeepResearchResult(researchResult);
  } catch (error) {
    console.error('Deep Research error:', error);
    return null;
  }
}

// Main API for GPT search
export async function POST(req: NextRequest) {
  try {
    const body: GPTSearchRequest = await req.json();
    const { currentMaterials, requirements, searchQuery } = body;

    console.log('🤖 GPT search started...');

    // Extract requirements simply
    const extractedRequirements: ExtractedRequirements = {};
    requirements.forEach((req) => {
      const value = parseFloat(req.value);
      if (
        req.name.includes('Tensile Strength') ||
        req.name.includes('引張強度')
      )
        extractedRequirements.tensileStrength = value;
      if (
        req.name.includes('Oxygen Permeability') ||
        req.name.includes('酸素透過率')
      )
        extractedRequirements.oxygenPermeability = value;
      if (
        req.name.includes('Water Vapor Permeability') ||
        req.name.includes('水蒸気透過率')
      )
        extractedRequirements.waterVaporPermeability = value;
      if (req.name.includes('Heat Resistance') || req.name.includes('耐熱温度'))
        extractedRequirements.heatResistance = value;
    });

    // Execute Deep Research
    const researchResult = await executeDeepResearch(
      extractedRequirements,
      currentMaterials,
      searchQuery
    );

    if (!researchResult) {
      return NextResponse.json(
        {
          error: 'OpenAI API not available',
          message: 'Please configure OPENAI_API_KEY in environment variables',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      result: researchResult,
      metadata: {
        prompt:
          generateDeepResearchPrompt(
            extractedRequirements,
            currentMaterials,
            searchQuery
          ).substring(0, 500) + '...',
        model: 'gpt-4-turbo-preview',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('GPT search error:', error);
    return NextResponse.json(
      {
        error: 'GPT search failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
