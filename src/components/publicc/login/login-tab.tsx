import { User, Lock, ShieldAlert, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "./password-input"

interface LoginTabProps {
  email: string
  password: string
  showPassword: boolean
  loading: boolean
  isLocked: boolean
  lockoutSecondsLeft: number
  honeypotProps: Record<string, any>
  emailField: { ref: React.Ref<HTMLInputElement>; onKeyDown: any; onMouseDown: any; onFocus: any }
  passwordField: { ref: React.Ref<HTMLInputElement>; onKeyDown: any; onMouseDown: any; onFocus: any }
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onTogglePassword: () => void
  onForgotPassword: () => void
  onSubmit: (e: React.FormEvent) => void
}

export function LoginTab({
  email, password, showPassword, loading, isLocked, lockoutSecondsLeft,
  honeypotProps, emailField, passwordField,
  onEmailChange, onPasswordChange, onTogglePassword, onForgotPassword, onSubmit,
}: LoginTabProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input {...honeypotProps} />

      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-[var(--foreground)]">Email / Usuário</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            id="login-email"
            ref={emailField.ref}
            placeholder="seu@email.com"
            className="pl-10 h-11 bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
            value={email}
            onChange={onEmailChange}
            onKeyDown={emailField.onKeyDown}
            onMouseDown={emailField.onMouseDown}
            onFocus={emailField.onFocus}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-[var(--foreground)]">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <PasswordInput
            id="login-password"
            ref={passwordField.ref}
            visible={showPassword}
            onToggleVisibility={onTogglePassword}
            className="pl-10"
            value={password}
            onChange={onPasswordChange}
            onKeyDown={passwordField.onKeyDown}
            onMouseDown={passwordField.onMouseDown}
            onFocus={passwordField.onFocus}
            required
          />
        </div>
        <div className="flex justify-end pt-2">
          <button type="button" className="text-sm text-[var(--accent-primary)] hover:underline" onClick={onForgotPassword}>
            Esqueci minha senha
          </button>
        </div>
      </div>

      {isLocked && (
        <div className="flex items-center gap-2 text-sm text-[var(--danger)] bg-[var(--danger-subtle)] px-3 py-2 rounded-md">
          <ShieldAlert className="h-4 w-4 flex-shrink-0" />
          <span>Muitas tentativas falhadas. Aguarde <strong>{lockoutSecondsLeft}s</strong></span>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || isLocked}
        className="w-full h-11 bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] hover:opacity-90 text-white flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin" />Processando...</>
        ) : isLocked ? (
          `Aguarde ${lockoutSecondsLeft}s`
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  )
}
