"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Shield, Activity } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logout as apiLogout } from "@/lib/api"

export default function AdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Utiliser le contexte d'authentification au lieu du localStorage
    const checkUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          credentials: 'include',
        })
        
        if (!response.ok) {
          router.push("/login")
          return
        }
        
        const data = await response.json()
        const userData = data.user
        
        // Vérifier que l'utilisateur a les droits d'admin
        if (!["SUPER_ADMIN", "ADMIN_HOPITAL"].includes(userData.role)) {
          router.push("/dashboard")
          return
        }
        
        setUser(userData)
      } catch (error) {
        console.error("Erreur lors de la vérification de l'utilisateur:", error)
        router.push("/login")
      }
    }
    
    checkUser()
  }, [router])

  const handleLogout = async () => {
    setLogoutError("")
    setIsLoggingOut(true)
    try {
      await apiLogout()
      router.push("/login")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Échec de la déconnexion. Veuillez réessayer."
      setLogoutError(message)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  if (!["SUPER_ADMIN", "ADMIN_HOPITAL"].includes(user.role)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>Vous n'avez pas les permissions pour accéder à cette page</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/dashboard")} className="w-full">
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {logoutError && (
          <Alert variant="destructive">
            <AlertDescription>{logoutError}</AlertDescription>
          </Alert>
        )}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administration</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">Bienvenue, {user.email}</p>
              <Badge variant={user.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin Hôpital"}
              </Badge>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" disabled={isLoggingOut}>
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Médecins en attente</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 depuis hier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+15% ce mois</p>
            </CardContent>
          </Card>

          {user.role === "SUPER_ADMIN" && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Admins Hôpital</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">3 en attente</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Actions aujourd'hui</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Validations et modifications</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {user.role === "SUPER_ADMIN" && (
            <Card>
              <CardHeader>
                <CardTitle>Actions Super Admin</CardTitle>
                <CardDescription>Gestion des administrateurs et validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => router.push("/admin/super/promote")} className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Promouvoir un médecin en admin
                </Button>
                <Button
                  onClick={() => router.push("/admin/super/validate")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Valider un admin d'hôpital
                </Button>
                <Button
                  onClick={() => router.push("/admin/super/revoke")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Révoquer un admin
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>{user.role === "SUPER_ADMIN" ? "Gestion Globale" : "Gestion Hôpital"}</CardTitle>
              <CardDescription>
                {user.role === "SUPER_ADMIN"
                  ? "Vue d'ensemble et gestion des utilisateurs"
                  : "Gestion des médecins de votre hôpital"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={() => router.push("/admin/users")} className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Gérer les utilisateurs
              </Button>
              {user.role === "ADMIN_HOPITAL" && (
                <>
                  <Button
                    onClick={() => router.push("/admin/hospital/doctors")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Valider les médecins
                  </Button>
                  <Button
                    onClick={() => router.push("/admin/hospital/manage")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Rechercher et gérer
                  </Button>
                </>
              )}
              <Button onClick={() => router.push("/admin/logs")} className="w-full justify-start" variant="outline">
                <Activity className="mr-2 h-4 w-4" />
                Consulter les logs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
