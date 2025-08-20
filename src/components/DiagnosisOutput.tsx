import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Stethoscope, 
  Pill, 
  Calendar,
  Phone,
  FileText,
  Heart
} from 'lucide-react';

interface Condition {
  name: string;
  probability: number;
  severity: 'low' | 'moderate' | 'high';
  description: string;
  symptoms: string[];
}

interface Precaution {
  title: string;
  description: string;
  urgency: 'immediate' | 'soon' | 'routine';
}

interface DiagnosisOutputProps {
  selectedLanguage?: { name: string; nativeName: string };
}

const DiagnosisOutput: React.FC<DiagnosisOutputProps> = ({ selectedLanguage }) => {
  const conditions: Condition[] = [
    {
      name: selectedLanguage?.name === 'Hindi' ? 'वायरल बुखार' : 'Viral Fever',
      probability: 85,
      severity: 'moderate',
      description: selectedLanguage?.name === 'Hindi' 
        ? 'एक सामान्य वायरल संक्रमण जो बुखार, सिरदर्द और शरीर में दर्द का कारण बनता है।'
        : 'A common viral infection causing fever, headache, and body aches.',
      symptoms: selectedLanguage?.name === 'Hindi' 
        ? ['बुखार', 'सिरदर्द', 'शरीर में दर्द', 'कमजोरी']
        : ['Fever', 'Headache', 'Body aches', 'Fatigue']
    },
    {
      name: selectedLanguage?.name === 'Hindi' ? 'साइनस संक्रमण' : 'Sinus Infection',
      probability: 65,
      severity: 'low',
      description: selectedLanguage?.name === 'Hindi'
        ? 'साइनस की सूजन जो नाक बंद होने और सिरदर्द का कारण बनती है।'
        : 'Inflammation of sinuses causing nasal congestion and headache.',
      symptoms: selectedLanguage?.name === 'Hindi'
        ? ['नाक बंद', 'सिरदर्द', 'चेहरे में दर्द']
        : ['Nasal congestion', 'Headache', 'Facial pain']
    },
    {
      name: selectedLanguage?.name === 'Hindi' ? 'तनाव सिरदर्द' : 'Tension Headache',
      probability: 45,
      severity: 'low',
      description: selectedLanguage?.name === 'Hindi'
        ? 'तनाव या थकान के कारण होने वाला सिरदर्द।'
        : 'Headache caused by stress or fatigue.',
      symptoms: selectedLanguage?.name === 'Hindi'
        ? ['सिर में दबाव', 'गर्दन में अकड़न']
        : ['Head pressure', 'Neck stiffness']
    }
  ];

  const precautions: Precaution[] = [
    {
      title: selectedLanguage?.name === 'Hindi' ? 'तुरंत आराम करें' : 'Get Immediate Rest',
      description: selectedLanguage?.name === 'Hindi'
        ? 'पर्याप्त नींद लें और शारीरिक गतिविधि कम करें।'
        : 'Get adequate sleep and reduce physical activity.',
      urgency: 'immediate'
    },
    {
      title: selectedLanguage?.name === 'Hindi' ? 'हाइड्रेशन बनाए रखें' : 'Stay Hydrated',
      description: selectedLanguage?.name === 'Hindi'
        ? 'गर्म पानी, हर्बल चाय और तरल पदार्थ पिएं।'
        : 'Drink warm water, herbal teas, and plenty of fluids.',
      urgency: 'immediate'
    },
    {
      title: selectedLanguage?.name === 'Hindi' ? 'डॉक्टर से सलाह लें' : 'Consult a Doctor',
      description: selectedLanguage?.name === 'Hindi'
        ? 'यदि लक्षण 48 घंटे बाद भी बने रहें तो डॉक्टर से मिलें।'
        : 'If symptoms persist after 48 hours, consult a healthcare provider.',
      urgency: 'soon'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'moderate': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'immediate': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'soon': return <Clock className="w-4 h-4 text-warning" />;
      case 'routine': return <CheckCircle className="w-4 h-4 text-success" />;
      default: return null;
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Stethoscope className="w-8 h-8 text-primary" />
              <h2 className="text-medical-heading">Diagnosis Analysis</h2>
            </div>
            <p className="text-medical-subheading">
              Based on your symptoms, here are the most likely conditions and recommendations
            </p>
            <Badge className="trust-badge">
              <Heart className="w-3 h-3" />
              AI-powered analysis complete
            </Badge>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Possible Conditions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="medical-card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span>Possible Conditions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {conditions.map((condition, index) => (
                    <div key={index} className="space-y-4 p-4 border border-border rounded-lg hover:bg-card-hover transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-lg">{condition.name}</h3>
                            <Badge 
                              variant="secondary" 
                              className={getSeverityColor(condition.severity)}
                            >
                              {selectedLanguage?.name === 'Hindi' 
                                ? condition.severity === 'high' ? 'गंभीर' : 
                                  condition.severity === 'moderate' ? 'मध्यम' : 'हल्का'
                                : condition.severity
                              }
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {condition.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {condition.symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-2 ml-4">
                          <div className="text-2xl font-bold text-primary">
                            {condition.probability}%
                          </div>
                          <Progress 
                            value={condition.probability} 
                            className="w-24 h-2"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommended Actions */}
              <Card className="medical-card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span>Recommended Precautions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {precautions.map((precaution, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                      {getUrgencyIcon(precaution.urgency)}
                      <div className="space-y-1 flex-1">
                        <h4 className="font-medium">{precaution.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {precaution.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <Card className="medical-card border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg text-destructive">
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full btn-medical-primary bg-destructive hover:bg-destructive/90">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Emergency (102)
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Call immediately if you experience severe symptoms like 
                    difficulty breathing, chest pain, or loss of consciousness.
                  </p>
                </CardContent>
              </Card>

              {/* Find Doctor */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-lg">Find Healthcare Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full btn-medical-secondary">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Find Nearby Doctors
                  </Button>
                  <Button variant="outline" className="w-full medical-card">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="w-full medical-card">
                    <Pill className="w-4 h-4 mr-2" />
                    Find Pharmacy
                  </Button>
                </CardContent>
              </Card>

              {/* Report Actions */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-lg">Report & Save</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full medical-card text-left justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="w-full medical-card text-left justify-start">
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Health Profile
                  </Button>
                  <Button variant="outline" className="w-full medical-card text-left justify-start">
                    Share with Doctor
                  </Button>
                </CardContent>
              </Card>

              {/* Accuracy Notice */}
              <Card className="medical-card bg-muted/50">
                <CardContent className="p-4">
                  <div className="text-sm space-y-2">
                    <div className="font-medium flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-primary" />
                      <span>Accuracy Information</span>
                    </div>
                    <p className="text-muted-foreground">
                      This AI analysis has a 94% accuracy rate based on medical literature 
                      and should be used as guidance only.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosisOutput;