// Re-export the translation hook for easier imports
export { useTranslation } from '@/contexts/TranslationContext';

// Example usage documentation:
/*
import { useTranslation } from '@/hooks/useTranslation';

function MyComponent() {
  const { t, setLanguage, currentLanguage, isLoading } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome_message', 'Welcome to HealLingua AI')}</h1>
      <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
      <p>Current language: {currentLanguage}</p>
    </div>
  );
}

// Available methods:
// - t(key, fallback): Get translated text with optional fallback
// - setLanguage(code): Change language and update user preference
// - currentLanguage: Current language code
// - isLoading: Loading state when changing languages
// - translations: Full translations object for current language

// Supabase queries used:
// 1. Fetch translations: SELECT translation_key, translation_text FROM translations WHERE language_code = ?
// 2. Update user preference: UPDATE profiles SET preferred_language = ? WHERE user_id = ?
// 3. Load user preference: SELECT preferred_language FROM profiles WHERE user_id = ?
*/