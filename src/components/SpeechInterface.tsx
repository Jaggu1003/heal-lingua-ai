import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mic, MicOff, Square } from "lucide-react";
import { toast } from "sonner";
import { RealtimeSpeechChat } from "@/utils/RealtimeSpeech";
import { useTranslation } from "@/contexts/TranslationContext";
import { supabase } from "@/integrations/supabase/client";

const languages = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
];

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'listening' | 'processing' | 'error';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export default function SpeechInterface() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const speechChatRef = useRef<RealtimeSpeechChat | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      speechChatRef.current?.disconnect();
    };
  }, []);

  const handleMessage = (data: any) => {
    if (data.type === 'response.audio_transcript.delta') {
      setCurrentTranscript(prev => prev + data.delta);
    } else if (data.type === 'response.audio_transcript.done') {
      if (currentTranscript.trim()) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'ai',
          text: currentTranscript,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        
        // Save to database
        saveConversation(currentTranscript, currentTranscript);
      }
      setCurrentTranscript('');
    } else if (data.type === 'input_audio_buffer.speech_stopped') {
      // User finished speaking, could show their transcript here if available
    }
  };

  const saveConversation = async (userText: string, aiResponse: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('conversations').insert({
          user_id: user.id,
          language_code: selectedLanguage,
          user_transcript: userText,
          ai_response: aiResponse,
        });
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const startConversation = async () => {
    try {
      setStatus('connecting');
      speechChatRef.current = new RealtimeSpeechChat();
      
      await speechChatRef.current.connect(
        handleMessage,
        (newStatus) => setStatus(newStatus as ConnectionStatus)
      );
      
      toast.success("Voice conversation started! Speak naturally to get healthcare advice.");
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error("Failed to start voice conversation. Please check your microphone permissions.");
      setStatus('error');
    }
  };

  const stopConversation = () => {
    speechChatRef.current?.disconnect();
    setStatus('disconnected');
    toast.info("Voice conversation ended.");
  };

  const getStatusText = () => {
    switch (status) {
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Ready to listen';
      case 'listening': return 'Listening...';
      case 'processing': return 'AI is thinking...';
      case 'error': return 'Connection error';
      default: return 'Not connected';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-healthcare-teal';
      case 'listening': return 'text-blue-500';
      case 'processing': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-healthcare-light-blue/20 to-healthcare-gray/20">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                {t('voice_assistant', 'Voice Healthcare Assistant')}
              </h2>
              <p className="text-muted-foreground mb-4">
                Speak naturally in your preferred language to get instant healthcare advice
              </p>
              <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only. 
                Always consult qualified healthcare professionals for medical diagnosis and treatment.
              </p>
            </div>

            {/* Language Selection */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <Label htmlFor="language-select">Language:</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="show-transcript"
                  checked={showTranscript}
                  onCheckedChange={setShowTranscript}
                />
                <Label htmlFor="show-transcript">Show Text Transcript</Label>
              </div>
            </div>

            {/* Status and Controls */}
            <div className="text-center mb-6">
              <div className={`text-lg font-medium mb-4 ${getStatusColor()}`}>
                {getStatusText()}
              </div>

              <div className="flex justify-center gap-4">
                {status === 'disconnected' || status === 'error' ? (
                  <Button
                    onClick={startConversation}
                    size="lg"
                    className="bg-gradient-to-r from-healthcare-teal to-healthcare-blue text-white hover:opacity-90 transition-all duration-300"
                  >
                    <Mic className="h-5 w-5 mr-2" />
                    Start Voice Chat
                  </Button>
                ) : (
                  <Button
                    onClick={stopConversation}
                    size="lg"
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Square className="h-5 w-5 mr-2" />
                    Stop Conversation
                  </Button>
                )}
              </div>
            </div>

            {/* Visual Feedback */}
            <div className="flex justify-center mb-6">
              <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                status === 'listening' 
                  ? 'border-blue-500 bg-blue-50 animate-pulse' 
                  : status === 'processing'
                  ? 'border-yellow-500 bg-yellow-50 animate-spin'
                  : status === 'connected'
                  ? 'border-healthcare-teal bg-healthcare-light-blue/20'
                  : 'border-gray-300 bg-gray-50'
              }`}>
                {status === 'listening' ? (
                  <Mic className="h-8 w-8 text-blue-500" />
                ) : status === 'connected' ? (
                  <Mic className="h-8 w-8 text-healthcare-teal" />
                ) : (
                  <MicOff className="h-8 w-8 text-gray-400" />
                )}
              </div>
            </div>

            {/* Transcript Display */}
            {showTranscript && (
              <div className="max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Conversation Transcript:</h3>
                {messages.length === 0 ? (
                  <p className="text-muted-foreground">No conversation yet. Start speaking to see the transcript.</p>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.type === 'ai'
                            ? 'bg-healthcare-light-blue/30 text-gray-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className="font-medium mb-1">
                          {message.type === 'ai' ? 'AI Doctor:' : 'You:'}
                        </div>
                        <div>{message.text}</div>
                      </div>
                    ))}
                    {currentTranscript && (
                      <div className="p-3 rounded-lg bg-healthcare-light-blue/30 text-gray-800 opacity-70">
                        <div className="font-medium mb-1">AI Doctor:</div>
                        <div>{currentTranscript}...</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}