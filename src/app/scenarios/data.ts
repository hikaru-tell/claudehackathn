export interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  currentMaterial: {
    composition: string;
    properties: string[];
  };
  requirements: {
    performance: string[];
    sustainability: string[];
  };
  challenges: string[];
}

export const scenarios: Scenario[] = [
  // ===== Existing Scenarios =====
  {
    id: 'potato-chips',
    name: 'Potato Chip Bags',
    icon: '🍟',
    description: 'Common multi-layer film packaging for snack foods',
    currentMaterial: {
      composition: 'PET/VMPET/CPP', // VMPET (Vacuum Metallized PET)
      properties: ['Oxygen barrier', 'Light blocking', 'Moisture proof', 'Heat sealability'],
    },
    requirements: {
      performance: ['Oxygen transmission rate < 2cc', 'Water vapor transmission rate < 1g', 'Light blocking > 99%'],
      sustainability: ['Mono-material design', 'Recyclable', 'CO2 reduction'],
    },
    challenges: ['Composite materials', 'Recycling difficulty', 'Aluminum metallized layer'],
  },
  {
    id: 'frozen-food',
    name: 'Frozen Food Pouches',
    icon: '🥟',
    description: 'Standing pouches for frozen and microwave-safe foods',
    currentMaterial: {
      composition: 'PET/NY/CPP', // Common structure
      properties: ['Cold resistance', 'Pinhole resistance', 'Microwave safe', 'Self-standing'],
    },
    requirements: {
      performance: ['-20°C resistance', 'Microwave heating compatible', 'Drop strength', 'Seal strength'],
      sustainability: [
        'Single material (mono-material)',
        'Biomass materials',
        'Thickness reduction',
      ],
    },
    challenges: ['Multi-layer structure', 'Mixed materials', 'Nylon (NY) recycling'],
  },
  {
    id: 'coffee-beans',
    name: 'Coffee Bean Bags',
    icon: '☕',
    description: 'High-barrier packaging for roasted coffee beans (with valve)',
    currentMaterial: {
      composition: 'PET/Al/PE',
      properties: ['Ultra-high barrier', 'Aroma retention', 'Degassing valve', 'Light blocking'],
    },
    requirements: {
      performance: [
        'Oxygen transmission rate < 0.1cc',
        'Aroma retention',
        'CO2 release capability',
        'Long-term storage',
      ],
      sustainability: ['Aluminum-free', 'Paper-based', 'Compostable'],
    },
    challenges: ['Aluminum foil usage', 'Valve separation', 'Non-recyclable'],
  },
  {
    id: 'beverage-bottle',
    name: 'PET Bottles (Beverages)',
    icon: '🥤',
    description: 'Standard bottles for carbonated and soft drinks',
    currentMaterial: {
      composition: 'PET (Polyethylene Terephthalate)',
      properties: ['Transparency', 'Gas barrier', 'Pressure resistance', 'Lightweight'],
    },
    requirements: {
      performance: ['CO2 retention', 'Transparency > 90%', 'Drop strength', 'Seal integrity'],
      sustainability: [
        'Increased recycled PET usage',
        'Bio-PET',
        'Weight reduction',
        'Label-free',
      ],
    },
    challenges: ['Petroleum-based', 'Microplastic issues', 'Bottle-to-bottle recycling rate'],
  },

  // ===== Additional Scenarios =====

  {
    id: 'shampoo-refill',
    name: 'Shampoo Refill Pouches',
    icon: '🧴',
    description: 'Self-standing pouches with spout for liquid products',
    currentMaterial: {
      composition: 'NY/LLDPE',
      properties: ['Self-standing', 'Content resistance', 'Drop strength', 'Pouring spout'],
    },
    requirements: {
      performance: [
        '1m drop resistance',
        'No chemical reaction with contents',
        'Long-term storage stability',
        'Easy opening',
      ],
      sustainability: [
        'Mono-material design (All PE)',
        'Plastic usage reduction',
        'Easy recycling',
      ],
    },
    challenges: ['Mixed material laminate', 'Spout separation', 'Film thickness'],
  },
  {
    id: 'retort-pouch',
    name: 'Retort Pouches (Curry, etc.)',
    icon: '🍛',
    description: 'High-barrier food packaging resistant to high temperature/pressure sterilization',
    currentMaterial: {
      composition: 'PET/Al/CPP-R',
      properties: ['Retort resistance (135°C)', 'Ultra-high barrier', 'Light blocking', 'Sterility'],
    },
    requirements: {
      performance: [
        '135°C 30min heat resistance',
        '2+ years long-term storage',
        'Complete seal',
        'Easy opening',
      ],
      sustainability: [
        'Aluminum-free',
        'Transparent barrier film',
        'Mono-material design (PP-based)',
      ],
    },
    challenges: ['Aluminum foil essential', 'Ultra-high temperature resistance', 'Non-recyclable'],
  },
  {
    id: 'tofu-container',
    name: 'Tofu Containers',
    icon: '🧊',
    description: 'Plastic containers and lid films for filled tofu',
    currentMaterial: {
      composition: 'PS container / PET lid',
      properties: ['Shape retention', 'Water resistance', 'Heat sealability', 'Easy peel'],
    },
    requirements: {
      performance: [
        'Complete seal',
        'Aseptic filling compatible',
        'Transport strength',
        'Easy to open',
      ],
      sustainability: ['Paper container conversion', 'Biomass plastics', 'Plastic reduction'],
    },
    challenges: [
      'High plastic usage',
      'Container and lid separation',
      'PS recyclability',
    ],
  },
  {
    id: 'choco-wrap',
    name: 'Chocolate Individual Wrapping',
    icon: '🍫',
    description: 'Individual wrapping film for confectionery like "Takenoko no Sato"',
    currentMaterial: {
      composition: 'OPP/VMPET/CPP',
      properties: ['Twist wrapping capability', 'Moisture proof', 'Aroma retention', 'Glossy finish'],
    },
    requirements: {
      performance: [
        'Automatic packaging machine compatibility',
        'Water vapor transmission rate < 2g',
        'Oxidation prevention',
        'Flavor maintenance',
      ],
      sustainability: ['Aluminum metallization-free', 'Paper conversion challenge', 'Mono-material design'],
    },
    challenges: [
      'Recycling hindered by aluminum metallized layer',
      'Thin film strength',
      'Paper barrier properties',
    ],
  },
  {
    id: 'pharma-blister',
    name: 'Pharmaceutical Blister Packaging',
    icon: '💊',
    description: 'PTP (Press Through Pack) sheets for tablets',
    currentMaterial: {
      composition: 'PVC/Al',
      properties: ['Moisture proof', 'Tablet protection', 'Push-through capability', 'Hygienic'],
    },
    requirements: {
      performance: [
        'Water vapor transmission rate < 0.1g',
        'Long-term drug stability',
        'Easy dispensing',
        'Non-toxic',
      ],
      sustainability: [
        'PVC-free',
        'Mono-material design (PP or PET)',
        'Recyclable',
      ],
    },
    challenges: [
      'PVC (Polyvinyl chloride) usage',
      'Composite with aluminum foil',
      'Pharmaceutical grade quality',
    ],
  },
  {
    id: 'paper-cup',
    name: 'Paper Cups (Beverages)',
    icon: '🥡',
    description: 'Paper cups for beverages with PE laminate on the inside',
    currentMaterial: {
      composition: 'Paper/PE',
      properties: ['Water resistance', 'Insulation', 'Shape retention', 'Printability'],
    },
    requirements: {
      performance: [
        'Liquid retention (24 hours)',
        'Hot & cold compatible',
        'Strength',
        'Good mouthfeel',
      ],
      sustainability: [
        'PE laminate-free',
        'Water-based coating alternative',
        'Paper recycling',
      ],
    },
    challenges: [
      'Recycling hindered by PE laminate',
      'Difficult separation of paper and plastic',
      'Alternative coating performance',
    ],
  },
];
