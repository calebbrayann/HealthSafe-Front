"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { requestResetPassword } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email) {
      setError("Veuillez entrer votre adresse email")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Veuillez entrer une adresse email valide")
      setIsLoading(false)
      return
    }

    try {
      const response = await requestResetPassword({ email })
      setIsSubmitted(true)
      setIsLoading(false)
    } catch (err: any) {
      const message = err?.message || "Échec de l'envoi. Veuillez réessayer."
      setError(message)
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/digital-health.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 w-full max-w-md space-y-6">
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Email envoyé</CardTitle>
              <CardDescription>Vérifiez votre boîte de réception</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  Un email de réinitialisation a été envoyé à {email}. Cliquez sur le lien dans l'email pour
                  réinitialiser votre mot de passe.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full">
                <Link href="/login">Retour à la connexion</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/digital-health.jpg')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Mot de passe oublié</h1>
          <p className="text-white drop-shadow-md">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>Nous vous enverrons un lien pour réinitialiser votre mot de passe</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/login" className="text-sm text-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
