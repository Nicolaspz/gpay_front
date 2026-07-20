"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useContext, useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth";
import { Loader2, X } from "lucide-react"
import { createWebhooks, updateWebhooks } from "@/lib/webhook"
import { getErrorMessage } from "@/utils/api-error"

interface WebhookModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  initialData?: {
    id: string
    name: string
    endpoint: string
    tenant_id: string
  }
  onSuccess?: () => void
}

interface FormData {
  name: string
  endpoint: string
  tenant_id: string
}

export function WebhookModal({ isOpen, onClose, mode, initialData, onSuccess }: WebhookModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm<FormData>()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id

  // Se estiver no modo edit, preenche os valores
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setValue("name", initialData.name)
      setValue("endpoint", initialData.endpoint)
      setValue("tenant_id", initialData.tenant_id)
    } else {
      reset()
    }
  }, [mode, initialData, reset, setValue])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)

      if (mode === "create") {
        await createWebhooks({
          name: data.name,
          tenant_id: tenantId ?? "",
          endpoint: data.endpoint
        })
        toast.success("Webhook criado com sucesso!")
      } else if (mode === "edit" && initialData) {
        await updateWebhooks(initialData.id, {
          name: data.name,
          endpoint: data.endpoint,
          tenant_id: tenantId,
        })
        toast.success("Webhook atualizado com sucesso!")
      }

      onClose()
      reset()
      onSuccess?.()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao salvar webhook"))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-md rounded-lg shadow-xl bg-[var(--card)] border border-[var(--border)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              {mode === "create" ? "Criar Novo Webhook" : "Editar Webhook"}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-[var(--muted)]"
            >
              <X className="h-4 w-4 text-[var(--muted-foreground)]" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-3">
              <Label 
                htmlFor="name" 
                className="text-[var(--foreground)] font-medium"
              >
                Nome do Webhook*
              </Label>
              <Input
                id="name"
                placeholder="Ex: Webhook de notificações"
                {...register("name", { required: true })}
                disabled={loading}
                className="bg-[var(--card)] border-[var(--border)] 
                         text-[var(--foreground)] 
                         placeholder:text-[var(--muted-foreground)]
                         focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
              />
            </div>

            <div className="space-y-3">
              <Label 
                htmlFor="endpoint" 
                className="text-[var(--foreground)] font-medium"
              >
                Endpoint*
              </Label>
              <Input
                id="endpoint"
                placeholder="Ex: https://example.com/webhook"
                {...register("endpoint", { 
                  required: true,
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Digite uma URL válida (começando com http:// ou https://)"
                  }
                })}
                disabled={loading}
                className="bg-[var(--card)] border-[var(--border)] 
                         text-[var(--foreground)] 
                         placeholder:text-[var(--muted-foreground)]
                         focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)]"
              />
              <p className="text-sm text-[var(--muted-foreground)]">
                URL que receberá as notificações do webhook
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--border)]">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className="border-[var(--border)] 
                         text-[var(--foreground)] 
                         hover:bg-[var(--muted)]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[var(--accent-primary)] hover:opacity-90 
                         text-white flex items-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading
                  ? mode === "create" ? "Criando..." : "Salvando..."
                  : mode === "create" ? "Criar Webhook" : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
