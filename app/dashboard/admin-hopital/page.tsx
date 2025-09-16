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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Settings, 
  UserCheck, 
  UserX, 
  Shield, 
  Search, 
  Plus, 
  Trash2, 
  RefreshCw, 
  FileText,
  Building,
  CheckCircle,
  XCircle
} from "lucide-react"
import { 
  logout as apiLogout,
  promouvoirMedecinEnAdmin,
  validerAdminHopital,
  revoquerAdmin,
  validerMedecin,
  getMedecins,
  searchMedecins,
  supprimerMedecin,
  getUtilisateurs,
  reactiverUtilisateur,
  getLogs
} from "@/lib/api"

export default function AdminHopitalDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  // États pour les modals
  const [showPromouvoirMedecin, setShowPromouvoirMedecin] = useState(false)
  const [showValiderAdmin, setShowValiderAdmin] = useState(false)
  const [showRevoquerAdmin, setShowRevoquerAdmin] = useState(false)
  const [showValiderMedecin, setShowValiderMedecin] = useState(false)
  const [showSupprimerMedecin, setShowSupprimerMedecin] = useState(false)

  // États pour les formulaires
  const [promotionData, setPromotionData] = useState({
    medecinId: "",
    hopital: "",
    raison: "",
  })

  const [validationAdminData, setValidationAdminData] = useState({
    adminId: "",
    statut: "APPROUVER",
    commentaire: "",
  })

  const [revocationData, setRevocationData] = useState({
    adminId: "",
    raison: "",
  })

  const [validationMedecinData, setValidationMedecinData] = useState({
    medecinId: "",
    statut: "APPROUVER",
    commentaire: "",
  })

  const [suppressionData, setSuppressionData] = useState({
    medecinId: "",
    raison: "",
  })

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
    setLogoutError("")
    try {
      await apiLogout()
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      setLogoutError("Échec de la déconnexion. Veuillez réessayer.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Route: POST /admin/promouvoir-medecin
  const handlePromouvoirMedecin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await promouvoirMedecinEnAdmin(promotionData)
      setSuccess((response as any)?.message || "Médecin promu avec succès")
      setShowPromouvoirMedecin(false)
      setPromotionData({ medecinId: "", hopital: "", raison: "" })
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de la promotion"
      setError(message)
      setIsLoading(false)
    }
  }

  // Route: POST /admin/valider-admin
  const handleValiderAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await validerAdminHopital(validationAdminData)
      setSuccess((response as any)?.message || "Admin validé avec succès")
      setShowValiderAdmin(false)
      setValidationAdminData({ adminId: "", statut: "APPROUVER", commentaire: "" })
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de la validation"
      setError(message)
      setIsLoading(false)
    }
  }

  // Route: DELETE /admin/admin-hopital
  const handleRevoquerAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await revoquerAdmin(revocationData)
      setSuccess((response as any)?.message || "Admin révoqué avec succès")
      setShowRevoquerAdmin(false)
      setRevocationData({ adminId: "", raison: "" })
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de la révocation"
      setError(message)
      setIsLoading(false)
    }
  }

  // Route: POST /admin/valider-medecin
  const handleValiderMedecin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await validerMedecin(validationMedecinData)
      setSuccess((response as any)?.message || "Médecin validé avec succès")
      setShowValiderMedecin(false)
      setValidationMedecinData({ medecinId: "", statut: "APPROUVER", commentaire: "" })
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de la validation"
      setError(message)
      setIsLoading(false)
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

  // Route: DELETE /admin/medecins
  const handleSupprimerMedecin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await supprimerMedecin(suppressionData)
      setSuccess((response as any)?.message || "Médecin supprimé avec succès")
      setShowSupprimerMedecin(false)
      setSuppressionData({ medecinId: "", raison: "" })
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de la suppression"
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

  // Route: PUT /admin/utilisateurs/:id/reactiver
  const handleReactiverUtilisateur = async (userId: string) => {
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const response = await reactiverUtilisateur(userId)
      setSuccess((response as any)?.message || "Utilisateur réactivé avec succès")
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de la réactivation"
      setError(message)
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
      case "APPROUVER":
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>
      case "En attente":
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
      case "Inactif":
      case "REJETER":
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
              <span className="text-xl font-semibold text-gray-900">HealthSafe - Admin Hôpital</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.prenom} {user?.nom} - {user?.hopital}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                disabled={isLoggingOut}
              >
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
            {/* Profil Admin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
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
                  <Label className="text-sm font-medium text-gray-600">Hôpital</Label>
                  <p className="text-gray-900">{user?.hopital}</p>
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
                  onClick={() => setShowPromouvoirMedecin(true)} 
                  className="w-full"
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Promouvoir médecin
                </Button>
                
                <Button 
                  onClick={() => setShowValiderMedecin(true)} 
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Valider médecin
                </Button>

                <Button 
                  onClick={handleGetMedecins} 
                  variant="outline"
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
                  <FileText className="h-4 w-4 mr-2" />
                  Voir les logs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contenu Principal */}
          <div className="lg:col-span-3 space-y-6">
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
                  Gérez les médecins de votre hôpital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Spécialité</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medecins.map((medecin) => (
                      <TableRow key={medecin.id}>
                        <TableCell className="font-medium">{medecin.prenom} {medecin.nom}</TableCell>
                        <TableCell>{medecin.email}</TableCell>
                        <TableCell>{medecin.specialite}</TableCell>
                        <TableCell>{getStatusBadge(medecin.statut)}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setValidationMedecinData({ ...validationMedecinData, medecinId: medecin.id })
                              setShowValiderMedecin(true)
                            }}
                            disabled={isLoading}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSuppressionData({ ...suppressionData, medecinId: medecin.id })
                              setShowSupprimerMedecin(true)
                            }}
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </TableCell>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utilisateurs.map((utilisateur) => (
                      <TableRow key={utilisateur.id}>
                        <TableCell className="font-medium">{utilisateur.prenom} {utilisateur.nom}</TableCell>
                        <TableCell>{utilisateur.email}</TableCell>
                        <TableCell>{utilisateur.role}</TableCell>
                        <TableCell>{getStatusBadge(utilisateur.statut)}</TableCell>
                        <TableCell>
                          {utilisateur.statut === "Inactif" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReactiverUtilisateur(utilisateur.id)}
                              disabled={isLoading}
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Réactiver
                            </Button>
                          )}
                        </TableCell>
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
                  <FileText className="h-5 w-5" />
                  <span>Logs Système</span>
                </CardTitle>
                <CardDescription>
                  Historique des actions du système
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

      {/* Modals seront ajoutés ici */}
    </div>
  )
}
