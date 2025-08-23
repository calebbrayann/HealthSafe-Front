"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import React from "react";

// --- Types ---
export interface User {
  id: string;
  email?: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// --- Context ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Fonction pour appeler /me ---
async function getMe(): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include", // envoie le cookie token httpOnly
  });

  if (!res.ok) {
    throw new Error("Impossible de récupérer l'utilisateur");
  }

  const data = await res.json();

  // Mapping pour correspondre au type User
  return {
    id: data.userId,
    role: data.role,
    email: data.email ?? "",
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
  };
}

// --- Provider ---
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    setLoading(true);
    try {
      const me = await getMe();
      setUser(me);

      // Stocker dans localStorage pour persistance (optionnel)
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(me));
      }
    } catch (err) {
      console.error("Erreur checkAuth:", err);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    router.push("/");
  };

  // Refresh user info
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook ---
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
