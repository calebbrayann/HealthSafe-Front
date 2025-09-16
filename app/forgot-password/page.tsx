"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { requestResetPassword } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    
    if (!email) {
      setError("Veuillez entrer votre adresse email")
      return
    }

    if (!validateEmail(email)) {
      setError("Veuillez entrer une adresse email valide")
      return
    }

    setIsLoading(true)

    try {
      const response = await requestResetPassword({ email })
      setSuccess((response as any)?.message || "Email de réinitialisation envoyé")
      setIsSubmitted(true)
    } catch (err: any) {
      const message = err?.message || "Erreur lors de l'envoi de l'email de réinitialisation"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Email envoyé !
              </h2>
              <p className="text-gray-600 mb-4">
                Nous avons envoyé un lien de réinitialisation à votre adresse email. 
                Vérifiez votre boîte de réception et suivez les instructions.
              </p>
              <div className="space-y-2">
                <Button onClick={() => router.push("/login")} className="w-full">
                  Retour à la connexion
                </Button>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false)
                    setEmail("")
                    setSuccess("")
                  }} 
                  variant="outline" 
                  className="w-full"
                >
                  Envoyer un autre email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/healthsafe-logo.png"
            alt="HealthSafe Logo"
            width={64}
            height={64}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-900">HealthSafe</h1>
          <p className="text-gray-600 mt-2">Mot de passe oublié</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Réinitialiser le mot de passe</span>
            </CardTitle>
            <CardDescription>
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => router.push("/login")}
                className="text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}