"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  FileText, 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Upload, 
  LogOut,
  UserCheck,
  UserX,
  Clock,
  Shield
} from "lucide-react"
import { 
  logout as apiLogout,
  createDossier,
  getDossier,
  updateDossier,
  getDossierHistorique,
  autoriserMedecin,
  uploadFichier,
  demanderAcces,
  repondreDemande,
  revoquerAcces,
  listeAcces
} from "@/lib/api"

export default function MedecinDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dossiers, setDossiers] = useState<any[]>([])
  const [demandesAcces, setDemandesAcces] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    titre: "",
    contenu: "",
    numeroDossier: ""
  })
  const [accessForm, setAccessForm] = useState({
    codePatient: "",
    motif: ""
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
  }, [router])

  const handleLogout = async () => {
    setLogoutError("")
    setIsLoggingOut(true)
    try {
      await apiLogout()
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("user")
      router.push("/login")
    } catch (err: any) {
      setLogoutError(err?.message || "Erreur lors de la déconnexion")
      setIsLoggingOut(false)
    }
  }

  const handleCreateDossier = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const response = await createDossier(createForm)
      setSuccess("Dossier créé avec succès")
      setShowCreateModal(false)
      setCreateForm({ titre: "", contenu: "", numeroDossier: "" })
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la création du dossier")
      setIsLoading(false)
    }
  }

  const handleDemanderAcces = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const response = await demanderAcces(accessForm)
      setSuccess("Demande d'accès envoyée avec succès")
      setShowAccessModal(false)
      setAccessForm({ codePatient: "", motif: "" })
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la demande d'accès")
      setIsLoading(false)
    }
  }

  const handleGetDossier = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const numeroDossier = "DOS-001" // À adapter selon le contexte
      const response = await getDossier(numeroDossier)
      setSuccess("Dossier récupéré avec succès")
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération du dossier")
      setIsLoading(false)
    }
  }

  const handleGetDossierHistorique = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const numeroDossier = "DOS-001" // À adapter selon le contexte
      const response = await getDossierHistorique(numeroDossier)
      setSuccess("Historique récupéré avec succès")
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération de l'historique")
      setIsLoading(false)
    }
  }

  const handleAutoriserMedecin = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const numeroDossier = "DOS-001" // À adapter selon le contexte
      const medecinData = { medecinId: "medecin-id" } // À adapter selon le contexte
      const response = await autoriserMedecin(numeroDossier, medecinData)
      setSuccess("Médecin autorisé avec succès")
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'autorisation")
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadFichier = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier")
      return
    }
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const numeroDossier = "DOS-001" // À adapter selon le contexte
      const formData = new FormData()
      formData.append('fichier', selectedFile)
      const response = await uploadFichier(numeroDossier, formData)
      setSuccess("Fichier uploadé avec succès")
      setSelectedFile(null)
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'upload du fichier")
      setIsLoading(false)
    }
  }

  const handleListeAcces = async () => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const response = await listeAcces()
      setSuccess("Liste des accès récupérée avec succès")
      setIsLoading(false)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération des accès")
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Médecin</h1>
              <p className="text-gray-600">Bienvenue, Dr. {user.nom} {user.prenom}</p>
            </div>
            <Button onClick={handleLogout} variant="outline" disabled={isLoggingOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
            </Button>
          </div>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <Alert className="mb-4 border-destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 border-secondary">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Actions Rapides */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Accédez rapidement aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button onClick={() => setShowCreateModal(true)} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                <FileText className="mb-2 h-6 w-6" />
                <span>Créer Dossier</span>
              </Button>
              <Button onClick={() => setShowAccessModal(true)} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                <UserCheck className="mb-2 h-6 w-6" />
                <span>Demander Accès</span>
              </Button>
              <Button onClick={handleGetDossier} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Eye className="mb-2 h-6 w-6" />
                <span>Voir Dossier</span>
              </Button>
              <Button onClick={handleGetDossierHistorique} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Clock className="mb-2 h-6 w-6" />
                <span>Historique</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gestion des Dossiers */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Gestion des Dossiers
            </CardTitle>
            <CardDescription>
              Créez et gérez les dossiers médicaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={handleAutoriserMedecin} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Users className="mb-2 h-6 w-6" />
                <span>Autoriser Médecin</span>
              </Button>
              <Button onClick={handleListeAcces} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                <Shield className="mb-2 h-6 w-6" />
                <span>Liste des Accès</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload de Fichier */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="mr-2 h-5 w-5" />
              Upload de Fichier
            </CardTitle>
            <CardDescription>
              Ajoutez un fichier à un dossier médical
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="file">Sélectionner un fichier</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              <Button 
                onClick={handleUploadFichier} 
                disabled={!selectedFile || isLoading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Uploader
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Modal Création Dossier */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Créer un Dossier</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titre">Titre</Label>
                  <Input
                    id="titre"
                    value={createForm.titre}
                    onChange={(e) => setCreateForm({...createForm, titre: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contenu">Contenu</Label>
                  <textarea
                    id="contenu"
                    value={createForm.contenu}
                    onChange={(e) => setCreateForm({...createForm, contenu: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateDossier} disabled={isLoading} className="flex-1">
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                  <Button onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1">
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Demande Accès */}
        {showAccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-xl font-semibold mb-4">Demander Accès</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="codePatient">Code Patient</Label>
                  <Input
                    id="codePatient"
                    value={accessForm.codePatient}
                    onChange={(e) => setAccessForm({...accessForm, codePatient: e.target.value})}
                    placeholder="Ex: PAT-001"
                  />
                </div>
                <div>
                  <Label htmlFor="motif">Motif</Label>
                  <textarea
                    id="motif"
                    value={accessForm.motif}
                    onChange={(e) => setAccessForm({...accessForm, motif: e.target.value})}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Motif de la demande d'accès"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleDemanderAcces} disabled={isLoading} className="flex-1">
                    {isLoading ? "Envoi..." : "Envoyer"}
                  </Button>
                  <Button onClick={() => setShowAccessModal(false)} variant="outline" className="flex-1">
                    Annuler
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
