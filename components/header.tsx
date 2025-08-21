"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/images/healthsafe-logo.png"
              alt="HealthSafe Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl sm:text-2xl font-bold text-primary">HealthSafe</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Accueil
            </Link>
            <Link href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Fonctionnalités
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Contact
            </Link>
          </nav>

          {/* Boutons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Connexion
            </Link>
            <Link
              href="/register"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              S'inscrire
            </Link>
          </div>

          {/* Menu Burger Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                href="#features" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link 
                href="#contact" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
            <div className="flex flex-col space-y-3 mt-4 pt-4 border-t border-gray-100">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
