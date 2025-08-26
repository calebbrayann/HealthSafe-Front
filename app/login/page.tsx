"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { login as apiLogin } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { Eye, EyeOff } from "lucide-react"

interface LoginResponse {
  message: string;
  user: {
    id: string;
    role: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { refreshUser } = useAuth()

  useEffect(() => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await apiLogin({ email, password }) as LoginResponse
      console.log("Connexion réussie:", response)

      const loggedUser = response.user
      if (!loggedUser) {
        console.error("Utilisateur non récupéré après login")
        setError("Impossible de récupérer les informations utilisateur")
        setIsLoading(false)
        return
      }

      const role = loggedUser.role?.toUpperCase() || ""
      let redirectPath = "/dashboard"

      switch (role) {
        case "PATIENT":
          redirectPath = "/dashboard/patient"
          break
        case "MEDECIN":
          redirectPath = "/dashboard/medecin"
          break
        case "ADMIN_HOPITAL":
          redirectPath = "/dashboard/admin-hopital"
          break
        case "SUPER_ADMIN":
          redirectPath = "/dashboard/super-admin"
          break
        default:
          redirectPath = "/dashboard"
      }

      console.log(`Redirection vers: ${redirectPath} (rôle: ${role})`)
      router.push(redirectPath)

    } catch (err: any) {
      console.error("Erreur de connexion:", err)
      setError(err?.message || "Erreur de connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">HealthSafe</h1>
          <h2 className="text-2xl font-semibold text-green-400">Connexion</h2>
          <p className="mt-2 text-green-400">
            Accédez à votre espace personnel sécurisé
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">
              Bienvenue
            </CardTitle>
            <CardDescription className="text-center text-green-400">
              Entrez vos identifiants pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-400">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-400">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-green-200 focus:border-green-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Connexion"}
              </Button>

              <div className="text-center space-y-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-400 hover:text-green-600 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
                <div className="text-sm text-green-400">
                  Pas encore de compte ?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-green-600 hover:text-green-700 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
