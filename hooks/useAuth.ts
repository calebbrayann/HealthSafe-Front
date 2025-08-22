"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setLoading(true);
      const userData = await getMe();
      console.log("✅ HealthSafe AuthProvider version — Libreville 12:45 PM");
      console.log("Active session:", userData);
      setUser(userData as User);
    } catch (error) {
      console.log("❌ Invalid session, redirecting to /");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/");
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    refreshUser,
  };

  console.log("🟢 useAuth.ts updated — commit Libreville 12:45 PM");

  return (
    <AuthContext.Provider value={value}>
      {children}
      </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
