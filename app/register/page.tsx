"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Stethoscope } from "lucide-react"
import Image from "next/image"
import { registerPatient as apiRegisterPatient, registerMedecin as apiRegisterMedecin } from "@/lib/api"

const specialites = [
  "Cardiologie",
  "Dermatologie",
  "Endocrinologie",
  "Gastroentérologie",
  "Gynécologie",
  "Neurologie",
  "Oncologie",
  "Ophtalmologie",
  "Orthopédie",
  "Pédiatrie",
  "Pneumologie",
  "Psychiatrie",
  "Radiologie",
  "Rhumatologie",
  "Urologie",
  "Médecine générale",
  "Chirurgie générale",
  "Anesthésie-Réanimation",
]

export default function RegisterPage() {
  const [userType, setUserType] = useState<"patient" | "medecin">("patient")
  
  // État pour les données du patient
  const [patientData, setPatientData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    dateNaissance: "",
  })

  // État pour les données du médecin
  const [medecinData, setMedecinData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    specialite: "",
    numeroLicence: "",
    hopital: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleMedecinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedecinData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setMedecinData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateDateOfBirth = (dateString: string) => {
    const birthDate = new Date(dateString)
    const minDate = new Date("1970-01-01")
    const maxDate = new Date()

    if (birthDate < minDate) {
      return "La date de naissance ne peut pas être antérieure au 1er janvier 1970"
    }

    if (birthDate > maxDate) {
      return "La date de naissance ne peut pas être dans le futur"
    }

    return null
  }

  const validatePatientForm = () => {
    if (
      !patientData.nom ||
      !patientData.prenom ||
      !patientData.email ||
      !patientData.password ||
      !patientData.telephone ||
      !patientData.dateNaissance
    ) {
      return "Veuillez remplir tous les champs obligatoires"
    }

    if (!patientData.email.includes("@")) {
      return "Veuillez entrer une adresse email valide"
    }

    if (patientData.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (patientData.password !== patientData.confirmPassword) {
      return "Les mots de passe ne correspondent pas"
    }

    if (!/^[0-9+\-\s()]+$/.test(patientData.telephone)) {
      return "Veuillez entrer un numéro de téléphone valide"
    }

    const dateError = validateDateOfBirth(patientData.dateNaissance)
    if (dateError) {
      return dateError
    }

    return null
  }

  const validateMedecinForm = () => {
    if (
      !medecinData.nom ||
      !medecinData.prenom ||
      !medecinData.email ||
      !medecinData.password ||
      !medecinData.telephone ||
      !medecinData.specialite ||
      !medecinData.numeroLicence ||
      !medecinData.hopital
    ) {
      return "Veuillez remplir tous les champs obligatoires"
    }

    if (!medecinData.email.includes("@")) {
      return "Veuillez entrer une adresse email valide"
    }

    if (medecinData.password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (medecinData.password !== medecinData.confirmPassword) {
      return "Les mots de passe ne correspondent pas"
    }

    if (!/^[0-9+\-\s()]+$/.test(medecinData.telephone)) {
      return "Veuillez entrer un numéro de téléphone valide"
    }

    if (!/^[0-9A-Z-]+$/.test(medecinData.numeroLicence)) {
      return "Le numéro de licence doit contenir uniquement des lettres majuscules, chiffres et tirets"
    }

    return null
  }

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    const validationError = validatePatientForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        nom: patientData.nom,
        prenom: patientData.prenom,
        email: patientData.email,
        password: patientData.password,
        telephone: patientData.telephone,
        dateNaissance: patientData.dateNaissance,
      }
      const res = await apiRegisterPatient(payload)
      setSuccess((res as any)?.message || "Inscription réussie. Vous pouvez maintenant vous connecter.")
      setIsLoading(false)
      // Option: rediriger après un bref délai
      setTimeout(() => router.push("/login"), 800)
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

    const validationError = validateMedecinForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        nom: medecinData.nom,
        prenom: medecinData.prenom,
        email: medecinData.email,
        password: medecinData.password,
        telephone: medecinData.telephone,
        specialite: medecinData.specialite,
        numeroLicence: medecinData.numeroLicence,
        hopital: medecinData.hopital,
      }
      const res = await apiRegisterMedecin(payload)
      setSuccess((res as any)?.message || "Inscription réussie. Vous pouvez maintenant vous connecter.")
      setIsLoading(false)
      // Redirection selon le rôle retourné par l'API
      if ((res as any)?.role === "MEDECIN") {
        setTimeout(() => router.push("/dashboard/medecin"), 800)
      } else {
        setTimeout(() => router.push("/login"), 800)
      }
    } catch (err: any) {
      const message = err?.message || "Échec de l'inscription. Veuillez réessayer."
      setError(message)
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split("T")[0]
  const minDate = "1970-01-01"

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/patient-registration-bg.jpg')",
        }}
      ></div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105"
            >
              <Image
                src="/images/healthsafe-logo.png"
                alt="HealthSafe Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-primary">HealthSafe</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Accueil
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-2xl space-y-6 relative z-10 mt-20">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Inscription</h1>
          <p className="text-white/90 drop-shadow-md">Rejoignez HealthSafe</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Créer votre compte</CardTitle>
            <CardDescription className="text-center">
              Choisissez votre type de compte et remplissez les informations requises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={userType}
              onValueChange={(value: string) => setUserType(value as "patient" | "medecin")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="patient" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Patient</span>
                </TabsTrigger>
                <TabsTrigger value="medecin" className="flex items-center space-x-2">
                  <Stethoscope className="h-4 w-4" />
                  <span>Médecin</span>
                </TabsTrigger>
              </TabsList>

              {/* Formulaire Patient */}
              <TabsContent value="patient">
                <form onSubmit={handlePatientSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient-nom">Nom *</Label>
                      <Input
                        id="patient-nom"
                        name="nom"
                        type="text"
                        placeholder="Dupont"
                        value={patientData.nom}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-prenom">Prénom *</Label>
                      <Input
                        id="patient-prenom"
                        name="prenom"
                        type="text"
                        placeholder="Jean"
                        value={patientData.prenom}
                        onChange={handlePatientChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email *</Label>
                    <Input
                      id="patient-email"
                      name="email"
                      type="email"
                      placeholder="jean.dupont@email.com"
                      value={patientData.email}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-telephone">Téléphone *</Label>
                    <Input
                      id="patient-telephone"
                      name="telephone"
                      type="tel"
                      placeholder="01 23 45 67 89"
                      value={patientData.telephone}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-dateNaissance">Date de naissance *</Label>
                    <Input
                      id="patient-dateNaissance"
                      name="dateNaissance"
                      type="date"
                      min={minDate}
                      max={today}
                      value={patientData.dateNaissance}
                      onChange={handlePatientChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Date comprise entre le 1er janvier 1970 et aujourd'hui</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Mot de passe *</Label>
                    <Input
                      id="patient-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={patientData.password}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="patient-confirmPassword">Confirmer le mot de passe *</Label>
                    <Input
                      id="patient-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={patientData.confirmPassword}
                      onChange={handlePatientChange}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Création du compte..." : "Créer mon compte"}
                  </Button>
                </form>
              </TabsContent>

              {/* Formulaire Médecin */}
              <TabsContent value="medecin">
                <form onSubmit={handleMedecinSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medecin-nom">Nom *</Label>
                      <Input
                        id="medecin-nom"
                        name="nom"
                        type="text"
                        placeholder="Dr. Dupont"
                        value={medecinData.nom}
                        onChange={handleMedecinChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medecin-prenom">Prénom *</Label>
                      <Input
                        id="medecin-prenom"
                        name="prenom"
                        type="text"
                        placeholder="Marie"
                        value={medecinData.prenom}
                        onChange={handleMedecinChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medecin-email">Email professionnel *</Label>
                    <Input
                      id="medecin-email"
                      name="email"
                      type="email"
                      placeholder="dr.marie.dupont@hopital.fr"
                      value={medecinData.email}
                      onChange={handleMedecinChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medecin-telephone">Téléphone *</Label>
                      <Input
                        id="medecin-telephone"
                        name="telephone"
                        type="tel"
                        placeholder="01 23 45 67 89"
                        value={medecinData.telephone}
                        onChange={handleMedecinChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medecin-numeroLicence">Numéro de licence *</Label>
                      <Input
                        id="medecin-numeroLicence"
                        name="numeroLicence"
                        type="text"
                        placeholder="123456789"
                        value={medecinData.numeroLicence}
                        onChange={handleMedecinChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medecin-specialite">Spécialité *</Label>
                      <Select onValueChange={(value) => handleSelectChange("specialite", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialites.map((specialite) => (
                            <SelectItem key={specialite} value={specialite}>
                              {specialite}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medecin-hopital">Nom de l'hôpital *</Label>
                      <Input
                        id="medecin-hopital"
                        name="hopital"
                        type="text"
                        placeholder="Saisissez le nom de votre établissement"
                        value={medecinData.hopital}
                        onChange={handleMedecinChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="medecin-password">Mot de passe *</Label>
                      <Input
                        id="medecin-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={medecinData.password}
                        onChange={handleMedecinChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="medecin-confirmPassword">Confirmer le mot de passe *</Label>
                      <Input
                        id="medecin-confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={medecinData.confirmPassword}
                        onChange={handleMedecinChange}
                        required
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      <strong>Important :</strong> Votre compte sera examiné par un administrateur avant activation. Vous
                      recevrez un email de confirmation une fois votre compte validé.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Création du compte..." : "Créer mon compte médecin"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-white/90 drop-shadow-sm">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-green-400 hover:text-green-300 transition-colors font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
