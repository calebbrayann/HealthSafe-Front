"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  initialLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPatient: boolean;
  isMedecin: boolean;
  isAdminHopital: boolean;
  isSuperAdmin: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

// --- Contexte ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- getMe avec refresh automatique ---
async function getMe(): Promise<User> {
  let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok && res.status !== 401) {
    throw new Error(`Erreur serveur: ${res.status}`);
  }

  if (res.status === 401) {
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) throw new Error("Utilisateur non authentifié");

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

// --- Provider ---
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async (): Promise<User | null> => {
    setLoading(true);
    try {
      const me = await getMe();
      setUser(me);
      return me;
    } catch {
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
    checkAuth().finally(() => setInitialLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        initialLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isPatient: user?.role === "PATIENT",
        isMedecin: user?.role === "MEDECIN",
        isAdminHopital: user?.role === "ADMIN_HOPITAL",
        isSuperAdmin: user?.role === "SUPER_ADMIN",
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// --- Hook ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
