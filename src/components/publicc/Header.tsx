"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { AuthModal } from "./auth-modal"
import { Button } from "@/components/ui/button"
import { Menu, Search } from "lucide-react"
import Image from "next/image"

export function Header() {
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { name: "Início", href: "#top" },
        { name: "Serviços", href: "#services" },
        { name: "Sobre", href: "#about" },
        { name: "Preços", href: "#pricing" },
        { name: "Documentação", href: "/document" },
        { name: "Contacto", href: "#newsletter" },
    ]

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "bg-white shadow-sm h-[80px]"
                    : "bg-transparent h-[100px] border-b border-[rgba(42,42,42,0.2)]"
            )}
        >
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center">
                    <img
                     src="/assets/images/logo.png" 
                     alt=""
                     className="w-full h-full object-cover object-bottom"
                     />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-8">
                    <ul className="flex space-x-6">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-[15px] font-medium transition-colors hover:text-[#4b8ef1]",
                                        isScrolled ? "text-[#2a2a2a]" : "text-[#2a2a2a]"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <AuthModal
                        trigger={
                            <div className="cursor-pointer">
                                <div className="inline-block px-5 py-2.5 rounded-3xl bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] text-white font-medium text-[15px] hover:text-white transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                                    <i className="fa fa-sign-in-alt"></i>
                                    <span>Entrar</span>
                                </div>
                            </div>
                        }
                    />
                </nav>

                {/* Mobile Menu Trigger */}
                <button
                    className="lg:hidden text-[#2a2a2a]"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <Menu className="h-8 w-8" />
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full overflow-hidden">
                    {/* Container com imagem de fundo */}
                    <div className="relative bg-white shadow-lg border-t">
                        {/* Imagem decorativa na parte inferior do menu */}
                        <div className="absolute bottom-0 left-0 right-0 h-[120px] overflow-hidden">
                            <div className="relative w-full h-full">
                                {/* Substitua esta imagem pela sua */}
                                <img
                                    src="/assets/images/heading-line-dec.png" 
                                    alt=""
                                    className="w-full h-full object-cover object-bottom"
                                />
                            </div>
                        </div>
                        
                        {/* Conteúdo do menu */}
                        <div className="relative z-10">
                            <ul className="flex flex-col">
                                {navItems.map((item) => (
                                    <li key={item.name} className="border-b border-gray-100">
                                        <Link
                                            href={item.href}
                                            className="block py-4 px-6 text-[#2a2a2a] hover:bg-gray-50 hover:text-[#4b8ef1] font-medium"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                                <li className="p-6 border-b border-gray-100">
                                    <AuthModal />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}