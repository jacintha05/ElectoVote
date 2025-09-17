import { useState } from "react";
import { User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function VoterPortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    votingId: "",
  });
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; votingId: string }) => {
      const response = await apiRequest("POST", "/api/voters/register", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "You have been registered successfully. You can now log in.",
      });
      setIsLogin(true);
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { name: string; votingId: string }) => {
      const response = await apiRequest("POST", "/api/voters/login", data);
      return response.json();
    },
    onSuccess: (voter) => {
      if (voter.hasVoted) {
        toast({
          title: "Already Voted",
          description: "You have already cast your vote in this election.",
          variant: "destructive",
        });
        return;
      }
      localStorage.setItem('currentVoter', JSON.stringify(voter));
      navigate("/voting");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed", 
        description: error.message || "Invalid credentials. Please check your details.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.votingId.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (isLogin) {
      loginMutation.mutate(formData);
    } else {
      registerMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-md mx-auto pt-16">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Voter Portal</h2>
            <p className="text-gray-600">Secure access to cast your vote</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <Button
              variant={isLogin ? "default" : "ghost"}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                isLogin 
                  ? "bg-white shadow-sm text-primary-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsLogin(true)}
              data-testid="button-voter-login"
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "default" : "ghost"}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                !isLogin 
                  ? "bg-white shadow-sm text-primary-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsLogin(false)}
              data-testid="button-voter-register"
            >
              Register
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                className="w-full"
                data-testid="input-voter-name"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-1">
                Voting ID
              </Label>
              <Input
                type="text"
                value={formData.votingId}
                onChange={(e) => handleInputChange("votingId", e.target.value)}
                placeholder={isLogin ? "Enter your voting ID" : "Your unique voting ID"}
                className="w-full"
                data-testid="input-voting-id"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors font-medium"
              disabled={registerMutation.isPending || loginMutation.isPending}
              data-testid="button-submit-voter"
            >
              {registerMutation.isPending || loginMutation.isPending ? (
                "Processing..."
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Login to Vote
                    </>
                  ) : (
                    <>
                      <User className="w-4 h-4 mr-2" />
                      Register to Vote
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Shield className="w-4 h-4 inline mr-1 text-secondary-500" />
              Your information is protected and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
