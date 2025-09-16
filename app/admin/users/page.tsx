"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Filter, ArrowLeft, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getUtilisateurs, reactiverUtilisateur } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import SecureLayout from "@/components/SecureLayout"

export default function UsersManagementPage() {
  const { user } = useAuth()
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [utilisateurs, searchTerm, roleFilter, statusFilter])

  const loadUsers = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await getUtilisateurs()
      setUtilisateurs((response as any) || [])
      setSuccess("Utilisateurs chargés avec succès")
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des utilisateurs")
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = [...utilisateurs]

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    if (statusFilter) {
      const isActive = statusFilter === "active"
      filtered = filtered.filter(user => user.actif === isActive)
    }

    setFilteredUsers(filtered)
  }

  const handleReactiverUser = async (userId: string) => {
    setIsLoading(true)
    setError("")
    try {
      await reactiverUtilisateur(userId)
      setSuccess("Utilisateur réactivé avec succès")
      await loadUsers() // Recharger la liste
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la réactivation")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "default"
      case "ADMIN_HOPITAL":
        return "secondary"
      case "MEDECIN":
        return "outline"
      case "PATIENT":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <SecureLayout allowedRoles={["SUPER_ADMIN", "ADMIN_HOPITAL"]}>
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
                <p className="text-muted-foreground">
                  Gérez tous les utilisateurs du système
                </p>
              </div>
            </div>
            <Button onClick={loadUsers} disabled={isLoading} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>

          {/* Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Nom, prénom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les rôles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les rôles</SelectItem>
                      <SelectItem value="PATIENT">Patient</SelectItem>
                      <SelectItem value="MEDECIN">Médecin</SelectItem>
                      <SelectItem value="ADMIN_HOPITAL">Admin Hôpital</SelectItem>
                      <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous les statuts</SelectItem>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm("")
                      setRoleFilter("")
                      setStatusFilter("")
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Effacer les filtres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Utilisateurs ({filteredUsers.length})
                </div>
              </CardTitle>
              <CardDescription>
                {utilisateurs.length} utilisateur(s) au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Chargement des utilisateurs...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((utilisateur, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                              {utilisateur.prenom} {utilisateur.nom}
                            </h3>
                            <Badge variant={getRoleBadgeVariant(utilisateur.role)}>
                              {utilisateur.role}
                            </Badge>
                            <Badge variant={utilisateur.actif ? "default" : "secondary"}>
                              {utilisateur.actif ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Email: {utilisateur.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {utilisateur.id}
                          </p>
                          {utilisateur.numeroLicence && (
                            <p className="text-sm text-muted-foreground">
                              Licence: {utilisateur.numeroLicence}
                            </p>
                          )}
                          {utilisateur.codePatient && (
                            <p className="text-sm text-muted-foreground">
                              Code Patient: {utilisateur.codePatient}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!utilisateur.actif && (
                            <Button
                              onClick={() => handleReactiverUser(utilisateur.id)}
                              size="sm"
                              variant="outline"
                              disabled={isLoading}
                            >
                              Réactiver
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SecureLayout>
  )
}