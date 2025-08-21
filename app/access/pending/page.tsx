"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, User, Mail, FileText } from "lucide-react"
import Link from "next/link"

// Mock data
const mockPendingRequests = [
  {
    id: "DEM-01",
    medecin: { nom: "Martin", prenom: "Alice", numeroLicence: "MED-01", email: "alice.martin@mail.com" },
    patient: { nom: "Doe", prenom: "John", codePatient: "PAT-01", email: "john.doe@mail.com" },
    statut: "EN_ATTENTE",
    dateCreation: "15/01/2024",
  },
  {
    id: "DEM-02",
    medecin: { nom: "Dubois", prenom: "Pierre", numeroLicence: "MED-02", email: "pierre.dubois@mail.com" },
    patient: { nom: "Doe", prenom: "John", codePatient: "PAT-01", email: "john.doe@mail.com" },
    statut: "EN_ATTENTE",
    dateCreation: "14/01/2024",
  },
  {
    id: "DEM-03",
    medecin: { nom: "Leroy", prenom: "Sophie", numeroLicence: "MED-03", email: "sophie.leroy@mail.com" },
    patient: { nom: "Doe", prenom: "John", codePatient: "PAT-01", email: "john.doe@mail.com" },
    statut: "EN_ATTENTE",
    dateCreation: "13/01/2024",
  },
]

export default function PendingRequestsPage() {
  const [requests, setRequests] = useState(mockPendingRequests)
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; content: string } | null>(null)
  const [responseDetails, setResponseDetails] = useState<any>(null)
  const [userRole] = useState("patient") // Mock role - in real app would come from auth

  const handleResponse = async (requestId: string, decision: "ACCEPTE" | "REFUSE") => {
    setIsLoading(requestId)
    setMessage(null)
    setResponseDetails(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock role validation
    if (userRole !== "patient") {
      setMessage({ type: "error", content: "Seuls les patients peuvent répondre aux demandes." })
      setIsLoading(null)
      return
    }

    // Validate decision
    if (!["ACCEPTE", "REFUSE"].includes(decision)) {
      setMessage({ type: "error", content: "Décision invalide." })
      setIsLoading(null)
      return
    }

    // Find request
    const request = requests.find((r) => r.id === requestId)
    if (!request) {
      setMessage({ type: "error", content: "Demande introuvable." })
      setIsLoading(null)
      return
    }

    // Success - process response
    const updatedRequest = {
      ...request,
      statut: decision,
      dateReponse: new Date().toLocaleDateString("fr-FR"),
    }

    setResponseDetails(updatedRequest)
    setMessage({
      type: "success",
      content: `Demande ${decision === "ACCEPTE" ? "acceptée" : "refusée"} avec succès.`,
    })

    // Remove request from pending list
    setRequests((prev) => prev.filter((r) => r.id !== requestId))
    setIsLoading(null)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Demandes en attente</h1>
            <p className="text-muted-foreground">Gérer les demandes d'accès à vos dossiers médicaux</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{requests.length}</p>
                  <p className="text-sm text-muted-foreground">Demandes en attente</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{new Set(requests.map((r) => r.medecin.numeroLicence)).size}</p>
                  <p className="text-sm text-muted-foreground">Médecins différents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Dossiers concernés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Demandes d'accès en attente
            </CardTitle>
            <CardDescription>Acceptez ou refusez les demandes d'accès à vos dossiers médicaux</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune demande en attente</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Médecin</TableHead>
                      <TableHead>Licence</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date demande</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {request.medecin.prenom} {request.medecin.nom}
                            </p>
                            <p className="text-sm text-muted-foreground">ID: {request.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.medecin.numeroLicence}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{request.medecin.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{request.dateCreation}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            <Clock className="mr-1 h-3 w-3" />
                            {request.statut}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleResponse(request.id, "ACCEPTE")}
                              disabled={isLoading === request.id}
                            >
                              {isLoading === request.id ? (
                                <Clock className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Accepter
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleResponse(request.id, "REFUSE")}
                              disabled={isLoading === request.id}
                            >
                              {isLoading === request.id ? (
                                <Clock className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="mr-1 h-4 w-4" />
                                  Refuser
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <Alert
            className={
              message.type === "error"
                ? "border-destructive"
                : message.type === "success"
                  ? "border-secondary"
                  : "border-primary"
            }
          >
            {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>{message.content}</AlertDescription>
          </Alert>
        )}

        {/* Response Details */}
        {responseDetails && (
          <Card className="border-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <CheckCircle className="h-5 w-5" />
                Décision enregistrée
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Détails Patient</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Nom:</span> {responseDetails.patient.nom}
                    </p>
                    <p>
                      <span className="font-medium">Prénom:</span> {responseDetails.patient.prenom}
                    </p>
                    <p>
                      <span className="font-medium">Code:</span> {responseDetails.patient.codePatient}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {responseDetails.patient.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Détails Médecin</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Nom:</span> {responseDetails.medecin.nom}
                    </p>
                    <p>
                      <span className="font-medium">Prénom:</span> {responseDetails.medecin.prenom}
                    </p>
                    <p>
                      <span className="font-medium">Licence:</span> {responseDetails.medecin.numeroLicence}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {responseDetails.medecin.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Badge
                  variant={responseDetails.statut === "ACCEPTE" ? "default" : "destructive"}
                  className={responseDetails.statut === "ACCEPTE" ? "bg-secondary" : ""}
                >
                  {responseDetails.statut === "ACCEPTE" ? (
                    <CheckCircle className="mr-1 h-3 w-3" />
                  ) : (
                    <XCircle className="mr-1 h-3 w-3" />
                  )}
                  {responseDetails.statut}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Demande créée le {responseDetails.dateCreation} • Réponse le {responseDetails.dateReponse}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Information</h4>
              <p className="text-sm text-muted-foreground">
                En acceptant une demande, vous autorisez le médecin à consulter vos dossiers médicaux. En refusant,
                l'accès sera définitivement refusé pour cette demande. Vous pouvez toujours révoquer un accès
                ultérieurement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
