"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface SecureLayoutProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function SecureLayout({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/login" 
}: SecureLayoutProps) {
  const { user, initialLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialLoading) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
      // Rediriger vers le dashboard approprié selon le rôle
      switch (user.role) {
        case "PATIENT":
          router.push("/dashboard/patient");
          break;
        case "MEDECIN":
          router.push("/dashboard/medecin");
          break;
        case "ADMIN_HOPITAL":
          router.push("/dashboard/admin-hopital");
          break;
        case "SUPER_ADMIN":
          router.push("/dashboard/super-admin");
          break;
        default:
          router.push("/login");
      }
      return;
    }
  }, [user, initialLoading, isAuthenticated, allowedRoles, redirectTo, router]);

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}