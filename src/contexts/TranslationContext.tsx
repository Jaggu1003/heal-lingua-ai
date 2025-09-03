import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Translation {
  translation_key: string;
  language_code: string;
  translation_text: string;
}

interface TranslationContextType {
  currentLanguage: string;
  translations: Record<string, string>;
  setLanguage: (language: string) => Promise<void>;
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch translations for a specific language
  const fetchTranslations = async (languageCode: string): Promise<Record<string, string>> => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('translation_key, translation_text')
        .eq('language_code', languageCode);

      if (error) {
        console.error('Error fetching translations:', error);
        return {};
      }

      const translationMap: Record<string, string> = {};
      data?.forEach((item: Translation) => {
        translationMap[item.translation_key] = item.translation_text;
      });

      return translationMap;
    } catch (error) {
      console.error('Error fetching translations:', error);
      return {};
    }
  };

  // Update user's preferred language in database
  const updateUserLanguagePreference = async (languageCode: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({ preferred_language: languageCode })
          .eq('user_id', user.id);

        if (error) {
          console.error('Error updating language preference:', error);
        }
      }
    } catch (error) {
      console.error('Error updating user language:', error);
    }
  };

  // Set language and fetch translations
  const setLanguage = async (languageCode: string) => {
    setIsLoading(true);
    
    try {
      // Fetch translations for the new language
      const newTranslations = await fetchTranslations(languageCode);
      
      // If no translations found for the language, fallback to English
      if (Object.keys(newTranslations).length === 0 && languageCode !== 'en') {
        const englishTranslations = await fetchTranslations('en');
        setTranslations(englishTranslations);
        toast({
          variant: "destructive",
          title: "Translation Error",
          description: `No translations found for ${languageCode}. Falling back to English.`,
        });
      } else {
        setTranslations(newTranslations);
      }

      setCurrentLanguage(languageCode);
      
      // Update user preference in database
      await updateUserLanguagePreference(languageCode);
      
    } catch (error) {
      console.error('Error setting language:', error);
      toast({
        variant: "destructive",
        title: "Language Error",
        description: "Failed to change language. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Translation function with fallback
  const t = (key: string, fallback?: string): string => {
    const translation = translations[key];
    if (translation) {
      return translation;
    }
    
    // Return fallback or key if no translation found
    return fallback || key;
  };

  // Load user's preferred language on mount
  useEffect(() => {
    const loadUserLanguage = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('preferred_language')
            .eq('user_id', user.id)
            .single();

          if (!error && profile?.preferred_language) {
            await setLanguage(profile.preferred_language);
          } else {
            await setLanguage('en'); // Default to English
          }
        } else {
          await setLanguage('en'); // Default to English for non-authenticated users
        }
      } catch (error) {
        console.error('Error loading user language:', error);
        await setLanguage('en'); // Fallback to English
      }
    };

    loadUserLanguage();
  }, []);

  const value = {
    currentLanguage,
    translations,
    setLanguage,
    t,
    isLoading,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

// Example usage:
// const { t, setLanguage, currentLanguage } = useTranslation();
// const welcomeText = t('welcome_message', 'Welcome to HealLingua AI');