import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Globe,
  Shield,
  BookOpen,
  Users,
  Send
} from 'lucide-react';

interface FooterProps {
  selectedLanguage?: { name: string; nativeName: string; code: string };
  onLanguageChange?: (language: { name: string; nativeName: string; code: string }) => void;
}

const Footer: React.FC<FooterProps> = ({ selectedLanguage, onLanguageChange }) => {
  const [email, setEmail] = useState('');

  const languages = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const quickLinks = [
    { 
      label: selectedLanguage?.name === 'Hindi' ? 'लक्षण विश्लेषण' : 'Symptom Analysis',
      href: '#symptoms'
    },
    {
      label: selectedLanguage?.name === 'Hindi' ? 'भाषा चयन' : 'Language Selection',
      href: '#languages'
    },
    {
      label: selectedLanguage?.name === 'Hindi' ? 'डॉक्टर खोजें' : 'Find Doctors',
      href: '#doctors'
    },
    {
      label: selectedLanguage?.name === 'Hindi' ? 'स्वास्थ्य टिप्स' : 'Health Tips',
      href: '#tips'
    }
  ];

  const supportLinks = [
    {
      label: selectedLanguage?.name === 'Hindi' ? 'सहायता केंद्र' : 'Help Center',
      href: '#help'
    },
    {
      label: selectedLanguage?.name === 'Hindi' ? 'नियम और शर्तें' : 'Terms & Conditions',
      href: '#terms'
    },
    {
      label: selectedLanguage?.name === 'Hindi' ? 'गोपनीयता नीति' : 'Privacy Policy',
      href: '#privacy'
    },
    {
      label: selectedLanguage?.name === 'Hindi' ? 'संपर्क करें' : 'Contact Us',
      href: '#contact'
    }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 space-y-12">
          {/* Top Section */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand & Description */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">HealthAI</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {selectedLanguage?.name === 'Hindi'
                  ? 'AI-संचालित स्वास्थ्य निदान जो भारतीय भाषाओं में सुलभ चिकित्सा मार्गदर्शन प्रदान करता है।'
                  : 'AI-powered health diagnosis providing accessible medical guidance in Indian languages.'
                }
              </p>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {selectedLanguage?.name === 'Hindi' ? 'HIPAA अनुपालित' : 'HIPAA Compliant'}
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground">
                {selectedLanguage?.name === 'Hindi' ? 'त्वरित लिंक' : 'Quick Links'}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground">
                {selectedLanguage?.name === 'Hindi' ? 'सहायता' : 'Support'}
              </h4>
              <ul className="space-y-3">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div className="space-y-6">
              <h4 className="font-semibold text-foreground">
                {selectedLanguage?.name === 'Hindi' ? 'संपर्क में रहें' : 'Stay Connected'}
              </h4>
              
              {/* Newsletter */}
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder={selectedLanguage?.name === 'Hindi' 
                    ? 'आपका ईमेल पता'
                    : 'Your email address'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="medical-input text-sm"
                  required
                />
                <Button 
                  type="submit" 
                  className="w-full btn-medical-primary h-9 text-sm"
                >
                  <Send className="w-3 h-3 mr-2" />
                  {selectedLanguage?.name === 'Hindi' ? 'सब्स्क्राइब करें' : 'Subscribe'}
                </Button>
              </form>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>+91 80000 12345</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>support@healthai.in</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedLanguage?.name === 'Hindi' 
                      ? 'बंगलौर, भारत'
                      : 'Bangalore, India'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Language Switcher */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">
                {selectedLanguage?.name === 'Hindi' ? 'भाषा चुनें' : 'Choose Language'}
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant="outline"
                  size="sm"
                  onClick={() => onLanguageChange?.(lang)}
                  className={`medical-card text-xs ${
                    selectedLanguage?.code === lang.code 
                      ? 'border-primary text-primary bg-primary/5' 
                      : ''
                  }`}
                >
                  <span className="font-medium">{lang.nativeName}</span>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Social Links & Statistics */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {selectedLanguage?.name === 'Hindi' ? 'हमसे जुड़ें:' : 'Follow Us:'}
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Statistics */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>100,000+ {selectedLanguage?.name === 'Hindi' ? 'उपयोगकर्ता' : 'Users'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>10M+ {selectedLanguage?.name === 'Hindi' ? 'विश्लेषण' : 'Analyses'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>12+ {selectedLanguage?.name === 'Hindi' ? 'भाषाएं' : 'Languages'}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span>© 2024 HealthAI.</span>
              <span>
                {selectedLanguage?.name === 'Hindi' 
                  ? 'सभी अधिकार सुरक्षित।'
                  : 'All rights reserved.'
                }
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span>
                  {selectedLanguage?.name === 'Hindi' 
                    ? 'प्रेम से बनाया गया'
                    : 'Made with'
                  }
                </span>
                <Heart className="w-4 h-4 text-destructive" />
                <span>
                  {selectedLanguage?.name === 'Hindi' 
                    ? 'भारत में'
                    : 'in India'
                  }
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;