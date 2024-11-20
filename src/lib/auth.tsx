import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import { User, JobSeekerProfile, EmployerProfile } from '../types/database';

interface AuthState {
  user: SupabaseUser | null;
  profile: (JobSeekerProfile | EmployerProfile) | null;
  userDetails: User | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userType: 'employer' | 'jobseeker') => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    userDetails: null,
    loading: true,
  });

  // Fetch user profile data
  const fetchUserData = async (userId: string) => {
    // First get user details
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userDetails) return;

    // Then get profile based on user type
    const profileTable = userDetails.user_type === 'employer' ? 'employer_profiles' : 'jobseeker_profiles';
    const { data: profile } = await supabase
      .from(profileTable)
      .select('*')
      .eq('id', userId)
      .single();

    setState(prev => ({
      ...prev,
      userDetails,
      profile,
    }));
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setState(prev => ({ ...prev, user: session?.user ?? null }));
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    getInitialSession();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState(prev => ({ ...prev, user: session?.user ?? null }));
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setState(prev => ({ ...prev, profile: null, userDetails: null }));
      }
      setState(prev => ({ ...prev, loading: false }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, userType: 'employer' | 'jobseeker') => {
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    
    if (data.user) {
      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert([{ 
          id: data.user.id,
          email,
          user_type: userType,
        }]);
      
      if (userError) throw userError;

      // Create profile record
      const profileTable = userType === 'employer' ? 'employer_profiles' : 'jobseeker_profiles';
      const { error: profileError } = await supabase
        .from(profileTable)
        .insert([{ id: data.user.id }]);
      
      if (profileError) throw profileError;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (state.user) {
      await fetchUserData(state.user.id);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 