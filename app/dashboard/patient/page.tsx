"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import SecureLayout from "@/components/SecureLayout";
import {
  FileText,
  Shield,
  RefreshCw,
  LogOut,
  Plus,
  Eye,
  History,
  Upload,
  Users
} from "lucide-react";
import {
  logout as apiLogout,
  resetCodePatient,
  getPatientDossiers,
  getAutorisations,
  getDossier,
  getDossierHistorique,
  uploadFichier
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function PatientDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [patientCode, setPatientCode] = useState<string>("123456");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dossiers, setDossiers] = useState<any[]>([]);
  const [autorisations, setAutorisations] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ------------------------ Handlers ------------------------

  const handleLogout = async () => {
    setLogoutError("");
    setIsLoggingOut(true);
    try {
      await apiLogout();
      router.push("/login");
    } catch (err: any) {
      setLogoutError(err?.message || "Erreur lors de la déconnexion");
      setIsLoggingOut(false);
    }
  };

  const handleResetCode = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const response = await resetCodePatient({});
      setSuccess((response as any)?.message || "Code secret réinitialisé avec succès");
      if ((response as any)?.nouveauCode) setPatientCode((response as any).nouveauCode);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la réinitialisation du code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetPatientDossiers = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const response = await getPatientDossiers({});
      setDossiers((response as any)?.dossiers || []);
      setSuccess("Dossiers récupérés avec succès");
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération des dossiers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAutorisations = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const numeroDossier = "DOS-001";
      const response = await getAutorisations(numeroDossier);
      setAutorisations((response as any)?.autorisations || []);
      setSuccess("Autorisations récupérées avec succès");
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération des autorisations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDossier = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const numeroDossier = "DOS-001";
      const response = await getDossier(numeroDossier);
      setSelectedRecord(response);
      setSuccess("Dossier récupéré avec succès");
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération du dossier");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDossierHistorique = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const numeroDossier = "DOS-001";
      await getDossierHistorique(numeroDossier);
      setSuccess("Historique récupéré avec succès");
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la récupération de l'historique");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleUploadFichier = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier");
      return;
    }
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const numeroDossier = "DOS-001";
      const formData = new FormData();
      formData.append("fichier", selectedFile);
      await uploadFichier(numeroDossier, formData);
      setSuccess("Fichier uploadé avec succès");
      setSelectedFile(null);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de l'upload du fichier");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------ Render ------------------------

  return (
    <SecureLayout>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Patient</h1>
                <p className="text-gray-600">Bienvenue, {user?.firstName} {user?.lastName}</p>
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
          {logoutError && (
            <Alert className="mb-4 border-destructive">
              <AlertDescription>{logoutError}</AlertDescription>
            </Alert>
          )}

          {/* Code Patient */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Code Secret Patient
              </CardTitle>
              <CardDescription>
                Votre code secret pour accéder à vos dossiers médicaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="patientCode">Code actuel</Label>
                  <Input
                    id="patientCode"
                    value={patientCode}
                    readOnly
                    className="font-mono text-lg"
                  />
                </div>
                <Button 
                  onClick={handleResetCode} 
                  disabled={isLoading}
                  variant="outline"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Actions Rapides */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Accédez rapidement à vos dossiers et autorisations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={handleGetPatientDossiers} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <FileText className="mb-2 h-6 w-6" />
                  <span>Mes Dossiers</span>
                </Button>
                <Button onClick={handleGetAutorisations} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <Users className="mb-2 h-6 w-6" />
                  <span>Autorisations</span>
                </Button>
                <Button onClick={handleGetDossier} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <Eye className="mb-2 h-6 w-6" />
                  <span>Voir Dossier</span>
                </Button>
                <Button onClick={handleGetDossierHistorique} disabled={isLoading} variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <History className="mb-2 h-6 w-6" />
                  <span>Historique</span>
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
                Ajoutez un fichier à votre dossier médical
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

          {/* Affichage des Dossiers */}
          {dossiers.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Mes Dossiers Médicaux</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dossiers.map((dossier, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{dossier.titre || dossier.numero}</h3>
                      <p className="text-sm text-gray-600">{dossier.date}</p>
                      <p className="text-sm">{dossier.contenu}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affichage des Autorisations */}
          {autorisations.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Autorisations d'Accès</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {autorisations.map((auth, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h3 className="font-semibold">{auth.medecin?.nom} {auth.medecin?.prenom}</h3>
                      <p className="text-sm text-gray-600">{auth.medecin?.email}</p>
                      <Badge variant={auth.statut === 'ACTIVE' ? 'default' : 'secondary'}>
                        {auth.statut}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Affichage du Dossier Sélectionné */}
          {selectedRecord && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Dossier Sélectionné</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold">{selectedRecord.titre || selectedRecord.numero}</h3>
                  <p className="text-sm text-gray-600">{selectedRecord.date}</p>
                  <p className="text-sm">{selectedRecord.contenu}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </SecureLayout>
  );
}