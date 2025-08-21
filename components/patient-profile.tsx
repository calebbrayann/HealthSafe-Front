"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Copy, Check } from "lucide-react"

interface PatientProfileProps {
  user: {
    email: string
    nom?: string
    prenom?: string
    codePatient?: string
  }
}

export default function PatientProfile({ user }: PatientProfileProps) {
  const [codePatient, setCodePatient] = useState(user.codePatient || "PAT-2024-001234")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleRegenerateCode = async () => {
    setIsRegenerating(true)
    setShowSuccess(false)

    // Simulate API call to regenerate patient code
    setTimeout(() => {
      const newCode = `PAT-2024-${Math.random().toString().substring(2, 8)}`
      setCodePatient(newCode)
      setIsRegenerating(false)
      setShowSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codePatient)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy code:", err)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Vos informations de profil patient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Nom</p>
              <p className="text-sm text-muted-foreground">{user.nom || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Prénom</p>
              <p className="text-sm text-muted-foreground">{user.prenom || "Non renseigné"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Email</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Code Patient</CardTitle>
          <CardDescription>Votre identifiant unique pour les consultations médicales</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showSuccess && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>Votre code patient a été régénéré avec succès !</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <code className="flex-1 text-lg font-mono font-semibold text-primary">{codePatient}</code>
            <Button size="sm" variant="outline" onClick={handleCopyCode} className="shrink-0 bg-transparent">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleRegenerateCode}
              disabled={isRegenerating}
              variant="outline"
              className="w-full bg-transparent"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Régénération...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Régénérer mon code patient
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Utilisez ce code lors de vos rendez-vous médicaux pour vous identifier rapidement
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
