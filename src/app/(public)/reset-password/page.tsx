"use client"

import { Suspense, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { AuthService } from "@/services/auth.service"
import { Loader2, CheckCircle, XCircle, Lock } from "lucide-react"
import { PasswordInput } from "@/components/shared/PasswordInput"
import { usePasswordValidation } from "@/hooks/usePasswordValidation"
import { getErrorMessage } from "@/utils/api-error"
import type { RequestStatus } from "@/types/status"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [status, setStatus] = useState<RequestStatus>("idle")
  const [message, setMessage] = useState("")

  const { errors: passwordErrors, isValid: isPasswordValid } = usePasswordValidation(newPassword)
  const passwordsMatch = newPassword === confirmNewPassword && confirmNewPassword.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (passwordErrors.length > 0) {
      setMessage("Por favor, corrija os erros na senha antes de continuar")
      setStatus("error")
      return
    }

    if (!passwordsMatch) {
      setMessage("As senhas não coincidem")
      setStatus("error")
      return
    }

    if (!token) {
      setMessage("Token inválido ou não encontrado")
      setStatus("error")
      return
    }

    setStatus("loading")
    try {
      await AuthService.resetPassword(token, { newPassword, confirmNewPassword })
      setStatus("success")
      setMessage("Senha redefinida com sucesso!")
      setTimeout(() => router.push("/login"), 3000)
    } catch (err: unknown) {
      setStatus("error")
      setMessage(getErrorMessage(err, "Erro ao redefinir senha, tente novamente"))
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 bg-white">
        <CardHeader className="text-center space-y-6 pb-6">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-full bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] bg-opacity-20 mb-4">
              <Lock className="h-8 w-8 text-[#5b68eb]" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              Redefinir Senha
            </CardTitle>
            <CardDescription className="text-gray-600 text-lg mt-2">
              Bem-vindo ao <span className="font-bold text-[#5b68eb]">Gpayment</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "idle" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="newPassword" className="text-gray-700 text-base font-medium">
                  Nova Senha
                </Label>
                <PasswordInput
                  id="newPassword"
                  value={newPassword}
                  onChange={(v) => {
                    setNewPassword(v)
                    if (!passwordTouched) setPasswordTouched(true)
                  }}
                  placeholder="Digite sua nova senha"
                  showValidation={passwordTouched}
                  errors={passwordErrors}
                  isValid={isPasswordValid}
                  icon={<Lock className="h-5 w-5" />}
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="confirmNewPassword" className="text-gray-700 text-base font-medium">
                  Confirmar Nova Senha
                </Label>
                <PasswordInput
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={setConfirmNewPassword}
                  placeholder="Confirme sua nova senha"
                  icon={<Lock className="h-5 w-5" />}
                />
                {confirmNewPassword.length > 0 && !passwordsMatch && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <XCircle className="h-4 w-4" />
                    As senhas não coincidem
                  </p>
                )}
                {passwordsMatch && (
                  <p className="text-green-500 text-sm flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Senhas coincidem
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white shadow-md"
                disabled={!isPasswordValid || !passwordsMatch}
              >
                Redefinir Senha
              </Button>
            </form>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <div className="p-4 rounded-full bg-blue-50">
                <Loader2 className="animate-spin h-12 w-12 text-[#5b68eb]" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-700 font-medium text-lg">Redefinindo sua senha...</p>
                <p className="text-gray-500 text-sm">Por favor, aguarde um momento</p>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <div className="p-4 rounded-full bg-green-50">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-green-600 font-bold text-lg">{message}</p>
                <p className="text-gray-500 text-sm">
                  Redirecionando para a página de login em 3 segundos...
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <div className="p-4 rounded-full bg-red-50">
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-red-600 font-bold text-lg">{message}</p>
              </div>
              <Button
                onClick={() => { setStatus("idle"); setMessage("") }}
                className="mt-4 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white px-8 h-11"
              >
                Tentar novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 bg-white">
          <CardHeader className="text-center space-y-6 pb-6">
            <CardTitle className="text-3xl font-bold text-gray-800">Redefinir Senha</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="animate-spin h-10 w-10 text-blue-500" />
            <p className="mt-2 text-center">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
