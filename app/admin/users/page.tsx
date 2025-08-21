"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Search, Users, UserCheck, UserX } from "lucide-react"

// Mock user data
const mockUsers = [
  {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    role: "Patient",
    actif: true,
    codePatient: "PAT-2024-001234",
    dateCreation: "2024-01-15",
  },
  {
    id: 2,
    nom: "Martin",
    prenom: "Sophie",
    email: "sophie.martin@chu-paris.fr",
    role: "Médecin",
    actif: true,
    numeroLicence: "123456789",
    specialite: "Cardiologie",
    hopital: "CHU de Paris",
    dateCreation: "2024-01-10",
  },
  {
    id: 3,
    nom: "Leroy",
    prenom: "Pierre",
    email: "pierre.leroy@email.com",
    role: "Patient",
    actif: false,
    codePatient: "PAT-2024-001235",
    dateCreation: "2024-01-12",
  },
  {
    id: 4,
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@saint-louis.fr",
    role: "Médecin",
    actif: false,
    numeroLicence: "987654321",
    specialite: "Neurologie",
    hopital: "Hôpital Saint-Louis",
    dateCreation: "2024-01-08",
  },
  {
    id: 5,
    nom: "Bernard",
    prenom: "Paul",
    email: "paul.bernard@admin.fr",
    role: "Admin",
    actif: true,
    hopital: "CHU de Lyon",
    dateCreation: "2024-01-05",
  },
  {
    id: 6,
    nom: "Moreau",
    prenom: "Anne",
    email: "anne.moreau@email.com",
    role: "Patient",
    actif: true,
    codePatient: "PAT-2024-001236",
    dateCreation: "2024-01-14",
  },
  {
    id: 7,
    nom: "Petit",
    prenom: "Luc",
    email: "luc.petit@cochin.fr",
    role: "Médecin",
    actif: true,
    numeroLicence: "456789123",
    specialite: "Pédiatrie",
    hopital: "Hôpital Cochin",
    dateCreation: "2024-01-11",
  },
  {
    id: 8,
    nom: "Roux",
    prenom: "Claire",
    email: "claire.roux@admin.fr",
    role: "Admin",
    actif: false,
    hopital: "CHU de Marseille",
    dateCreation: "2024-01-07",
  },
]

export default function UsersManagementPage() {
  const [users, setUsers] = useState(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!["SUPER_ADMIN", "ADMIN_HOPITAL"].includes(parsedUser.role) && !parsedUser.email.includes("admin")) {
      router.push("/admin")
      return
    }
  }, [router])

  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.codePatient && user.codePatient.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.numeroLicence && user.numeroLicence.includes(searchTerm)) ||
          (user.hopital && user.hopital.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => (statusFilter === "active" ? user.actif : !user.actif))
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleReactivateUser = (userId: number) => {
    const user = users.find((u) => u.id === userId)
    if (user) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, actif: true } : u)))
      setMessage(`Utilisateur ${user.prenom} ${user.nom} réactivé avec succès.`)
      setMessageType("success")

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Admin":
        return "default"
      case "Médecin":
        return "secondary"
      case "Patient":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusBadgeVariant = (actif: boolean) => {
    return actif ? "default" : "destructive"
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
            <h1 className="text-2xl font-bold text-foreground">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground">Vue d'ensemble et gestion de tous les utilisateurs</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "Patient").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Médecins</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.role === "Médecin").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inactifs</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => !u.actif).length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
            <CardDescription>Recherchez et gérez tous les utilisateurs de la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={messageType === "error" ? "destructive" : "default"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email, code patient, licence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  <SelectItem value="Patient">Patients</SelectItem>
                  <SelectItem value="Médecin">Médecins</SelectItem>
                  <SelectItem value="Admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Identifiant</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {user.prenom} {user.nom}
                            </p>
                            {user.hopital && <p className="text-sm text-muted-foreground">{user.hopital}</p>}
                            {user.specialite && <p className="text-sm text-muted-foreground">{user.specialite}</p>}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.actif)}>{user.actif ? "Actif" : "Inactif"}</Badge>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm">{user.codePatient || user.numeroLicence || "N/A"}</code>
                        </TableCell>
                        <TableCell>
                          {!user.actif && (
                            <Button size="sm" onClick={() => handleReactivateUser(user.id)}>
                              Réactiver
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="text-sm text-muted-foreground">
              Affichage de {filteredUsers.length} utilisateur(s) sur {users.length} au total
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
