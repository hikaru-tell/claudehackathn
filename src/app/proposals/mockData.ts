export function generateMockProposals(scenarioId: string) {
  const proposalTemplates = {
    'potato-chips': [
      {
        materialName: 'Bio-PP Monolayer Film',
        composition: ['Bio-PP', 'EVOH', 'Coating'],
        scores: {
          physical: 85,
          environmental: 92,
          cost: 70,
          safety: 95,
          supply: 75,
        },
        totalScore: 83,
        reasoning:
          'By applying EVOH coating to plant-based polypropylene, we achieve mono-material design while maintaining excellent barrier properties. Recyclability is greatly improved with 40% CO2 emission reduction.',
        features: [
          'Mono-material',
          'Biomass-based',
          'Recyclable',
          'High barrier',
        ],
        dataSources: ['Convex Database', 'Latest Web Info', 'AI Analysis'],
      },
      {
        materialName: 'Paper/Bio-PE Laminate',
        composition: ['Paper', 'Bio-PE'],
        scores: {
          physical: 75,
          environmental: 88,
          cost: 85,
          safety: 90,
          supply: 80,
        },
        totalScore: 84,
        reasoning:
          'FSC-certified paper laminated with biomass-based PE. By keeping paper content above 70%, it can be processed through paper recycling routes. Appeals to environmentally conscious consumers.',
        features: ['Paper-based', 'FSC Certified', 'Bio-PE', 'Compatible with existing equipment'],
        dataSources: ['Convex Database', 'Industry Trend Analysis'],
      },
      {
        materialName: 'High Barrier PET Mono-material',
        composition: ['PET', 'SiOx', 'Coating'],
        scores: {
          physical: 90,
          environmental: 75,
          cost: 75,
          safety: 92,
          supply: 85,
        },
        totalScore: 83,
        reasoning:
          'Single material design with silicon oxide vapor deposition on PET. Can utilize existing PET recycling infrastructure while maintaining transparency for product visibility.',
        features: ['Single material', 'Transparency maintained', 'High barrier', 'Existing infrastructure'],
        dataSources: ['Technical Database', 'Patent Analysis'],
      },
    ],
    'frozen-food': [
      {
        materialName: 'Bio-PE Monolayer Film',
        composition: ['Bio-PE', 'EVOH', 'Bio-PE'],
        scores: {
          physical: 88,
          environmental: 85,
          cost: 72,
          safety: 94,
          supply: 78,
        },
        totalScore: 83,
        reasoning:
          'Using sugarcane-derived PE with EVOH middle layer. Maintains flexibility at -18°C while enabling microwave compatibility. Contributes to carbon neutrality.',
        features: ['Biomass-based', 'Freezer compatible', 'Microwave safe', 'Low-temp flexibility'],
        dataSources: ['Convex Database', 'Latest Research Papers'],
      },
      {
        materialName: 'Recycled PP Composite',
        composition: ['Recycled PP', 'EVOH', 'Recycled PP'],
        scores: {
          physical: 82,
          environmental: 80,
          cost: 88,
          safety: 90,
          supply: 82,
        },
        totalScore: 84,
        reasoning:
          'Three-layer structure using chemically recycled PP. Properties equivalent to virgin material with cost advantages. Contributes to circular economy.',
        features: ['Recycled material', 'Cost advantage', 'Circular economy', 'Proven track record'],
        dataSources: ['Market Data', 'Supplier Information'],
      },
      {
        materialName: 'Plant-based PA/PE',
        composition: ['Bio-PA', 'Bio-PE'],
        scores: {
          physical: 85,
          environmental: 82,
          cost: 68,
          safety: 91,
          supply: 73,
        },
        totalScore: 80,
        reasoning:
          'Combination of castor oil-derived polyamide and bio-PE. Excellent pinhole resistance and drop strength. Cost reduction expected with future mass production.',
        features: ['Plant-derived', 'High strength', 'Pinhole resistant', 'Future potential'],
        dataSources: ['Technology Trends', 'Developer Interviews'],
      },
    ],
    'coffee-beans': [
      {
        materialName: 'Barrier Coated Paper',
        composition: ['Paper', 'Bio-barrier', 'Coating'],
        scores: {
          physical: 78,
          environmental: 95,
          cost: 82,
          safety: 93,
          supply: 77,
        },
        totalScore: 85,
        reasoning:
          'Paper material with special barrier coating. Compostable with 6-month shelf life capability. Degassing valve can also be unified with paper material.',
        features: ['Compostable', 'Paper-based', 'Barrier properties', 'Eco-friendly'],
        dataSources: ['Convex Database', 'Environmental Certification Data'],
      },
      {
        materialName: 'Bio-PBS/PBAT',
        composition: ['Bio-PBS', 'PBAT', 'Blend'],
        scores: {
          physical: 82,
          environmental: 90,
          cost: 75,
          safety: 91,
          supply: 72,
        },
        totalScore: 82,
        reasoning:
          'Biodegradable plastic blend material. Completely degrades in soil with excellent gas barrier properties. Aroma retention performance equal to conventional materials.',
        features: ['Biodegradable', 'Soil degradable', 'Aroma retention', 'Barrier properties'],
        dataSources: ['Environmental Performance Data', 'Third-party Certification'],
      },
      {
        materialName: 'Recycled PET/PE',
        composition: ['Recycled PET', 'PE'],
        scores: {
          physical: 80,
          environmental: 78,
          cost: 85,
          safety: 89,
          supply: 83,
        },
        totalScore: 83,
        reasoning:
          'Two-layer structure of mechanically recycled PET and PE. Leverages existing recycling chains while maintaining necessary barrier properties.',
        features: ['Recycled material', 'Practical', 'Cost efficient', 'Stable supply'],
        dataSources: ['Market Price Data', 'Recycling Statistics'],
      },
    ],
    cosmetics: [
      {
        materialName: 'Glass Container',
        composition: ['Glass'],
        scores: {
          physical: 95,
          environmental: 85,
          cost: 60,
          safety: 98,
          supply: 90,
        },
        totalScore: 86,
        reasoning:
          'Infinitely recyclable glass container. Premium feel with no interaction with contents. Weight increase addressed through thin-wall technology.',
        features: ['Infinitely recyclable', 'Premium feel', 'Chemically stable', 'Transparency'],
        dataSources: ['Convex Database', 'Container Manufacturer Catalog'],
      },
      {
        materialName: 'PCR-PP Container',
        composition: ['PCR-PP'],
        scores: {
          physical: 82,
          environmental: 88,
          cost: 78,
          safety: 92,
          supply: 82,
        },
        totalScore: 84,
        reasoning:
          'Uses over 80% post-consumer recycled PP. Meets cosmetic-grade quality standards and compatible with existing filling lines.',
        features: ['High PCR content', 'Lightweight', 'Compatible with existing equipment', 'Cost efficient'],
        dataSources: ['Recycled Material Database', 'Quality Test Results'],
      },
      {
        materialName: 'Bio-PET Container',
        composition: ['Bio-PET'],
        scores: {
          physical: 88,
          environmental: 83,
          cost: 72,
          safety: 94,
          supply: 75,
        },
        totalScore: 82,
        reasoning:
          'Sugarcane-derived bio-PET. Can be processed in same recycling stream as conventional PET. Combines transparency with strength.',
        features: ['Biomass-based', 'Transparent', 'Recyclable', 'Lightweight'],
        dataSources: ['Bio-material Data', 'LCA Analysis Results'],
      },
    ],
  };

  // デフォルトのテンプレート（シナリオが見つからない場合）
  const defaultProposals = [
    {
      materialName: 'General Eco Material A',
      composition: ['Recycled material', 'Bio-material'],
      scores: {
        physical: 75,
        environmental: 85,
        cost: 80,
        safety: 90,
        supply: 75,
      },
      totalScore: 81,
      reasoning:
        'General-purpose alternative material that maintains necessary performance while reducing environmental impact.',
      features: ['Eco-friendly', 'Cost efficient', 'Stable supply'],
      dataSources: ['Database Search', 'AI Analysis'],
    },
    {
      materialName: 'General Eco Material B',
      composition: ['Regenerated material', 'Natural material'],
      scores: {
        physical: 70,
        environmental: 90,
        cost: 85,
        safety: 88,
        supply: 70,
      },
      totalScore: 81,
      reasoning: 'Environmentally conscious material based on natural materials.',
      features: ['Natural origin', 'Low environmental impact', 'Safety'],
      dataSources: ['Web Search', 'Technical Literature'],
    },
    {
      materialName: 'General Eco Material C',
      composition: ['Composite', 'Bioplastic'],
      scores: {
        physical: 80,
        environmental: 80,
        cost: 75,
        safety: 85,
        supply: 80,
      },
      totalScore: 80,
      reasoning: 'Standard alternative material with balanced performance.',
      features: ['Balanced', 'Versatile', 'Proven track record'],
      dataSources: ['Market Data', 'User Reviews'],
    },
  ];

  return (
    proposalTemplates[scenarioId as keyof typeof proposalTemplates] ||
    defaultProposals
  );
}
