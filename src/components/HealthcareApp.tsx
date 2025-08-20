import { useState } from "react";
import LoginPage from "./LoginPage";
import HeroSection from "./HeroSection";
import LanguageSelector from "./LanguageSelector";
import SymptomInput from "./SymptomInput";
import AIChatSection from "./AIChatSection";
import DiagnosisOutput from "./DiagnosisOutput";
import AboutTrustSection from "./AboutTrustSection";
import Footer from "./Footer";

type AppState = "login" | "hero" | "language" | "symptoms" | "chat" | "diagnosis" | "complete";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function HealthcareApp() {
  const [currentState, setCurrentState] = useState<AppState>("login");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [userSymptoms, setUserSymptoms] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const handleLogin = () => {
    setCurrentState("hero");
  };

  const handleStartDiagnosis = () => {
    setCurrentState("language");
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentState("symptoms");
  };

  const handleSubmitSymptoms = (symptoms: string) => {
    setUserSymptoms(symptoms);
    setCurrentState("chat");
  };

  const handleGetDiagnosis = (messages: Message[]) => {
    setChatMessages(messages);
    setCurrentState("diagnosis");
  };

  const renderCurrentSection = () => {
    switch (currentState) {
      case "login":
        return <LoginPage onLogin={handleLogin} />;
      
      case "hero":
        return (
          <>
            <HeroSection onStartDiagnosis={handleStartDiagnosis} />
            <AboutTrustSection />
          </>
        );
      
      case "language":
        return (
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
          />
        );
      
      case "symptoms":
        return (
          <SymptomInput 
            onSubmitSymptoms={handleSubmitSymptoms}
            selectedLanguage={selectedLanguage}
          />
        );
      
      case "chat":
        return (
          <AIChatSection 
            initialSymptoms={userSymptoms}
            selectedLanguage={selectedLanguage}
            onGetDiagnosis={handleGetDiagnosis}
          />
        );
      
      case "diagnosis":
        return (
          <>
            <DiagnosisOutput selectedLanguage={selectedLanguage} />
            <AboutTrustSection />
          </>
        );
      
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentSection()}
      {currentState !== "login" && <Footer />}
    </div>
  );
}