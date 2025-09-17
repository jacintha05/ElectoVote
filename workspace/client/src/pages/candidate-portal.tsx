import { useState } from "react";
import { Bus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function CandidatePortal() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "",
    phone: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    symbol: "",
    partyName: "",
    motto: "",
  });
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/candidates/register", {
        ...data,
        age: parseInt(data.age),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your campaign has been registered successfully. You can now log in.",
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
    mutationFn: async (data: { email: string; phone: string }) => {
      const response = await apiRequest("POST", "/api/candidates/login", data);
      return response.json();
    },
    onSuccess: (candidate) => {
      localStorage.setItem('currentCandidate', JSON.stringify(candidate));
      navigate("/candidate-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please check your details.",
        variant: "destructive",
      });
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email.trim() || !loginData.phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate(loginData);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields = ['name', 'age', 'email', 'phone', 'symbol', 'partyName', 'motto'];
    const missingFields = requiredFields.filter(field => !registerData[field as keyof typeof registerData].trim());
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(registerData.age) < 18) {
      toast({
        title: "Invalid Age",
        description: "Candidate must be at least 18 years old.",
        variant: "destructive",
      });
      return;
    }

    registerMutation.mutate(registerData);
  };

  const handleLoginInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegisterInputChange = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  const symbolOptions = [
    { value: "star", label: "⭐ Star" },
    { value: "sun", label: "☀️ Sun" },
    { value: "tree", label: "🌳 Tree" },
    { value: "dove", label: "🕊️ Dove" },
    { value: "shield", label: "🛡️ Shield" },
    { value: "flag", label: "🚩 Flag" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-lg mx-auto pt-16">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Candidate Portal</h2>
            <p className="text-gray-600">Manage your campaign and track votes</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <Button
              variant={isLogin ? "default" : "ghost"}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                isLogin 
                  ? "bg-white shadow-sm text-accent-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsLogin(true)}
              data-testid="button-candidate-login"
            >
              Login
            </Button>
            <Button
              variant={!isLogin ? "default" : "ghost"}
              className={`flex-1 py-2 px-4 rounded-md font-medium ${
                !isLogin 
                  ? "bg-white shadow-sm text-accent-600" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setIsLogin(false)}
              data-testid="button-candidate-register"
            >
              Register
            </Button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                <Input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => handleLoginInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full"
                  data-testid="input-candidate-email"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</Label>
                <Input
                  type="tel"
                  value={loginData.phone}
                  onChange={(e) => handleLoginInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="w-full"
                  data-testid="input-candidate-phone"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent-500 text-white py-2 px-4 rounded-lg hover:bg-accent-600 transition-colors font-medium"
                disabled={loginMutation.isPending}
                data-testid="button-submit-candidate-login"
              >
                {loginMutation.isPending ? "Processing..." : (
                  <>
                    <Bus className="w-4 h-4 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Full Name</Label>
                  <Input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => handleRegisterInputChange("name", e.target.value)}
                    placeholder="John Smith"
                    data-testid="input-candidate-name"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">Age</Label>
                  <Input
                    type="number"
                    value={registerData.age}
                    onChange={(e) => handleRegisterInputChange("age", e.target.value)}
                    placeholder="35"
                    min="18"
                    data-testid="input-candidate-age"
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
                <Input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => handleRegisterInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                  data-testid="input-register-email"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</Label>
                <Input
                  type="tel"
                  value={registerData.phone}
                  onChange={(e) => handleRegisterInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  data-testid="input-register-phone"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Election Symbol</Label>
                <Select 
                  value={registerData.symbol} 
                  onValueChange={(value) => handleRegisterInputChange("symbol", value)}
                >
                  <SelectTrigger className="w-full" data-testid="select-candidate-symbol">
                    <SelectValue placeholder="Select a symbol" />
                  </SelectTrigger>
                  <SelectContent>
                    {symbolOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Party Name</Label>
                <Input
                  type="text"
                  value={registerData.partyName}
                  onChange={(e) => handleRegisterInputChange("partyName", e.target.value)}
                  placeholder="Democratic Party"
                  data-testid="input-party-name"
                />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Campaign Motto</Label>
                <Textarea
                  value={registerData.motto}
                  onChange={(e) => handleRegisterInputChange("motto", e.target.value)}
                  placeholder="Enter your campaign motto or slogan..."
                  rows={3}
                  className="resize-none"
                  data-testid="textarea-motto"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-secondary-500 text-white py-2 px-4 rounded-lg hover:bg-secondary-600 transition-colors font-medium"
                disabled={registerMutation.isPending}
                data-testid="button-submit-candidate-register"
              >
                {registerMutation.isPending ? "Processing..." : (
                  <>
                    <Bus className="w-4 h-4 mr-2" />
                    Register Campaign
                  </>
                )}
              </Button>
            </form>
          )}

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
