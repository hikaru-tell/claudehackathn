import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

// Dynamic import of PDF parser
async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    // For PDF files - temporarily return mock data
    console.log('Skipping PDF parsing, using mock data');

    // Return sample text instead of actual PDF content
    return `
Product Specification Sheet
Product Code: TK-FILM-2024-STD

1. Product Overview
This product is a multi-layer film for food packaging.

2. Material Composition
- Outer layer: PET (12μm) - Printability, strength
- Middle layer: Vacuum Metallized PET (12μm) - Barrier properties, light blocking
- Inner layer: CPP (30μm) - Heat sealability

3. Performance Requirements
3.1 Physical Performance
- Tensile strength: >100 N/15mm
- Elongation: >150%
- Impact strength: >1.0 J
- Heat seal strength: >20 N/15mm

3.2 Barrier Performance
- Oxygen transmission rate: <1.0 cc/m²·day·atm
- Water vapor transmission rate: <2.0 g/m²·day
- Light blocking: >99%

3.3 Resistance Requirements
- Heat resistance: 120°C (30 min)
- Cold resistance: -20°C
- Oil resistance: Salad oil 60°C 30 days no abnormality

4. Environmental Requirements
- Recycling: Promoting mono-material design
- CO2 reduction: 20% reduction in manufacturing CO2 emissions vs conventional
- Biomass: Considering use of some biomass-derived materials

5. Quality Control
- Appearance: No foreign matter, stains, or scratches
- Dimensions: Width 300mm ±2mm
- Thickness: 54μm ±5%
`;
  } else {
    // Other text files
    return await file.text();
  }
}

export async function POST(req: NextRequest) {
  console.log('AI analysis API called');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('File not found');
      return NextResponse.json(
        { error: 'File not found' },
        { status: 400 }
      );
    }

    console.log(`File received: ${file.name}, Size: ${file.size} bytes`);

    // Read file contents
    const text = await extractTextFromFile(file);
    console.log(`Text extraction complete: ${text.length} characters`);

    console.log('Calling Claude API...');

    // Analyze performance requirements using Claude API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: `Analyze the product performance requirements and material information from the following document and extract them in JSON format.
Please output in the following format:
{
  "requirements": [
    {
      "name": "Requirement name",
      "value": "Specific value or standard",
      "unit": "Unit (if applicable)",
      "importance": "high/medium/low"
    }
  ],
  "materials": {
    "composition": "Estimated material composition (e.g., PET/Al/PE)",
    "properties": ["Property 1", "Property 2", "Property 3"],
    "analysisConfidence": "high/medium/low"
  }
}

Document content:
${text}

Please focus on analyzing the following points:
1. Performance requirements (strength, durability, temperature resistance, barrier properties, weight, size, cost, etc.)
2. Information about materials used
3. Information about packaging form and structure
4. Environmental and recycling requirements

If material composition is not specified, please estimate and suggest an appropriate multi-layer structure based on the requirements.`,
        },
      ],
    });

    console.log('Claude API response received');

    // Extract JSON from Claude's response
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    console.log('Claude response content length:', responseText.length);

    // Parse JSON
    let requirements;
    try {
      // Extract JSON block (also handles ```json ... ``` format)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        requirements = JSON.parse(jsonMatch[0]);
        console.log('JSON parsing successful:', requirements);
      } else {
        throw new Error('JSON format response not found');
      }
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Response text:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse requirements', details: responseText },
        { status: 500 }
      );
    }

    console.log('Returning analysis results');
    return NextResponse.json(requirements);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Server error occurred' },
      { status: 500 }
    );
  }
}
