"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Ne rien faire tant que la vérification n'est pas terminée
    if (loading) return;

    // Si pas d'utilisateur, rediriger vers /
    if (!user) {
      console.log("Utilisateur non authentifié, redirection vers /");
      router.push("/");
      return;
    }

    // Éviter les redirections multiples
    if (hasRedirected) return;

    // Attendre que user.role soit bien défini
    if (!user.role) {
      console.log("Rôle utilisateur non défini, attente...");
      return;
    }

    const dashboardRoutes: Record<string, string> = {
      SUPER_ADMIN: "/dashboard/super-admin",
      MEDECIN: "/dashboard/medecin",
      PATIENT: "/dashboard/patient",
      ADMIN_HOPITAL: "/dashboard/admin-hopital",
    };

    const targetRoute = dashboardRoutes[user.role];
    const currentPath = window.location.pathname;

    console.log("Vérification redirection:", {
      currentPath,
      userRole: user.role,
      targetRoute,
      hasRedirected
    });

    // Rediriger uniquement si on n'est pas déjà sur la bonne route
    if (targetRoute && currentPath !== targetRoute) {
      console.log(`Redirection nécessaire de ${currentPath} vers ${targetRoute}`);
      setHasRedirected(true);
      router.push(targetRoute);
    } else if (!targetRoute) {
      console.log("Rôle inconnu, redirection vers /");
      setHasRedirected(true);
      router.push("/");
    }
  }, [user, loading, router, hasRedirected]);

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

  // Si pas d'utilisateur ou redirection en cours, ne rien afficher
  if (!user || (user.role && !hasRedirected && window.location.pathname !== `/dashboard/${user.role.toLowerCase().replace('_', '-')}`)) {
    return null;
  }

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