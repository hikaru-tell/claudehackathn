// 共通の型定義

export interface MaterialRequirement {
  name: string;
  value: string;
  unit?: string;
  importance: "high" | "medium" | "low";
}

export interface MaterialComposition {
  composition: string;
  properties: string[];
}

export interface ExtractedRequirements {
  tensileStrength?: number;
  elongation?: number;
  impactStrength?: number;
  heatSealStrength?: number;
  oxygenPermeability?: number;
  waterVaporPermeability?: number;
  lightBlocking?: number;
  heatResistance?: number;
  coldResistance?: number;
}

export interface MaterialProperties {
  tensileStrength?: number;
  elongation?: number;
  oxygenPermeability?: number;
  waterVaporPermeability?: number;
  heatResistance?: number;
  recyclability?: string;
  biodegradability?: string;
  carbonFootprint?: number;
}

export interface SustainableMaterial {
  name: string;
  composition: string;
  properties: MaterialProperties;
  sustainabilityScore: number;
  matchScore: number;
  advantages: string[];
  considerations: string[];
  deepResearchInsights?: string;
}

export interface MaterialsSearchRequest {
  currentMaterials: MaterialComposition;
  requirements: MaterialRequirement[];
}

export interface DeepResearchMaterial {
  name: string;
  source: string;
  confidence: "high" | "medium" | "low";
  citations?: MaterialCitation[];
}

export interface MaterialCitation {
  title: string;
  authors?: string;
  organization?: string;
  year?: number;
  url?: string;
  type: "paper" | "patent" | "report" | "website" | "other";
}

export interface DeepResearchResult {
  materials: DeepResearchMaterial[];
  trends: string[];
  considerations: string[];
  citations: MaterialCitation[];
  fullText: string;
  timestamp: string;
}

export interface SearchResponse {
  success: boolean;
  materials?: SustainableMaterial[];
  result?: DeepResearchResult;
  metadata: {
    searchCriteria?: {
      currentComposition: string;
      highPriorityRequirements: string[];
    };
    dataSource?: string;
    totalResults?: number;
    timestamp: string;
    error?: string;
    prompt?: string;
    model?: string;
  };
}
