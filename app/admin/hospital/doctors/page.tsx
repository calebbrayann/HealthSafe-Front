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
import { ArrowLeft, UserCheck } from "lucide-react"

export default function ValidateDoctorsPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
  })
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "ADMIN_HOPITAL" && !parsedUser.email.includes("hopital")) {
      router.push("/admin")
      return
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)

    if (!formData.nom || !formData.prenom) {
      setMessage("Veuillez remplir tous les champs")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.2 // 80% success rate for demo

      if (success) {
        setMessage(`Dr. ${formData.prenom} ${formData.nom} a été validé(e) avec succès.`)
        setMessageType("success")
        setFormData({ nom: "", prenom: "" })
      } else {
        setMessage("Erreur: Médecin introuvable ou déjà validé.")
        setMessageType("error")
      }
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hospital-admin-bg.png')",
        }}
      ></div>

      <div className="relative z-10 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Valider un médecin</h1>
              <p className="text-white/90 drop-shadow-md">Validation des médecins de votre hôpital</p>
            </div>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Validation de médecin
              </CardTitle>
              <CardDescription>Validez un médecin en saisissant son nom et prénom</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                  <Alert variant={messageType === "error" ? "destructive" : "default"}>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom *</Label>
                    <Input
                      id="nom"
                      name="nom"
                      type="text"
                      placeholder="Dupont"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prenom">Prénom *</Label>
                    <Input
                      id="prenom"
                      name="prenom"
                      type="text"
                      placeholder="Marie"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <Alert>
                  <AlertDescription>
                    Cette action validera le médecin et lui donnera accès à la plateforme pour votre hôpital.
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Validation en cours..." : "Valider"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
