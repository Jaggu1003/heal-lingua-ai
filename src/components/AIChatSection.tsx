import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Mic } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatSectionProps {
  initialSymptoms: string;
  selectedLanguage: string;
  onGetDiagnosis: (messages: Message[]) => void;
}

export default function AIChatSection({ initialSymptoms, selectedLanguage, onGetDiagnosis }: AIChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat with user's symptoms
    const initialMessage: Message = {
      id: "1",
      text: initialSymptoms,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([initialMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const aiResponse: Message = {
          id: "2",
          text: getAIResponse(initialSymptoms, selectedLanguage),
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    }, 1000);
  }, [initialSymptoms, selectedLanguage]);

  const getAIResponse = (symptoms: string, language: string) => {
    if (language === "hi") {
      return "मैं आपके लक्षणों को समझ गया हूँ। कुछ और जानकारी के लिए: क्या यह समस्या कब से है? क्या आपको कोई अन्य लक्षण भी हैं? आपकी उम्र कितनी है?";
    }
    return "I understand your symptoms. To provide a better diagnosis, I need some additional information: How long have you been experiencing these symptoms? Any other symptoms you've noticed? What's your age?";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Thank you for that information. Based on your symptoms, I'm analyzing possible conditions. Can you tell me about any recent travel or exposure to sick individuals?",
        "I see. These symptoms could indicate a few different conditions. Have you taken your temperature? Any specific areas where you feel discomfort?",
        "That's helpful information. I'm now ready to provide you with a comprehensive diagnosis and recommendations. Let me generate the results for you."
      ];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages(prev => {
        const updated = [...prev, aiResponse];
        
        // After 3-4 exchanges, offer diagnosis
        if (updated.filter(m => m.sender === "user").length >= 3) {
          setTimeout(() => {
            onGetDiagnosis(updated);
          }, 2000);
        }
        
        return updated;
      });
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  return (
    <section className="py-16 px-4 bg-healthcare-gray/20">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-healthcare-teal to-healthcare-blue rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              HealLingua AI Assistant
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 bg-healthcare-green rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-healthcare-teal to-healthcare-blue text-white"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "ai" && (
                        <Bot className="h-4 w-4 mt-0.5 text-healthcare-teal" />
                      )}
                      {message.sender === "user" && (
                        <User className="h-4 w-4 mt-0.5 text-white opacity-80" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 opacity-70 ${
                          message.sender === "user" ? "text-white" : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-healthcare-teal" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-healthcare-teal rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-healthcare-teal rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-healthcare-teal rounded-full animate-bounce delay-150"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">AI is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-healthcare-teal text-healthcare-teal hover:bg-healthcare-teal hover:text-white"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="submit"
                  disabled={!currentMessage.trim() || isTyping}
                  className="shrink-0 bg-gradient-to-r from-healthcare-teal to-healthcare-blue hover:from-healthcare-teal/90 hover:to-healthcare-blue/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}