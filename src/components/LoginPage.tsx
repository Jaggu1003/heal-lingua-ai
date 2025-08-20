import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Heart, Shield, Globe, Facebook, Chrome } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`${provider} login clicked`);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-trust flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">HealthAI</h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-medical-heading">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-medical-caption">
              {isSignUp 
                ? 'Join thousands using AI-powered healthcare in their language'
                : 'Sign in to continue your diagnosis journey'
              }
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Shield className="w-4 h-4 text-primary" />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Globe className="w-4 h-4 text-primary" />
            <span>Multi-language</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4 text-primary" />
            <span>HIPAA Compliant</span>
          </div>
        </div>

        {/* Login Form */}
        <Card className="medical-card-elevated">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? 'Enter your information to create an account'
                : 'Enter your credentials to access your account'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="medical-input"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="medical-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="medical-input"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full btn-medical-primary h-11"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('Google')}
                className="medical-card hover:bg-card-hover"
              >
                <Chrome className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSocialLogin('Facebook')}
                className="medical-card hover:bg-card-hover"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp 
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"
              }
            </button>
            {!isSignUp && (
              <button
                type="button"
                className="text-sm text-muted-foreground hover:underline"
              >
                Forgot your password?
              </button>
            )}
          </CardFooter>
        </Card>

        {/* Privacy Notice */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
          <div className="trust-badge">
            <Shield className="w-3 h-3" />
            Your data is encrypted end-to-end
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;