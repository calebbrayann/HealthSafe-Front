import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail } from "lucide-react"

export default function VerifyEmailInstructionsPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Vérifiez votre email</h1>
          <p className="text-muted-foreground">Un email de vérification vous a été envoyé</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email envoyé
            </CardTitle>
            <CardDescription>Consultez votre boîte de réception</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Nous avons envoyé un email de vérification à votre adresse. Cliquez sur le lien dans l'email pour
                activer votre compte.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Vérifiez votre dossier spam si vous ne voyez pas l'email</p>
              <p>• Le lien expire dans 24 heures</p>
              <p>• Vous pouvez fermer cette page en toute sécurité</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link href="/login">Aller à la connexion</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
