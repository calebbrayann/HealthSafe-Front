"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerPatient, registerMedecin } from "@/lib/api"
import { Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState("patient")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPatientPassword, setShowPatientPassword] = useState(false)
  const [showPatientConfirmPassword, setShowPatientConfirmPassword] = useState(false)
  const [showMedecinPassword, setShowMedecinPassword] = useState(false)
  const [showMedecinConfirmPassword, setShowMedecinConfirmPassword] = useState(false)
  const router = useRouter()

  // État pour le formulaire patient
  const [patientData, setPatientData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    dateNaissance: "",
  })

  // État pour le formulaire médecin
  const [medecinData, setMedecinData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    specialite: "",
    numero_licence: "",
    hopital: "",
  })

  const handlePatientChange = (field: string, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }))
  }

  const handleMedecinChange = (field: string, value: string) => {
    setMedecinData(prev => ({ ...prev, [field]: value }))
  }

  const validatePatientForm = () => {
    if (!patientData.nom || !patientData.prenom || !patientData.email || !patientData.password || !patientData.confirmPassword || !patientData.telephone || !patientData.dateNaissance) {
      setError("Veuillez remplir tous les champs obligatoires")
      return false
    }

    if (!patientData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide")
      return false
    }

    if (patientData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return false
    }

    if (patientData.password !== patientData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return false
    }

    return true
  }

  const validateMedecinForm = () => {
    if (!medecinData.nom || !medecinData.prenom || !medecinData.email || !medecinData.password || !medecinData.confirmPassword || !medecinData.telephone || !medecinData.specialite || !medecinData.numero_licence || !medecinData.hopital) {
      setError("Veuillez remplir tous les champs obligatoires")
      return false
    }

    if (!medecinData.email.includes("@")) {
      setError("Veuillez entrer une adresse email valide")
      return false
    }

    if (medecinData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      return false
    }

    if (medecinData.password !== medecinData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return false
    }

    return true
  }

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!validatePatientForm()) {
      setIsLoading(false)
      return
    }

    try {
      const { confirmPassword, ...dataToSend } = patientData
      await registerPatient(dataToSend)
      setSuccess("Inscription réussie ! Un email de vérification vous a été envoyé.")
      setIsLoading(false)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      const message = err?.message || "Échec de l'inscription. Veuillez réessayer."
      setError(message)
      setIsLoading(false)
    }
  }

  const handleMedecinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    if (!validateMedecinForm()) {
      setIsLoading(false)
      return
    }

    try {
      const { confirmPassword, ...dataToSend } = medecinData
      await registerMedecin(dataToSend)
      setSuccess("Inscription réussie ! Votre compte sera validé par un administrateur.")
      setIsLoading(false)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      const message = err?.message || "Échec de l'inscription. Veuillez réessayer."
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/patient-registration-bg.jpg')",
        }}
      ></div>

      <div className="w-full max-w-4xl space-y-6 relative z-10">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/images/healthsafe-logo.png"
              alt="HealthSafe Logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="text-3xl font-bold text-white drop-shadow-lg">HealthSafe</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Créer un compte</h1>
            <p className="text-white/90 drop-shadow-md">Rejoignez HealthSafe pour une gestion sécurisée de vos données médicales</p>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Inscription</CardTitle>
            <CardDescription className="text-center">Choisissez votre type de compte et remplissez les informations requises</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="medecin">Médecin</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mt-4">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="patient" className="mt-6">
                <form onSubmit={handlePatientSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-nom">Nom *</Label>
                      <Input
                        id="patient-nom"
                        value={patientData.nom}
                        onChange={(e) => handlePatientChange("nom", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-prenom">Prénom *</Label>
                      <Input
                        id="patient-prenom"
                        value={patientData.prenom}
                        onChange={(e) => handlePatientChange("prenom", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-email">Email *</Label>
                      <Input
                        id="patient-email"
                        type="email"
                        value={patientData.email}
                        onChange={(e) => handlePatientChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patient-telephone">Téléphone *</Label>
                      <Input
                        id="patient-telephone"
                        type="tel"
                        value={patientData.telephone}
                        onChange={(e) => handlePatientChange("telephone", e.target.value)}
                        required
                      />
                    </div>

                                         <div className="space-y-2">
                       <Label htmlFor="patient-dateNaissance">Date de naissance *</Label>
                       <Input
                         id="patient-dateNaissance"
                         type="date"
                         value={patientData.dateNaissance}
                         onChange={(e) => handlePatientChange("dateNaissance", e.target.value)}
                         max="1970-12-31"
                         required
                       />
                     </div>

                                         <div className="space-y-2">
                       <Label htmlFor="patient-password">Mot de passe *</Label>
                       <div className="relative">
                         <Input
                           id="patient-password"
                           type={showPatientPassword ? "text" : "password"}
                           value={patientData.password}
                           onChange={(e) => handlePatientChange("password", e.target.value)}
                           required
                         />
                         <button
                           type="button"
                           onClick={() => setShowPatientPassword(!showPatientPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                         >
                           {showPatientPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </button>
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="patient-confirmPassword">Confirmer le mot de passe *</Label>
                       <div className="relative">
                         <Input
                           id="patient-confirmPassword"
                           type={showPatientConfirmPassword ? "text" : "password"}
                           value={patientData.confirmPassword}
                           onChange={(e) => handlePatientChange("confirmPassword", e.target.value)}
                           required
                         />
                         <button
                           type="button"
                           onClick={() => setShowPatientConfirmPassword(!showPatientConfirmPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                         >
                           {showPatientConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </button>
                       </div>
                     </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Inscription en cours..." : "S'inscrire en tant que patient"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="medecin" className="mt-6">
                <form onSubmit={handleMedecinSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medecin-nom">Nom *</Label>
                      <Input
                        id="medecin-nom"
                        value={medecinData.nom}
                        onChange={(e) => handleMedecinChange("nom", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medecin-prenom">Prénom *</Label>
                      <Input
                        id="medecin-prenom"
                        value={medecinData.prenom}
                        onChange={(e) => handleMedecinChange("prenom", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medecin-email">Email *</Label>
                      <Input
                        id="medecin-email"
                        type="email"
                        value={medecinData.email}
                        onChange={(e) => handleMedecinChange("email", e.target.value)}
                        required
                      />
                    </div>

                                         <div className="space-y-2">
                       <Label htmlFor="medecin-telephone">Téléphone *</Label>
                       <Input
                         id="medecin-telephone"
                         type="tel"
                         value={medecinData.telephone}
                         onChange={(e) => handleMedecinChange("telephone", e.target.value)}
                         required
                       />
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="medecin-specialite">Spécialité *</Label>
                       <Select value={medecinData.specialite} onValueChange={(value) => handleMedecinChange("specialite", value)}>
                         <SelectTrigger>
                           <SelectValue placeholder="Sélectionnez une spécialité" />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Cardiologie">Cardiologie</SelectItem>
                           <SelectItem value="Dermatologie">Dermatologie</SelectItem>
                           <SelectItem value="Endocrinologie">Endocrinologie</SelectItem>
                           <SelectItem value="Gastro-entérologie">Gastro-entérologie</SelectItem>
                           <SelectItem value="Gynécologie">Gynécologie</SelectItem>
                           <SelectItem value="Médecine générale">Médecine générale</SelectItem>
                           <SelectItem value="Neurologie">Neurologie</SelectItem>
                           <SelectItem value="Oncologie">Oncologie</SelectItem>
                           <SelectItem value="Ophtalmologie">Ophtalmologie</SelectItem>
                           <SelectItem value="Orthopédie">Orthopédie</SelectItem>
                           <SelectItem value="Pédiatrie">Pédiatrie</SelectItem>
                           <SelectItem value="Psychiatrie">Psychiatrie</SelectItem>
                           <SelectItem value="Radiologie">Radiologie</SelectItem>
                           <SelectItem value="Rhumatologie">Rhumatologie</SelectItem>
                           <SelectItem value="Urologie">Urologie</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="medecin-numero-licence">Numéro de licence *</Label>
                       <Input
                         id="medecin-numero-licence"
                         value={medecinData.numero_licence}
                         onChange={(e) => handleMedecinChange("numero_licence", e.target.value)}
                         placeholder="Numéro de licence professionnelle"
                         required
                       />
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="medecin-hopital">Établissement *</Label>
                       <Input
                         id="medecin-hopital"
                         value={medecinData.hopital}
                         onChange={(e) => handleMedecinChange("hopital", e.target.value)}
                         placeholder="Nom de l'hôpital ou clinique"
                         required
                       />
                     </div>

                                         <div className="space-y-2">
                       <Label htmlFor="medecin-password">Mot de passe *</Label>
                       <div className="relative">
                         <Input
                           id="medecin-password"
                           type={showMedecinPassword ? "text" : "password"}
                           value={medecinData.password}
                           onChange={(e) => handleMedecinChange("password", e.target.value)}
                           required
                         />
                         <button
                           type="button"
                           onClick={() => setShowMedecinPassword(!showMedecinPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                         >
                           {showMedecinPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </button>
                       </div>
                     </div>

                     <div className="space-y-2">
                       <Label htmlFor="medecin-confirmPassword">Confirmer le mot de passe *</Label>
                       <div className="relative">
                         <Input
                           id="medecin-confirmPassword"
                           type={showMedecinConfirmPassword ? "text" : "password"}
                           value={medecinData.confirmPassword}
                           onChange={(e) => handleMedecinChange("confirmPassword", e.target.value)}
                           required
                         />
                         <button
                           type="button"
                           onClick={() => setShowMedecinConfirmPassword(!showMedecinConfirmPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                         >
                           {showMedecinConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </button>
                       </div>
                     </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Inscription en cours..." : "S'inscrire en tant que médecin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <div className="text-sm text-white/90 drop-shadow-md">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-white hover:underline font-medium">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
