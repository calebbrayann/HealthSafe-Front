"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, Search, FileText, Mail, Hash, User } from "lucide-react"
import Link from "next/link"

interface Patient {
  nom: string
  prenom: string
  codePatient: string
  email: string
}

export default function PatientsListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Mock patient data
  const mockPatients: Patient[] = [
    { nom: "Doe", prenom: "John", codePatient: "PAT-01", email: "john.doe@mail.com" },
    { nom: "Smith", prenom: "Anna", codePatient: "PAT-02", email: "anna.smith@mail.com" },
    { nom: "Martin", prenom: "Pierre", codePatient: "PAT-03", email: "pierre.martin@mail.com" },
    { nom: "Dubois", prenom: "Marie", codePatient: "PAT-04", email: "marie.dubois@mail.com" },
    { nom: "Bernard", prenom: "Lucas", codePatient: "PAT-05", email: "lucas.bernard@mail.com" },
  ]

  // Filter patients based on search term
  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.codePatient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewRecords = (patient: Patient) => {
    // Simulate random "Patient introuvable" error (20% chance)
    if (Math.random() < 0.2) {
      setMessage({ type: "error", text: "Patient introuvable." })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    // In a real app, this would navigate to the patient's records
    // For now, we'll navigate to a record details page with the patient code
    window.location.href = `/records/details/${patient.codePatient}`
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
            <h1 className="text-2xl font-bold text-foreground">Liste des patients</h1>
            <p className="text-muted-foreground">Gérer les dossiers médicaux des patients</p>
          </div>
        </div>

        {/* Search and Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Patients enregistrés
            </CardTitle>
            <CardDescription>Recherchez et consultez les dossiers des patients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, prénom, code patient ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button asChild>
                <Link href="/records/create">
                  <FileText className="h-4 w-4 mr-2" />
                  Nouveau dossier
                </Link>
              </Button>
            </div>

            {/* Message Display */}
            {message && (
              <Alert className={message.type === "error" ? "border-destructive" : "border-secondary"}>
                <AlertDescription className={message.type === "error" ? "text-destructive" : "text-secondary"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Patients Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nom
                    </TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Code Patient
                    </TableHead>
                    <TableHead className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "Aucun patient trouvé pour cette recherche" : "Aucun patient enregistré"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.codePatient}>
                        <TableCell className="font-medium">{patient.nom}</TableCell>
                        <TableCell>{patient.prenom}</TableCell>
                        <TableCell>
                          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-mono">
                            {patient.codePatient}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{patient.email}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRecords(patient)}
                            className="hover:bg-primary hover:text-primary-foreground"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Voir dossiers
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Statistics */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}{" "}
                {searchTerm && `trouvé${filteredPatients.length !== 1 ? "s" : ""}`}
              </span>
              <span>Total: {mockPatients.length} patients</span>
            </div>
          </CardContent>
        </Card>

        {/* Mock Data Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Données mockées (développement)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              {JSON.stringify(mockPatients.slice(0, 2), null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
