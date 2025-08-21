"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, UserX, AlertTriangle } from "lucide-react"

export default function RevokeAdminPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "SUPER_ADMIN" && !parsedUser.email.includes("admin")) {
      router.push("/admin")
      return
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!showConfirmation) {
      if (!email) {
        setMessage("Veuillez entrer une adresse email")
        setMessageType("error")
        return
      }

      if (!email.includes("@")) {
        setMessage("Veuillez entrer une adresse email valide")
        setMessageType("error")
        return
      }

      setShowConfirmation(true)
      setMessage("")
      return
    }

    setMessage("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% success rate for demo

      if (success) {
        setMessage(`Les droits d'administration de ${email} ont été révoqués avec succès.`)
        setMessageType("success")
        setEmail("")
        setShowConfirmation(false)
      } else {
        setMessage("Erreur: Admin introuvable ou déjà révoqué.")
        setMessageType("error")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Révoquer un admin</h1>
            <p className="text-muted-foreground">Retirer les droits d'administration d'un utilisateur</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Révocation d'admin
            </CardTitle>
            <CardDescription>
              {showConfirmation
                ? "Confirmez la révocation des droits d'administration"
                : "Entrez l'email de l'administrateur à révoquer"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {message && (
                <Alert variant={messageType === "error" ? "destructive" : "default"}>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {!showConfirmation ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email de l'administrateur *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@hopital.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Attention :</strong> Cette action retirera tous les droits d'administration de
                      l'utilisateur. Il ne pourra plus gérer les médecins de son hôpital.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" variant="destructive">
                    Continuer
                  </Button>
                </>
              ) : (
                <>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Confirmation requise</strong>
                      <br />
                      Vous êtes sur le point de révoquer les droits d'administration de :
                      <br />
                      <strong>{email}</strong>
                      <br />
                      Cette action est irréversible.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancel}>
                      Annuler
                    </Button>
                    <Button type="submit" variant="destructive" className="flex-1" disabled={isLoading}>
                      {isLoading ? "Révocation..." : "Confirmer la révocation"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
