"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialProfile?: Profile | null;
}

export function AuthProvider({
  children,
  initialUser = null,
  initialProfile = null,
}: AuthProviderProps) {
  const supabase = useMemo(() => createClient(), []);

  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [profile, setProfile] = useState<Profile | null>(
    initialProfile ?? null,
  );
  const [loading, setLoading] = useState(!initialUser); // Only loading if we didn't get initial state

  async function loadProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Profile error:", error);
      return null;
    }

    return data;
  }

  useEffect(() => {
    let mounted = true;

    // Only initialize if we don't have initial state already
    if (!initialUser) {
      async function initialize() {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(user);

        if (user) {
          const profile = await loadProfile(user.id);

          if (!mounted) return;

          setProfile(profile);
        } else {
          setProfile(null);
        }

        setLoading(false);
      }

      initialize();
    } else {
      // We have initial state, so we're not loading anymore
      setLoading(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setLoading(true);

      setUser(session?.user ?? null);

      if (session?.user) {
        const profile = await loadProfile(session.user.id);

        if (!mounted) return;

        setProfile(profile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, initialUser]);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
