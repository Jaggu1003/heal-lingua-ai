import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Shield, 
  Globe, 
  Users, 
  Award, 
  Lock,
  CheckCircle,
  Zap,
  Heart
} from "lucide-react";

export default function AboutTrustSection() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Advanced AI Technology",
      description: "Powered by state-of-the-art machine learning models trained on millions of medical cases"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "12+ Indian Languages",
      description: "Communicate in your native language for the most accurate symptom description"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Analysis",
      description: "Get immediate insights and recommendations based on your symptoms"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Privacy Protected",
      description: "Your health data is encrypted and never shared with third parties"
    }
  ];

  const trustMetrics = [
    { label: "Accuracy Rate", value: "94.2%", icon: <CheckCircle className="h-5 w-5 text-healthcare-green" /> },
    { label: "Languages Supported", value: "12+", icon: <Globe className="h-5 w-5 text-healthcare-blue" /> },
    { label: "Users Helped", value: "50K+", icon: <Users className="h-5 w-5 text-healthcare-teal" /> },
    { label: "Medical Cases", value: "1M+", icon: <Heart className="h-5 w-5 text-red-500" /> }
  ];

  const certifications = [
    { name: "HIPAA Compliant", description: "Health Insurance Portability and Accountability Act" },
    { name: "ISO 27001", description: "Information Security Management" },
    { name: "SOC 2 Type II", description: "Security, Availability, and Confidentiality" },
    { name: "GDPR Compliant", description: "General Data Protection Regulation" }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-healthcare-light-blue to-healthcare-light-green">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* About Section */}
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-healthcare-teal to-healthcare-blue rounded-full flex items-center justify-center">
            <Brain className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold">How HealLingua AI Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our AI-powered healthcare assistant uses advanced natural language processing and medical knowledge 
            to understand your symptoms and provide accurate, multilingual health insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg border-0 bg-card/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-gradient-to-r from-healthcare-teal to-healthcare-blue rounded-full flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Metrics */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Trusted by Healthcare Professionals</CardTitle>
            <p className="text-muted-foreground">Real metrics that demonstrate our commitment to accuracy and reliability</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {trustMetrics.map((metric, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {metric.icon}
                    <div className="text-3xl font-bold bg-gradient-to-r from-healthcare-teal to-healthcare-blue bg-clip-text text-transparent">
                      {metric.value}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{metric.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trust & Safety */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Security & Privacy */}
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-healthcare-teal" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-healthcare-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">End-to-End Encryption</p>
                    <p className="text-sm text-muted-foreground">All your health data is encrypted in transit and at rest</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-healthcare-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">No Data Sharing</p>
                    <p className="text-sm text-muted-foreground">We never sell or share your personal health information</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-healthcare-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Data Anonymization</p>
                    <p className="text-sm text-muted-foreground">Personal identifiers are removed from all medical analysis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-healthcare-blue" />
                Certifications & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-healthcare-light-blue/50 border-healthcare-blue text-healthcare-blue">
                    <Shield className="h-3 w-3 mr-1" />
                    {cert.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-800">Important Medical Disclaimer</h3>
              <div className="max-w-4xl mx-auto space-y-3 text-sm text-red-700 leading-relaxed">
                <p>
                  <strong>HealLingua AI is an AI-powered health assistant designed to provide informational support only.</strong> 
                  This tool is NOT a replacement for professional medical advice, diagnosis, or treatment.
                </p>
                <p>
                  Always seek the advice of your physician or other qualified health provider with any questions you may have 
                  regarding a medical condition. Never disregard professional medical advice or delay in seeking it because 
                  of something you have read or received from this AI assistant.
                </p>
                <p>
                  <strong>In case of a medical emergency, immediately call your local emergency services.</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}