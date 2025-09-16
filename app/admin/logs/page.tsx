"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, Filter, ArrowLeft, RefreshCw, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getLogs } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import SecureLayout from "@/components/SecureLayout"

export default function LogsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<any[]>([])
  const [filteredLogs, setFilteredLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, actionFilter])

  const loadLogs = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await getLogs()
      setLogs((response as any) || [])
      setSuccess("Logs chargés avec succès")
    } catch (err: any) {
      setError(err?.message || "Erreur lors du chargement des logs")
    } finally {
      setIsLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = [...logs]

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.utilisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.utilisateur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.utilisateur?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (actionFilter) {
      filtered = filtered.filter(log => log.action === actionFilter)
    }

    setFilteredLogs(filtered)
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "default"
      case "LOGOUT":
        return "secondary"
      case "CREATE_DOSSIER":
        return "outline"
      case "UPDATE_DOSSIER":
        return "destructive"
      case "AUTORISATION_MEDECIN":
        return "default"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const getUniqueActions = () => {
    const actions = [...new Set(logs.map(log => log.action).filter(Boolean))]
    return actions.sort()
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
                <h1 className="text-3xl font-bold text-foreground">Logs Système</h1>
                <p className="text-muted-foreground">
                  Consultez l'historique des actions du système
                </p>
              </div>
            </div>
            <Button onClick={loadLogs} disabled={isLoading} variant="outline">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">Rechercher</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Action, utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="action">Action</Label>
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Toutes les actions</SelectItem>
                      {getUniqueActions().map(action => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchTerm("")
                      setActionFilter("")
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

          {/* Liste des logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Logs ({filteredLogs.length})
                </div>
              </CardTitle>
              <CardDescription>
                {logs.length} entrée(s) de log au total
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Chargement des logs...</p>
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun log trouvé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLogs.map((log, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={getActionBadgeVariant(log.action)}>
                            {log.action}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ID: {log.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(log.timestamp || log.dateAcces)}
                        </div>
                      </div>
                      
                      {log.utilisateur && (
                        <div className="mb-2">
                          <p className="text-sm">
                            <span className="font-medium">Utilisateur:</span>{" "}
                            {log.utilisateur.prenom} {log.utilisateur.nom} ({log.utilisateur.email})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Rôle: {log.utilisateur.role}
                          </p>
                        </div>
                      )}
                      
                      {log.meta && (
                        <div className="mb-2">
                          <p className="text-sm">
                            <span className="font-medium">Détails:</span>{" "}
                            {JSON.stringify(log.meta, null, 2)}
                          </p>
                        </div>
                      )}
                      
                      {log.cibleId && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Cible ID:</span> {log.cibleId}
                        </div>
                      )}
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