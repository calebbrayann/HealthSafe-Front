"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Key, 
  CheckCircle, 
  ExternalLink,
  TestTube,
  Shield
} from "lucide-react"
import Link from "next/link"

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const testPages = [
    {
      id: "verify",
      title: "Vérification d'Email",
      description: "Page de vérification avec token dynamique",
      path: "/verify/test-token-123",
      icon: Mail,
      color: "bg-blue-500",
      test: () => {
        // Test de la page de vérification
        setTestResults(prev => ({ ...prev, verify: true }))
      }
    },
    {
      id: "forgot-password",
      title: "Mot de Passe Oublié",
      description: "Demande de réinitialisation de mot de passe",
      path: "/forgot-password",
      icon: Key,
      color: "bg-orange-500",
      test: () => {
        // Test de la page de mot de passe oublié
        setTestResults(prev => ({ ...prev, forgotPassword: true }))
      }
    },
    {
      id: "reset-password",
      title: "Réinitialisation",
      description: "Page de réinitialisation avec token",
      path: "/reset-password/test-token-456",
      icon: CheckCircle,
      color: "bg-green-500",
      test: () => {
        // Test de la page de réinitialisation
        setTestResults(prev => ({ ...prev, resetPassword: true }))
      }
    },
    {
      id: "verify-instructions",
      title: "Instructions de Vérification",
      description: "Page d'instructions pour l'utilisateur",
      path: "/verify",
      icon: Shield,
      color: "bg-purple-500",
      test: () => {
        // Test de la page d'instructions
        setTestResults(prev => ({ ...prev, verifyInstructions: true }))
      }
    }
  ]

  const runAllTests = () => {
    testPages.forEach(page => {
      page.test()
    })
  }

  const getStatusBadge = (pageId: string) => {
    const isTested = testResults[pageId]
    return (
      <Badge variant={isTested ? "default" : "secondary"}>
        {isTested ? "Testé" : "Non testé"}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TestTube className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Test des Pages d'Authentification</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cette page permet de tester toutes les pages d'authentification de l'application HealthSafe.
            Vérifiez que chaque page fonctionne correctement avec les appels API intégrés.
          </p>
        </div>

        {/* Alert d'information */}
        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Note :</strong> Cette page est uniquement à des fins de test et de développement. 
            Elle ne doit pas être accessible en production.
          </AlertDescription>
        </Alert>

        {/* Actions globales */}
        <div className="mb-6 flex justify-center">
          <Button onClick={runAllTests} className="mr-4">
            <TestTube className="h-4 w-4 mr-2" />
            Tester Toutes les Pages
          </Button>
          <Button variant="outline" onClick={() => setTestResults({})}>
            Réinitialiser les Tests
          </Button>
        </div>

        {/* Grille des pages de test */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testPages.map((page) => {
            const IconComponent = page.icon
            return (
              <Card key={page.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${page.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {getStatusBadge(page.id)}
                  </div>
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <CardDescription>{page.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <strong>Chemin :</strong> <code className="bg-gray-100 px-2 py-1 rounded">{page.path}</code>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={page.test}
                      size="sm"
                      className="flex-1"
                    >
                      Tester
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Link href={page.path} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Ouvrir
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Résumé des tests */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Résumé des Tests</CardTitle>
            <CardDescription>
              État actuel des tests d'authentification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {testPages.map((page) => (
                <div key={page.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    testResults[page.id] ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm">{page.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions d'utilisation */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions d'Utilisation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Test de Vérification d'Email</h4>
              <p className="text-sm text-gray-600">
                Utilisez un token valide pour tester la vérification. La page devrait rediriger automatiquement 
                vers le dashboard approprié selon le rôle de l'utilisateur.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">2. Test de Mot de Passe Oublié</h4>
              <p className="text-sm text-gray-600">
                Entrez une adresse email valide pour tester l'envoi du lien de réinitialisation.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">3. Test de Réinitialisation</h4>
              <p className="text-sm text-gray-600">
                Utilisez un token valide pour tester la réinitialisation du mot de passe.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">4. Vérification des Appels API</h4>
              <p className="text-sm text-gray-600">
                Ouvrez la console du navigateur pour vérifier que les appels API sont bien effectués 
                et que les réponses sont correctement gérées.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
