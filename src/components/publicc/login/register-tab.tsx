import { User, Mail, Phone, Lock, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "./password-input"

interface RegisterTabProps {
  fullname: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  showPassword: boolean
  showConfirm: boolean
  passwordErrors: string[]
  passwordTouched: boolean
  isPasswordValid: boolean
  passwordsMatch: boolean
  loading: boolean
  onFullnameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onConfirmChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTogglePassword: () => void
  onToggleConfirm: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterTab({
  fullname, email, phone, password, confirmPassword,
  showPassword, showConfirm,
  passwordErrors, passwordTouched, isPasswordValid, passwordsMatch,
  loading,
  onFullnameChange, onEmailChange, onPhoneChange, onPasswordChange, onConfirmChange,
  onTogglePassword, onToggleConfirm, onSubmit,
}: RegisterTabProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-fullname" className="text-[var(--foreground)]">Nome Completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            id="register-fullname"
            placeholder="Seu nome"
            className="pl-10 h-11 bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
            value={fullname}
            onChange={onFullnameChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email" className="text-[var(--foreground)]">Endereço de Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            id="register-email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10 h-11 bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
            value={email}
            onChange={onEmailChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-phone_number" className="text-[var(--foreground)]">Número de Telefone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            id="register-phone_number"
            type="tel"
            placeholder="+244 900 000 000"
            className="pl-10 h-11 bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
            value={phone}
            onChange={onPhoneChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password" className="text-[var(--foreground)]">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <PasswordInput
            id="register-password"
            visible={showPassword}
            onToggleVisibility={onTogglePassword}
            placeholder="••••••••"
            className={`pl-10 ${passwordTouched && passwordErrors.length > 0 ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            value={password}
            onChange={onPasswordChange}
            required
          />
        </div>

        {passwordTouched && (
          <div className="space-y-1 mt-2">
            {passwordErrors.map((error) => (
              <p key={error} className="text-xs text-red-500 flex items-center gap-1">
                <span>•</span>{error}
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirmpassword" className="text-[var(--foreground)]">Confirme sua senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <PasswordInput
            id="register-confirmpassword"
            visible={showConfirm}
            onToggleVisibility={onToggleConfirm}
            placeholder="••••••••"
            className={`pl-10 ${confirmPassword.length > 0 && !passwordsMatch ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            value={confirmPassword}
            onChange={onConfirmChange}
            required
          />
        </div>

        {confirmPassword.length > 0 && !passwordsMatch && (
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
          <><Loader2 className="h-5 w-5 animate-spin" />Registrando...</>
        ) : (
          "Registrar"
        )}
      </Button>
    </form>
  )
}
