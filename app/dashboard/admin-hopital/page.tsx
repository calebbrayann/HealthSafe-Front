"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Activity, LogOut, Shield } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logout as apiLogout, getMedecins, getUtilisateurs } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import SecureLayout from "@/components/SecureLayout"

export default function AdminHopitalDashboardPage() {
  const { user } = useAuth()
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [medecins, setMedecins] = useState<any[]>([])
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Charger les médecins de l'hôpital
      const medecinsResponse = await getMedecins()
      setMedecins((medecinsResponse as any)?.medecins || [])
      
      // Charger les utilisateurs
      const utilisateursResponse = await getUtilisateurs()
      setUtilisateurs((utilisateursResponse as any) || [])
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

  return (
    <SecureLayout allowedRoles={["ADMIN_HOPITAL"]}>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {logoutError && (
            <Alert variant="destructive">
              <AlertDescription>{logoutError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Administration Hôpital</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground">Bienvenue, {user?.firstName} {user?.lastName}</p>
                <Badge variant="secondary">Admin Hôpital</Badge>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
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
                <div className="text-2xl font-bold">
                  {medecins.filter(m => !m.verifie).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  En attente de validation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Médecins validés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {medecins.filter(m => m.verifie).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Médecins actifs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{utilisateurs.length}</div>
                <p className="text-xs text-muted-foreground">
                  Tous rôles confondus
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hôpital</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{user?.hopital || "Non défini"}</div>
                <p className="text-xs text-muted-foreground">
                  Votre établissement
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Médecins</CardTitle>
                <CardDescription>Validez et gérez les médecins de votre hôpital</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push("/admin/hospital/doctors")} 
                  className="w-full justify-start"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Valider les médecins
                </Button>
                <Button
                  onClick={() => router.push("/admin/hospital/manage")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Rechercher et gérer
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

          {/* Liste des Médecins */}
          {medecins.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Médecins de l'Hôpital</CardTitle>
                <CardDescription>
                  Liste des médecins de {user?.hopital || "votre hôpital"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medecins.map((medecin, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            Dr. {medecin.prenom} {medecin.nom}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {medecin.specialite} - {medecin.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Licence: {medecin.numeroLicence}
                          </p>
                        </div>
                        <Badge variant={medecin.verifie ? "default" : "secondary"}>
                          {medecin.verifie ? "Validé" : "En attente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SecureLayout>
  )
}