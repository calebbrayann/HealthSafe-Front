"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Shield, AlertCircle, User, Mail, FileText, Search, Calendar } from "lucide-react"
import Link from "next/link"

// Mock data - authorized doctors with associated records
const mockAuthorizedAccess = [
  {
    nom: "Martin",
    prenom: "Alice",
    numeroLicence: "MED-01",
    email: "alice.martin@mail.com",
    dateAutorisation: "10/01/2024",
    dossiersAssocies: [
      { numero: "DOS-001", titre: "Consultation générale", dateCreation: "12/01/2024" },
      { numero: "DOS-003", titre: "Suivi cardiologique", dateCreation: "15/01/2024" },
    ],
  },
  {
    nom: "Dubois",
    prenom: "Pierre",
    numeroLicence: "MED-02",
    email: "pierre.dubois@mail.com",
    dateAutorisation: "08/01/2024",
    dossiersAssocies: [{ numero: "DOS-002", titre: "Radiologie thoracique", dateCreation: "14/01/2024" }],
  },
  {
    nom: "Leroy",
    prenom: "Sophie",
    numeroLicence: "MED-03",
    email: "sophie.leroy@mail.com",
    dateAutorisation: "05/01/2024",
    dossiersAssocies: [
      { numero: "DOS-004", titre: "Consultation dermatologique", dateCreation: "16/01/2024" },
      { numero: "DOS-005", titre: "Suivi allergologique", dateCreation: "18/01/2024" },
      { numero: "DOS-006", titre: "Bilan sanguin", dateCreation: "20/01/2024" },
    ],
  },
  {
    nom: "Bernard",
    prenom: "Marc",
    numeroLicence: "MED-04",
    email: "marc.bernard@mail.com",
    dateAutorisation: "03/01/2024",
    dossiersAssocies: [{ numero: "DOS-007", titre: "Consultation orthopédique", dateCreation: "17/01/2024" }],
  },
]

export default function AuthorizedAccessPage() {
  const [authorizedAccess, setAuthorizedAccess] = useState(mockAuthorizedAccess)
  const [filteredAccess, setFilteredAccess] = useState(mockAuthorizedAccess)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; content: string } | null>(null)
  const [userRole] = useState("patient") // Mock role - in real app would come from auth

  useEffect(() => {
    // Mock role validation
    if (userRole !== "patient") {
      setMessage({ type: "error", content: "Seuls les patients peuvent consulter la liste des accès." })
      return
    }

    // Filter based on search term
    if (searchTerm.trim() === "") {
      setFilteredAccess(authorizedAccess)
    } else {
      const filtered = authorizedAccess.filter(
        (access) =>
          access.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          access.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          access.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          access.numeroLicence.toLowerCase().includes(searchTerm.toLowerCase()) ||
          access.dossiersAssocies.some(
            (dossier) =>
              dossier.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
              dossier.numero.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      )
      setFilteredAccess(filtered)
    }
  }, [searchTerm, authorizedAccess, userRole])

  const totalRecords = authorizedAccess.reduce((total, access) => total + access.dossiersAssocies.length, 0)

  if (userRole !== "patient") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Accès non autorisé</h1>
            </div>
          </div>
          {message && (
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message.content}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Accès autorisés</h1>
            <p className="text-muted-foreground">Liste des médecins autorisés et dossiers associés</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{authorizedAccess.length}</p>
                  <p className="text-sm text-muted-foreground">Médecins autorisés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{totalRecords}</p>
                  <p className="text-sm text-muted-foreground">Dossiers associés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{filteredAccess.length}</p>
                  <p className="text-sm text-muted-foreground">Résultats affichés</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-chart-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round((Date.now() - new Date("2024-01-03").getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-sm text-muted-foreground">Jours depuis 1er accès</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, licence ou dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Authorized Access Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Médecins autorisés et dossiers associés
            </CardTitle>
            <CardDescription>
              Liste complète des médecins ayant accès à vos dossiers médicaux et leurs dossiers associés
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAccess.length === 0 ? (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? "Aucun résultat trouvé" : "Aucun médecin autorisé"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Médecin</TableHead>
                      <TableHead>Licence</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date autorisation</TableHead>
                      <TableHead>Dossiers associés</TableHead>
                      <TableHead className="text-right">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccess.map((access, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">
                                {access.prenom} {access.nom}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{access.numeroLicence}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{access.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>{access.dateAutorisation}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {access.dossiersAssocies.map((dossier, dossierIndex) => (
                              <div key={dossierIndex} className="flex items-center gap-2 text-sm">
                                <FileText className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{dossier.numero}</span>
                                <span className="text-muted-foreground">-</span>
                                <span>{dossier.titre}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {dossier.dateCreation}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="default" className="bg-secondary">
                            <Shield className="mr-1 h-3 w-3" />
                            Autorisé
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Résumé des autorisations</h4>
              <div className="grid gap-2 text-sm">
                <p>
                  <span className="font-medium">Total médecins autorisés:</span> {authorizedAccess.length}
                </p>
                <p>
                  <span className="font-medium">Total dossiers accessibles:</span> {totalRecords}
                </p>
                <p>
                  <span className="font-medium">Première autorisation:</span>{" "}
                  {Math.min(
                    ...authorizedAccess.map((a) =>
                      new Date(a.dateAutorisation.split("/").reverse().join("-")).getTime(),
                    ),
                  )}
                </p>
                <p className="text-muted-foreground mt-2">
                  Vous pouvez révoquer l'accès d'un médecin à tout moment via la section "Révoquer un accès".
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
