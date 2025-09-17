import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import VoterPortal from "@/pages/voter-portal";
import CandidatePortal from "@/pages/candidate-portal";
import VotingInterface from "@/pages/voting-interface";
import CandidateDashboard from "@/pages/candidate-dashboard";
import LiveResults from "@/pages/live-results";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/voter-portal" component={VoterPortal} />
          <Route path="/candidate-portal" component={CandidatePortal} />
          <Route path="/voting" component={VotingInterface} />
          <Route path="/candidate-dashboard" component={CandidateDashboard} />
          <Route path="/results" component={LiveResults} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/voter-portal" component={VoterPortal} />
          <Route path="/candidate-portal" component={CandidatePortal} />
          <Route path="/voting" component={VotingInterface} />
          <Route path="/candidate-dashboard" component={CandidateDashboard} />
          <Route path="/results" component={LiveResults} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
