"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

// 404 page — metadata handled by Next.js automatically for not-found

export default function NotFoundPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
      <AlertTriangle className="w-20 h-20 text-red-500 mb-6" aria-hidden="true" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Página não encontrada</h2>
      <p className="text-gray-400 mb-8">
        O conteúdo que procura não existe ou foi movido.
        Verifique o endereço e tente novamente.
      </p>
      <Button onClick={() => router.push("/")} className="cursor-pointer">
        Ir para Home
      </Button>
    </div>
  )
}
