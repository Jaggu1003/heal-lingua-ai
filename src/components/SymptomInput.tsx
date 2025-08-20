import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Send, Stethoscope } from "lucide-react";

interface SymptomInputProps {
  onSubmitSymptoms: (symptoms: string) => void;
  selectedLanguage: string;
}

export default function SymptomInput({ onSubmitSymptoms, selectedLanguage }: SymptomInputProps) {
  const [symptoms, setSymptoms] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        onSubmitSymptoms(symptoms);
        setIsLoading(false);
      }, 1000);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        if (selectedLanguage === "hi") {
          setSymptoms("मुझे सिरदर्द और बुखार है। मेरा गला भी दुख रहा है।");
        } else {
          setSymptoms("I have a headache and fever. My throat is also sore.");
        }
      }, 3000);
    }
  };

  const getPlaceholder = () => {
    switch (selectedLanguage) {
      case "hi":
        return "अपने लक्षण यहाँ बताएं... जैसे: मुझे सिरदर्द है, बुखार है";
      case "ta":
        return "உங்கள் அறிகுறிகளை இங்கே விவரிக்கவும்...";
      case "bn":
        return "এখানে আপনার লক্ষণগুলি বর্ণনা করুন...";
      case "mr":
        return "तुमची लक्षणे येथे वर्णन करा...";
      default:
        return "Describe your symptoms here... e.g., I have a headache, fever, sore throat";
    }
  };

  const getTitle = () => {
    switch (selectedLanguage) {
      case "hi":
        return "अपने लक्षण बताएं";
      case "ta":
        return "உங்கள் அறிகுறிகளை விவரிக்கவும்";
      case "bn":
        return "আপনার লক্ষণ বর্ণনা করুন";
      case "mr":
        return "तुमची लक्षणे सांगा";
      default:
        return "Describe Your Symptoms";
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-healthcare-green to-healthcare-teal rounded-full flex items-center justify-center mb-4">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
            <p className="text-muted-foreground">
              Be as detailed as possible. Include when symptoms started, their severity, and any relevant details.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="min-h-32 text-lg resize-none border-2 focus:border-healthcare-teal"
                  disabled={isListening || isLoading}
                />
                {isListening && (
                  <div className="absolute inset-0 bg-healthcare-teal/5 rounded-md flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 bg-healthcare-teal rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Mic className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-healthcare-teal font-medium">Listening...</p>
                      <div className="flex gap-1 justify-center">
                        <div className="w-2 h-2 bg-healthcare-teal rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-healthcare-teal rounded-full animate-bounce delay-75"></div>
                        <div className="w-2 h-2 bg-healthcare-teal rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleListening}
                  className={`flex-1 ${
                    isListening 
                      ? "bg-healthcare-teal text-white border-healthcare-teal" 
                      : "border-healthcare-teal text-healthcare-teal hover:bg-healthcare-teal hover:text-white"
                  }`}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Voice Input
                    </>
                  )}
                </Button>
                
                <Button
                  type="submit"
                  disabled={!symptoms.trim() || isListening || isLoading}
                  className="flex-1 bg-gradient-to-r from-healthcare-teal to-healthcare-blue hover:from-healthcare-teal/90 hover:to-healthcare-blue/90"
                >
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Get Diagnosis
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-healthcare-light-green/20 rounded-lg">
              <h4 className="font-semibold text-sm mb-2 text-healthcare-green">💡 Tips for better diagnosis:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mention when symptoms started</li>
                <li>• Describe pain level (1-10 scale)</li>
                <li>• Include any triggers or patterns</li>
                <li>• Note any medications you're taking</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}