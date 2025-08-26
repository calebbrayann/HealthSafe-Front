"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SecureLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, initialLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [initialLoading, isAuthenticated]);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-green-500 text-lg font-semibold">Chargement de la session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
