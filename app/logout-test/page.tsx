"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  TestTube,
  Trash2,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cleanupClientAuth, forceLogout, isClientAuthenticated } from "@/lib/logout-utils";
import LogoutErrorHandler from "@/components/LogoutErrorHandler";

export default function LogoutTestPage() {
  const { logout, user } = useAuth();
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setIsLoading(true);
    setError("");
    
    try {
      const startTime = Date.now();
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: true,
          result,
          duration,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (err: any) {
      setTestResults(prev => ({
        ...prev,
        [testName]: {
          success: false,
          error: err?.message || "Erreur inconnue",
          timestamp: new Date().toISOString()
        }
      }));
      setError(err?.message || "Erreur lors du test");
    } finally {
      setIsLoading(false);
    }
  };

  const tests = [
    {
      id: "normal-logout",
      name: "Déconnexion Normale",
      description: "Test de la déconnexion standard via useAuth",
      icon: LogOut,
      color: "bg-blue-500",
      test: async () => {
        await logout();
        return "Déconnexion effectuée";
      }
    },
    {
      id: "client-cleanup",
      name: "Nettoyage Côté Client",
      description: "Test du nettoyage des données côté client",
      icon: Trash2,
      color: "bg-orange-500",
      test: async () => {
        cleanupClientAuth();
        return "Nettoyage effectué";
      }
    },
    {
      id: "force-logout",
      name: "Déconnexion Forcée",
      description: "Test de la déconnexion forcée sans API",
      icon: Shield,
      color: "bg-red-500",
      test: async () => {
        forceLogout();
        return "Déconnexion forcée effectuée";
      }
    },
    {
      id: "auth-check",
      name: "Vérification Auth",
      description: "Test de la vérification de l'état d'authentification",
      icon: CheckCircle,
      color: "bg-green-500",
      test: async () => {
        const isAuth = isClientAuthenticated();
        return { isAuthenticated: isAuth };
      }
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id, test.test);
      // Attendre un peu entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const clearResults = () => {
    setTestResults({});
    setError("");
  };

  const getStatusBadge = (testId: string) => {
    const result = testResults[testId];
    if (!result) {
      return <Badge variant="secondary">Non testé</Badge>;
    }
    
    return (
      <Badge variant={result.success ? "default" : "destructive"}>
        {result.success ? "Succès" : "Échec"}
      </Badge>
    );
  };

  const getTestIcon = (testId: string) => {
    const result = testResults[testId];
    if (!result) {
      return <TestTube className="h-4 w-4" />;
    }
    
    return result.success ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TestTube className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">Test de Déconnexion</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cette page permet de tester la robustesse du système de déconnexion de HealthSafe.
            Vérifiez que la déconnexion fonctionne correctement même en cas d'erreur serveur.
          </p>
        </div>

        {/* Informations utilisateur */}
        {user && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Utilisateur Connecté
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nom</p>
                  <p className="text-lg">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Rôle</p>
                  <p className="text-lg">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions globales */}
        <div className="mb-6 flex justify-center space-x-4">
          <Button onClick={runAllTests} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Tester Toutes les Fonctions
          </Button>
          <Button onClick={clearResults} variant="outline">
            Effacer les Résultats
          </Button>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Grille des tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const IconComponent = test.icon;
            const result = testResults[test.id];
            
            return (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${test.color} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    {getStatusBadge(test.id)}
                  </div>
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {getTestIcon(test.id)}
                        <span className="text-sm font-medium">
                          {result.success ? "Succès" : "Échec"}
                        </span>
                      </div>
                      
                      {result.success && result.duration && (
                        <p className="text-xs text-gray-500">
                          Durée: {result.duration}ms
                        </p>
                      )}
                      
                      {result.error && (
                        <p className="text-xs text-red-500">
                          Erreur: {result.error}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-400">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => runTest(test.id, test.test)}
                    disabled={isLoading}
                    className="w-full"
                    size="sm"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    Tester
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Résumé des tests */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Résumé des Tests</CardTitle>
            <CardDescription>
              État actuel des tests de déconnexion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tests.map((test) => (
                <div key={test.id} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    testResults[test.id]?.success ? 'bg-green-500' : 
                    testResults[test.id] ? 'bg-red-500' : 'bg-gray-300'
                  }`} />
                  <span className="text-sm">{test.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Instructions de Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Test de Déconnexion Normale</h4>
              <p className="text-sm text-gray-600">
                Teste la déconnexion standard via le hook useAuth. Vérifiez que l'utilisateur 
                est redirigé vers la page de connexion.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">2. Test de Nettoyage Côté Client</h4>
              <p className="text-sm text-gray-600">
                Teste le nettoyage des données côté client (localStorage, cookies, etc.) 
                sans effectuer de déconnexion serveur.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">3. Test de Déconnexion Forcée</h4>
              <p className="text-sm text-gray-600">
                Teste la déconnexion forcée en cas d'échec de l'API. 
                L'utilisateur devrait être déconnecté côté client uniquement.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">4. Test de Vérification d'Authentification</h4>
              <p className="text-sm text-gray-600">
                Vérifie l'état d'authentification côté client. 
                Utile pour détecter les incohérences d'état.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
