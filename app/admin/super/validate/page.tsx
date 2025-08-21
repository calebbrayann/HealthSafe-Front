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
import { ArrowLeft, UserCheck, Clock } from "lucide-react"

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

// Mock data for pending admins
const pendingAdmins = [
  {
    id: 1,
    nom: "Martin",
    prenom: "Sophie",
    numeroLicence: "123456789",
    hopital: "CHU de Paris",
    email: "sophie.martin@chu-paris.fr",
    dateCreation: "2024-01-15",
  },
  {
    id: 2,
    nom: "Dubois",
    prenom: "Pierre",
    numeroLicence: "987654321",
    hopital: "Hôpital Saint-Louis",
    email: "pierre.dubois@saint-louis.fr",
    dateCreation: "2024-01-14",
  },
  {
    id: 3,
    nom: "Leroy",
    prenom: "Anne",
    numeroLicence: "456789123",
    hopital: "CHU de Lyon",
    email: "anne.leroy@chu-lyon.fr",
    dateCreation: "2024-01-13",
  },
]

export default function ValidateAdminPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    numeroLicence: "",
    hopital: "",
  })
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [admins, setAdmins] = useState(pendingAdmins)
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
      const success = Math.random() > 0.2 // 80% success rate for demo

      if (success) {
        setMessage(`Admin ${formData.prenom} ${formData.nom} de ${formData.hopital} a été validé(e) avec succès.`)
        setMessageType("success")
        setFormData({ nom: "", prenom: "", numeroLicence: "", hopital: "" })
      } else {
        setMessage("Erreur: Admin introuvable ou déjà validé.")
        setMessageType("error")
      }
      setIsLoading(false)
    }, 1500)
  }

  const handleValidateFromTable = (admin: any) => {
    setMessage(`Admin ${admin.prenom} ${admin.nom} de ${admin.hopital} a été validé(e) avec succès.`)
    setMessageType("success")
    setAdmins((prev) => prev.filter((a) => a.id !== admin.id))
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Valider un admin d'hôpital</h1>
            <p className="text-muted-foreground">Validation des demandes d'administration</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Validation manuelle
              </CardTitle>
              <CardDescription>Valider un admin d'hôpital en saisissant ses informations</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                  <Alert variant={messageType === "error" ? "destructive" : "default"}>
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Validation en cours..." : "Valider"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Admins en attente ({admins.length})
              </CardTitle>
              <CardDescription>Liste des demandes d'administration en attente de validation</CardDescription>
            </CardHeader>
            <CardContent>
              {admins.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Aucune demande en attente</p>
              ) : (
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {admin.prenom} {admin.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">{admin.hopital}</p>
                        <p className="text-xs text-muted-foreground">Licence: {admin.numeroLicence}</p>
                      </div>
                      <Button size="sm" onClick={() => handleValidateFromTable(admin)}>
                        Valider
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
