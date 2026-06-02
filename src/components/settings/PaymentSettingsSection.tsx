"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { TenantsService } from "@/services/tenants.service"
import { getErrorMessage } from "@/utils/api-error"

export function PaymentSettingsSection() {
  const [legal_name, setLegal_name] = useState("")
  const [bank_iban, setBank_iban] = useState("AO06")
  const [bank_owner_name, setBank_owner_name] = useState("")
  const [client_reference_count, setClient_reference_count] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClient_reference_count(e.target.value)
  }

  useEffect(() => {
    if (user) {
      setLegal_name(user.tenant?.legal_name || "")
      setBank_iban(user.tenant?.bank_iban || "")
      setBank_owner_name(user.tenant?.bank_owner_name || "")
      setClient_reference_count(user.tenant?.client_reference_count || "")
    }
  }, [user])

  const validateIban = (value: string) => {
    return /^\d+$/.test(value)
  }

  const handleUpdate = async () => {
    if (!bank_iban || bank_iban.trim() === "") {
      toast.error("a entidade é obrigatório.")
      return
    }

    if (!tenantId) {
      toast.error("Tenant não encontrado.")
      return
    }

    setLoading(true)
    try {
      const data = await TenantsService.updatePaymentSettings(tenantId, {
        legal_name,
        bank_iban,
        bank_owner_name,
        client_reference_count,
      })

      toast.success("Configurações atualizadas com sucesso!")
      setLegal_name(data.legal_name)
      setBank_iban(data.bank_iban)
      setBank_owner_name(data.bank_owner_name)
      setClient_reference_count(data.client_reference_count || "")
      
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao atualizar as configurações."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4 sm:p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg sm:text-xl font-semibold">Configurações de Pagamento</h2>
        <p className="text-sm text-gray-600">
          Defina o IBAN padrão para recebimento
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="iban">Entidade bancária</Label>
          <Input
            id="bank_iban"
            value={bank_iban}
            onChange={(e) => setBank_iban(e.target.value.toUpperCase())}
            maxLength={25}
            disabled={loading}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Entidade Bancária so contem números
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="legal_name">Proprietário</Label>
          <Input
            id="legal_name"
            value={legal_name}
            onChange={(e) => setLegal_name(e.target.value.toUpperCase())}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank_owner_name">Nome do Banco</Label>
          <Input
            id="bank_owner_name"
            value={bank_owner_name}
            onChange={(e) => setBank_owner_name(e.target.value.toUpperCase())}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <Label htmlFor="client_reference_count">Quantidade dos valores da referência</Label>
          
          {/* Mostra valor atual ou "Selecione" */}
          <p className="text-sm text-gray-600 mb-2">
            {client_reference_count ? `Valor atual: ${client_reference_count}` : "Nenhum valor selecionado"}
          </p>

          <select
            id="client_reference_count"
            value={client_reference_count}
            onChange={handleChange}
            disabled={loading}
            className="w-full border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          >
            <option value="">Selecione</option>
            <option value="9">9</option>
            <option value="15">15</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 cursor-pointer w-full sm:w-auto"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Aplicar Configurações"
          )}
        </Button>
      </div>
    </Card>
  )
}
