"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, LogOut, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LogoutErrorHandlerProps {
  error: string;
  onRetry?: () => void;
  onForceLogout?: () => void;
  showDetails?: boolean;
}

export default function LogoutErrorHandler({ 
  error, 
  onRetry, 
  onForceLogout,
  showDetails = false 
}: LogoutErrorHandlerProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { logout } = useAuth();
  const router = useRouter();

  const maxRetries = 3;

  const handleRetry = async () => {
    if (retryCount >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      if (onRetry) {
        await onRetry();
      }
    } catch (err) {
      console.error("Erreur lors de la nouvelle tentative:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  const handleForceLogout = async () => {
    try {
      if (onForceLogout) {
        await onForceLogout();
      } else {
        // Déconnexion forcée par défaut
        await logout();
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion forcée:", err);
      // Redirection forcée vers la page de connexion
      router.push("/login");
    }
  };

  const handleGoHome = () => {
    router.push("/");
  };

  const getErrorType = (error: string) => {
    if (error.includes("network") || error.includes("fetch")) {
      return "network";
    }
    if (error.includes("timeout")) {
      return "timeout";
    }
    if (error.includes("unauthorized") || error.includes("401")) {
      return "auth";
    }
    return "unknown";
  };

  const errorType = getErrorType(error.toLowerCase());

  const getErrorIcon = () => {
    switch (errorType) {
      case "network":
        return <RefreshCw className="h-5 w-5" />;
      case "timeout":
        return <AlertTriangle className="h-5 w-5" />;
      case "auth":
        return <LogOut className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case "network":
        return "Problème de connexion";
      case "timeout":
        return "Délai d'attente dépassé";
      case "auth":
        return "Session expirée";
      default:
        return "Erreur de déconnexion";
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case "network":
        return "Impossible de contacter le serveur. Vérifiez votre connexion internet.";
      case "timeout":
        return "La requête a pris trop de temps. Le serveur pourrait être surchargé.";
      case "auth":
        return "Votre session a expiré. Une déconnexion automatique va être effectuée.";
      default:
        return "Une erreur inattendue s'est produite lors de la déconnexion.";
    }
  };

  const getRetryButtonText = () => {
    if (isRetrying) {
      return "Nouvelle tentative...";
    }
    if (retryCount >= maxRetries) {
      return "Tentatives épuisées";
    }
    return `Réessayer (${retryCount}/${maxRetries})`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {getErrorIcon()}
          <CardTitle className="text-lg">{getErrorTitle()}</CardTitle>
        </div>
        <CardDescription>{getErrorDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>

        {showDetails && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Type d'erreur :</strong> {errorType}</p>
            <p><strong>Tentatives :</strong> {retryCount}/{maxRetries}</p>
            <p><strong>Heure :</strong> {new Date().toLocaleTimeString()}</p>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          {retryCount < maxRetries && (
            <Button 
              onClick={handleRetry} 
              disabled={isRetrying}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {getRetryButtonText()}
            </Button>
          )}

          <Button 
            onClick={handleForceLogout} 
            variant="outline"
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion forcée
          </Button>

          <Button 
            onClick={handleGoHome} 
            variant="ghost"
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Button>
        </div>

        {retryCount >= maxRetries && (
          <div className="text-center text-sm text-gray-500">
            <p>Les tentatives automatiques ont échoué.</p>
            <p>Utilisez la déconnexion forcée ou contactez le support.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
