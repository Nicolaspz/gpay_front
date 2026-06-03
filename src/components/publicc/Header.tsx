'use client'

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Menu, X, Home, Layers, Info, Tag, FileText, Mail, ChevronRight, LogIn } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  React.useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  const navItems = [
    { name: "Início",        href: "#top",       icon: Home },
    { name: "Serviços",      href: "#services",  icon: Layers },
    { name: "Sobre",         href: "#about",     icon: Info },
    { name: "Preços",        href: "#pricing",   icon: Tag },
    { name: "Documentação",  href: "/document",  icon: FileText },
    { name: "Contacto",      href: "#newsletter",icon: Mail },
  ]

  return (
    <header
        className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
            isScrolled
            ? "bg-white/70 backdrop-blur-md shadow-sm h-[80px] border-b border-white/20"
            : "bg-transparent h-[100px]"
        )}
        >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="h-10 w-full"
          />
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-[15px] font-medium text-[#2a2a2a] transition-colors hover:text-[#4b8ef1]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/login"
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-3xl bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] text-white font-medium text-[15px] hover:opacity-90 transition-opacity shadow-md"
          >
            <LogIn className="h-4 w-4" />
            <span>Entrar</span>
          </Link>
        </nav>

        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/70 border border-black/10 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5 text-[#2a2a2a]" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex items-end"
          style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", background: "rgba(30,30,50,0.45)" }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl border-t border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image 
                  src="/assets/images/logo.png" 
                  alt="Logo" 
                  width={32}
                  height={32}
                  className="h-8 w-auto object-contain" 
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <nav className="px-3 py-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-3.5 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-[17px] w-[17px] text-[#5b68eb]" />
                      <span className="text-[14px] text-gray-800 font-medium">{item.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  </Link>
                )
              })}
            </nav>

            <div className="h-px bg-gray-100 mx-3" />

            <div className="px-4 py-4 pb-8">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] text-white font-medium text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}