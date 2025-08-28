import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserHeaderProps {
  user: SupabaseUser;
}

export default function UserHeader({ user }: UserHeaderProps) {
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          variant: "destructive",
          title: "Logout Failed",
          description: error.message,
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been signed out of your account.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Error",
        description: "An unexpected error occurred during logout.",
      });
    }
  };

  return (
    <header className="bg-card border-b border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-healthcare-teal to-healthcare-blue rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Welcome back!</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}