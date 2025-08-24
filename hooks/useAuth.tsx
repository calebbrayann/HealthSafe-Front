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

// --- Fonction pour appeler /auth/me ---
async function getMe(): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include", // envoie le cookie httpOnly
  });

  if (!res.ok) {
    throw new Error("Impossible de récupérer l'utilisateur");
  }

  const data = await res.json();

  return {
    id: data.user.id,
    role: data.user.role,
    email: data.user.email ?? "",
    firstName: data.user.firstName ?? "",
    lastName: data.user.lastName ?? "",
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
    } catch (err) {
      console.error("Erreur checkAuth:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // supprime le cookie côté serveur
      });
    } catch (err) {
      console.error("Erreur logout:", err);
    } finally {
      setUser(null);
      router.push("/"); // redirection après logout
    }
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook ---
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
