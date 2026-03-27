"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useContext, useEffect } from "react"
import { Lock, Mail, User, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react"
import { AuthContext } from "@/contexts/AuthContext"
import { api } from "@/services/apiClients"
import { toast } from "react-toastify"

export function AuthModal({ trigger }: { trigger?: React.ReactNode }) {
    const { signIn } = useContext(AuthContext)
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
        setLoading(true)

        try {
            await signIn({ email: loginForm.email, password: loginForm.password })
            //toast.success("Login realizado com sucesso!")
            // Fechar o modal após login bem-sucedido
            const dialog = document.querySelector('[data-state="open"]')
            if (dialog) {
                const closeButton = dialog.querySelector('button[aria-label="Close"]') as HTMLButtonElement
                closeButton?.click()
            }
        } catch (err) {
            console.error("Erro ao logar:", err)
            toast.error("Erro ao fazer login. Verifique suas credenciais.")
        } finally {
            setLoading(false)
        }
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        // Validate password before submitting
        const errors = validatePassword(registerForm.password)
        if (errors.length > 0) {
            toast.error("Por favor, corrija os erros na senha antes de continuar")
            setLoading(false)
            return
        }

        // Check if passwords match
        if (registerForm.password !== registerForm.confirmpassword) {
            toast.error("As senhas não coincidem")
            setLoading(false)
            return
        }

        try {
            const response = await api.post("/users", {
                fullname: registerForm.fullname,
                email: registerForm.email,
                password: registerForm.password
            })
            toast.success("Conta criada com sucesso! Faça login.")
            setActiveTab("login")
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
        await api.post("/auth/forgot-password", { email: forgotEmail }) // Use forgotEmail aqui
        toast.success("Enviamos um link de recuperação para o seu email.")
        setForgotMode(false)
        setForgotEmail("") // Limpa o campo após sucesso
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

    const resetForms = () => {
        setLoginForm({ email: "", password: "" })
        setRegisterForm({
            fullname: "",
            email: "",
            password: "",
            confirmpassword: ""
        })
        setForgotEmail("")
        setPasswordErrors([])
        setPasswordTouched(false)
        setShowPassword({ login: false, register: false, confirm: false })
        setForgotMode(false)
        setLoading(false)
    }

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm({ ...loginForm, [e.target.id.replace('login-', '')]: e.target.value })
    }


// Função separada para handle do email de recuperação
    const handleForgotEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForgotEmail(e.target.value)
    }

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const id = e.target.id.replace('register-', '')
        setRegisterForm({ ...registerForm, [id]: e.target.value })
        
        // Mark password as touched when user starts typing
        if (id === "password" && !passwordTouched) {
            setPasswordTouched(true)
        }
    }

    const togglePasswordVisibility = (type: 'login' | 'register' | 'confirm') => {
        setShowPassword({ ...showPassword, [type]: !showPassword[type] })
    }

    return (
        <Dialog onOpenChange={(open) => !open && resetForms()}>
            <DialogTrigger asChild>
                {trigger || <Button>Entrar</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-gray-800">
                        Bem-vindo ao Gpayment
                    </DialogTitle>
                </DialogHeader>

                {forgotMode ? (
                    // Modo recuperação de senha
                    <form onSubmit={handleForgotPassword} className="space-y-4 py-4">
                        <div className="flex flex-col items-center space-y-2 mb-6">
                            <div className="p-3 rounded-full bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] bg-opacity-20">
                                <Mail className="h-6 w-6 text-[#5b68eb]" />
                            </div>
                            <h2 className="text-xl font-bold text-center text-gray-800">
                                Recuperar Senha
                            </h2>
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
                                    value={forgotEmail} // Use forgotEmail aqui
                                    onChange={handleForgotEmailChange}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white flex items-center justify-center gap-2 cursor-pointer"
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
                                className="text-sm text-gray-600 hover:text-[#5b68eb] hover:underline cursor-pointer"
                            >
                                Voltar ao login
                            </button>
                        </div>
                    </form>
                ) : (
                    // Modo login/registro com tabs
                    <Tabs 
                        defaultValue="login" 
                        value={activeTab} 
                        onValueChange={setActiveTab} 
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-lg">
                            <TabsTrigger 
                                value="login" 
                                className="data-[state=active]:text-blue-900 data-[state=active]:font-semibold transition-all duration-200 cursor-pointer"
                            >
                                Entrar
                            </TabsTrigger>
                            <TabsTrigger 
                                value="register"
                                className="data-[state=active]:text-blue-900 data-[state=active]:font-semibold transition-all duration-200 cursor-pointer"
                            >
                                Registrar
                            </TabsTrigger>
                        </TabsList>

                        {/* Formulário de Login */}
                        <TabsContent value="login" className="space-y-4 py-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email" className="text-gray-700">Email / Usuário</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="login-email"
                                            placeholder="seu@email.com"
                                            className="pl-10 h-11 bg-white border-gray-300 text-gray-900"
                                            value={loginForm.email}
                                            onChange={handleLoginChange}
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
                                            type={showPassword.login ? "text" : "password"}
                                            className="pl-10 pr-10 h-11 bg-white border-gray-300 text-gray-900"
                                            value={loginForm.password}
                                            onChange={handleLoginChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('login')}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 cursor-pointer"
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
                                            className="text-sm text-[#5b68eb] hover:underline cursor-pointer"
                                            onClick={() => setForgotMode(true)}
                                        >
                                            Esqueci minha senha
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-11 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Processando...
                                        </>
                                    ) : (
                                        "Entrar"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        {/* Formulário de Registro */}
                        <TabsContent value="register" className="space-y-4 py-4">
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
                                            className={`pl-10 pr-10 h-11 bg-white border-gray-300 text-gray-900 ${passwordTouched && passwordErrors.length > 0 ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                            value={registerForm.password}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('register')}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                            {showPassword.register ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
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

                                <div className="space-y-2">
                                    <Label htmlFor="register-confirmpassword" className="text-gray-700">Confirme sua senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="register-confirmpassword"
                                            type={showPassword.confirm ? "text" : "password"}
                                            placeholder="••••••••"
                                            className={`pl-10 pr-10 h-11 bg-white border-gray-300 text-gray-900 ${registerForm.confirmpassword.length > 0 && !passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                            value={registerForm.confirmpassword}
                                            onChange={handleRegisterChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                                        >
                                            {showPassword.confirm ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    {registerForm.confirmpassword.length > 0 && !passwordsMatch && (
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
                                    disabled={loading || !isPasswordValid || !passwordsMatch}
                                    className="w-full h-11 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Criando conta...
                                        </>
                                    ) : (
                                        "Registrar"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}