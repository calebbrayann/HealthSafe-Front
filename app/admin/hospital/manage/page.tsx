"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, UserCheck, Trash2 } from "lucide-react"

// Mock doctors data for hospital admin
const mockDoctors = [
  {
    id: 1,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@chu-paris.fr",
    specialite: "Cardiologie",
    hopital: "CHU de Paris",
    numeroLicence: "123456789",
    actif: true,
    valide: true,
  },
  {
    id: 2,
    nom: "Dubois",
    prenom: "Pierre",
    email: "pierre.dubois@chu-paris.fr",
    specialite: "Neurologie",
    hopital: "CHU de Paris",
    numeroLicence: "987654321",
    actif: true,
    valide: false,
  },
  {
    id: 3,
    nom: "Leroy",
    prenom: "Anne",
    email: "anne.leroy@chu-paris.fr",
    specialite: "Pédiatrie",
    hopital: "CHU de Paris",
    numeroLicence: "456789123",
    actif: true,
    valide: true,
  },
  {
    id: 4,
    nom: "Bernard",
    prenom: "Paul",
    email: "paul.bernard@chu-paris.fr",
    specialite: "Orthopédie",
    hopital: "CHU de Paris",
    numeroLicence: "789123456",
    actif: false,
    valide: true,
  },
]

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState(mockDoctors)
  const [filteredDoctors, setFilteredDoctors] = useState(mockDoctors)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteEmail, setDeleteEmail] = useState("")
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

  useEffect(() => {
    let filtered = doctors

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.numeroLicence.includes(searchTerm) ||
          doctor.hopital.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialite.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredDoctors(filtered)
  }, [doctors, searchTerm])

  const handleValidateDoctor = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    if (doctor) {
      setDoctors((prev) => prev.map((d) => (d.id === doctorId ? { ...d, valide: true } : d)))
      setMessage(`Dr. ${doctor.prenom} ${doctor.nom} a été validé(e) avec succès.`)
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleDeleteDoctor = (doctorId: number) => {
    const doctor = doctors.find((d) => d.id === doctorId)
    if (doctor) {
      setDoctors((prev) => prev.filter((d) => d.id !== doctorId))
      setMessage(`Dr. ${doctor.prenom} ${doctor.nom} a été supprimé(e) avec succès.`)
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleDeleteByEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setIsLoading(true)

    if (!deleteEmail) {
      setMessage("Veuillez entrer une adresse email")
      setMessageType("error")
      setIsLoading(false)
      return
    }

    const doctor = doctors.find((d) => d.email.toLowerCase() === deleteEmail.toLowerCase())

    setTimeout(() => {
      if (doctor) {
        setDoctors((prev) => prev.filter((d) => d.id !== doctor.id))
        setMessage(`Dr. ${doctor.prenom} ${doctor.nom} a été supprimé(e) avec succès.`)
        setMessageType("success")
        setDeleteEmail("")
      } else {
        setMessage("Aucun médecin trouvé avec cette adresse email.")
        setMessageType("error")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des médecins</h1>
            <p className="text-muted-foreground">Recherchez et gérez les médecins de votre hôpital</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Delete by Email Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Supprimer un médecin
              </CardTitle>
              <CardDescription>Supprimez un médecin en saisissant son email</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDeleteByEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deleteEmail">Email du médecin *</Label>
                  <Input
                    id="deleteEmail"
                    type="email"
                    placeholder="medecin@hopital.fr"
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" variant="destructive" className="w-full" disabled={isLoading}>
                  {isLoading ? "Suppression..." : "Supprimer"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>Vue d'ensemble des médecins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Total médecins:</span>
                <Badge>{doctors.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Validés:</span>
                <Badge variant="default">{doctors.filter((d) => d.valide).length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">En attente:</span>
                <Badge variant="secondary">{doctors.filter((d) => !d.valide).length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Inactifs:</span>
                <Badge variant="destructive">{doctors.filter((d) => !d.actif).length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Raccourcis vers les fonctions courantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link href="/admin/hospital/doctors">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Valider un médecin
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href="/admin/users">
                  <Search className="mr-2 h-4 w-4" />
                  Voir tous les utilisateurs
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des médecins</CardTitle>
            <CardDescription>Recherchez et gérez les médecins de votre hôpital</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={messageType === "error" ? "destructive" : "default"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, numéro de licence, hôpital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Doctors Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Spécialité</TableHead>
                    <TableHead>Licence</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Aucun médecin trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              Dr. {doctor.prenom} {doctor.nom}
                            </p>
                            <p className="text-sm text-muted-foreground">{doctor.hopital}</p>
                          </div>
                        </TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.specialite}</TableCell>
                        <TableCell>
                          <code className="text-sm">{doctor.numeroLicence}</code>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Badge variant={doctor.valide ? "default" : "secondary"}>
                              {doctor.valide ? "Validé" : "En attente"}
                            </Badge>
                            <Badge variant={doctor.actif ? "outline" : "destructive"}>
                              {doctor.actif ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!doctor.valide && (
                              <Button size="sm" onClick={() => handleValidateDoctor(doctor.id)}>
                                Valider
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteDoctor(doctor.id)}>
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-muted-foreground">
              Affichage de {filteredDoctors.length} médecin(s) sur {doctors.length} au total
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
