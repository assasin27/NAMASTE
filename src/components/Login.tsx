import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { AuthService } from "@/lib/auth/service";

const Login = () => {
  const [step, setStep] = useState<'abha' | 'otp'>('abha');
  const [abhaNumber, setAbhaNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleABHASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = AuthService.getInstance();
      const isValid = await auth.verifyABHA(abhaNumber);

      if (isValid) {
        const otpSent = await auth.requestOTP(abhaNumber);
        if (otpSent) {
          setStep('otp');
          toast({
            title: "OTP Sent",
            description: "Please check your registered mobile number for OTP",
          });
        } else {
          throw new Error("Failed to send OTP");
        }
      } else {
        throw new Error("Invalid ABHA number");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = AuthService.getInstance();
      const success = await auth.login(abhaNumber, otp);

      if (success) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        // Redirect or update UI state
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to NAMASTE</h1>
          <p className="text-muted-foreground">
            {step === 'abha' 
              ? "Please enter your ABHA number to continue" 
              : "Enter the OTP sent to your registered mobile number"}
          </p>
        </div>

        {step === 'abha' ? (
          <form onSubmit={handleABHASubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter ABHA Number"
                value={abhaNumber}
                onChange={(e) => setAbhaNumber(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || !abhaNumber}
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                maxLength={6}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || !otp}
            >
              {loading ? "Verifying..." : "Login"}
            </Button>
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setStep('abha')}
              disabled={loading}
            >
              Use different ABHA number
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Login;