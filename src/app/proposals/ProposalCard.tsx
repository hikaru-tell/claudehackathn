import { Card } from '../components/Card';

interface ProposalCardProps {
  proposal: any;
  rank: number;
  onClick?: () => void;
}

export function ProposalCard({ proposal, rank, onClick }: ProposalCardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500';
      case 2:
        return 'bg-gray-400';
      case 3:
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card
      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* ランクバッジ */}
      <div
        className={`absolute top-0 right-0 ${getRankColor(rank)} text-white px-4 py-2 rounded-bl-lg`}
      >
        <span className="font-bold text-lg">#{rank}</span>
      </div>

      <div className="pr-16">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {proposal.materialName}
            </h3>
            <p className="text-gray-600 mt-1">
              構成: <span className="font-mono">{proposal.composition}</span>
            </p>
          </div>
          <div className="text-center">
            <div
              className={`text-4xl font-bold ${getScoreColor(proposal.totalScore)}`}
            >
              {proposal.totalScore}
            </div>
            <p className="text-sm text-gray-500">総合スコア</p>
          </div>
        </div>

        {/* スコア詳細 */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {Object.entries(proposal.scores).map(
            ([key, value]: [string, any]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-semibold text-gray-700">
                  {value}
                </div>
                <p className="text-xs text-gray-500">
                  {key === 'physical' && '物性'}
                  {key === 'environmental' && '環境性'}
                  {key === 'cost' && 'コスト'}
                  {key === 'safety' && '安全性'}
                  {key === 'supply' && '供給性'}
                </p>
              </div>
            )
          )}
        </div>

        {/* 推奨理由 */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-800 mb-2">推奨理由</h4>
          <p className="text-gray-700">{proposal.reasoning}</p>
        </div>

        {/* 特徴タグ */}
        <div className="flex flex-wrap gap-2">
          {proposal.features.map((feature: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* データソース */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            データソース: {proposal.dataSources.join(', ')}
          </p>
        </div>
      </div>
    </Card>
  );
}
