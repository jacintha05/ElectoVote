import { Vote, Shield, BarChart3, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { useLocation } from "wouter";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 mb-12 text-white">
          <div className="max-w-4xl">
            <h2 className="text-4xl font-bold mb-4">Secure Digital Voting Platform</h2>
            <p className="text-xl mb-6 text-blue-100">Your voice matters. Cast your vote securely and transparently in the digital age.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate("/voter-portal")}
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                data-testid="button-vote-now"
              >
                <Vote className="w-4 h-4 mr-2" />
                Vote Now
              </Button>
              <Button 
                onClick={() => navigate("/candidate-portal")}
                variant="outline"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                data-testid="button-candidate-portal"
              >
                <Shield className="w-4 h-4 mr-2" />
                Candidate Portal
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Voting</h3>
            <p className="text-gray-600">End-to-end encryption ensures your vote remains private and secure.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Live Results</h3>
            <p className="text-gray-600">Real-time vote counting with transparent and verifiable results.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Mobile Ready</h3>
            <p className="text-gray-600">Vote from anywhere using your mobile device or computer.</p>
          </div>
        </div>

        {/* Current Election Info */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h3 className="text-2xl font-bold mb-6">Current Election Information</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-3">General Election 2024</h4>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="w-5 h-5 text-primary-500 mr-2">📅</span>
                  Voting Period: Nov 1-15, 2024
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 text-primary-500 mr-2">👥</span>
                  <span data-testid="text-registered-voters">12,847 Registered Voters</span>
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 text-primary-500 mr-2">👨‍💼</span>
                  <span data-testid="text-total-candidates">8 Candidates</span>
                </p>
                <p className="flex items-center">
                  <span className="w-5 h-5 text-primary-500 mr-2">🗳️</span>
                  <span data-testid="text-votes-cast">0 Votes Cast</span>
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h5 className="font-semibold mb-3">Voting Statistics</h5>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Turnout</span>
                    <span data-testid="text-turnout">0.0%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary-500 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">ElectVote</span>
            </div>
            <p className="text-gray-400 mb-4">Secure, transparent, and accessible digital voting platform</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span><Shield className="w-4 h-4 inline mr-1" /> Encrypted & Secure</span>
              <span>✅ Verified System</span>
              <span><Smartphone className="w-4 h-4 inline mr-1" /> Mobile Friendly</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
