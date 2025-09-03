import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Globe, Loader2 } from "lucide-react";

/**
 * Example component demonstrating how to use the translation system
 * This shows all the key features: t() function, language switching, loading states, fallbacks
 */
export default function TranslationExample() {
  const { t, setLanguage, currentLanguage, isLoading } = useTranslation();

  const handleLanguageChange = async (lang: string) => {
    await setLanguage(lang);
  };

  return (
    <Card className="max-w-2xl mx-auto m-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Translation System Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Current Language Display */}
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium">Current Language: {currentLanguage}</p>
          {isLoading && (
            <div className="flex items-center gap-2 mt-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading translations...</span>
            </div>
          )}
        </div>

        {/* Example Translations */}
        <div className="space-y-4">
          <h3 className="font-semibold">Example Translations:</h3>
          
          <div className="grid gap-3">
            <div className="p-3 border rounded">
              <strong>welcome_message:</strong> {t('welcome_message', 'Welcome to HealLingua AI')}
            </div>
            
            <div className="p-3 border rounded">
              <strong>get_started:</strong> {t('get_started', 'Get Started')}
            </div>
            
            <div className="p-3 border rounded">
              <strong>describe_symptoms:</strong> {t('describe_symptoms', 'Describe Your Symptoms')}
            </div>

            <div className="p-3 border rounded">
              <strong>trusted_healthcare:</strong> {t('trusted_healthcare', 'Trusted Healthcare AI')}
            </div>

            {/* Example with missing translation - shows fallback */}
            <div className="p-3 border rounded bg-yellow-50">
              <strong>missing_key (fallback demo):</strong> {t('this_key_does_not_exist', 'This is a fallback text')}
            </div>
          </div>
        </div>

        {/* Language Switching Buttons */}
        <div className="space-y-3">
          <h3 className="font-semibold">Quick Language Switch:</h3>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={currentLanguage === 'en' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleLanguageChange('en')}
              disabled={isLoading}
            >
              English
            </Button>
            <Button 
              variant={currentLanguage === 'hi' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleLanguageChange('hi')}
              disabled={isLoading}
            >
              हिन्दी
            </Button>
            <Button 
              variant={currentLanguage === 'ta' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleLanguageChange('ta')}
              disabled={isLoading}
            >
              தமிழ்
            </Button>
            <Button 
              variant={currentLanguage === 'mr' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => handleLanguageChange('mr')}
              disabled={isLoading}
            >
              मराठी
            </Button>
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-3">
          <h3 className="font-semibold">Usage Examples:</h3>
          <div className="p-4 bg-gray-100 rounded-lg text-sm font-mono">
            <div>// Basic usage</div>
            <div>const &#123; t &#125; = useTranslation();</div>
            <div>const text = t('welcome_message', 'Default text');</div>
            <br />
            <div>// Change language</div>
            <div>const &#123; setLanguage &#125; = useTranslation();</div>
            <div>await setLanguage('hi');</div>
            <br />
            <div>// Get current language</div>
            <div>const &#123; currentLanguage &#125; = useTranslation();</div>
            <div>console.log(currentLanguage); // 'en', 'hi', etc.</div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}