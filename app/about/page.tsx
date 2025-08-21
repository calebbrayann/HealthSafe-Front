"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Users, Shield, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105"
            >
              <Image
                src="/images/healthsafe-logo.png"
                alt="HealthSafe Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-primary">HealthSafe</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Accueil
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-primary transition-colors font-medium">
                Connexion
              </Link>
              <Link
                href="/register/patient"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/chaire-e-sante-bg.jpg')",
          }}
        ></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="space-y-12">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-white hover:text-green-400 transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Retour à l'accueil</span>
            </Link>

            {/* Title */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
                À propos de
                <span className="text-green-400 block">HealthSafe</span>
              </h1>
            </div>

            {/* Content Cards */}
            <div className="space-y-8">
              {/* Introduction */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                      <p className="text-gray-700 leading-relaxed">
                        HealthSafe est une plateforme numérique médicale innovante, conçue pour centraliser l'ensemble
                        des dossiers médicaux des patients gabonais dans un système sécurisé, moderne et facilement
                        accessible par les professionnels de santé.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Le créateur */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Le créateur</h2>
                      <p className="text-gray-700 leading-relaxed">
                        HealthSafe a été imaginé et développé par Brayann, jeune développeur gabonais passionné par les
                        nouvelles technologies et déterminé à mettre ses compétences au service de l'intérêt général. À
                        travers ce projet, il incarne une nouvelle génération de talents africains qui veulent utiliser
                        le numérique pour résoudre des problèmes concrets dans leur pays.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Les problèmes à résoudre */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Les problèmes à résoudre</h2>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Aujourd'hui, le système de santé gabonais est confronté à plusieurs difficultés majeures :
                      </p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>
                            La dispersion des dossiers médicaux, souvent éparpillés entre plusieurs hôpitaux ou
                            cliniques.
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>La perte fréquente d'informations essentielles lors du suivi d'un patient.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                          <span>Le manque de continuité dans la prise en charge médicale.</span>
                        </li>
                      </ul>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        Ces problèmes entraînent des retards, des erreurs, et une inefficacité générale qui peut coûter
                        la vie. HealthSafe veut répondre à ce défi en mettant la technologie au service de la médecine.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* La solution HealthSafe */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">La solution HealthSafe</h2>
                      <ul className="space-y-3 text-gray-700">
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>Centralisation de l'historique médical d'un patient.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>
                            Accès en temps réel et sécurisé pour tout médecin habilité, quel que soit l'hôpital.
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>Réduction des pertes d'information et amélioration de la coordination des soins.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* L'ambition */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Globe className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">L'ambition</h2>
                      <p className="text-gray-700 leading-relaxed">
                        HealthSafe ne veut pas seulement être une application technique. C'est une vision : bâtir un
                        système de santé plus fiable, plus efficace et plus juste. À long terme, l'objectif est que
                        chaque citoyen gabonais ait un dossier médical numérique unique, consultable partout et protégé
                        par des standards de sécurité internationaux.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Conclusion */}
              <Card className="bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
                      <p className="text-gray-700 leading-relaxed">
                        HealthSafe, c'est l'union entre innovation technologique et engagement social. C'est l'histoire
                        d'un jeune développeur qui veut transformer les difficultés actuelles en opportunités pour bâtir
                        le futur de la santé au Gabon.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center space-y-6">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/register/patient">Rejoindre HealthSafe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
