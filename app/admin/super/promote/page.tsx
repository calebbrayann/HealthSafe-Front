"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield } from "lucide-react"

const hopitaux = [
  "CHU de Paris",
  "Hôpital Saint-Louis",
  "Hôpital Cochin",
  "Hôpital Pitié-Salpêtrière",
  "Hôpital Necker",
  "CHU de Lyon",
  "CHU de Marseille",
  "CHU de Toulouse",
  "CHU de Bordeaux",
  "CHU de Lille",
]

export default function PromoteDoctorPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    numeroLicence: "",
    hopital: "",
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
    if (parsedUser.role !== "SUPER_ADMIN" && !parsedUser.email.includes("admin")) {
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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      hopital: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)

    if (!formData.nom || !formData.prenom || !formData.numeroLicence || !formData.hopital) {
      setMessage("Veuillez remplir tous les champs")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      // Mock success/error response
      const success = Math.random() > 0.3 // 70% success rate for demo

      if (success) {
        setMessage(`Dr. ${formData.prenom} ${formData.nom} a été promu(e) admin de ${formData.hopital} avec succès.`)
        setMessageType("success")
        setFormData({ nom: "", prenom: "", numeroLicence: "", hopital: "" })
      } else {
        setMessage("Erreur: Médecin introuvable ou déjà administrateur.")
        setMessageType("error")
      }
      setIsLoading(false)
    }, 1500)
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
            <h1 className="text-2xl font-bold text-foreground">Promouvoir un médecin</h1>
            <p className="text-muted-foreground">Nommer un médecin comme administrateur d'hôpital</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Promotion en Admin Hôpital
            </CardTitle>
            <CardDescription>
              Remplissez les informations du médecin à promouvoir comme administrateur d'hôpital
            </CardDescription>
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

              <div className="space-y-2">
                <Label htmlFor="numeroLicence">Numéro de licence *</Label>
                <Input
                  id="numeroLicence"
                  name="numeroLicence"
                  type="text"
                  placeholder="123456789"
                  value={formData.numeroLicence}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hopital">Hôpital *</Label>
                <Select onValueChange={handleSelectChange} value={formData.hopital}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez l'hôpital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hopitaux.map((hopital) => (
                      <SelectItem key={hopital} value={hopital}>
                        {hopital}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Attention :</strong> Cette action donnera au médecin les droits d'administration pour
                  l'hôpital sélectionné. Il pourra valider et supprimer d'autres médecins de cet établissement.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Promotion en cours..." : "Promouvoir"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
