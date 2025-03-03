
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  becomeSeller: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Set up auth change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Error signing in",
          description: error.message,
          variant: "destructive",
        });
        console.error(error);
      } else {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      }
    } catch (error) {
      console.error("Error in sign in:", error);
      toast({
        title: "Error signing in",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) {
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        console.error(error);
      } else {
        toast({
          title: "Account created!",
          description: "Check your email to confirm your account.",
        });
      }
    } catch (error) {
      console.error("Error in sign up:", error);
      toast({
        title: "Error signing up",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        console.error(error);
      } else {
        toast({
          title: "Signed out",
          description: "You've been signed out successfully.",
        });
      }
    } catch (error) {
      console.error("Error in sign out:", error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const becomeSeller = async () => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You need to be signed in to become a seller.",
          variant: "destructive",
        });
        return;
      }

      // First, check if the user already has a seller role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'seller');

      if (checkError) {
        console.error("Error checking seller role:", checkError);
        toast({
          title: "Error",
          description: "Could not check your current roles. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // If user already has seller role, just inform them
      if (existingRole && existingRole.length > 0) {
        toast({
          title: "You're already a seller",
          description: "Your account already has seller privileges.",
        });
        return;
      }

      // Use supabase serverless function to create the seller role
      // This bypasses RLS issues by running with elevated privileges
      const { data, error } = await supabase.functions.invoke('assign-seller-role', {
        body: { user_id: user.id }
      });
      
      if (error) {
        console.error("Error becoming seller:", error);
        toast({
          title: "Error becoming a seller",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Congratulations!",
          description: "You're now a seller on DataHubX.",
        });
        
        // Optionally refresh the session to update any claims if needed
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
        }
      }
    } catch (error) {
      console.error("Error becoming seller:", error);
      toast({
        title: "Error becoming a seller",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut, becomeSeller }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
