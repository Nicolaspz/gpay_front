import { Mail, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ForgotPasswordFormProps {
  email: string
  loading: boolean
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onBack: () => void
}

export function ForgotPasswordForm({
  email, loading, onEmailChange, onSubmit, onBack,
}: ForgotPasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col items-center space-y-2 mb-6">
        <div className="p-3 rounded-full bg-gradient-to-r from-[#5b68eb] to-[#28e1fd] bg-opacity-20">
          <Mail className="h-6 w-6 text-[var(--accent-primary)]" />
        </div>
        <h2 className="text-xl font-bold text-center text-[var(--foreground)]">Recuperar Senha</h2>
        <p className="text-sm text-[var(--muted-foreground)] text-center">
          Informe seu email para receber o link de redefinição
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="forgot-email" className="text-[var(--foreground)]">Endereço de Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-[var(--muted-foreground)]" />
          <Input
            id="forgot-email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10 h-11 bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]"
            value={email}
            onChange={onEmailChange}
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
          <><Loader2 className="h-5 w-5 animate-spin" />Enviando...</>
        ) : (
          "Enviar link de recuperação"
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-[var(--muted-foreground)] hover:text-[var(--accent-primary)] hover:underline"
        >
          Voltar ao login
        </button>
      </div>
    </form>
  )
}
