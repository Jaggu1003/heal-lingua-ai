import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2, Mail, Lock, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const { toast } = useToast();

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendOTP = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address first.",
      });
      return;
    }

    setIsSendingOTP(true);
    const generatedOTP = generateOTP();
    setOtpCode(generatedOTP);

    try {
      const response = await supabase.functions.invoke('send-otp', {
        body: { email, otp: generatedOTP }
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "OTP Sent!",
        description: "Please check your email for the verification code.",
      });
      setShowOTPVerification(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: error.message || "Failed to send verification code. Please try again.",
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    if (otp !== otpCode) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code you entered is incorrect.",
      });
      return;
    }

    setIsVerifyingOTP(true);
    try {
      // Create the account with email already marked as verified
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            email_verified: true, // Mark as verified since OTP was confirmed
          }
        }
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message,
        });
        return;
      }

      // Immediately try to sign in the user
      if (data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          toast({
            title: "Account Created!",
            description: "Your account was created successfully. Please try logging in.",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "Your account has been verified and you're now logged in.",
          });
          onLogin();
          return;
        }
      }

      setShowOTPVerification(false);
      setIsSignUp(false); // Switch to sign in mode
      setOtp("");
      setOtpCode("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.message || "Failed to complete verification. Please try again.",
      });
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Handle sign up with OTP verification
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Passwords don't match",
            description: "Please make sure your passwords match.",
          });
          return;
        }

        if (password.length < 6) {
          toast({
            variant: "destructive",
            title: "Password Too Short",
            description: "Password must be at least 6 characters long.",
          });
          return;
        }

        // Send OTP instead of direct signup
        await sendOTP();
        return;
      } else {
        // Sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            variant: "destructive",
            title: "Sign In Failed", 
            description: error.message,
          });
          return;
        }

        if (data.user) {
          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
          onLogin();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-healthcare-light-blue to-background p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-healthcare-teal to-healthcare-blue bg-clip-text text-transparent">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp ? "Join HealLingua AI today" : "Sign in to continue your diagnosis"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-healthcare-teal to-healthcare-blue hover:from-healthcare-teal/90 hover:to-healthcare-blue/90 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing In..."}
                </>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          {showOTPVerification && (
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <div className="text-center space-y-4">
                <div className="text-sm text-muted-foreground">
                  <Shield className="h-6 w-6 mx-auto mb-3 text-healthcare-teal" />
                  <p className="font-medium text-base text-foreground mb-2">Verify Your Email</p>
                  <p>We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></p>
                  <p className="mt-2">Enter the code below to complete your registration:</p>
                </div>
                
                <div className="flex justify-center py-4">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={verifyOTP}
                    disabled={isVerifyingOTP || otp.length !== 6}
                    className="w-full"
                  >
                    {isVerifyingOTP ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={sendOTP}
                    disabled={isSendingOTP}
                    className="w-full text-xs"
                  >
                    {isSendingOTP ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Code"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
            </span>{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-healthcare-teal hover:text-healthcare-blue font-medium transition-colors"
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}