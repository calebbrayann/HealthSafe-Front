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
  Shield,
  Loader2
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
  getMedecinDossiers // ✅ CORRECTION: API dédiée pour les médecins
} from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import SecureLayout from "@/components/SecureLayout"
import LogoutErrorHandler from "@/components/LogoutErrorHandler"

export default function MedecinDashboardPage() {
  const { user, logout: authLogout } = useAuth()
  const [logoutError, setLogoutError] = useState("")
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dossiers, setDossiers] = useState<any[]>([])
  const [dossiersAutorises, setDossiersAutorises] = useState<any[]>([])
  const [demandesAcces, setDemandesAcces] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAccessModal, setShowAccessModal] = useState(false)
  const [createForm, setCreateForm] = useState({
    titre: "",
    contenu: "",
    nom: "",
    prenom: "",
    codePatient: ""
  })
  const [accessForm, setAccessForm] = useState({
    codePatient: "",
    motif: ""
  })
  const router = useRouter()

  // Charger les données au montage du composant
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setIsLoading(true)
    try {
      // ✅ CORRECTION: Charger les dossiers du médecin avec une API dédiée
      await handleGetMedecinDossiers()
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err)
      setError("Erreur lors du chargement des données")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    setLogoutError("")
    setIsLoggingOut(true)
    try {
      await authLogout()
    } catch (err: any) {
      const errorMessage = err?.message || "Erreur lors de la déconnexion"
      setLogoutError(errorMessage)
      console.error("Erreur de déconnexion:", err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleRetryLogout = async () => {
    setLogoutError("")
    await handleLogout()
  }

  const handleForceLogout = async () => {
    setLogoutError("")
    setIsLoggingOut(true)
    try {
      // Déconnexion forcée - nettoyage côté client uniquement
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        // Nettoyage des cookies
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        })
      }
      router.push("/login")
    } catch (err) {
      console.error("Erreur lors de la déconnexion forcée:", err)
      router.push("/login")
    } finally {
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
      setCreateForm({ titre: "", contenu: "", nom: "", prenom: "", codePatient: "" })
      // Recharger la liste des dossiers
      await handleGetMedecinDossiers()
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la création du dossier")
    } finally {
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
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la demande d'accès")
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ CORRECTION: API dédiée pour récupérer les dossiers du médecin
  const handleGetMedecinDossiers = async () => {
    setError("")
    try {
      const response = await getMedecinDossiers()
      setDossiers((response as any)?.dossiersCreated || [])
      setDossiersAutorises((response as any)?.dossiersAutorises || [])
      setSuccess("Dossiers récupérés avec succès")
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération des dossiers")
    }
  }

  const handleGetDossier = async (numeroDossier: string) => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const response = await getDossier(numeroDossier)
      setSuccess("Dossier récupéré avec succès")
      return response
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération du dossier")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetDossierHistorique = async (numeroDossier: string) => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const response = await getDossierHistorique(numeroDossier)
      setSuccess("Historique récupéré avec succès")
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération de l'historique")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAutoriserMedecin = async (numeroDossier: string, medecinData: any) => {
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const response = await autoriserMedecin(numeroDossier, medecinData)
      setSuccess("Médecin autorisé avec succès")
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'autorisation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUploadFichier = async (numeroDossier: string) => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier")
      return
    }
    setError("")
    setSuccess("")
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('fichier', selectedFile)
      const response = await uploadFichier(numeroDossier, formData)
      setSuccess("Fichier uploadé avec succès")
      setSelectedFile(null)
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'upload du fichier")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SecureLayout allowedRoles={["MEDECIN"]}>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Médecin</h1>
                <p className="text-gray-600">Bienvenue, Dr. {user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-500">{user?.specialite} - {user?.hopital}</p>
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

        {/* Gestionnaire d'erreur de déconnexion */}
        {logoutError && (
          <div className="mb-4">
            <LogoutErrorHandler
              error={logoutError}
              onRetry={handleRetryLogout}
              onForceLogout={handleForceLogout}
              showDetails={true}
            />
          </div>
        )}

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dossiers créés</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dossiers.length}</div>
                <p className="text-xs text-muted-foreground">
                  Dossiers que vous avez créés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accès autorisés</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dossiersAutorises.length}</div>
                <p className="text-xs text-muted-foreground">
                  Dossiers auxquels vous avez accès
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total dossiers</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dossiers.length + dossiersAutorises.length}</div>
                <p className="text-xs text-muted-foreground">
                  Accès total
                </p>
              </CardContent>
            </Card>
          </div>

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
                <Button onClick={handleGetMedecinDossiers} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <Eye className="mb-2 h-6 w-6" />
                  <span>Mes Dossiers</span>
                </Button>
                <Button onClick={() => router.push("/dashboard/medecin/patients")} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <Users className="mb-2 h-6 w-6" />
                  <span>Mes Patients</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Affichage des Dossiers Créés */}
          {dossiers.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Dossiers que j'ai créés
                </CardTitle>
                <CardDescription>
                  Dossiers médicaux que vous avez créés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dossiers.map((dossier, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{dossier.titre || dossier.numeroDossier}</h3>
                          <p className="text-sm text-gray-600">Patient: {dossier.patient?.nom} {dossier.patient?.prenom}</p>
                          <p className="text-sm text-gray-500">Créé le: {new Date(dossier.createdAt).toLocaleDateString()}</p>
                          <p className="text-sm mt-1">{dossier.contenu}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGetDossier(dossier.numeroDossier)}
                            disabled={isLoading}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affichage des Dossiers Autorisés */}
          {dossiersAutorises.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Dossiers auxquels j'ai accès
                </CardTitle>
                <CardDescription>
                  Dossiers pour lesquels vous avez reçu une autorisation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dossiersAutorises.map((dossier, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{dossier.titre || dossier.numeroDossier}</h3>
                          <p className="text-sm text-gray-600">Patient: {dossier.patient?.nom} {dossier.patient?.prenom}</p>
                          <p className="text-sm text-gray-500">Accès autorisé</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGetDossier(dossier.numeroDossier)}
                            disabled={isLoading}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
                  onClick={() => dossiers.length > 0 && handleUploadFichier(dossiers[0].numeroDossier)} 
                  disabled={!selectedFile || isLoading || dossiers.length === 0}
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
                    <Label htmlFor="nom">Nom du patient</Label>
                    <Input
                      id="nom"
                      value={createForm.nom}
                      onChange={(e) => setCreateForm({...createForm, nom: e.target.value})}
                      placeholder="Nom de famille"
                    />
                  </div>
                  <div>
                    <Label htmlFor="prenom">Prénom du patient</Label>
                    <Input
                      id="prenom"
                      value={createForm.prenom}
                      onChange={(e) => setCreateForm({...createForm, prenom: e.target.value})}
                      placeholder="Prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codePatient">Code Patient</Label>
                    <Input
                      id="codePatient"
                      value={createForm.codePatient}
                      onChange={(e) => setCreateForm({...createForm, codePatient: e.target.value})}
                      placeholder="Code du patient"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titre">Titre du dossier</Label>
                    <Input
                      id="titre"
                      value={createForm.titre}
                      onChange={(e) => setCreateForm({...createForm, titre: e.target.value})}
                      placeholder="Titre du dossier médical"
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
                      placeholder="Description médicale, diagnostic, traitement..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateDossier} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création...
                        </>
                      ) : (
                        "Créer"
                      )}
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
                <h2 className="text-xl font-semibold mb-4">Demander Accès à un Dossier</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="codePatientAccess">Code Patient</Label>
                    <Input
                      id="codePatientAccess"
                      value={accessForm.codePatient}
                      onChange={(e) => setAccessForm({...accessForm, codePatient: e.target.value})}
                      placeholder="Ex: PAT-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="motif">Motif de la demande</Label>
                    <textarea
                      id="motif"
                      value={accessForm.motif}
                      onChange={(e) => setAccessForm({...accessForm, motif: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Motif médical de la demande d'accès"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleDemanderAcces} disabled={isLoading} className="flex-1">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        "Envoyer"
                      )}
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
    </SecureLayout>
  )
}