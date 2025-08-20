import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Sparkles, ArrowRight, Play } from 'lucide-react';
import heroImage from '@/assets/healthcare-hero.jpg';

interface HeroSectionProps {
  onStartDiagnosis: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartDiagnosis }) => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-trust" />
      
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 fade-in-up">
            {/* Trust Badge */}
            <div className="flex items-center space-x-4">
              <Badge className="trust-badge">
                <Shield className="w-3 h-3" />
                Trusted by 100,000+ users
              </Badge>
              <Badge className="trust-badge">
                <Sparkles className="w-3 h-3" />
                AI-powered
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                AI-powered
                <span className="block text-primary">Health Diagnosis</span>
                <span className="block text-accent">in Your Language</span>
              </h1>
              <p className="text-medical-subheading max-w-lg">
                Get instant, personalized health insights using advanced AI technology. 
                Describe your symptoms in Hindi, Tamil, Bengali, or any Indian language 
                and receive accurate medical guidance.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-muted-foreground">12+ Indian Languages</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-accent rounded-full" />
                <span className="text-muted-foreground">Voice Recognition</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-muted-foreground">24/7 Available</span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={onStartDiagnosis}
                size="lg"
                className="btn-medical-primary h-14 px-8 text-lg group"
              >
                Start Free Diagnosis
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="medical-card h-14 px-6"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Statement */}
            <div className="flex items-start space-x-3 p-4 bg-card/50 rounded-lg border border-border/50">
              <Heart className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Medical Accuracy Guaranteed</p>
                <p className="text-muted-foreground">
                  Our AI is trained on millions of medical cases and continuously updated 
                  by healthcare professionals.
                </p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:mt-0 mt-8">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-primary rounded-3xl opacity-10 blur-xl" />
              
              {/* Main image */}
              <div className="relative medical-card-elevated rounded-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Healthcare professionals using AI diagnosis technology with multilingual support"
                  className="w-full h-auto object-cover"
                  loading="eager"
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 medical-card p-4 bg-white shadow-elevated">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Live AI Analysis</span>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 medical-card p-4 bg-white shadow-elevated">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">12+</span>
                  <span className="text-sm text-muted-foreground">Languages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;