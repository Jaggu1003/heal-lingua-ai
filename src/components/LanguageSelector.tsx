import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Globe } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region?: string;
}

const indianLanguages: Language[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'North India' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Universal' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab' },
  { code: 'or', name: 'Oriya', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam' }
];

interface LanguageSelectorProps {
  onLanguageSelect: (language: Language) => void;
  selectedLanguage?: Language;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageSelect,
  selectedLanguage
}) => {
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  return (
    <section className="py-16 bg-gradient-trust">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Globe className="w-8 h-8 text-primary" />
            <h2 className="text-medical-heading">Choose Your Language</h2>
          </div>
          <p className="text-medical-subheading max-w-2xl mx-auto">
            Get healthcare guidance in the language you're most comfortable with. 
            Our AI understands medical terms across all major Indian languages.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {indianLanguages.map((language) => (
            <Card
              key={language.code}
              className={`language-tile cursor-pointer transition-all duration-300 ${
                selectedLanguage?.code === language.code ? 'selected' : ''
              }`}
              onClick={() => onLanguageSelect(language)}
              onMouseEnter={() => setHoveredLang(language.code)}
              onMouseLeave={() => setHoveredLang(null)}
            >
              <CardContent className="p-4 text-center space-y-2">
                <div className="relative">
                  <div className="text-2xl font-semibold text-primary">
                    {language.nativeName}
                  </div>
                  {selectedLanguage?.code === language.code && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {language.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {language.region}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedLanguage && (
          <div className="text-center mt-8">
            <div className="trust-badge">
              <Check className="w-4 h-4" />
              Selected: {selectedLanguage.nativeName} ({selectedLanguage.name})
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <p className="text-medical-caption mb-4">
            Don't see your language? We're continuously adding support for more regional languages.
          </p>
          <Button variant="outline" className="medical-card">
            Request Language Support
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LanguageSelector;