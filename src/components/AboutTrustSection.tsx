import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Shield, 
  Globe, 
  Users, 
  Award, 
  BookOpen,
  Lock,
  AlertTriangle,
  CheckCircle,
  Heart,
  Stethoscope,
  Database
} from 'lucide-react';

interface AboutTrustSectionProps {
  selectedLanguage?: { name: string; nativeName: string };
}

const AboutTrustSection: React.FC<AboutTrustSectionProps> = ({ selectedLanguage }) => {
  const aiFeatures = [
    {
      icon: Brain,
      title: selectedLanguage?.name === 'Hindi' ? 'उन्नत AI तकनीक' : 'Advanced AI Technology',
      description: selectedLanguage?.name === 'Hindi'
        ? 'मशीन लर्निंग और न्यूरल नेटवर्क का उपयोग करके सटीक निदान'
        : 'Accurate diagnosis using machine learning and neural networks'
    },
    {
      icon: Database,
      title: selectedLanguage?.name === 'Hindi' ? '10M+ मेडिकल केसेस' : '10M+ Medical Cases',
      description: selectedLanguage?.name === 'Hindi'
        ? 'दुनिया भर के चिकित्सा मामलों पर प्रशिक्षित AI मॉडल'
        : 'AI model trained on millions of medical cases worldwide'
    },
    {
      icon: Globe,
      title: selectedLanguage?.name === 'Hindi' ? '12+ भारतीय भाषाएं' : '12+ Indian Languages',
      description: selectedLanguage?.name === 'Hindi'
        ? 'स्थानीय भाषाओं में चिकित्सा शब्दावली की समझ'
        : 'Understanding of medical terminology in local languages'
    },
    {
      icon: Users,
      title: selectedLanguage?.name === 'Hindi' ? 'डॉक्टरों द्वारा सत्यापित' : 'Doctor Verified',
      description: selectedLanguage?.name === 'Hindi'
        ? 'योग्य चिकित्सकों द्वारा नियमित समीक्षा और अपडेट'
        : 'Regular review and updates by qualified medical professionals'
    }
  ];

  const trustFactors = [
    {
      icon: Shield,
      title: selectedLanguage?.name === 'Hindi' ? 'HIPAA अनुपालन' : 'HIPAA Compliant',
      description: selectedLanguage?.name === 'Hindi'
        ? 'आपकी स्वास्थ्य जानकारी पूरी तरह सुरक्षित और निजी है'
        : 'Your health information is completely secure and private'
    },
    {
      icon: Lock,
      title: selectedLanguage?.name === 'Hindi' ? 'एंड-टू-एंड एन्क्रिप्शन' : 'End-to-End Encryption',
      description: selectedLanguage?.name === 'Hindi'
        ? 'सभी डेटा एन्क्रिप्टेड है और केवल आप तक पहुंच सकते हैं'
        : 'All data is encrypted and accessible only to you'
    },
    {
      icon: Award,
      title: selectedLanguage?.name === 'Hindi' ? 'ISO 27001 प्रमाणित' : 'ISO 27001 Certified',
      description: selectedLanguage?.name === 'Hindi'
        ? 'अंतर्राष्ट्रीय सुरक्षा मानकों का पालन'
        : 'Compliance with international security standards'
    },
    {
      icon: CheckCircle,
      title: selectedLanguage?.name === 'Hindi' ? 'नो-स्टोरेज पॉलिसी' : 'No-Storage Policy',
      description: selectedLanguage?.name === 'Hindi'
        ? 'आपके लक्षण स्थायी रूप से संग्रहीत नहीं किए जाते'
        : 'Your symptoms are not permanently stored'
    }
  ];

  const disclaimers = [
    {
      icon: AlertTriangle,
      title: selectedLanguage?.name === 'Hindi' ? 'AI सहायक, डॉक्टर का विकल्प नहीं' : 'AI Assistant, Not Doctor Replacement',
      content: selectedLanguage?.name === 'Hindi'
        ? 'यह एक AI सहायक है जो जानकारी प्रदान करता है, लेकिन पेशेवर चिकित्सा सलाह का विकल्प नहीं है।'
        : 'This is an AI assistant that provides information but is not a substitute for professional medical advice.'
    },
    {
      icon: Stethoscope,
      title: selectedLanguage?.name === 'Hindi' ? 'डॉक्टर से सलाह आवश्यक' : 'Doctor Consultation Required',
      content: selectedLanguage?.name === 'Hindi'
        ? 'गंभीर या निरंतर लक्षणों के लिए हमेशा योग्य चिकित्सक से सलाह लें।'
        : 'Always consult with a qualified healthcare provider for serious or persistent symptoms.'
    },
    {
      icon: Heart,
      title: selectedLanguage?.name === 'Hindi' ? 'आपातकालीन स्थितियों में' : 'In Emergency Situations',
      content: selectedLanguage?.name === 'Hindi'
        ? 'आपातकालीन स्थितियों में तुरंत 102 पर कॉल करें या निकटतम अस्पताल जाएं।'
        : 'In emergency situations, immediately call 102 or visit the nearest hospital.'
    }
  ];

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* About AI Section */}
          <div className="text-center space-y-12">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Brain className="w-8 h-8 text-primary" />
                <h2 className="text-medical-heading">
                  {selectedLanguage?.name === 'Hindi' ? 'AI कैसे काम करता है' : 'How Our AI Works'}
                </h2>
              </div>
              <p className="text-medical-subheading max-w-3xl mx-auto">
                {selectedLanguage?.name === 'Hindi'
                  ? 'हमारा AI सिस्टम लाखों चिकित्सा मामलों का विश्लेषण करके आपके लक्षणों की सटीक व्याख्या करता है'
                  : 'Our AI system analyzes millions of medical cases to provide accurate interpretation of your symptoms'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="medical-card-elevated text-center hover:scale-105 transition-transform">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trust & Safety */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-8 h-8 text-primary" />
                <h2 className="text-medical-heading">
                  {selectedLanguage?.name === 'Hindi' ? 'भरोसा और सुरक्षा' : 'Trust & Safety'}
                </h2>
              </div>
              <p className="text-medical-subheading max-w-3xl mx-auto">
                {selectedLanguage?.name === 'Hindi'
                  ? 'आपकी निजता और डेटा सुरक्षा हमारी सर्वोच्च प्राथमिकता है'
                  : 'Your privacy and data security are our highest priorities'
                }
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {trustFactors.map((factor, index) => (
                <Card key={index} className="medical-card">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <factor.icon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{factor.title}</h3>
                        <p className="text-sm text-muted-foreground">{factor.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="trust-badge">
                <Shield className="w-3 h-3" />
                256-bit SSL Encryption
              </Badge>
              <Badge className="trust-badge">
                <Award className="w-3 h-3" />
                ISO 27001 Certified
              </Badge>
              <Badge className="trust-badge">
                <Users className="w-3 h-3" />
                100,000+ Trusted Users
              </Badge>
              <Badge className="trust-badge">
                <CheckCircle className="w-3 h-3" />
                HIPAA Compliant
              </Badge>
            </div>
          </div>

          {/* Medical Disclaimers */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <AlertTriangle className="w-8 h-8 text-warning" />
                <h2 className="text-medical-heading">
                  {selectedLanguage?.name === 'Hindi' ? 'महत्वपूर्ण चिकित्सा जानकारी' : 'Important Medical Information'}
                </h2>
              </div>
            </div>

            <div className="grid gap-6">
              {disclaimers.map((disclaimer, index) => (
                <Card key={index} className="medical-card border-warning/20 bg-warning/5">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <disclaimer.icon className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">{disclaimer.title}</h3>
                        <p className="text-muted-foreground">{disclaimer.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" className="medical-card">
                <BookOpen className="w-4 h-4 mr-2" />
                {selectedLanguage?.name === 'Hindi' ? 'पूर्ण नियम और शर्तें पढ़ें' : 'Read Full Terms & Conditions'}
              </Button>
            </div>
          </div>

          {/* Data Privacy Statement */}
          <Card className="medical-card-elevated bg-gradient-trust">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {selectedLanguage?.name === 'Hindi' ? 'डेटा गोपनीयता प्रतिज्ञा' : 'Data Privacy Commitment'}
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {selectedLanguage?.name === 'Hindi'
                  ? 'हम आपकी व्यक्तिगत स्वास्थ्य जानकारी को कभी भी तीसरे पक्ष के साथ साझा नहीं करते हैं। आपका डेटा आपका है और हमेशा आपके नियंत्रण में रहता है।'
                  : 'We never share your personal health information with third parties. Your data belongs to you and remains under your control at all times.'
                }
              </p>
              <Button className="btn-medical-primary">
                <Shield className="w-4 h-4 mr-2" />
                {selectedLanguage?.name === 'Hindi' ? 'गोपनीयता नीति देखें' : 'View Privacy Policy'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutTrustSection;