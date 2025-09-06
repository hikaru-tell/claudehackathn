export function generateMockProposals(scenarioId: string) {
  const proposalTemplates = {
    'potato-chips': [
      {
        materialName: 'バイオPP単層フィルム',
        composition: ['バイオPP', 'EVOH', 'コーティング'],
        scores: {
          physical: 85,
          environmental: 92,
          cost: 70,
          safety: 95,
          supply: 75,
        },
        totalScore: 83,
        reasoning:
          '植物由来のポリプロピレンにEVOHコーティングを施すことで、優れたバリア性を維持しながらモノマテリアル化を実現。リサイクル性が大幅に向上し、CO2排出量を40%削減可能。',
        features: [
          'モノマテリアル',
          'バイオマス由来',
          'リサイクル可能',
          '高バリア性',
        ],
        dataSources: ['Convexデータベース', '最新Web情報', 'AI分析'],
      },
      {
        materialName: '紙/バイオPEラミネート',
        composition: ['紙', 'バイオPE'],
        scores: {
          physical: 75,
          environmental: 88,
          cost: 85,
          safety: 90,
          supply: 80,
        },
        totalScore: 84,
        reasoning:
          'FSC認証紙にバイオマス由来PEをラミネート。紙の割合を70%以上にすることで紙リサイクルルートで処理可能。消費者の環境意識にも訴求しやすい。',
        features: ['紙ベース', 'FSC認証', 'バイオPE使用', '既存設備対応'],
        dataSources: ['Convexデータベース', '業界トレンド分析'],
      },
      {
        materialName: '高バリアPETモノマテリアル',
        composition: ['PET', 'SiOx', 'コーティング'],
        scores: {
          physical: 90,
          environmental: 75,
          cost: 75,
          safety: 92,
          supply: 85,
        },
        totalScore: 83,
        reasoning:
          'PETに酸化ケイ素蒸着処理を施した単一素材構成。既存のPETリサイクルインフラを活用可能で、透明性も維持できるため商品の視認性も確保。',
        features: ['単一素材', '透明性維持', '高バリア', '既存インフラ活用'],
        dataSources: ['技術データベース', '特許情報分析'],
      },
    ],
    'frozen-food': [
      {
        materialName: 'バイオPE単層フィルム',
        composition: ['バイオPE', 'EVOH', 'バイオPE'],
        scores: {
          physical: 88,
          environmental: 85,
          cost: 72,
          safety: 94,
          supply: 78,
        },
        totalScore: 83,
        reasoning:
          'サトウキビ由来のPEを使用し、中間層にEVOHを配置。-18℃での柔軟性を維持しながら、電子レンジ対応も可能。カーボンニュートラルに貢献。',
        features: ['バイオマス', '冷凍対応', '電子レンジ可', '低温柔軟性'],
        dataSources: ['Convexデータベース', '最新研究論文'],
      },
      {
        materialName: 'リサイクルPP複合材',
        composition: ['リサイクルPP', 'EVOH', 'リサイクルPP'],
        scores: {
          physical: 82,
          environmental: 80,
          cost: 88,
          safety: 90,
          supply: 82,
        },
        totalScore: 84,
        reasoning:
          'ケミカルリサイクルPPを使用した3層構造。バージン材と同等の物性を持ち、コスト面でも優位性あり。循環型経済に貢献。',
        features: ['リサイクル材', 'コスト優位', '循環型', '実績豊富'],
        dataSources: ['市場データ', 'サプライヤー情報'],
      },
      {
        materialName: '植物由来PA/PE',
        composition: ['バイオPA', 'バイオPE'],
        scores: {
          physical: 85,
          environmental: 82,
          cost: 68,
          safety: 91,
          supply: 73,
        },
        totalScore: 80,
        reasoning:
          'ヒマシ油由来のポリアミドとバイオPEの組み合わせ。優れた耐ピンホール性と落下強度を実現。将来的な量産化でコスト削減見込み。',
        features: ['植物由来', '高強度', '耐ピンホール', '将来性'],
        dataSources: ['技術トレンド', '開発者インタビュー'],
      },
    ],
    'coffee-beans': [
      {
        materialName: 'バリアコート紙',
        composition: ['紙', 'バイオバリア', 'コーティング'],
        scores: {
          physical: 78,
          environmental: 95,
          cost: 82,
          safety: 93,
          supply: 77,
        },
        totalScore: 85,
        reasoning:
          '特殊バリアコーティングを施した紙素材。コンポスト可能で、6ヶ月の賞味期限を確保。脱気バルブも紙製で統一可能。',
        features: ['コンポスト可能', '紙製', 'バリア性', '環境配慮'],
        dataSources: ['Convexデータベース', '環境認証データ'],
      },
      {
        materialName: 'バイオPBS/PBAT',
        composition: ['バイオPBS', 'PBAT', 'ブレンド'],
        scores: {
          physical: 82,
          environmental: 90,
          cost: 75,
          safety: 91,
          supply: 72,
        },
        totalScore: 82,
        reasoning:
          '生分解性プラスチックのブレンド材。土壌中で完全分解し、優れたガスバリア性を実現。香り保持性能も従来材と同等。',
        features: ['生分解性', '土壌分解', '香り保持', 'バリア性'],
        dataSources: ['環境性能データ', '第三者認証'],
      },
      {
        materialName: 'リサイクルPET/PE',
        composition: ['リサイクルPET', 'PE'],
        scores: {
          physical: 80,
          environmental: 78,
          cost: 85,
          safety: 89,
          supply: 83,
        },
        totalScore: 83,
        reasoning:
          'メカニカルリサイクルPETとPEの2層構造。既存のリサイクルチェーンを活用しながら、必要なバリア性を確保。',
        features: ['リサイクル材', '実用的', 'コスト効率', '供給安定'],
        dataSources: ['市場価格データ', 'リサイクル統計'],
      },
    ],
    cosmetics: [
      {
        materialName: 'ガラス容器',
        composition: ['ガラス'],
        scores: {
          physical: 95,
          environmental: 85,
          cost: 60,
          safety: 98,
          supply: 90,
        },
        totalScore: 86,
        reasoning:
          '無限にリサイクル可能なガラス容器。高級感があり、内容物との相互作用がない。重量増加分は薄肉化技術でカバー。',
        features: ['無限リサイクル', '高級感', '化学的安定', '透明性'],
        dataSources: ['Convexデータベース', '容器メーカーカタログ'],
      },
      {
        materialName: 'PCR-PP容器',
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
          'ポストコンシューマーリサイクルPPを80%以上使用。化粧品グレードの品質基準をクリアし、既存の充填ラインで使用可能。',
        features: ['高PCR含有率', '軽量', '既存設備対応', 'コスト効率'],
        dataSources: ['リサイクル材データベース', '品質試験結果'],
      },
      {
        materialName: 'バイオPET容器',
        composition: ['バイオPET'],
        scores: {
          physical: 88,
          environmental: 83,
          cost: 72,
          safety: 94,
          supply: 75,
        },
        totalScore: 82,
        reasoning:
          'サトウキビ由来のバイオPET。従来のPETと同じリサイクルストリームで処理可能。透明性と強度を両立。',
        features: ['バイオマス', '透明', 'リサイクル可能', '軽量'],
        dataSources: ['バイオ材料データ', 'LCA分析結果'],
      },
    ],
  };

  // デフォルトのテンプレート（シナリオが見つからない場合）
  const defaultProposals = [
    {
      materialName: '汎用エコ素材A',
      composition: ['リサイクル材', 'バイオ材'],
      scores: {
        physical: 75,
        environmental: 85,
        cost: 80,
        safety: 90,
        supply: 75,
      },
      totalScore: 81,
      reasoning:
        '環境負荷を低減しながら、必要な性能を維持する汎用的な代替素材。',
      features: ['環境配慮', 'コスト効率', '供給安定'],
      dataSources: ['データベース検索', 'AI分析'],
    },
    {
      materialName: '汎用エコ素材B',
      composition: ['再生材', '天然素材'],
      scores: {
        physical: 70,
        environmental: 90,
        cost: 85,
        safety: 88,
        supply: 70,
      },
      totalScore: 81,
      reasoning: '天然素材をベースにした環境配慮型素材。',
      features: ['天然由来', '低環境負荷', '安全性'],
      dataSources: ['Web検索', '技術文献'],
    },
    {
      materialName: '汎用エコ素材C',
      composition: ['複合材', 'バイオプラスチック'],
      scores: {
        physical: 80,
        environmental: 80,
        cost: 75,
        safety: 85,
        supply: 80,
      },
      totalScore: 80,
      reasoning: 'バランスの取れた性能を持つ標準的な代替素材。',
      features: ['バランス型', '汎用性', '実績あり'],
      dataSources: ['市場データ', 'ユーザーレビュー'],
    },
  ];

  return (
    proposalTemplates[scenarioId as keyof typeof proposalTemplates] ||
    defaultProposals
  );
}
