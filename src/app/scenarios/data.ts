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
  {
    id: "potato-chips",
    name: "ポテトチップス袋",
    icon: "🥔",
    description: "スナック菓子用の多層フィルム包装",
    currentMaterial: {
      composition: "PET/Al/CPP",
      properties: ["酸素バリア", "遮光性", "防湿性", "ヒートシール性"],
    },
    requirements: {
      performance: ["酸素透過率 < 1cc", "水蒸気透過率 < 1g", "遮光性 > 99%"],
      sustainability: ["モノマテリアル化", "リサイクル可能", "CO2削減"],
    },
    challenges: ["複合材料", "リサイクル困難", "アルミ使用"],
  },
  {
    id: "frozen-food",
    name: "冷凍食品パウチ",
    icon: "🧊",
    description: "冷凍・電子レンジ対応の食品包装",
    currentMaterial: {
      composition: "NY/EVOH/CPP",
      properties: ["耐寒性", "酸素バリア", "耐ピンホール性", "電子レンジ対応"],
    },
    requirements: {
      performance: ["-18℃保存", "電子レンジ加熱可", "落下強度", "シール強度"],
      sustainability: ["単一素材化", "バイオマス原料", "薄肉化"],
    },
    challenges: ["多層構造", "異種材料混合", "厚膜"],
  },
  {
    id: "coffee-beans",
    name: "コーヒー豆包装",
    icon: "☕",
    description: "焙煎コーヒー豆用のバリア包装",
    currentMaterial: {
      composition: "PET/Al/PE",
      properties: ["酸素バリア", "香り保持", "脱気バルブ", "遮光性"],
    },
    requirements: {
      performance: ["酸素透過率 < 0.1cc", "香気保持", "CO2放出", "6ヶ月保存"],
      sustainability: ["紙製化", "生分解性", "コンポスト可能"],
    },
    challenges: ["アルミ箔使用", "バルブ付き", "長期保存"],
  },
  {
    id: "beverage-bottle",
    name: "飲料ボトル",
    icon: "🥤",
    description: "炭酸飲料・清涼飲料用ボトル",
    currentMaterial: {
      composition: "PET",
      properties: ["透明性", "ガスバリア", "耐圧性", "軽量"],
    },
    requirements: {
      performance: ["CO2保持", "透明度 > 90%", "落下強度", "キャップ密封"],
      sustainability: ["バイオPET", "リサイクルPET", "軽量化", "ラベルレス"],
    },
    challenges: ["石油由来", "マイクロプラ", "回収率"],
  },
];