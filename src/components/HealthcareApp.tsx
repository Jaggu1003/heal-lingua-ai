import React, { useState } from 'react';
import LoginPage from './LoginPage';
import HeroSection from './HeroSection';
import LanguageSelector from './LanguageSelector';
import SymptomInput from './SymptomInput';
import AIChatSection from './AIChatSection';
import DiagnosisOutput from './DiagnosisOutput';
import AboutTrustSection from './AboutTrustSection';
import Footer from './Footer';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  region?: string;
}

type AppState = 'login' | 'home' | 'symptoms' | 'chat' | 'diagnosis';

const HealthcareApp: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({
    code: 'en',
    name: 'English',
    nativeName: 'English'
  });
  const [userSymptoms, setUserSymptoms] = useState<string>('');

  const handleLogin = () => {
    setCurrentState('home');
  };

  const handleStartDiagnosis = () => {
    setCurrentState('symptoms');
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleSymptomSubmit = (symptoms: string) => {
    setUserSymptoms(symptoms);
    setCurrentState('chat');
  };

  const handleChatComplete = () => {
    setCurrentState('diagnosis');
  };

  // Login Page
  if (currentState === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Main App Content
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Always shown on home */}
      {currentState === 'home' && (
        <HeroSection onStartDiagnosis={handleStartDiagnosis} />
      )}

      {/* Language Selector - Always shown on home */}
      {currentState === 'home' && (
        <LanguageSelector 
          onLanguageSelect={handleLanguageSelect}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* Symptom Input Section */}
      {currentState === 'symptoms' && (
        <SymptomInput 
          onSubmitSymptoms={handleSymptomSubmit}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* AI Chat Section */}
      {currentState === 'chat' && (
        <AIChatSection
          initialSymptoms={userSymptoms}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* Diagnosis Output */}
      {currentState === 'diagnosis' && (
        <DiagnosisOutput selectedLanguage={selectedLanguage} />
      )}

      {/* About & Trust Section - Always shown */}
      <AboutTrustSection selectedLanguage={selectedLanguage} />

      {/* Footer - Always shown */}
      <Footer 
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />

      {/* Floating Navigation - Show when not on home */}
      {currentState !== 'home' && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setCurrentState('home')}
              className="w-12 h-12 bg-gradient-primary rounded-full shadow-elevated flex items-center justify-center text-white hover:scale-105 transition-transform"
              title={selectedLanguage.name === 'Hindi' ? 'होम पर जाएं' : 'Go to Home'}
            >
              🏠
            </button>
            
            {currentState === 'symptoms' && (
              <button
                onClick={handleStartDiagnosis}
                className="w-12 h-12 bg-gradient-secondary rounded-full shadow-elevated flex items-center justify-center text-white hover:scale-105 transition-transform"
                title={selectedLanguage.name === 'Hindi' ? 'निदान शुरू करें' : 'Start Diagnosis'}
              >
                🩺
              </button>
            )}
            
            {(currentState === 'chat' || currentState === 'diagnosis') && (
              <button
                onClick={() => setCurrentState('symptoms')}
                className="w-12 h-12 bg-gradient-healing rounded-full shadow-elevated flex items-center justify-center text-white hover:scale-105 transition-transform"
                title={selectedLanguage.name === 'Hindi' ? 'नए लक्षण' : 'New Symptoms'}
              >
                ➕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {currentState !== 'home' && (
        <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500 ease-out"
            style={{
              width: currentState === 'symptoms' ? '33%' : 
                     currentState === 'chat' ? '66%' : 
                     currentState === 'diagnosis' ? '100%' : '0%'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HealthcareApp;