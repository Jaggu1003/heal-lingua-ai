import { useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import UserHeader from "./UserHeader";
import HeroSection from "./HeroSection";
import LanguageSelector from "./LanguageSelector";
import SymptomInput from "./SymptomInput";
import AIChatSection from "./AIChatSection";
import DiagnosisOutput from "./DiagnosisOutput";
import AboutTrustSection from "./AboutTrustSection";
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
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [userSymptoms, setUserSymptoms] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('preferred_language')
        .eq('user_id', userId)
        .single();
        
      if (profile?.preferred_language) {
        setSelectedLanguage(profile.preferred_language);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };


  const handleStartDiagnosis = () => {
    setCurrentState("language");
  };

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    
    // Save language preference to user profile
    if (user) {
      try {
        await supabase
          .from('profiles')
          .update({ preferred_language: language })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error saving language preference:', error);
      }
    }
    
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