"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/services/auth.service"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { getErrorMessage } from "@/utils/api-error"
import type { RequestStatus } from "@/types/status"

function ActivateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<RequestStatus>("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("Token não encontrado")
      return
    }

    AuthService.activate(token)
      .then(() => {
        setStatus("success")
        setMessage("Conta ativada com sucesso!")
        setTimeout(() => router.push("/login"), 3000)
      })
      .catch((err: unknown) => {
        setStatus("error")
        setMessage(getErrorMessage(err, "Erro ao ativar a conta. Tente novamente."))
      })
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Ativação de Conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
              <p className="mt-2 text-center">Ativando sua conta...</p>
            </>
          )}
          {status === "success" && (
            <>
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="mt-2 text-center text-green-600 font-medium">{message}</p>
              <p className="text-sm text-gray-500 text-center">Redirecionando para login...</p>
            </>
          )}
          {status === "error" && (
            <>
              <XCircle className="h-10 w-10 text-red-500" />
              <p className="mt-2 text-center text-red-600 font-medium">{message}</p>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => router.push("/register")} variant="outline">
                  Criar nova conta
                </Button>
                <Button onClick={() => router.push("/login")}>
                  Fazer login
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ActivateClient() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Ativação de Conta</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
            <p className="mt-2 text-center">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ActivateContent />
    </Suspense>
  )
}
