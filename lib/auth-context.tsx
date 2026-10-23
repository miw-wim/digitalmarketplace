"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";

export type Role = "user" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  address?: {
    fullName: string;
    mobile: string;
    street: string;
    barangay: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  saveAddress: (addr: AuthUser["address"]) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
  saveAddress: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from public.profiles table
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, name, email, role, avatar, address")
      .eq("id", userId)
      .single();
    if (data) {
      setUser({ id: data.id, name: data.name, email: data.email, role: data.role, avatar: data.avatar ?? undefined, address: data.address ?? undefined });
    }
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) await fetchProfile(session.user.id);
  };

  const saveAddress = async (addr: AuthUser["address"]) => {
    if (!user) return;
    await supabase.from("profiles").update({ address: addr }).eq("id", user.id);
    setUser((prev) => prev ? { ...prev, address: addr } : prev);
  };

  useEffect(() => {
    // Check existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser, saveAddress }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
