import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, User, Lock } from "lucide-react";

interface LoginProps {
  onBack: () => void;
}

const Login = ({ onBack }: LoginProps) => {
  const [abhaId, setAbhaId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login process
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: `Welcome back! ABHA ID: ${abhaId}`,
      });
      setLoading(false);
      onBack(); // Redirect back to homepage
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-strong">
        <div className="space-y-2 text-center">
          <div className="w-16 h-16 medical-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">N</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to NAMASTE</h1>
          <p className="text-muted-foreground">
            Sign in with your ABHA ID to access the platform
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="abha-id" className="text-sm font-medium">
                ABHA ID
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="abha-id"
                  type="text"
                  placeholder="Enter your ABHA ID"
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              type="submit" 
              className="w-full medical-gradient shadow-medical"
              disabled={loading || !abhaId || !password}
              size="lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onBack}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homepage
            </Button>
          </div>
        </form>

      </Card>
    </div>
  );
};

export default Login;