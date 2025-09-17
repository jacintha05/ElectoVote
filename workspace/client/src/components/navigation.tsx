import { Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Navigation() {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Home", testId: "nav-home" },
    { path: "/voter-portal", label: "Voter Portal", testId: "nav-voter-portal" },
    { path: "/candidate-portal", label: "Candidate Portal", testId: "nav-candidate-portal" },
    { path: "/results", label: "Live Results", testId: "nav-results" },
  ];

  return (
    <header className="bg-white shadow-md border-b-2 border-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Vote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ElectVote</h1>
              <p className="text-xs text-gray-600">Secure Digital Voting</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary-600 border-b-2 border-primary-500 pb-1 bg-transparent hover:bg-transparent"
                    : "text-gray-600 hover:text-primary-600 hover:bg-transparent"
                }`}
                onClick={() => navigate(item.path)}
                data-testid={item.testId}
              >
                {item.label}
              </Button>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-4 h-4 text-secondary-500">🛡️</span>
              <span>Secure & Verified</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
