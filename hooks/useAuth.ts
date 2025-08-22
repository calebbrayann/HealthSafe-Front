"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
  nom?: string;
  prenom?: string;
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
      console.log("✅ Version HealthSafe AuthProvider — 22 août 2025 — Libreville 12h30");
      console.log("Session active :", userData);
      setUser(userData as User);
    } catch (error) {
      console.log("❌ Session invalide, redirection vers /");
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

  // 🟢 Indicateur de version ajouté pour forcer Git à détecter le changement
  console.log("🟢 useAuth.ts modifié — commit Libreville 12h30");

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
