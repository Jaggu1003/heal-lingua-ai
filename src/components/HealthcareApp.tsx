import { useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "@/contexts/TranslationContext";
import UserHeader from "./UserHeader";
import HeroSection from "./HeroSection";
import LanguageSelector from "./LanguageSelector";
import SymptomInput from "./SymptomInput";
import AIChatSection from "./AIChatSection";
import DiagnosisOutput from "./DiagnosisOutput";
import AboutTrustSection from "./AboutTrustSection";
import SpeechInterface from "./SpeechInterface";
import Footer from "./Footer";

type AppState = "hero" | "language" | "symptoms" | "chat" | "diagnosis" | "complete";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function HealthcareApp() {
  const [currentState, setCurrentState] = useState<AppState>("hero");
  const [userSymptoms, setUserSymptoms] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setCurrentState("hero");
          // Load user preferences
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentState("hero");
        loadUserProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    // Profile loading is now handled by TranslationContext
    // This function can be removed or used for other profile data
  };


  const handleStartDiagnosis = () => {
    setCurrentState("language");
  };

  const handleLanguageSelect = async (language: string) => {
    // Language preference is now handled by TranslationContext
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
      case "hero":
        return (
          <>
            <HeroSection onStartDiagnosis={handleStartDiagnosis} />
            <SpeechInterface />
            <AboutTrustSection />
          </>
        );
      
      case "language":
        return (
          <LanguageSelector 
            onLanguageSelect={handleLanguageSelect}
          />
        );
      
      case "symptoms":
        return (
          <SymptomInput 
            onSubmitSymptoms={handleSubmitSymptoms}
            selectedLanguage={currentLanguage}
          />
        );
      
      case "chat":
        return (
          <AIChatSection 
            initialSymptoms={userSymptoms}
            selectedLanguage={currentLanguage}
            onGetDiagnosis={handleGetDiagnosis}
          />
        );
      
      case "diagnosis":
        return (
          <>
            <DiagnosisOutput selectedLanguage={currentLanguage} />
            <AboutTrustSection />
          </>
        );
      
      default:
        return (
          <>
            <HeroSection onStartDiagnosis={handleStartDiagnosis} />
            <AboutTrustSection />
          </>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-teal mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <UserHeader user={user} />}
      {renderCurrentSection()}
      <Footer />
    </div>
  );
}