import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  Heart, 
  Clock, 
  User, 
  FileText, 
  Download,
  Phone,
  Calendar,
  Shield
} from "lucide-react";

interface DiagnosisResult {
  condition: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
}

interface DiagnosisOutputProps {
  selectedLanguage: string;
}

export default function DiagnosisOutput({ selectedLanguage }: DiagnosisOutputProps) {
  const diagnosisResults: DiagnosisResult[] = [
    {
      condition: "Viral Upper Respiratory Infection",
      confidence: 87,
      severity: "medium",
      description: "Common viral infection affecting the nose, throat, and upper airways."
    },
    {
      condition: "Seasonal Allergies",
      confidence: 45,
      severity: "low", 
      description: "Allergic reaction to environmental factors like pollen or dust."
    },
    {
      condition: "Bacterial Sinusitis",
      confidence: 23,
      severity: "medium",
      description: "Bacterial infection of the sinus cavities requiring medical attention."
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return "🔴";
      case "medium": return "🟡"; 
      case "low": return "🟢";
      default: return "⚪";
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-healthcare-green to-healthcare-teal rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold">AI Diagnosis Results</h2>
          <p className="text-muted-foreground">
            Based on your symptoms and our conversation, here are the most likely conditions
          </p>
        </div>

        {/* Main Diagnosis Results */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-healthcare-teal" />
              Possible Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {diagnosisResults.map((result, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getSeverityIcon(result.severity)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{result.condition}</h3>
                      <p className="text-sm text-muted-foreground">{result.description}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="text-2xl font-bold text-healthcare-teal">{result.confidence}%</div>
                    <Badge className={getSeverityColor(result.severity)}>
                      {result.severity.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-healthcare-teal to-healthcare-blue h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${result.confidence}%` }}
                  ></div>
                </div>
                
                {index < diagnosisResults.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Immediate Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-healthcare-green">
                <Clock className="h-5 w-5" />
                Immediate Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-healthcare-green/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-healthcare-green">1</span>
                </div>
                <p className="text-sm">Get plenty of rest and stay hydrated</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-healthcare-green/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-healthcare-green">2</span>
                </div>
                <p className="text-sm">Monitor your temperature regularly</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-healthcare-green/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-healthcare-green">3</span>
                </div>
                <p className="text-sm">Avoid contact with others to prevent spread</p>
              </div>
            </CardContent>
          </Card>

          {/* When to See a Doctor */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-healthcare-blue">
                <User className="h-5 w-5" />
                See a Doctor If
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm">Symptoms worsen or persist beyond 7 days</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm">High fever (over 103°F/39.4°C)</p>
              </div>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm">Difficulty breathing or chest pain</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-healthcare-teal to-healthcare-blue hover:from-healthcare-teal/90 hover:to-healthcare-blue/90"
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Appointment
          </Button>
          <Button variant="outline" size="lg" className="border-healthcare-teal text-healthcare-teal hover:bg-healthcare-teal hover:text-white">
            <Download className="mr-2 h-5 w-5" />
            Download Report
          </Button>
          <Button variant="outline" size="lg" className="border-healthcare-blue text-healthcare-blue hover:bg-healthcare-blue hover:text-white">
            <Phone className="mr-2 h-5 w-5" />
            Emergency Help
          </Button>
        </div>

        {/* Disclaimer */}
        <Card className="bg-healthcare-light-blue/20 border-healthcare-blue/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-healthcare-blue shrink-0" />
              <div className="space-y-2">
                <h3 className="font-semibold text-healthcare-blue">Important Disclaimer</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This AI diagnosis is for informational purposes only and should not replace professional medical advice. 
                  Always consult with a qualified healthcare provider for proper diagnosis and treatment. 
                  In case of emergency, contact your local emergency services immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}