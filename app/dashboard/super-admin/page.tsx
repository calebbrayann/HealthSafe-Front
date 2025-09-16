"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Activity, LogOut, Shield, Crown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logout as apiLogout, getUtilisateurs, getLogs } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import SecureLayout from "@/components/SecureLayout"

export default function SuperAdminDashboardPage() {
  const { user } = useAuth()
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Charger tous les utilisateurs
      const utilisateursResponse = await getUtilisateurs()
      setUtilisateurs((utilisateursResponse as any) || [])
      
      // Charger les logs
      const logsResponse = await getLogs()
      setLogs((logsResponse as any) || [])
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des données")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setLogoutError("")
    setIsLoggingOut(true)
    try {
      await apiLogout()
      router.push("/login")
    } catch (err: any) {
      setLogoutError(err?.message || "Erreur lors de la déconnexion")
      setIsLoggingOut(false)
    }
  }

  const getStatsByRole = () => {
    const stats = {
      patients: 0,
      medecins: 0,
      adminHopital: 0,
      superAdmin: 0,
      total: utilisateurs.length
    }
    
    utilisateurs.forEach(user => {
      switch (user.role) {
        case "PATIENT":
          stats.patients++
          break
        case "MEDECIN":
          stats.medecins++
          break
        case "ADMIN_HOPITAL":
          stats.adminHopital++
          break
        case "SUPER_ADMIN":
          stats.superAdmin++
          break
      }
    })
    
    return stats
  }

  const stats = getStatsByRole()

  return (
    <SecureLayout allowedRoles={["SUPER_ADMIN"]}>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {logoutError && (
            <Alert variant="destructive">
              <AlertDescription>{logoutError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Super Administration</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">Bienvenue, {user?.firstName} {user?.lastName}</p>
                <Badge variant="default">
                  <Crown className="mr-1 h-3 w-3" />
                  Super Admin
                </Badge>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  Tous rôles confondus
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.patients}</div>
                <p className="text-xs text-muted-foreground">
                  Patients enregistrés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Médecins</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.medecins}</div>
                <p className="text-xs text-muted-foreground">
                  Médecins actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Admins Hôpital</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.adminHopital}</div>
                <p className="text-xs text-muted-foreground">
                  Administrateurs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Logs Système</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{logs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Entrées de log
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Actions Super Admin</CardTitle>
                <CardDescription>Gestion des administrateurs et validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push("/admin/super/promote")} 
                  className="w-full justify-start"
                >
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

            <Card>
              <CardHeader>
                <CardTitle>Gestion Globale</CardTitle>
                <CardDescription>Vue d'ensemble et gestion des utilisateurs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push("/admin/users")} 
                  className="w-full justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Gérer les utilisateurs
                </Button>
                <Button 
                  onClick={() => router.push("/admin/logs")} 
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Activity className="mr-2 h-4 w-4" />
                  Consulter les logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Liste des Utilisateurs */}
          {utilisateurs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tous les Utilisateurs</CardTitle>
                <CardDescription>
                  Vue d'ensemble de tous les utilisateurs du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {utilisateurs.slice(0, 10).map((utilisateur, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {utilisateur.prenom} {utilisateur.nom}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {utilisateur.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {utilisateur.id}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge variant={
                            utilisateur.role === "SUPER_ADMIN" ? "default" :
                            utilisateur.role === "ADMIN_HOPITAL" ? "secondary" :
                            utilisateur.role === "MEDECIN" ? "outline" : "destructive"
                          }>
                            {utilisateur.role}
                          </Badge>
                          <Badge variant={utilisateur.actif ? "default" : "secondary"}>
                            {utilisateur.actif ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {utilisateurs.length > 10 && (
                    <div className="text-center">
                      <Button 
                        onClick={() => router.push("/admin/users")}
                        variant="outline"
                      >
                        Voir tous les utilisateurs ({utilisateurs.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SecureLayout>
  )
}