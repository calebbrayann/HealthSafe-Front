"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cleanupClientAuth, logoutWithRetry } from "@/lib/logout-utils";

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
  try {
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
  } catch (error) {
    console.error("Erreur getMe:", error);
    throw error;
  }
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
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const logoutFunction = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      return response;
    };

    try {
      // Utiliser la fonction de déconnexion avec retry et fallback
      const result = await logoutWithRetry(logoutFunction, 3, 1000);
      
      if (result.fallback) {
        console.warn("Déconnexion effectuée via fallback côté client");
      }
    } catch (err) {
      console.error("Erreur critique lors de la déconnexion:", err);
    } finally {
      // Nettoyage côté client systématique
      cleanupClientAuth();
      
      // Mise à jour de l'état local
      setUser(null);
      
      // Redirection vers la page de connexion
      if (typeof window !== 'undefined') {
        router.push("/login");
      }
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
