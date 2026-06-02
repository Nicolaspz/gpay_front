"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { updateWebhooks } from "@/lib/webhook"
import { toast } from "react-toastify"
import { useContext, useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { getErrorMessage } from "@/utils/api-error"
import { AuthContext } from "@/contexts/AuthContext"

interface EditApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey?: { id: string; name: string; endpoint?: string; tenant_id?: string }
  onUpdated: () => void
}

interface FormData {
  name: string
  endpoint: string
}

export function EditApiKeyModal({ isOpen, onClose, apiKey, onUpdated }: EditApiKeyModalProps) {
  const { register, handleSubmit, reset } = useForm<FormData>()
  const [loading, setLoading] = useState(false)
  const { user } = useContext(AuthContext)
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id || apiKey?.tenant_id

  useEffect(() => {
    if (apiKey) {
      reset({
        name: apiKey.name,
        endpoint: apiKey.endpoint ?? "",
      })
    }
  }, [apiKey, reset])

  const onSubmit = async (data: FormData) => {
    if (!apiKey) return
    try {
      setLoading(true)
      await updateWebhooks(apiKey.id, {
        name: data.name,
        endpoint: data.endpoint,
        tenant_id: tenantId,
      })
      toast.success("Webhook atualizado com sucesso!")
      onUpdated()
      onClose()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao atualizar webhook"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Chave de API</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Chave *</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endpoint">Endpoint *</Label>
            <Input
              id="endpoint"
              {...register("endpoint", { required: true })}
              disabled={loading}
            />
          </div>
         <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2" 
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
