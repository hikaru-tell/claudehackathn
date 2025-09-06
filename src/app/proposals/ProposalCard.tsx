import { Card } from "../components/Card";
import { scoreToGrade } from "@/lib/grading-criteria";

interface ProposalCardProps {
  proposal: any;
  rank: number;
  onClick?: () => void;
}

export function ProposalCard({ proposal, rank, onClick }: ProposalCardProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-orange-600";
      default:
        return "bg-gray-600";
    }
  };

  const getGradeDisplay = (score: number) => {
    const gradeInfo = scoreToGrade(score);
    return {
      grade: gradeInfo.grade,
      label: gradeInfo.label,
      colorClasses: `${gradeInfo.color.bg} ${gradeInfo.color.text} ${gradeInfo.color.border}`,
    };
  };

  return (
    <Card
      className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {/* Rank Badge */}
      <div
        className={`absolute top-0 right-0 ${getRankColor(rank)} text-white px-4 py-2 rounded-bl-lg`}
      >
        <span className="font-bold text-lg">#{rank}</span>
      </div>

      <div className="pr-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              {proposal.materialName}
            </h3>
            <p className="text-gray-600 mt-1">
              Composition:{" "}
              <span className="font-mono">{proposal.composition}</span>
            </p>
          </div>
          <div className="text-center">
            {(() => {
              const gradeDisplay = getGradeDisplay(proposal.totalScore);
              return (
                <div
                  className={`inline-block px-4 py-2 rounded-lg border-2 ${gradeDisplay.colorClasses}`}
                >
                  <div className="text-3xl font-bold">{gradeDisplay.grade}</div>
                  <p className="text-xs font-medium">{gradeDisplay.label}</p>
                </div>
              );
            })()}
            <p className="text-sm text-gray-500 mt-2">Total Score</p>
          </div>
        </div>

        {/* Score Details */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {Object.entries(proposal.scores).map(
            ([key, value]: [string, any]) => {
              const gradeDisplay = getGradeDisplay(value);
              return (
                <div key={key} className="text-center">
                  <div
                    className={`inline-block px-2 py-1 rounded border ${gradeDisplay.colorClasses}`}
                  >
                    <div className="text-lg font-bold">
                      {gradeDisplay.grade}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {key === "physical" && "Physical"}
                    {key === "environmental" && "Environmental"}
                    {key === "cost" && "Cost"}
                    {key === "safety" && "Safety"}
                    {key === "supply" && "Supply Chain"}
                  </p>
                </div>
              );
            },
          )}
        </div>

        {/* Recommendation Reason */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-green-800 mb-2">
            Recommendation Reason
          </h4>
          <p className="text-gray-700">{proposal.reasoning}</p>
        </div>

        {/* Feature Tags */}
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

        {/* Data Sources */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Data Sources: {proposal.dataSources.join(", ")}
          </p>
        </div>
      </div>
    </Card>
  );
}
