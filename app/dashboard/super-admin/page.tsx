"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Settings, 
  Shield, 
  Search, 
  Crown,
  Database,
  LogOut
} from "lucide-react"
import { 
  logout as apiLogout,
  getMedecins,
  searchMedecins,
  getUtilisateurs,
  getLogs
} from "@/lib/api"

export default function SuperAdminDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // États pour les données
  const [medecins, setMedecins] = useState<any[]>([])
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Charger les données au montage du composant
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      // Charger les médecins
      await handleGetMedecins()
      // Charger les utilisateurs
      await handleGetUtilisateurs()
      // Charger les logs
      await handleGetLogs()
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await apiLogout()
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setError("Échec de la déconnexion. Veuillez réessayer.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Route: GET /admin/medecins
  const handleGetMedecins = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await getMedecins()
      setMedecins((response as any)?.medecins || [])
      setSuccess(`Liste des médecins récupérée: ${(response as any)?.medecins?.length || 0} médecins`)
    } catch (err: any) {
      const message = err?.message || "Échec de la récupération des médecins"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Route: GET /admin/medecins/search
  const handleSearchMedecins = async () => {
    if (!searchTerm.trim()) return
    
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await searchMedecins({ q: searchTerm })
      setSuccess(`Recherche terminée: ${(response as any)?.length || 0} résultats`)
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de la recherche"
      setError(message)
      setIsLoading(false)
    }
  }

  // Route: GET /admin/utilisateurs
  const handleGetUtilisateurs = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await getUtilisateurs()
      setUtilisateurs((response as any)?.utilisateurs || [])
      setSuccess(`Liste des utilisateurs récupérée: ${(response as any)?.utilisateurs?.length || 0} utilisateurs`)
    } catch (err: any) {
      const message = err?.message || "Échec de la récupération des utilisateurs"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Route: GET /admin/logs
  const handleGetLogs = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await getLogs()
      setLogs((response as any)?.logs || [])
      setSuccess(`Logs récupérés: ${(response as any)?.logs?.length || 0} entrées`)
    } catch (err: any) {
      const message = err?.message || "Échec de la récupération des logs"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "Validé":
      case "Actif":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "Inactif":
        return <Badge className="bg-red-100 text-red-800">Inactif</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/healthsafe-logo.png"
                alt="HealthSafe Logo"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold text-gray-900">HealthSafe - Super Admin</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.prenom} {user?.nom} - Super Administrateur
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profil Super Admin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>Mon Profil</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nom complet</Label>
                  <p className="text-gray-900">{user?.prenom} {user?.nom}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Rôle</Label>
                  <p className="text-gray-900">Super Administrateur</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions Rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Actions Rapides</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleGetMedecins} 
                  className="w-full"
                  disabled={isLoading}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Liste médecins
                </Button>

                <Button 
                  onClick={handleGetUtilisateurs} 
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Liste utilisateurs
                </Button>

                <Button 
                  onClick={handleGetLogs} 
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Voir les logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contenu Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Médecins</p>
                      <p className="text-2xl font-bold text-gray-900">{medecins.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Users className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
                      <p className="text-2xl font-bold text-gray-900">{utilisateurs.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Shield className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Hôpitaux</p>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Database className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Logs Système</p>
                      <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recherche Médecins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Rechercher des Médecins</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Input
                    placeholder="Rechercher par nom, spécialité..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearchMedecins} disabled={isLoading || !searchTerm.trim()}>
                    {isLoading ? "Recherche..." : "Rechercher"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Médecins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Gestion des Médecins</span>
                </CardTitle>
                <CardDescription>
                  Gérez tous les médecins du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Spécialité</TableHead>
                      <TableHead>Hôpital</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medecins.map((medecin) => (
                      <TableRow key={medecin.id}>
                        <TableCell className="font-medium">{medecin.prenom} {medecin.nom}</TableCell>
                        <TableCell>{medecin.email}</TableCell>
                        <TableCell>{medecin.specialite}</TableCell>
                        <TableCell>{medecin.hopital}</TableCell>
                        <TableCell>{getStatusBadge(medecin.statut)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Utilisateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Gestion des Utilisateurs</span>
                </CardTitle>
                <CardDescription>
                  Gérez tous les utilisateurs du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilisateurs.map((utilisateur) => (
                      <TableRow key={utilisateur.id}>
                        <TableCell className="font-medium">{utilisateur.prenom} {utilisateur.nom}</TableCell>
                        <TableCell>{utilisateur.email}</TableCell>
                        <TableCell>{utilisateur.role}</TableCell>
                        <TableCell>{getStatusBadge(utilisateur.statut)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Logs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Logs Système</span>
                </CardTitle>
                <CardDescription>
                  Historique complet des actions du système
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.action}</TableCell>
                        <TableCell>{log.utilisateur}</TableCell>
                        <TableCell>{log.date}</TableCell>
                        <TableCell>{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
