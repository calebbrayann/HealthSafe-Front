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
import { ArrowLeft, Search, Activity, Filter, Calendar } from "lucide-react"

// Mock logs data
const mockLogs = [
  {
    id: 1,
    utilisateur: "Sophie Martin",
    email: "sophie.martin@chu-paris.fr",
    role: "SUPER_ADMIN",
    action: "Promotion médecin en admin",
    details: "Dr. Pierre Dubois promu admin de CHU de Lyon",
    date: "2024-01-20T14:30:00Z",
    ip: "192.168.1.100",
  },
  {
    id: 2,
    utilisateur: "Pierre Leroy",
    email: "pierre.leroy@saint-louis.fr",
    role: "ADMIN_HOPITAL",
    action: "Validation médecin",
    details: "Dr. Anne Bernard validée pour Hôpital Saint-Louis",
    date: "2024-01-20T13:45:00Z",
    ip: "192.168.1.101",
  },
  {
    id: 3,
    utilisateur: "Jean Dupont",
    email: "jean.dupont@email.com",
    role: "Patient",
    action: "Inscription patient",
    details: "Création de compte patient",
    date: "2024-01-20T12:15:00Z",
    ip: "192.168.1.102",
  },
  {
    id: 4,
    utilisateur: "Marie Dubois",
    email: "marie.dubois@cochin.fr",
    role: "Médecin",
    action: "Inscription médecin",
    details: "Demande d'inscription médecin - En attente de validation",
    date: "2024-01-20T11:30:00Z",
    ip: "192.168.1.103",
  },
  {
    id: 5,
    utilisateur: "Sophie Martin",
    email: "sophie.martin@chu-paris.fr",
    role: "SUPER_ADMIN",
    action: "Révocation admin",
    details: "Révocation des droits admin de paul.bernard@admin.fr",
    date: "2024-01-20T10:45:00Z",
    ip: "192.168.1.100",
  },
  {
    id: 6,
    utilisateur: "Paul Bernard",
    email: "paul.bernard@chu-lyon.fr",
    role: "ADMIN_HOPITAL",
    action: "Suppression médecin",
    details: "Suppression du Dr. Claire Roux de CHU de Lyon",
    date: "2024-01-20T09:20:00Z",
    ip: "192.168.1.104",
  },
  {
    id: 7,
    utilisateur: "Anne Moreau",
    email: "anne.moreau@email.com",
    role: "Patient",
    action: "Régénération code patient",
    details: "Nouveau code patient généré: PAT-2024-001237",
    date: "2024-01-20T08:15:00Z",
    ip: "192.168.1.105",
  },
  {
    id: 8,
    utilisateur: "Luc Petit",
    email: "luc.petit@cochin.fr",
    role: "Médecin",
    action: "Connexion",
    details: "Connexion réussie",
    date: "2024-01-20T07:30:00Z",
    ip: "192.168.1.106",
  },
  {
    id: 9,
    utilisateur: "Sophie Martin",
    email: "sophie.martin@chu-paris.fr",
    role: "SUPER_ADMIN",
    action: "Validation admin",
    details: "Validation de l'admin Claire Roux pour CHU de Marseille",
    date: "2024-01-19T16:45:00Z",
    ip: "192.168.1.100",
  },
  {
    id: 10,
    utilisateur: "Pierre Leroy",
    email: "pierre.leroy@saint-louis.fr",
    role: "ADMIN_HOPITAL",
    action: "Réactivation utilisateur",
    details: "Réactivation du compte de marie.dubois@saint-louis.fr",
    date: "2024-01-19T15:20:00Z",
    ip: "192.168.1.101",
  },
  {
    id: 11,
    utilisateur: "System",
    email: "system@mediconnect.fr",
    role: "System",
    action: "Nettoyage automatique",
    details: "Suppression des tokens expirés",
    date: "2024-01-19T02:00:00Z",
    ip: "127.0.0.1",
  },
  {
    id: 12,
    utilisateur: "Jean Martin",
    email: "jean.martin@email.com",
    role: "Patient",
    action: "Échec connexion",
    details: "Tentative de connexion échouée - Mot de passe incorrect",
    date: "2024-01-19T14:30:00Z",
    ip: "192.168.1.107",
  },
]

const actionTypes = [
  "Connexion",
  "Inscription patient",
  "Inscription médecin",
  "Validation médecin",
  "Suppression médecin",
  "Promotion médecin en admin",
  "Validation admin",
  "Révocation admin",
  "Réactivation utilisateur",
  "Régénération code patient",
  "Échec connexion",
  "Nettoyage automatique",
]

const roles = ["Patient", "Médecin", "ADMIN_HOPITAL", "SUPER_ADMIN", "System"]

export default function LogsPage() {
  const [logs, setLogs] = useState(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [actionFilter, setActionFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc")
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
    let filtered = [...logs]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.utilisateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((log) => log.role === roleFilter)
    }

    // Filter by action type
    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

    setFilteredLogs(filtered)
  }, [logs, searchTerm, roleFilter, actionFilter, sortOrder])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "default"
      case "ADMIN_HOPITAL":
        return "secondary"
      case "Médecin":
        return "outline"
      case "Patient":
        return "outline"
      case "System":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("Échec") || action.includes("Suppression") || action.includes("Révocation")) {
      return "destructive"
    }
    if (action.includes("Validation") || action.includes("Promotion") || action.includes("Réactivation")) {
      return "default"
    }
    if (action.includes("Inscription") || action.includes("Connexion")) {
      return "secondary"
    }
    return "outline"
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logs & Traçabilité</h1>
            <p className="text-muted-foreground">Historique des actions et événements système</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total événements</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">Dernières 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actions admin</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter((log) => ["SUPER_ADMIN", "ADMIN_HOPITAL"].includes(log.role)).length}
              </div>
              <p className="text-xs text-muted-foreground">Validations, promotions, etc.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {logs.filter((log) => log.action.includes("Inscription")).length}
              </div>
              <p className="text-xs text-muted-foreground">Patients et médecins</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Échecs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.filter((log) => log.action.includes("Échec")).length}</div>
              <p className="text-xs text-muted-foreground">Connexions échouées</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Journal des événements
            </CardTitle>
            <CardDescription>Historique complet des actions utilisateurs et système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par utilisateur, email, action..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full lg:w-[200px]">
                  <SelectValue placeholder="Filtrer par action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="w-full lg:w-auto"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {sortOrder === "desc" ? "Plus récent" : "Plus ancien"}
              </Button>
            </div>

            {/* Logs Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Détails</TableHead>
                    <TableHead className="hidden md:table-cell">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Aucun log trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{formatDate(log.date)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{log.utilisateur}</p>
                            <p className="text-sm text-muted-foreground">{log.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(log.role)}>{log.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getActionBadgeVariant(log.action)}>{log.action}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm truncate" title={log.details}>
                            {log.details}
                          </p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-mono text-sm">{log.ip}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                Affichage de {filteredLogs.length} événement(s) sur {logs.length} au total
              </span>
              <span>Trié par date ({sortOrder === "desc" ? "décroissant" : "croissant"})</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
