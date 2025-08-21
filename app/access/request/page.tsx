"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AccessRequestPage() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page de login car cette page n'est plus utilisée
    router.push("/login")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Redirection...</h1>
        <p className="text-gray-600">Vous allez être redirigé vers la page de connexion.</p>
      </div>
    </div>
  )
}
