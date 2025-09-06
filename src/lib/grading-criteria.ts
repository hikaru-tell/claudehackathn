/**
 * 素材評価基準
 * A, B, C, Dの4段階評価基準を定義
 */

export interface GradingCriteria {
  grade: "A" | "B" | "C" | "D";
  label: string;
  description: string;
  scoreRange: {
    min: number;
    max: number;
  };
  color: {
    bg: string;
    text: string;
    border: string;
  };
}

export const GRADING_CRITERIA: GradingCriteria[] = [
  {
    grade: "A",
    label: "優秀",
    description:
      "非常に優れた性能・持続可能性を持つ素材。実用化レベルで高い評価。",
    scoreRange: { min: 85, max: 100 },
    color: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
  },
  {
    grade: "B",
    label: "良好",
    description: "良好な性能・持続可能性を持つ素材。実用化に向けて有望。",
    scoreRange: { min: 70, max: 84 },
    color: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
    },
  },
  {
    grade: "C",
    label: "普通",
    description: "標準的な性能・持続可能性。改善の余地がある素材。",
    scoreRange: { min: 55, max: 69 },
    color: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
  },
  {
    grade: "D",
    label: "要改善",
    description: "性能・持続可能性に課題がある素材。大幅な改善が必要。",
    scoreRange: { min: 0, max: 54 },
    color: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
  },
];

/**
 * スコアを評価グレードに変換する関数
 */
export function scoreToGrade(score: number): GradingCriteria {
  for (const criteria of GRADING_CRITERIA) {
    if (score >= criteria.scoreRange.min && score <= criteria.scoreRange.max) {
      return criteria;
    }
  }
  // デフォルトはD評価
  return GRADING_CRITERIA[3];
}

/**
 * 評価基準の詳細説明（AI分析用）
 */
export const DETAILED_GRADING_CRITERIA = `
# 素材評価基準 (A-D グレード)

## A評価 (85-100点): 優秀
- **性能面**: 要求仕様を大幅に上回る優秀な物性値
- **持続可能性**: 高いリサイクル性、低環境負荷、カーボンニュートラルに大きく貢献
- **実用性**: 既存設備での加工が容易、コスト競争力あり
- **安全性**: 食品包装に適用可能な高い安全性認証
- **将来性**: 市場での採用実績があり、今後の普及が期待される

## B評価 (70-84点): 良好
- **性能面**: 要求仕様を満たし、一部で優れた特性を持つ
- **持続可能性**: 良好なリサイクル性、環境負荷削減効果あり
- **実用性**: 一部設備改修で対応可能、合理的なコスト
- **安全性**: 基本的な安全性認証を取得済み
- **将来性**: 実用化に向けた開発が進んでいる

## C評価 (55-69点): 普通
- **性能面**: 最低限の要求仕様は満たすが、改善の余地あり
- **持続可能性**: 従来素材より環境負荷は低いが、大幅な改善は期待できない
- **実用性**: 設備投資や工程変更が必要、コスト面で課題
- **安全性**: 基本的な安全性は確保されているが、追加検証が必要
- **将来性**: 技術開発段階で実用化時期が不明確

## D評価 (0-54点): 要改善
- **性能面**: 要求仕様を満たさない、または大幅に劣る
- **持続可能性**: 環境負荷削減効果が限定的
- **実用性**: 大規模な設備投資が必要、コスト競争力に欠ける
- **安全性**: 安全性に懸念があり、追加の検証・認証が必要
- **将来性**: 基礎研究段階で実用化の見通しが立たない

## 評価項目の重み付け
1. **性能マッチ度** (30%): 要求仕様との適合性
2. **持続可能性スコア** (35%): 環境負荷、リサイクル性
3. **実用性** (20%): コスト、加工性、供給安定性
4. **安全性** (10%): 食品安全性、法規制適合性
5. **将来性** (5%): 技術成熟度、市場普及見込み

この基準に基づいて、各素材を総合的に評価し、A-Dのグレードを付与してください。
`;
