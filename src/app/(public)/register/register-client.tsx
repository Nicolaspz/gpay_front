"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth/AuthCard"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/auth.service"
import { PasswordInput } from "@/components/shared/PasswordInput"
import { usePasswordValidation } from "@/hooks/usePasswordValidation"
import { getErrorMessage } from "@/utils/api-error"
import { Phone } from "lucide-react"

export default function RegisterClient() {
  const [fullname, setFullname] = useState("")
  const [email, setEmail] = useState("")
  const [phone_number, setPhone_number] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { errors: passwordErrors, isValid: isPasswordValid } = usePasswordValidation(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordErrors.length > 0) {
      return toast.error("Por favor, corrija os erros na senha antes de continuar")
    }

    if (!passwordsMatch) {
      return toast.error("As senhas não coincidem")
    }

    setLoading(true)
    try {
      await AuthService.signUp({
        fullname,
        email,
        phone_number,
        password,
        confirmpassword: confirmPassword,
      })
      toast.success("Conta criada com sucesso! Faça login.")
      router.push("/login")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao registrar"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container max-w-md mx-auto py-12 px-4">
        <AuthCard
          title="Crie sua conta"
          description="Preencha os campos abaixo para se registrar"
          footerText="Já tem uma conta?"
          footerLink="/login"
          footerLinkText="Faça login"
        >
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Nome Completo</Label>
              <Input
                id="fullname"
                placeholder="Seu nome"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone_number">Número de Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone_number"
                  type="tel"
                  placeholder="+244 900 000 000"
                  value={phone_number}
                  onChange={(e) => setPhone_number(e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={(v) => {
                  setPassword(v)
                  if (!passwordTouched) setPasswordTouched(true)
                }}
                showValidation={passwordTouched}
                errors={passwordErrors}
                isValid={isPasswordValid}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmpassword">Confirme sua senha</Label>
              <PasswordInput
                id="confirmpassword"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
              {confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  As senhas não coincidem
                </p>
              )}
              {passwordsMatch && (
                <p className="text-green-500 text-sm flex items-center gap-1 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Senhas coincidem
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer mt-2 h-11"
              disabled={loading || !isPasswordValid || !passwordsMatch}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Registrar"
              )}
            </Button>
          </form>
        </AuthCard>
      </div>
    </div>
  )
}
