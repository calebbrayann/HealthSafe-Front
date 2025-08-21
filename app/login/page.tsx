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
import { login as apiLogin } from "@/lib/api"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      setIsLoading(false)
      return
    }

    if (!email.includes("@")) {
      setError("Veuillez entrer une adresse email valide")
      setIsLoading(false)
      return
    }

    try {
      const response = await apiLogin({ email, password })
      const token = response?.token
      const roleRaw = response?.role ?? response?.user?.role ?? response?.data?.role

      if (!token) {
        // Préserver le message exact si fourni par l'API
        throw new Error(response?.message || "Identifiants invalides ou token manquant dans la réponse")
      }

      // Stocker le token pour les prochaines requêtes
      localStorage.setItem("token", token)

      // Déterminer la route selon le rôle
      const role = String(roleRaw || "").toUpperCase()
      let destination = "/"
      switch (role) {
        case "PATIENT":
          destination = "/dashboard/patient"
          break
        case "MEDECIN":
          destination = "/dashboard/medecin"
          break
        case "ADMIN_HOPITAL":
          destination = "/dashboard/admin-hopital"
          break
        case "SUPER_ADMIN":
          destination = "/dashboard/super-admin"
          break
        default:
          destination = "/"
      }

      setIsLoading(false)
      router.push(destination)
    } catch (err: any) {
      // Afficher le message exact renvoyé par l'API si disponible
      const message = err?.message || "Échec de la connexion. Veuillez réessayer."
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/digital-health.jpg')",
        }}
      ></div>

      <div className="w-full max-w-md space-y-6 relative z-10">
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
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Connexion</h1>
            <p className="text-white/90 drop-shadow-md">Connectez-vous à votre compte HealthSafe</p>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Se connecter</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
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

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <Link href="/forgot-password" className="text-sm text-white hover:underline drop-shadow-md">
            Mot de passe oublié ?
          </Link>
          <div className="text-sm text-white/90 drop-shadow-md">
            Pas encore de compte ?{" "}
            <Link href="/" className="text-white hover:underline font-medium">
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
