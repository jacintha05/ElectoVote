import { useEffect, useState } from "react";
import { Trophy, TrendingUp, PieChart, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface Candidate {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  symbol: string;
  partyName: string;
  motto: string;
  voteCount: number;
}

const symbolEmojis: { [key: string]: string } = {
  star: "⭐",
  sun: "☀️",
  tree: "🌳",
  dove: "🕊️",
  shield: "🛡️",
  flag: "🚩",
};

const symbolColors: { [key: string]: string } = {
  star: "from-blue-500 to-blue-600",
  sun: "from-yellow-500 to-yellow-600",
  tree: "from-green-500 to-green-600",
  dove: "from-purple-500 to-purple-600",
  shield: "from-orange-500 to-orange-600",
  flag: "from-red-500 to-red-600",
};

export default function CandidateDashboard() {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["/api/candidates"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const voteMutation = useMutation({
    mutationFn: async (candidateId: string) => {
      // For candidates voting, we'll create a temporary voter record
      // This is a simplified implementation - in reality you'd have proper candidate voting logic
      const response = await apiRequest("POST", "/api/votes", {
        voterId: `candidate-${currentCandidate?.id}`,
        candidateId: candidateId,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote Cast Successfully!",
        description: "Your vote has been recorded and the candidate has been notified by email.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/candidates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const candidateData = localStorage.getItem('currentCandidate');
    if (!candidateData) {
      navigate("/candidate-portal");
      return;
    }

    const candidate = JSON.parse(candidateData);
    setCurrentCandidate(candidate);
  }, [navigate]);

  const handleVoteForCandidate = (candidateId: string) => {
    if (!currentCandidate) return;
    voteMutation.mutate(candidateId);
  };

  if (!currentCandidate) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalVotes = (stats as any)?.totalVotes || 0;
  const candidateVoteShare = totalVotes > 0 ? ((currentCandidate.voteCount || 0) / totalVotes * 100).toFixed(1) : '0.0';
  const sortedCandidates = (candidates as Candidate[])?.sort((a: Candidate, b: Candidate) => (b.voteCount || 0) - (a.voteCount || 0)) || [];
  const candidateRanking = sortedCandidates.findIndex((c: Candidate) => c.id === currentCandidate.id) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${symbolColors[currentCandidate.symbol] || 'from-accent-500 to-accent-600'} rounded-lg flex items-center justify-center text-white text-2xl`}>
                  {symbolEmojis[currentCandidate.symbol] || "📋"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900" data-testid="text-candidate-name">
                    {currentCandidate.name}
                  </h2>
                  <p className="text-gray-600" data-testid="text-party-name">
                    {currentCandidate.partyName}
                  </p>
                  <p className="text-sm text-gray-500" data-testid="text-motto">
                    "{currentCandidate.motto}"
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-secondary-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-secondary-600" data-testid="text-vote-count">
                    {currentCandidate.voteCount || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Votes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vote Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Vote Share</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-vote-share">
                    {candidateVoteShare}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ranking</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-ranking">
                    #{candidateRanking}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-900" data-testid="text-total-election-votes">
                    {totalVotes}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Candidates List */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">All Candidates</h3>
            <div className="space-y-4">
              {sortedCandidates.map((candidate: Candidate, index: number) => (
                <div 
                  key={candidate.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
                  data-testid={`card-dashboard-candidate-${candidate.id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${symbolColors[candidate.symbol] || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center text-white text-lg`}>
                      {symbolEmojis[candidate.symbol] || "📋"}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900" data-testid={`text-dashboard-candidate-name-${candidate.id}`}>
                          {candidate.name}
                        </h4>
                        {index === 0 && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                            👑 Leading
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600" data-testid={`text-dashboard-party-${candidate.id}`}>
                        {candidate.partyName}
                      </p>
                      <p className="text-xs text-gray-500" data-testid={`text-dashboard-motto-${candidate.id}`}>
                        "{candidate.motto}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900" data-testid={`text-candidate-votes-${candidate.id}`}>
                        {candidate.voteCount || 0}
                      </p>
                      <p className="text-xs text-gray-500">votes</p>
                    </div>
                    <Button
                      onClick={() => handleVoteForCandidate(candidate.id)}
                      disabled={voteMutation.isPending}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm"
                      data-testid={`button-vote-candidate-${candidate.id}`}
                    >
                      <Vote className="w-4 h-4 mr-1" />
                      {voteMutation.isPending ? "Voting..." : "Vote"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
