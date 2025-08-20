import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Send, Loader2, MessageSquare, Sparkles } from 'lucide-react';

interface SymptomInputProps {
  onSubmitSymptoms: (symptoms: string) => void;
  selectedLanguage?: { name: string; nativeName: string };
}

const SymptomInput: React.FC<SymptomInputProps> = ({ onSubmitSymptoms, selectedLanguage }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setSymptoms(prev => prev + (prev ? ' ' : '') + 
          'मुझे सिरदर्द और बुखार है, और गले में खराश भी है।');
      }, 3000);
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = async () => {
    if (!symptoms.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSubmitSymptoms(symptoms);
    setIsProcessing(false);
  };

  const suggestedSymptoms = [
    { en: 'Headache and fever', hi: 'सिरदर्द और बुखार' },
    { en: 'Stomach pain', hi: 'पेट में दर्द' },
    { en: 'Cough and cold', hi: 'खांसी और जुकाम' },
    { en: 'Body aches', hi: 'शरीर में दर्द' },
    { en: 'Chest pain', hi: 'सीने में दर्द' },
    { en: 'Difficulty breathing', hi: 'सांस लेने में तकलीफ' }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h2 className="text-medical-heading">Describe Your Symptoms</h2>
            </div>
            <p className="text-medical-subheading">
              Tell us how you're feeling in your own words. Our AI understands natural language
              {selectedLanguage && (
                <span className="block mt-2">
                  Currently set to: <Badge variant="secondary" className="ml-2">
                    {selectedLanguage.nativeName} ({selectedLanguage.name})
                  </Badge>
                </span>
              )}
            </p>
          </div>

          {/* Main Input Card */}
          <Card className="medical-card-elevated mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>AI Symptom Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Textarea */}
              <div className="relative">
                <Textarea
                  placeholder={selectedLanguage?.name === 'Hindi' 
                    ? 'अपने लक्षणों का वर्णन करें... जैसे "मुझे सिरदर्द है और बुखार भी है"'
                    : 'Describe your symptoms... e.g., "I have a headache and fever"'
                  }
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="medical-input min-h-[120px] text-base resize-none pr-16"
                  disabled={isProcessing}
                />
                
                {/* Character count */}
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {symptoms.length}/500
                </div>
              </div>

              {/* Voice Input & Submit */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handleVoiceInput}
                  disabled={isProcessing}
                  className={`medical-card ${isListening ? 'pulse-medical border-primary text-primary' : ''}`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Voice Input
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={!symptoms.trim() || isProcessing}
                  className="btn-medical-primary px-8"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Analyze Symptoms
                    </>
                  )}
                </Button>
              </div>

              {/* Voice Status */}
              {isListening && (
                <div className="flex items-center justify-center space-x-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-sm text-primary font-medium">
                    Listening... Speak clearly in {selectedLanguage?.name || 'your preferred language'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Suggestions */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="text-lg">Common Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {suggestedSymptoms.map((symptom, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setSymptoms(selectedLanguage?.name === 'Hindi' ? symptom.hi : symptom.en)}
                    disabled={isProcessing}
                    className="medical-card hover:bg-card-hover text-left h-auto p-3 justify-start"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {selectedLanguage?.name === 'Hindi' ? symptom.hi : symptom.en}
                      </div>
                      {selectedLanguage?.name === 'Hindi' && (
                        <div className="text-xs text-muted-foreground">
                          {symptom.en}
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Note */}
          <div className="text-center mt-8">
            <p className="text-medical-caption flex items-center justify-center space-x-2">
              <span>🔒</span>
              <span>Your symptoms are processed securely and never stored permanently</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymptomInput;