"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { verifyEmail } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [userRole, setUserRole] = useState<string>("")
  const router = useRouter()
  const params = useParams()
  const token = params.token as string
  const { refreshUser } = useAuth()

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Token de vérification manquant")
        return
      }

      try {
        const response = await verifyEmail(token)
        setStatus("success")
        setMessage((response as any)?.message || "Email vérifié avec succès")
        setUserRole((response as any)?.role || "")
        
        // Rafraîchir les données utilisateur dans le contexte d'authentification
        await refreshUser()
        
        // Redirection selon le rôle
        setTimeout(() => {
          switch ((response as any)?.role) {
            case "PATIENT":
              router.push("/dashboard/patient")
              break
            case "MEDECIN":
              router.push("/dashboard/medecin")
              break
            case "ADMIN_HOPITAL":
              router.push("/dashboard/admin-hopital")
              break
            case "SUPER_ADMIN":
              router.push("/dashboard/super-admin")
              break
            default:
              router.push("/login")
          }
        }, 2000)
      } catch (error: any) {
        setStatus("error")
        setMessage(error?.message || "Erreur lors de la vérification de l'email")
      }
    }

    verifyToken()
  }, [token, router])

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return "border-blue-200 bg-blue-50"
      case "success":
        return "border-green-200 bg-green-50"
      case "error":
        return "border-red-200 bg-red-50"
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/digital-health.jpg')" }}></div>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Image src="/images/healthsafe-logo.png" alt="HealthSafe Logo" width={80} height={80} className="mx-auto" />
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">Vérification de l'email</h1>
        </div>
        <Card className={`${getStatusColor()} border-2`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">{getStatusIcon()}</div>
            <CardTitle>
              {status === "loading" && "Vérification en cours..."}
              {status === "success" && "Email vérifié !"}
              {status === "error" && "Erreur de vérification"}
            </CardTitle>
            <CardDescription>
              {status === "loading" && "Veuillez patienter pendant que nous vérifions votre email"}
              {status === "success" && "Votre compte a été activé avec succès"}
              {status === "error" && "Impossible de vérifier votre email"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={status === "error" ? "destructive" : "default"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            {status === "success" && userRole && (
              <div className="text-center text-sm text-muted-foreground">
                Redirection vers votre tableau de bord...
              </div>
            )}
            {status === "error" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  Le lien de vérification est peut-être expiré ou invalide.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
