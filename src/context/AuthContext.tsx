
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

      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role: 'seller' });
      
      if (error) {
        if (error.code === '23505') {
          toast({
            title: "You're already a seller",
            description: "Your account already has seller privileges.",
          });
        } else {
          toast({
            title: "Error becoming a seller",
            description: error.message,
            variant: "destructive",
          });
          console.error(error);
        }
      } else {
        toast({
          title: "Congratulations!",
          description: "You're now a seller on DataHubX.",
        });
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
