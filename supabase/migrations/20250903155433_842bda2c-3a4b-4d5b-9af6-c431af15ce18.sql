-- Create translations table for multilingual support
CREATE TABLE public.translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key TEXT NOT NULL,
  language_code TEXT NOT NULL,
  translation_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(translation_key, language_code)
);

-- Enable Row Level Security
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to translations
CREATE POLICY "Translations are publicly readable" 
ON public.translations 
FOR SELECT 
USING (true);

-- Create policy for admin write access (you can modify this later)
CREATE POLICY "Admins can manage translations" 
ON public.translations 
FOR ALL 
USING (false); -- For now, disable write access through client

-- Add trigger for updated_at
CREATE TRIGGER update_translations_updated_at
BEFORE UPDATE ON public.translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample translations
INSERT INTO public.translations (translation_key, language_code, translation_text) VALUES
-- English translations
('welcome_message', 'en', 'Welcome to HealLingua AI'),
('get_started', 'en', 'Get Started'),
('choose_language', 'en', 'Choose Your Language'),
('describe_symptoms', 'en', 'Describe Your Symptoms'),
('start_diagnosis', 'en', 'Start AI Diagnosis'),
('chat_with_ai', 'en', 'Chat with AI Doctor'),
('get_diagnosis', 'en', 'Get Diagnosis'),
('trusted_healthcare', 'en', 'Trusted Healthcare AI'),
('accurate_diagnosis', 'en', 'Get accurate medical insights powered by advanced AI technology'),

-- Hindi translations
('welcome_message', 'hi', 'हील लिंगुआ एआई में आपका स्वागत है'),
('get_started', 'hi', 'शुरू करें'),
('choose_language', 'hi', 'अपनी भाषा चुनें'),
('describe_symptoms', 'hi', 'अपने लक्षणों का वर्णन करें'),
('start_diagnosis', 'hi', 'एआई निदान शुरू करें'),
('chat_with_ai', 'hi', 'एआई डॉक्टर से बात करें'),
('get_diagnosis', 'hi', 'निदान प्राप्त करें'),
('trusted_healthcare', 'hi', 'विश्वसनीय स्वास्थ्य सेवा एआई'),
('accurate_diagnosis', 'hi', 'उन्नत एआई तकनीक द्वारा संचालित सटीक चिकित्सा अंतर्दृष्टि प्राप्त करें'),

-- Tamil translations
('welcome_message', 'ta', 'ஹீல் லிங்குவா AI இல் உங்களை வரவேற்கிறோம்'),
('get_started', 'ta', 'தொடங்குங்கள்'),
('choose_language', 'ta', 'உங்கள் மொழியைத் தேர்ந்தெடுங்கள்'),
('describe_symptoms', 'ta', 'உங்கள் அறிகுறிகளை விவரிக்கவும்'),
('start_diagnosis', 'ta', 'AI நோய் கண்டறிதலைத் தொடங்கவும்'),
('chat_with_ai', 'ta', 'AI மருத்துவருடன் பேசுங்கள்'),
('get_diagnosis', 'ta', 'நோய் கண்டறிதலைப் பெறுங்கள்'),
('trusted_healthcare', 'ta', 'நம்பகமான சுகாதார AI'),
('accurate_diagnosis', 'ta', 'மேம்பட்ட AI தொழில்நுட்பத்தால் இயங்கும் துல்லியமான மருத்துவ நுண்ணறிவுகளைப் பெறுங்கள்'),

-- Marathi translations
('welcome_message', 'mr', 'हील लिंग्वा AI मध्ये आपले स्वागत आहे'),
('get_started', 'mr', 'सुरुवात करा'),
('choose_language', 'mr', 'तुमची भाषा निवडा'),
('describe_symptoms', 'mr', 'तुमच्या लक्षणांचे वर्णन करा'),
('start_diagnosis', 'mr', 'AI निदान सुरू करा'),
('chat_with_ai', 'mr', 'AI डॉक्टरांशी बोला'),
('get_diagnosis', 'mr', 'निदान मिळवा'),
('trusted_healthcare', 'mr', 'विश्वसनीय आरोग्यसेवा AI'),
('accurate_diagnosis', 'mr', 'प्रगत AI तंत्रज्ञानाद्वारे चालवलेली अचूक वैद्यकीय अंतर्दृष्टी मिळवा');