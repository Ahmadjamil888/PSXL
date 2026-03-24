import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  plan_type: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data as UserProfile;
  };

  // Fetch avatar from OAuth provider if available
  const getAvatarUrl = (user: User): string | null => {
    // Try to get avatar from user_metadata (Google OAuth provides this)
    const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    return avatar || null;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch profile from database
        const profileData = await fetchProfile(currentUser.id);
        
        // If profile exists but no avatar, check OAuth metadata
        if (profileData && !profileData.avatar_url) {
          const oauthAvatar = getAvatarUrl(currentUser);
          if (oauthAvatar) {
            // Update profile with OAuth avatar
            await supabase
              .from("profiles")
              .update({ avatar_url: oauthAvatar })
              .eq("user_id", currentUser.id);
            profileData.avatar_url = oauthAvatar;
          }
        }
        
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id);
        
        if (profileData && !profileData.avatar_url) {
          const oauthAvatar = getAvatarUrl(currentUser);
          if (oauthAvatar) {
            await supabase
              .from("profiles")
              .update({ avatar_url: oauthAvatar })
              .eq("user_id", currentUser.id);
            profileData.avatar_url = oauthAvatar;
          }
        }
        
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error("Not authenticated") };
    
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);
    
    if (!error) {
      // Refresh profile data
      const updatedProfile = await fetchProfile(user.id);
      setProfile(updatedProfile);
    }
    
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signUp, signIn, signInWithGoogle, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
