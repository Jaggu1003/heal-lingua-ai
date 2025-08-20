import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Send, Loader2, MessageCircle, Heart } from 'lucide-react';
import chatImage from '@/assets/chat-illustration.jpg';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
}

interface AIChatSectionProps {
  initialSymptoms?: string;
  selectedLanguage?: { name: string; nativeName: string };
}

const AIChatSection: React.FC<AIChatSectionProps> = ({ 
  initialSymptoms, 
  selectedLanguage 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message and symptoms if provided
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: selectedLanguage?.name === 'Hindi' 
        ? 'नमस्ते! मैं आपका AI स्वास्थ्य सहायक हूं। मैं आपके लक्षणों का विश्लेषण करके संभावित स्थितियों की जानकारी दे सकता हूं। कृपया बताएं कि आप कैसा महसूस कर रहे हैं?'
        : 'Hello! I\'m your AI Health Assistant. I can analyze your symptoms and provide insights about possible conditions. How are you feeling today?',
      timestamp: new Date()
    };
    
    const initialMessages = [welcomeMessage];
    
    if (initialSymptoms) {
      initialMessages.push({
        id: '2',
        type: 'user',
        content: initialSymptoms,
        timestamp: new Date()
      });

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: '3',
          type: 'ai',
          content: selectedLanguage?.name === 'Hindi'
            ? 'मैं आपके लक्षणों का विश्लेषण कर रहा हूं। कृपया कुछ अतिरिक्त प्रश्नों का उत्तर दें:\n\n1. यह समस्या कब से है?\n2. क्या आपको बुखार है?\n3. क्या आपने कोई दवा ली है?'
            : 'I\'m analyzing your symptoms. Let me ask a few follow-up questions:\n\n1. How long have you been experiencing this?\n2. Do you have any fever?\n3. Have you taken any medication?',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 2000);
    }
    
    setMessages(initialMessages);
  }, [initialSymptoms, selectedLanguage]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: selectedLanguage?.name === 'Hindi'
          ? 'आपकी जानकारी के आधार पर, यह एक सामान्य वायरल संक्रमण हो सकता है। मैं कुछ सुझाव दे रहा हूं:\n\n• पर्याप्त आराम करें\n• गर्म पानी पिएं\n• यदि बुखार बना रहे तो डॉक्टर से मिलें\n\nक्या आप कोई और लक्षण महसूस कर रहे हैं?'
          : 'Based on your symptoms, this could be a common viral infection. Here are my recommendations:\n\n• Get plenty of rest\n• Stay hydrated with warm fluids\n• Consult a doctor if fever persists\n\nAre you experiencing any other symptoms?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h2 className="text-medical-heading">AI Health Assistant</h2>
            </div>
            <p className="text-medical-subheading">
              Have a conversation with our AI to get personalized health insights
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="medical-card-elevated h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span>AI Health Assistant</span>
                    </div>
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      <span>Online</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%]`}>
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        <div
                          className={`p-3 rounded-2xl ${
                            message.type === 'user'
                              ? 'chat-bubble-user'
                              : 'chat-bubble-ai'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>

                        {message.type === 'user' && (
                          <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="chat-bubble-ai p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="border-t p-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder={selectedLanguage?.name === 'Hindi' 
                        ? 'अपना संदेश लिखें...'
                        : 'Type your message...'
                      }
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="medical-input"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isTyping}
                      className="btn-medical-primary"
                    >
                      {isTyping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              {/* AI Capabilities */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-lg">AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium text-sm">Symptom Analysis</div>
                      <div className="text-xs text-muted-foreground">
                        Analyze symptoms across multiple body systems
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-medium text-sm">Natural Language</div>
                      <div className="text-xs text-muted-foreground">
                        Understand medical terms in Indian languages
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Bot className="w-5 h-5 text-secondary" />
                    <div>
                      <div className="font-medium text-sm">Continuous Learning</div>
                      <div className="text-xs text-muted-foreground">
                        Updated with latest medical knowledge
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Illustration */}
              <Card className="medical-card overflow-hidden">
                <img
                  src={chatImage}
                  alt="AI chat interface illustration"
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Our AI assistant is trained on millions of medical cases and 
                    speaks your language fluently.
                  </p>
                </CardContent>
              </Card>

              {/* Emergency Notice */}
              <Card className="medical-card border-destructive/20 bg-destructive/5">
                <CardContent className="p-4">
                  <div className="text-sm">
                    <div className="font-medium text-destructive mb-2">
                      ⚠️ Emergency Situations
                    </div>
                    <p className="text-destructive/80">
                      For emergency situations, please call your local emergency 
                      number or visit the nearest hospital immediately.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatSection;