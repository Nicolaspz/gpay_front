"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/services/apiClients"
import { Loader2, CheckCircle, XCircle, Eye, EyeOff, Lock } from "lucide-react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [status, setStatus] = useState<"form" | "loading" | "success" | "error">("form")
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordTouched, setPasswordTouched] = useState(false)

  // Regex patterns for password validation
  const passwordRegex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
    minLength: /.{8,}/
  }

  const validatePassword = (password: string) => {
    const errors: string[] = []

    if (!passwordRegex.uppercase.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra maiúscula")
    }
    if (!passwordRegex.lowercase.test(password)) {
      errors.push("A senha deve conter pelo menos uma letra minúscula")
    }
    if (!passwordRegex.specialChar.test(password)) {
      errors.push("A senha deve conter pelo menos um caractere especial")
    }
    if (!passwordRegex.minLength.test(password)) {
      errors.push("A senha deve ter pelo menos 8 caracteres")
    }

    return errors
  }

  // Validar senha em tempo real
  useEffect(() => {
    if (passwordTouched) {
      const errors = validatePassword(newPassword)
      setPasswordErrors(errors)
    }
  }, [newPassword, passwordTouched])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Primeiro valida as senhas
    const errors = validatePassword(newPassword)
    if (errors.length > 0) {
      setMessage("Por favor, corrija os erros na senha antes de continuar")
      setStatus("error")
      return
    }

    if (newPassword !== confirmNewPassword) {
      setMessage("As senhas não coincidem")
      setStatus("error")
      return
    }

    if (!token) {
      setMessage("Token inválido ou não encontrado")
      setStatus("error")
      return
    }

    try {
      setStatus("loading")

      const response = await api.post(`/auth/reset-password?token=${token}`, {
        newPassword,
        confirmNewPassword
      })

      if (response.status === 200) {
        setStatus("success")
        setMessage("Senha redefinida com sucesso!")
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch (err: any) {
      setStatus("error")

      if (err.response?.status === 400) {
        setMessage("Token inválido ou expirado")
      } else if (err.response?.status === 422) {
        setMessage("A nova senha não atende aos requisitos mínimos")
      } else {
        setMessage("Erro ao redefinir senha, tente novamente")
      }
      console.error("Erro reset password", err)
    }
  }

  const isPasswordValid = passwordErrors.length === 0 && newPassword.length > 0
  const passwordsMatch = newPassword === confirmNewPassword && confirmNewPassword.length > 0

  const togglePasswordVisibility = (type: 'new' | 'confirm') => {
    setShowPassword({ ...showPassword, [type]: !showPassword[type] })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value)
    if (!passwordTouched) {
      setPasswordTouched(true)
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
          {status === "form" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="newPassword" className="text-gray-700 text-base font-medium">
                  Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    placeholder="Digite sua nova senha"
                    className={`pl-12 pr-12 h-12 text-base text-gray-900 ${passwordTouched && passwordErrors.length > 0 ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300"}`}
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {passwordTouched && (
                  <div className="space-y-2 mt-3">
                    {passwordErrors.map((error, index) => (
                      <div key={index} className="flex items-center text-red-500 text-sm">
                        <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                    {isPasswordValid && (
                      <div className="flex items-center text-green-500 text-sm">
                        <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Senha válida</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="confirmNewPassword" className="text-gray-700 text-base font-medium">
                  Confirmar Nova Senha
                </Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Confirme sua nova senha"
                    className={`pl-12 pr-12 h-12 text-base text-gray-900 ${passwordTouched && passwordErrors.length > 0 ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300"}`}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                  <div className="absolute left-4 top-3.5 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                {confirmNewPassword.length > 0 && !passwordsMatch && (
                  <div className="flex items-center text-red-500 text-sm mt-2">
                    <XCircle className="h-4 w-4 mr-2" />
                    <span>As senhas não coincidem</span>
                  </div>
                )}
                
                {passwordsMatch && confirmNewPassword.length > 0 && (
                  <div className="flex items-center text-green-500 text-sm mt-2">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Senhas coincidem</span>
                  </div>
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
                onClick={() => {
                  setStatus("form")
                  setMessage("")
                }} 
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