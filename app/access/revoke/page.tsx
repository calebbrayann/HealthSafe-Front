"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, UserX, AlertCircle, CheckCircle, Clock, Shield } from "lucide-react"
import Link from "next/link"

// Mock data - authorized doctors
const mockAuthorizedDoctors = [
  { nom: "Martin", prenom: "Alice", numeroLicence: "MED-01", email: "alice.martin@mail.com" },
  { nom: "Dubois", prenom: "Pierre", numeroLicence: "MED-02", email: "pierre.dubois@mail.com" },
  { nom: "Leroy", prenom: "Sophie", numeroLicence: "MED-03", email: "sophie.leroy@mail.com" },
  { nom: "Bernard", prenom: "Marc", numeroLicence: "MED-04", email: "marc.bernard@mail.com" },
]

export default function AccessRevokePage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    numeroLicence: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; content: string } | null>(null)
  const [revokedDoctor, setRevokedDoctor] = useState<any>(null)
  const [userRole] = useState("patient") // Mock role - in real app would come from auth

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setRevokedDoctor(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock role validation
    if (userRole !== "patient") {
      setMessage({ type: "error", content: "Seuls les patients peuvent révoquer des accès." })
      setIsLoading(false)
      return
    }

    // Validate required fields
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.numeroLicence.trim()) {
      setMessage({ type: "error", content: "Tous les champs sont requis." })
      setIsLoading(false)
      return
    }

    // Find doctor in authorized list
    const doctor = mockAuthorizedDoctors.find(
      (d) =>
        d.nom.toLowerCase() === formData.nom.trim().toLowerCase() &&
        d.prenom.toLowerCase() === formData.prenom.trim().toLowerCase() &&
        d.numeroLicence === formData.numeroLicence.trim(),
    )

    if (!doctor) {
      setMessage({ type: "error", content: "Médecin introuvable." })
      setIsLoading(false)
      return
    }

    // Success - revoke access
    setRevokedDoctor({
      ...doctor,
      dateRevocation: new Date().toLocaleDateString("fr-FR"),
      heureRevocation: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    })
    setMessage({ type: "success", content: "Accès révoqué avec succès." })
    setFormData({ nom: "", prenom: "", numeroLicence: "" })
    setIsLoading(false)
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
            <h1 className="text-2xl font-bold text-foreground">Révoquer un accès</h1>
            <p className="text-muted-foreground">Retirer l'autorisation d'accès à vos dossiers médicaux</p>
          </div>
        </div>

        {/* Revocation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-destructive" />
              Révocation d'accès médical
            </CardTitle>
            <CardDescription>
              Saisissez les informations du médecin pour révoquer son accès à vos dossiers médicaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input
                    id="nom"
                    type="text"
                    placeholder="Ex: Martin"
                    value={formData.nom}
                    onChange={(e) => handleInputChange("nom", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input
                    id="prenom"
                    type="text"
                    placeholder="Ex: Alice"
                    value={formData.prenom}
                    onChange={(e) => handleInputChange("prenom", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroLicence">Numéro de licence *</Label>
                <Input
                  id="numeroLicence"
                  type="text"
                  placeholder="Ex: MED-01"
                  value={formData.numeroLicence}
                  onChange={(e) => handleInputChange("numeroLicence", e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  Licences disponibles pour test: MED-01, MED-02, MED-03, MED-04
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full" variant="destructive">
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Révocation en cours...
                  </>
                ) : (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Révoquer
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <Alert
            className={
              message.type === "error"
                ? "border-destructive"
                : message.type === "success"
                  ? "border-secondary"
                  : "border-primary"
            }
          >
            {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}

        {/* Revocation Details */}
        {revokedDoctor && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-5 w-5" />
                Accès révoqué avec succès
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Détails du médecin</h4>
                <div className="grid gap-2 md:grid-cols-2 text-sm">
                  <p>
                    <span className="font-medium">Nom:</span> {revokedDoctor.nom}
                  </p>
                  <p>
                    <span className="font-medium">Prénom:</span> {revokedDoctor.prenom}
                  </p>
                  <p>
                    <span className="font-medium">Licence:</span> {revokedDoctor.numeroLicence}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {revokedDoctor.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Badge variant="destructive">
                  <UserX className="mr-1 h-3 w-3" />
                  ACCÈS RÉVOQUÉ
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Le {revokedDoctor.dateRevocation} à {revokedDoctor.heureRevocation}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authorized Doctors Reference */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">Médecins autorisés actuellement</CardTitle>
            <CardDescription>Liste des médecins ayant actuellement accès à vos dossiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {mockAuthorizedDoctors.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                  <div className="text-sm">
                    <span className="font-medium">
                      {doctor.prenom} {doctor.nom}
                    </span>
                    <span className="text-muted-foreground ml-2">({doctor.numeroLicence})</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Autorisé
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Information importante</h4>
              <p className="text-sm text-muted-foreground">
                La révocation d'accès est immédiate et définitive. Le médecin ne pourra plus consulter vos dossiers
                médicaux et devra faire une nouvelle demande d'accès si nécessaire. Cette action est irréversible.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
