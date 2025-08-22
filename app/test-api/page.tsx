"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { testApiDetailed, login } from "@/lib/api"

export default function TestApiPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState("")

  const runTest = async () => {
    setIsLoading(true)
    setError("")
    setResults(null)

    try {
      console.log("🧪 Démarrage du test API...")
      const testResults = await testApiDetailed()
      setResults(testResults)
      console.log("✅ Test terminé:", testResults)
    } catch (err: any) {
      setError(err.message)
      console.error("❌ Erreur lors du test:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const testLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      console.log("🔐 Test de login...")
      const loginResult = await login({
        email: "test@example.com",
        password: "123456"
      })
      console.log("✅ Login test:", loginResult)
      setResults({ type: "login", data: loginResult })
    } catch (err: any) {
      setError(err.message)
      console.error("❌ Erreur login:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test API HealthSafe</h1>
          <p className="text-gray-600">Page de diagnostic pour tester la connectivité API</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tests de diagnostic</CardTitle>
              <CardDescription>
                Utilisez ces boutons pour tester la connectivité avec l'API HealthSafe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button 
                  onClick={runTest} 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Test en cours..." : "Test détaillé de l'API"}
                </Button>
                
                <Button 
                  onClick={testLogin} 
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? "Test en cours..." : "Test de login"}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {results && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Résultats du test :</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instructions de diagnostic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold">1. Ouvrez les DevTools</h4>
                  <p>Appuyez sur F12 et allez dans l'onglet "Console"</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">2. Lancez un test</h4>
                  <p>Cliquez sur "Test détaillé de l'API" et observez les logs dans la console</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">3. Vérifiez l'onglet Network</h4>
                  <p>Dans les DevTools, allez dans l'onglet "Network" pour voir les requêtes HTTP</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">4. Informations à vérifier</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>URL exacte appelée</li>
                    <li>Headers envoyés</li>
                    <li>Body de la requête</li>
                    <li>Statut HTTP reçu</li>
                    <li>Réponse du serveur</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


