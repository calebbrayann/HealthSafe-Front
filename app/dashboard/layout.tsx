"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User as UserIcon } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Ne rien faire tant que la vérification n'est pas terminée

    if (!user) {
      console.log("Utilisateur non authentifié, redirection vers /");
      router.push("/"); // Redirection générale si pas connecté
      return;
    }

    const dashboardRoutes: Record<string, string> = {
      SUPER_ADMIN: "/dashboard/super-admin",
      MEDECIN: "/dashboard/medecin",
      PATIENT: "/dashboard/patient",
      ADMIN_HOPITAL: "/dashboard/admin-hopital",
    };

    const targetRoute = dashboardRoutes[user.role];

    // Si rôle inconnu ou route différente de l'actuelle, rediriger
    if (!targetRoute || window.location.pathname !== targetRoute) {
      router.push(targetRoute || "/");
    }
  }, [user, loading, router]);

  // Loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Tant que l'utilisateur n'est pas chargé ou redirigé
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bannière utilisateur */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <UserIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.firstName || ""} {user.lastName || ""}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role ? user.role.toLowerCase().replace("_", " ") : "Chargement..."}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400">ID: {user.id}</div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
