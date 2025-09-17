import { useEffect, useState } from "react";
import { Vote, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Voter {
  id: string;
  name: string;
  votingId: string;
  hasVoted: boolean;
}

interface Candidate {
  id: string;
  name: string;
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

export default function VotingInterface() {
  const [currentVoter, setCurrentVoter] = useState<Voter | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["/api/candidates"],
  });

  const voteMutation = useMutation({
    mutationFn: async (data: { voterId: string; candidateId: string }) => {
      const response = await apiRequest("POST", "/api/votes", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Vote Cast Successfully!",
        description: "Your vote has been recorded and the candidate has been notified by email.",
      });
      localStorage.removeItem('currentVoter');
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      navigate("/results");
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
    const voterData = localStorage.getItem('currentVoter');
    if (!voterData) {
      navigate("/voter-portal");
      return;
    }

    const voter = JSON.parse(voterData);
    if (voter.hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote in this election.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setCurrentVoter(voter);
  }, [navigate, toast]);

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowConfirmModal(true);
  };

  const handleConfirmVote = () => {
    if (!currentVoter || !selectedCandidate) return;

    voteMutation.mutate({
      voterId: currentVoter.id,
      candidateId: selectedCandidate.id,
    });
    setShowConfirmModal(false);
  };

  const handleCancelVote = () => {
    setSelectedCandidate(null);
    setShowConfirmModal(false);
  };

  if (!currentVoter) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center pt-32">
          <p className="text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Cast Your Vote</h2>
                <p className="text-gray-600">Select your preferred candidate for the General Election 2024</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Voter: <span className="font-medium" data-testid="text-voter-name">{currentVoter.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  ID: <span className="font-medium" data-testid="text-voting-id">{currentVoter.votingId}</span>
                </p>
              </div>
            </div>

            {/* Candidate List */}
            <div className="space-y-4 mb-8">
              {(candidates as Candidate[])?.map((candidate: Candidate) => (
                <div 
                  key={candidate.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                  data-testid={`card-candidate-${candidate.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${symbolColors[candidate.symbol] || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center text-white text-2xl`}>
                        {symbolEmojis[candidate.symbol] || "📋"}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900" data-testid={`text-candidate-name-${candidate.id}`}>
                          {candidate.name}
                        </h3>
                        <p className="text-gray-600" data-testid={`text-party-name-${candidate.id}`}>
                          {candidate.partyName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1" data-testid={`text-motto-${candidate.id}`}>
                          "{candidate.motto}"
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={() => handleCandidateSelect(candidate)}
                        className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                        disabled={voteMutation.isPending}
                        data-testid={`button-vote-${candidate.id}`}
                      >
                        <Vote className="w-4 h-4 mr-2" />
                        Vote
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">Click to select</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vote Information */}
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary-500 mr-2" />
                Once you cast your vote, it cannot be changed. Please review your selection carefully.
              </p>
              <p className="text-sm text-gray-500">
                Your vote is anonymous and secure. The selected candidate will receive an email notification.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vote Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-center">Confirm Your Vote</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to vote for{" "}
              <span className="font-semibold" data-testid="text-selected-candidate">
                {selectedCandidate?.name}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleCancelVote}
              className="flex-1"
              data-testid="button-cancel-vote"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmVote}
              disabled={voteMutation.isPending}
              className="flex-1 bg-secondary-500 hover:bg-secondary-600"
              data-testid="button-confirm-vote"
            >
              {voteMutation.isPending ? "Casting Vote..." : "Confirm Vote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
