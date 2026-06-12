"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import { Mail, Lock, Loader2, Eye, EyeOff, User, ShieldAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { api } from "@/services/apiClients"
import type { SignInCredentials, SignUpCredentials } from "@/types/global"
import { useRateLimit, useHoneypot, useBotBehavior } from "@/lib/antibot"

export function LoginForm() {
  const router = useRouter()
  const { signIn, signUp, isAuthenticated } = useAuth()

  const [forgotEmail, setForgotEmail] = useState("")
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const [registerForm, setRegisterForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Antibot hooks
  const {
    isLocked,
    lockoutSecondsLeft,
    registerFailure,
    registerSuccess,
  } = useRateLimit({ maxAttempts: 5, lockoutMs: 30000 })

  const { honeypotProps, isTriggered } = useHoneypot()

  const loginFieldIds = useMemo(() => ["login-email", "login-password"], [])
  const { registerField: registerBotField, isSuspicious } = useBotBehavior({ fieldIds: loginFieldIds })
  const emailField = useMemo(() => registerBotField("login-email"), [registerBotField])
  const passwordField = useMemo(() => registerBotField("login-password"), [registerBotField])

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

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  // Validar senha do registro em tempo real
  useEffect(() => {
    if (passwordTouched) {
      const errors = validatePassword(registerForm.password)
      setPasswordErrors(errors)
    }
  }, [registerForm.password, passwordTouched])

  // Resetar forms quando trocar de tab
  useEffect(() => {
    if (activeTab === "login") {
      setLoginForm({ email: "", password: "" })
    } else {
      setRegisterForm({
        fullname: "",
        email: "",
        password: "",
        confirmpassword: ""
      })
      setPasswordErrors([])
      setPasswordTouched(false)
    }
  }, [activeTab])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (isTriggered) return
    if (isSuspicious()) return

    if (isLocked) {
      toast.error(`Muitas tentativas. Aguarde ${lockoutSecondsLeft} segundos.`)
      return
    }

    setLoading(true)

    try {
      const credentials: SignInCredentials = {
        email: loginForm.email,
        password: loginForm.password
      }
      await signIn(credentials)
      registerSuccess()
      toast.success("Login feito com sucesso!")
      router.push("/dashboard")
    } catch (err) {
      registerFailure()
      console.error("Erro ao logar:", err)
      toast.error("Erro ao fazer login. Verifique suas credenciais.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const errors = validatePassword(registerForm.password)
    if (errors.length > 0) {
      toast.error("Por favor, corrija os erros na senha antes de continuar")
      setLoading(false)
      return
    }

    if (registerForm.password !== registerForm.confirmpassword) {
      toast.error("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      const credentials: SignUpCredentials = {
        id: "",
        name: registerForm.fullname,
        email: registerForm.email,
        password: registerForm.password,
        confirmpassword: registerForm.confirmpassword,
        role: "user",
        telefone: "",
        user_name: registerForm.email
      }
      await signUp(credentials)
      toast.success("Conta criada com sucesso! Faça login.")
      setActiveTab("login")
      setRegisterForm({
        fullname: "",
        email: "",
        password: "",
        confirmpassword: ""
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao registrar")
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post("/auth/forgot-password", { email: forgotEmail })
      toast.success("Enviamos um link de recuperação para o seu email.")
      setForgotMode(false)
      setForgotEmail("")
    } catch (err) {
      toast.error("Erro ao enviar email de recuperação, verifique se o email está correto")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isPasswordValid = passwordErrors.length === 0 && registerForm.password.length > 0
  const passwordsMatch = registerForm.password === registerForm.confirmpassword &&
    registerForm.confirmpassword.length > 0

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.id.replace('login-', '')]: e.target.value })
  }

  const handleForgotEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(e.target.value)
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id.replace('register-', '')
    setRegisterForm({ ...registerForm, [id]: e.target.value })

    if (id === "password" && !passwordTouched) {
      setPasswordTouched(true)
    }
  }

  const togglePasswordVisibility = (type: 'login' | 'register' | 'confirm') => {
    setShowPassword({ ...showPassword, [type]: !showPassword[type] })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[425px] bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bem-vindo ao Gpayment</h1>
          <p className="text-gray-600">Gerencie seus pagamentos de forma fácil</p>
        </div>

        {forgotMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="flex flex-col items-center space-y-2 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] bg-opacity-20">
                <Mail className="h-6 w-6 text-[#5b68eb]" />
              </div>
              <h2 className="text-xl font-bold text-center text-gray-800">Recuperar Senha</h2>
              <p className="text-sm text-gray-600 text-center">
                Informe seu email para receber o link de redefinição
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="forgot-email" className="text-gray-700">Endereço de Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 h-11 bg-white border-gray-300 text-gray-900"
                  value={forgotEmail}
                  onChange={handleForgotEmailChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setForgotMode(false)}
                className="text-sm text-gray-600 hover:text-[#5b68eb] hover:underline"
              >
                Voltar ao login
              </button>
            </div>
          </form>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:text-blue-900 data-[state=active]:font-semibold transition-all duration-200"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:text-blue-900 data-[state=active]:font-semibold transition-all duration-200"
              >
                Registrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <input {...honeypotProps} />

                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700">Email / Usuário</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      ref={emailField.ref}
                      placeholder="seu@email.com"
                      className="pl-10 h-11 bg-white border-gray-300 text-gray-900"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      onKeyDown={emailField.onKeyDown}
                      onMouseDown={emailField.onMouseDown}
                      onFocus={emailField.onFocus}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      ref={passwordField.ref}
                      type={showPassword.login ? "text" : "password"}
                      className="pl-10 pr-10 h-11 bg-white border-gray-300 text-gray-900"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      onKeyDown={passwordField.onKeyDown}
                      onMouseDown={passwordField.onMouseDown}
                      onFocus={passwordField.onFocus}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('login')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.login ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      className="text-sm text-[#5b68eb] hover:underline"
                      onClick={() => setForgotMode(true)}
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                </div>

                {isLocked && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 px-3 py-2 rounded-md">
                    <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                    <span>
                      Muitas tentativas falhadas. Aguarde <strong>{lockoutSecondsLeft}s</strong>
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || isLocked}
                  className="w-full h-11 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processando...
                    </>
                  ) : isLocked ? (
                    `Aguarde ${lockoutSecondsLeft}s`
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-fullname" className="text-gray-700">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-fullname"
                      placeholder="Seu nome"
                      className="pl-10 h-11 bg-white border-gray-300 text-gray-900"
                      value={registerForm.fullname}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-700">Endereço de Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 h-11 bg-white border-gray-300 text-gray-900"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      type={showPassword.register ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 h-11 bg-white border-gray-300 text-gray-900 ${
                        passwordTouched && passwordErrors.length > 0
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('register')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.register ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {passwordTouched && (
                    <div className="space-y-1 mt-2">
                      {passwordErrors.map((error) => (
                        <p key={error} className="text-xs text-red-500 flex items-center gap-1">
                          <span>•</span>
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirmpassword" className="text-gray-700">
                    Confirme sua senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-confirmpassword"
                      type={showPassword.confirm ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 h-11 bg-white border-gray-300 text-gray-900 ${
                        registerForm.confirmpassword.length > 0 && !passwordsMatch
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      value={registerForm.confirmpassword}
                      onChange={handleRegisterChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {registerForm.confirmpassword.length > 0 && !passwordsMatch && (
                    <p className="text-xs text-red-500">As senhas não coincidem</p>
                  )}

                  {passwordsMatch && (
                    <p className="text-xs text-green-500">✓ Senhas coincidem</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading || !isPasswordValid || !passwordsMatch}
                  className="w-full h-11 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Registrar"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Voltar para{" "}
            <Link href="/" className="text-[#5b68eb] hover:underline font-medium">
              homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
