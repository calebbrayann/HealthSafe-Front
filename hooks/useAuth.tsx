"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- getMe avec refresh automatique ---
async function getMe(): Promise<User> {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include", // indispensable pour envoyer les cookies
  });

  if (res.status === 401) {
    // accessToken expiré, tenter refresh
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) throw new Error("Utilisateur non authentifié");

    // retenter /me avec accessToken régénéré
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Utilisateur non authentifié");
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

// --- AuthProvider ---
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Erreur logout:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  const refreshUser = async (): Promise<User | null> => {
    return await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// --- Hook pour utiliser le contexte ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
