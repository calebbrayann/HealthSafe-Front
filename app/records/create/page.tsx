"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, FileText, User, Hash, Type, FileEdit } from "lucide-react"
import Link from "next/link"

export default function CreateRecordPage() {
  const [formData, setFormData] = useState({
    nomPatient: "",
    prenomPatient: "",
    codePatient: "",
    titre: "",
    contenu: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Mock user role - in real app this would come from auth context
  const userRole = "MEDECIN" // Change to "PATIENT" to test access control

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation and responses
    if (userRole !== "MEDECIN") {
      setMessage({ type: "error", text: "Accès interdit. Seuls les médecins peuvent créer un dossier." })
      setIsLoading(false)
      return
    }

    if (
      !formData.nomPatient ||
      !formData.prenomPatient ||
      !formData.codePatient ||
      !formData.titre ||
      !formData.contenu
    ) {
      setMessage({ type: "error", text: "Tous les champs sont requis." })
      setIsLoading(false)
      return
    }

    // Mock patient validation
    const mockPatients = ["PAT-01", "PAT-02", "PAT-03"]
    if (!mockPatients.includes(formData.codePatient)) {
      setMessage({ type: "error", text: "Patient introuvable." })
      setIsLoading(false)
      return
    }

    // Success case
    setMessage({ type: "success", text: "Dossier créé." })
    setFormData({
      nomPatient: "",
      prenomPatient: "",
      codePatient: "",
      titre: "",
      contenu: "",
    })
    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Créer un dossier médical</h1>
            <p className="text-muted-foreground">Nouveau dossier pour un patient</p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Informations du dossier
            </CardTitle>
            <CardDescription>Remplissez tous les champs pour créer un nouveau dossier médical</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomPatient" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Nom du patient
                  </Label>
                  <Input
                    id="nomPatient"
                    name="nomPatient"
                    value={formData.nomPatient}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenomPatient" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Prénom du patient
                  </Label>
                  <Input
                    id="prenomPatient"
                    name="prenomPatient"
                    value={formData.prenomPatient}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codePatient" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Code patient
                </Label>
                <Input
                  id="codePatient"
                  name="codePatient"
                  value={formData.codePatient}
                  onChange={handleChange}
                  placeholder="PAT-01"
                  required
                />
                <p className="text-sm text-muted-foreground">Codes disponibles: PAT-01, PAT-02, PAT-03</p>
              </div>

              {/* Record Information */}
              <div className="space-y-2">
                <Label htmlFor="titre" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Titre du dossier
                </Label>
                <Input
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Consultation initiale"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenu" className="flex items-center gap-2">
                  <FileEdit className="h-4 w-4" />
                  Contenu du dossier
                </Label>
                <Textarea
                  id="contenu"
                  name="contenu"
                  value={formData.contenu}
                  onChange={handleChange}
                  placeholder="Patient souffre de maux de tête..."
                  rows={6}
                  required
                />
              </div>

              {/* Message Display */}
              {message && (
                <Alert className={message.type === "error" ? "border-destructive" : "border-secondary"}>
                  <AlertDescription className={message.type === "error" ? "text-destructive" : "text-secondary"}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Création en cours..." : "Créer dossier"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Mock Data Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Données mockées (développement)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              {JSON.stringify(
                {
                  nom: "Doe",
                  prenom: "John",
                  codePatient: "PAT-01",
                  titre: "Consultation initiale",
                  contenu: "Patient souffre de maux de tête.",
                },
                null,
                2,
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
