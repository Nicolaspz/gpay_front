"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { AuthCard } from "@/components/auth/AuthCard"
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from "lucide-react"
import { toast } from "react-toastify"
import { api } from "@/services/apiClients"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

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

  useEffect(() => {
    if (passwordTouched) {
      const errors = validatePassword(form.password)
      setPasswordErrors(errors)
    }
  }, [form.password, passwordTouched])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value })

    // Mark password as touched when user starts typing
    if (e.target.id === "password" && !passwordTouched) {
      setPasswordTouched(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate password before submitting
    const errors = validatePassword(form.password)
    if (errors.length > 0) {
      toast.error("Por favor, corrija os erros na senha antes de continuar")
      setLoading(false)
      return
    }

    // Check if passwords match
    if (form.password !== form.confirmpassword) {
      toast.error("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      const response = await api.post("/users", {
        fullname: form.fullname,
        email: form.email,
        password: form.password,
        confirmpassword: form.confirmpassword
      })
      toast.success("Conta criada com sucesso! Faça login.")
      router.push("/login")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao registrar")
    } finally {
      setLoading(false)
    }
  }

  const isPasswordValid = passwordErrors.length === 0 && form.password.length > 0
  const passwordsMatch = form.password === form.confirmpassword && form.confirmpassword.length > 0

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
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
                value={form.fullname}
                onChange={handleChange}
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
                value={form.email}
                onChange={handleChange}
                required
                className="h-11"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className={`h-11 pr-10 ${passwordTouched && passwordErrors.length > 0 ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {passwordTouched && (
                <div className="text-sm space-y-1 mt-2">
                  {passwordErrors.map((error, index) => (
                    <div key={index} className="flex items-center text-red-500">
                      <XCircle className="h-3 w-3 mr-1" />
                      {error}
                    </div>
                  ))}
                  {isPasswordValid && (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Senha válida
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmpassword">Confirme sua senha</Label>
              <div className="relative">
                <Input
                  id="confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmpassword}
                  onChange={handleChange}
                  required
                  className={`h-11 pr-10 ${form.confirmpassword.length > 0 && !passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
                  aria-label={showConfirmPassword ? "Ocultar confirmação de senha" : "Mostrar confirmação de senha"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {form.confirmpassword.length > 0 && !passwordsMatch && (
                <div className="flex items-center text-red-500 text-sm mt-2">
                  <XCircle className="h-3 w-3 mr-1" />
                  As senhas não coincidem
                </div>
              )}

              {passwordsMatch && (
                <div className="flex items-center text-green-500 text-sm mt-2">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Senhas coincidem
                </div>
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