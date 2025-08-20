import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "How It Works", href: "#" },
    { name: "Languages", href: "#" },
    { name: "Contact", href: "#" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Medical Disclaimer", href: "#" },
    { name: "Data Protection", href: "#" },
    { name: "Cookie Policy", href: "#" }
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "ta", name: "தமிழ்" },
    { code: "te", name: "తెలుగు" },
    { code: "bn", name: "বাংলা" },
    { code: "mr", name: "मराठी" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="h-5 w-5" />, href: "#" },
    { name: "Twitter", icon: <Twitter className="h-5 w-5" />, href: "#" },
    { name: "Instagram", icon: <Instagram className="h-5 w-5" />, href: "#" },
    { name: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, href: "#" },
    { name: "YouTube", icon: <Youtube className="h-5 w-5" />, href: "#" }
  ];

  return (
    <footer className="bg-card border-t">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-healthcare-teal to-healthcare-blue rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-healthcare-teal to-healthcare-blue bg-clip-text text-transparent">
                HealLingua AI
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Empowering healthcare accessibility through AI-powered diagnosis in multiple Indian languages. 
              Your health, understood in your language.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="outline"
                  size="icon"
                  className="hover:bg-healthcare-teal hover:text-white hover:border-healthcare-teal transition-colors"
                >
                  {social.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-healthcare-teal transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal & Support</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-healthcare-teal transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Languages */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">support@heallingua.ai</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+91 1800-123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Mumbai, India</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language Support
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="text-xs text-muted-foreground hover:text-healthcare-teal transition-colors text-left"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 HealLingua AI. All rights reserved. Made with ❤️ for better healthcare accessibility.
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>🔒 HIPAA Compliant</span>
            <span>🛡️ ISO 27001</span>
            <span>✅ GDPR Ready</span>
          </div>
        </div>

        {/* Final Disclaimer */}
        <div className="mt-8 p-4 bg-healthcare-light-blue/20 rounded-lg border border-healthcare-blue/20">
          <p className="text-xs text-center text-muted-foreground leading-relaxed">
            <strong>Medical Disclaimer:</strong> HealLingua AI provides health information for educational purposes only. 
            This is not intended as medical advice. Always consult with qualified healthcare professionals for medical concerns. 
            In emergencies, contact local emergency services immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}