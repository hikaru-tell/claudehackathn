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
  // ===== 既存シナリオ =====
  {
    id: 'potato-chips',
    name: 'ポテトチップス袋',
    icon: '🍟',
    description: 'スナック菓子用の一般的な多層フィルム包装',
    currentMaterial: {
      composition: 'PET/VMPET/CPP', // VMPET (アルミ蒸着PET) に変更
      properties: ['酸素バリア', '遮光性', '防湿性', 'ヒートシール性'],
    },
    requirements: {
      performance: ['酸素透過率 < 2cc', '水蒸気透過率 < 1g', '遮光性 > 99%'],
      sustainability: ['モノマテリアル化', 'リサイクル可能', 'CO2削減'],
    },
    challenges: ['複合材料', 'リサイクル困難', 'アルミ蒸着層'],
  },
  {
    id: 'frozen-food',
    name: '冷凍食品パウチ',
    icon: '🥟',
    description: '冷凍・電子レンジ対応のスタンディングパウチ',
    currentMaterial: {
      composition: 'PET/NY/CPP', // 一般的な構成に変更
      properties: ['耐寒性', '耐ピンホール性', '電子レンジ対応', '自立性'],
    },
    requirements: {
      performance: ['-20℃耐性', '電子レンジ加熱可', '落下強度', 'シール強度'],
      sustainability: [
        '単一素材化 (モノマテリアル)',
        'バイオマス原料',
        '薄肉化',
      ],
    },
    challenges: ['多層構造', '異種材料混合', 'ナイロン(NY)のリサイクル'],
  },
  {
    id: 'coffee-beans',
    name: 'コーヒー豆袋',
    icon: '☕',
    description: '焙煎コーヒー豆用のハイバリア包装（バルブ付き）',
    currentMaterial: {
      composition: 'PET/Al/PE',
      properties: ['超ハイバリア', '香り保持', '脱気バルブ', '遮光性'],
    },
    requirements: {
      performance: [
        '酸素透過率 < 0.1cc',
        '香気保持性',
        'CO2放出性',
        '長期保存',
      ],
      sustainability: ['脱アルミ', '紙製化', 'コンポスト可能'],
    },
    challenges: ['アルミ箔使用', 'バルブの分別', 'リサイクル不可'],
  },
  {
    id: 'beverage-bottle',
    name: 'PETボトル（飲料）',
    icon: '🥤',
    description: '炭酸飲料・清涼飲料用の標準的なボトル',
    currentMaterial: {
      composition: 'PET (Polyethylene Terephthalate)',
      properties: ['透明性', 'ガスバリア性', '耐圧性', '軽量'],
    },
    requirements: {
      performance: ['CO2保持', '透明度 > 90%', '落下強度', '密封性'],
      sustainability: [
        'リサイクルPET利用率向上',
        'バイオPET',
        '軽量化',
        'ラベルレス',
      ],
    },
    challenges: ['石油由来', 'マイクロプラスチック問題', 'ボトルtoボトル率'],
  },

  // ===== 追加シナリオ =====

  {
    id: 'shampoo-refill',
    name: 'シャンプー詰替パウチ',
    icon: '🧴',
    description: '液体製品用の自立するスパウト付きパウチ',
    currentMaterial: {
      composition: 'NY/LLDPE',
      properties: ['自立性', '耐内容物性', '落下強度', '注ぎ口'],
    },
    requirements: {
      performance: [
        '1m落下耐性',
        '内容物との化学反応なし',
        '長期保存性',
        '易開封性',
      ],
      sustainability: [
        'モノマテリアル化 (All PE)',
        'プラスチック使用量削減',
        'リサイクル容易性',
      ],
    },
    challenges: ['異種材料ラミネート', 'スパウト部分の分別', 'フィルムの厚み'],
  },
  {
    id: 'retort-pouch',
    name: 'レトルトパウチ（カレー等）',
    icon: '🍛',
    description: '高温高圧殺菌に耐えるハイバリア食品包装',
    currentMaterial: {
      composition: 'PET/Al/CPP-R',
      properties: ['耐レトルト性 (135℃)', '超ハイバリア', '遮光性', '無菌性'],
    },
    requirements: {
      performance: [
        '135℃ 30分加熱耐性',
        '2年以上の長期保存',
        '完全密封',
        '易開封性',
      ],
      sustainability: [
        '脱アルミ',
        '透明バリアフィルム化',
        'モノマテリアル化 (PPベース)',
      ],
    },
    challenges: ['アルミ箔が必須級', '超高温耐性', 'リサイクル不可'],
  },
  {
    id: 'tofu-container',
    name: '豆腐容器',
    icon: '🧊',
    description: '充填豆腐用のプラスチック容器と蓋フィルム',
    currentMaterial: {
      composition: 'PS容器 / PET蓋',
      properties: ['保形性', '耐水性', 'ヒートシール性', 'イージーピール性'],
    },
    requirements: {
      performance: [
        '完全密封',
        '無菌充填対応',
        '輸送時の強度',
        '開封のしやすさ',
      ],
      sustainability: ['紙容器化', 'バイオマスプラスチック', '減プラ'],
    },
    challenges: [
      'プラスチック使用量が多い',
      '容器と蓋の分別',
      'PSのリサイクル性',
    ],
  },
  {
    id: 'choco-wrap',
    name: 'チョコレート個包装',
    icon: '🍫',
    description: '「たけのこの里」のような菓子用の個包装フィルム',
    currentMaterial: {
      composition: 'OPP/VMPET/CPP',
      properties: ['ひねり包装性', '防湿性', '香り保持', '光沢感'],
    },
    requirements: {
      performance: [
        '自動包装機適性',
        '水蒸気透過率 < 2g',
        '酸化防止',
        '風味維持',
      ],
      sustainability: ['脱アルミ蒸着', '紙化への挑戦', 'モノマテリアル化'],
    },
    challenges: [
      'アルミ蒸着層によるリサイクル阻害',
      '薄膜フィルムの強度',
      '紙のバリア性',
    ],
  },
  {
    id: 'pharma-blister',
    name: '医薬品ブリスター包装',
    icon: '💊',
    description: '錠剤用のPTP (Press Through Pack) シート',
    currentMaterial: {
      composition: 'PVC/Al',
      properties: ['防湿性', '錠剤保護', '突き破り性', '衛生的'],
    },
    requirements: {
      performance: [
        '水蒸気透過率 < 0.1g',
        '薬剤の長期安定性',
        '取り出しやすさ',
        '無毒性',
      ],
      sustainability: [
        '脱塩ビ (PVC Free)',
        'モノマテリアル化 (PP or PET)',
        'リサイクル',
      ],
    },
    challenges: [
      'PVC（ポリ塩化ビニル）の使用',
      'アルミ箔との複合',
      '医薬品グレードの品質',
    ],
  },
  {
    id: 'paper-cup',
    name: '紙コップ（飲料用）',
    icon: '🥡',
    description: '内側にPEをラミネートした飲料用紙コップ',
    currentMaterial: {
      composition: '紙/PE',
      properties: ['耐水性', '断熱性', '保形性', '印刷適性'],
    },
    requirements: {
      performance: [
        '液体保持（24時間）',
        'ホット・コールド対応',
        '強度',
        '口当たりの良さ',
      ],
      sustainability: [
        '脱PEラミネート',
        '水性コートへの代替',
        '古紙リサイクル',
      ],
    },
    challenges: [
      'PEラミネートによるリサイクル阻害',
      '紙とプラの分離困難',
      '代替コートの性能',
    ],
  },
];
