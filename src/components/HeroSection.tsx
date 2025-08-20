import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Globe } from "lucide-react";

interface HeroSectionProps {
  onStartDiagnosis: () => void;
}

export default function HeroSection({ onStartDiagnosis }: HeroSectionProps) {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-healthcare-light-blue via-background to-healthcare-light-green">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-healthcare-teal/10 rounded-full text-healthcare-teal text-sm font-medium">
                <Heart className="h-4 w-4" />
                AI-Powered Healthcare
              </div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Health Diagnosis in{" "}
                <span className="bg-gradient-to-r from-healthcare-teal to-healthcare-blue bg-clip-text text-transparent">
                  Your Language
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get instant, accurate health insights powered by advanced AI technology. 
                Communicate with our healthcare assistant in Hindi, Tamil, Bengali, Marathi, and more Indian languages.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onStartDiagnosis}
                className="bg-gradient-to-r from-healthcare-teal to-healthcare-blue hover:from-healthcare-teal/90 hover:to-healthcare-blue/90 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                Start Free Diagnosis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-6 text-lg font-semibold border-healthcare-teal text-healthcare-teal hover:bg-healthcare-teal hover:text-white transition-all duration-300"
              >
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-healthcare-green/20 rounded-full flex items-center justify-center">
                  <Globe className="h-5 w-5 text-healthcare-green" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">12+ Languages</p>
                  <p className="text-sm text-muted-foreground">Regional Support</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-healthcare-blue/20 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-healthcare-blue" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">99% Accuracy</p>
                  <p className="text-sm text-muted-foreground">AI Diagnosis</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl p-8 border border-border/50">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-healthcare-teal to-healthcare-blue rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">HealLingua AI</h3>
                    <p className="text-sm text-muted-foreground">Healthcare Assistant</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-healthcare-light-blue/30 rounded-lg p-4">
                    <p className="text-sm text-healthcare-blue">
                      "मुझे सिरदर्द और बुखार है। क्या यह चिंता की बात है?"
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm">
                      Based on your symptoms, this could indicate a viral infection. 
                      I recommend rest, hydration, and monitoring your temperature. 
                      If symptoms persist for more than 3 days, please consult a doctor.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-healthcare-teal rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-healthcare-blue rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-healthcare-green rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-healthcare-teal/20 to-healthcare-blue/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-r from-healthcare-green/20 to-healthcare-teal/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}