import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Check } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

export default function LanguageSelector({ selectedLanguage, onLanguageSelect }: LanguageSelectorProps) {
  return (
    <section className="py-16 px-4 bg-healthcare-gray/30">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-healthcare-teal to-healthcare-blue rounded-full flex items-center justify-center mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Choose Your Language</CardTitle>
            <p className="text-muted-foreground">
              Select your preferred language for the most comfortable healthcare experience
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={selectedLanguage === lang.code ? "default" : "outline"}
                  onClick={() => onLanguageSelect(lang.code)}
                  className={`relative h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 ${
                    selectedLanguage === lang.code
                      ? "bg-gradient-to-r from-healthcare-teal to-healthcare-blue text-white shadow-lg"
                      : "hover:bg-healthcare-light-blue/50 hover:border-healthcare-teal"
                  }`}
                >
                  {selectedLanguage === lang.code && (
                    <Check className="absolute top-2 right-2 h-4 w-4" />
                  )}
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-center">
                    <div className="font-semibold text-sm">{lang.name}</div>
                    <div className="text-xs opacity-80">{lang.nativeName}</div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-healthcare-light-blue/20 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                <strong>Selected:</strong> {languages.find(l => l.code === selectedLanguage)?.name || "English"} 
                ({languages.find(l => l.code === selectedLanguage)?.nativeName || "English"})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}