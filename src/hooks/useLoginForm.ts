"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"
import { api } from "@/services/apiClients"
import type { SignInCredentials, SignUpCredentials } from "@/types/global"
import { useRateLimit, useHoneypot, useBotBehavior } from "@/lib/antibot"

interface LoginFormState {
  email: string
  password: string
}

interface RegisterFormState {
  fullname: string
  email: string
  phone_number: string
  password: string
  confirmpassword: string
}

interface PasswordVisibility {
  login: boolean
  register: boolean
  confirm: boolean
}

const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  minLength: /.{8,}/,
} as const

function validatePassword(password: string): string[] {
  const errors: string[] = []
  if (!PASSWORD_REGEX.uppercase.test(password)) errors.push("A senha deve conter pelo menos uma letra maiúscula")
  if (!PASSWORD_REGEX.lowercase.test(password)) errors.push("A senha deve conter pelo menos uma letra minúscula")
  if (!PASSWORD_REGEX.specialChar.test(password)) errors.push("A senha deve conter pelo menos um caractere especial")
  if (!PASSWORD_REGEX.minLength.test(password)) errors.push("A senha deve ter pelo menos 8 caracteres")
  return errors
}

export function useLoginForm() {
  const router = useRouter()
  const { signIn, signUp, isAuthenticated } = useAuth()

  const [forgotEmail, setForgotEmail] = useState("")
  const [loginForm, setLoginForm] = useState<LoginFormState>({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    fullname: "", email: "", phone_number: "", password: "", confirmpassword: "",
  })
  const [passwordErrors, setPasswordErrors] = useState<string[]>([])
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({ login: false, register: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Antibot
  const { isLocked, lockoutSecondsLeft, registerFailure, registerSuccess } = useRateLimit({ maxAttempts: 5, lockoutMs: 30000 })
  const { honeypotProps, isTriggered } = useHoneypot()

  const loginFieldIds = useMemo(() => ["login-email", "login-password"], [])
  const { registerField: registerBotField } = useBotBehavior({ fieldIds: loginFieldIds })
  const emailField = useMemo(() => registerBotField("login-email"), [registerBotField])
  const passwordField = useMemo(() => registerBotField("login-password"), [registerBotField])

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard")
  }, [isAuthenticated, router])

  // Validate password in real-time
  useEffect(() => {
    if (passwordTouched) setPasswordErrors(validatePassword(registerForm.password))
  }, [registerForm.password, passwordTouched])

  // Reset forms on tab change
  useEffect(() => {
    if (activeTab === "login") {
      setLoginForm({ email: "", password: "" })
    } else {
      setRegisterForm({ fullname: "", email: "", phone_number: "", password: "", confirmpassword: "" })
      setPasswordErrors([])
      setPasswordTouched(false)
    }
  }, [activeTab])

  // --- Handlers ---

  const handleLoginChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({ ...prev, [e.target.id.replace("login-", "")]: e.target.value }))
  }, [])

  const handleRegisterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.id.replace("register-", "")
    setRegisterForm((prev) => ({ ...prev, [id]: e.target.value }))
    if (id === "password") setPasswordTouched(true)
  }, [])

  const handleForgotEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(e.target.value)
  }, [])

  const togglePasswordVisibility = useCallback((type: keyof PasswordVisibility) => {
    setShowPassword((prev) => ({ ...prev, [type]: !prev[type] }))
  }, [])

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (isTriggered) return
    if (isLocked) {
      toast.error(`Muitas tentativas. Aguarde ${lockoutSecondsLeft} segundos.`)
      return
    }
    setLoading(true)
    try {
      const credentials: SignInCredentials = { email: loginForm.email, password: loginForm.password }
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
  }, [loginForm.email, loginForm.password, isTriggered, isLocked, lockoutSecondsLeft, signIn, registerSuccess, registerFailure, router])

  const handleRegister = useCallback(async (e: React.FormEvent) => {
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
        fullname: registerForm.fullname,
        email: registerForm.email,
        phone_number: registerForm.phone_number,
        password: registerForm.password,
        confirmpassword: registerForm.confirmpassword,
      }
      await signUp(credentials)
      toast.success("Conta criada com sucesso! Faça login.")
      setActiveTab("login")
      setRegisterForm({ fullname: "", email: "", phone_number: "", password: "", confirmpassword: "" })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao registrar")
    } finally {
      setLoading(false)
    }
  }, [registerForm, signUp])

  const handleForgotPassword = useCallback(async (e: React.FormEvent) => {
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
  }, [forgotEmail])

  // --- Computed ---

  const isPasswordValid = passwordErrors.length === 0 && registerForm.password.length > 0
  const passwordsMatch = registerForm.password === registerForm.confirmpassword && registerForm.confirmpassword.length > 0

  return {
    // State
    forgotEmail,
    loginForm,
    registerForm,
    passwordErrors,
    passwordTouched,
    showPassword,
    loading,
    forgotMode,
    activeTab,

    // Antibot
    isLocked,
    lockoutSecondsLeft,
    isTriggered,
    honeypotProps,
    emailField,
    passwordField,

    // Computed
    isPasswordValid,
    passwordsMatch,

    // Handlers
    handleLoginChange,
    handleRegisterChange,
    handleForgotEmailChange,
    togglePasswordVisibility,
    handleLogin,
    handleRegister,
    handleForgotPassword,
    setForgotMode,
    setActiveTab,
  }
}
