import { BarChart3, Users, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface Candidate {
  id: string;
  name: string;
  symbol: string;
  partyName: string;
  voteCount: number;
  percentage: string;
}

const symbolEmojis: { [key: string]: string } = {
  star: "⭐",
  sun: "☀️",
  tree: "🌳",
  dove: "🕊️",
  shield: "🛡️",
  flag: "🚩",
};

const getResultColor = (index: number) => {
  switch (index) {
    case 0: return "from-green-50 to-green-100 border-green-500";
    case 1: return "from-blue-50 to-blue-100 border-blue-500";
    case 2: return "from-orange-50 to-orange-100 border-orange-500";
    default: return "from-gray-50 to-gray-100 border-gray-300";
  }
};

const getProgressColor = (index: number) => {
  switch (index) {
    case 0: return "bg-green-500";
    case 1: return "bg-blue-500";
    case 2: return "bg-orange-500";
    default: return "bg-gray-400";
  }
};

const getTextColor = (index: number) => {
  switch (index) {
    case 0: return "text-green-600";
    case 1: return "text-blue-600";
    case 2: return "text-orange-600";
    default: return "text-gray-600";
  }
};

export default function LiveResults() {
  const { data: stats, refetch } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
  });

  useEffect(() => {
    // Trigger initial refetch when component mounts
    refetch();
  }, [refetch]);

  const totalVotes = (stats as any)?.totalVotes || 0;
  const totalCandidates = (stats as any)?.totalCandidates || 0;
  const candidates: Candidate[] = (stats as any)?.candidates || [];
  const turnoutPercentage = totalVotes > 0 ? ((totalVotes / 12847) * 100).toFixed(1) : '0.0';
  const leadingCandidate = candidates[0];
  const leadMargin = candidates.length > 1 ? (leadingCandidate?.voteCount || 0) - (candidates[1]?.voteCount || 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Live Election Results</h2>
              <p className="text-gray-600">General Election 2024 - Real-time vote counting</p>
              <div className="mt-4 inline-flex items-center space-x-2 bg-secondary-50 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-secondary-500 rounded-full animate-pulse"></div>
                <span className="text-secondary-600 font-medium">Live Updates</span>
              </div>
            </div>

            {/* Overall Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900" data-testid="text-total-votes">
                  {totalVotes}
                </p>
                <p className="text-sm text-gray-600">Total Votes</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900" data-testid="text-results-candidates">
                  {totalCandidates}
                </p>
                <p className="text-sm text-gray-600">Candidates</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900" data-testid="text-turnout-percentage">
                  {turnoutPercentage}%
                </p>
                <p className="text-sm text-gray-600">Turnout</p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900" data-testid="text-lead-margin">
                  {leadMargin}
                </p>
                <p className="text-sm text-gray-600">Lead Margin</p>
              </div>
            </div>

            {/* Results Chart */}
            <div className="space-y-6">
              {candidates.map((candidate, index) => (
                <div 
                  key={candidate.id}
                  className={`flex items-center justify-between p-6 bg-gradient-to-r ${getResultColor(index)} rounded-lg border-l-4`}
                  data-testid={`card-result-${candidate.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${getProgressColor(index)} rounded-lg flex items-center justify-center text-white text-lg`}>
                      {symbolEmojis[candidate.symbol] || "📋"}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900" data-testid={`text-result-name-${candidate.id}`}>
                          {candidate.name}
                        </h3>
                        {index === 0 && totalVotes > 0 && (
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs font-medium text-green-600">Leading</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600" data-testid={`text-result-party-${candidate.id}`}>
                        {candidate.partyName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getTextColor(index)}`} data-testid={`text-result-votes-${candidate.id}`}>
                      {candidate.voteCount}
                    </p>
                    <p className="text-sm text-gray-600" data-testid={`text-result-percentage-${candidate.id}`}>
                      {candidate.percentage}% of votes
                    </p>
                    <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`${getProgressColor(index)} h-2 rounded-full transition-all duration-500`}
                        style={{width: `${parseFloat(candidate.percentage)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {candidates.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No votes cast yet</h3>
                  <p className="text-gray-500">Results will appear here once voting begins.</p>
                </div>
              )}
            </div>

            {/* Last Updated */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                Last updated: <span className="font-medium" data-testid="text-last-updated">
                  {new Date().toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </p>
              <p className="mt-1">Results will be updated every 30 seconds</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
