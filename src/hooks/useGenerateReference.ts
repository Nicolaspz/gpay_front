import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { TransactionsService } from "@/services/transactions.service"
import { useApiKeyStore } from "@/store/useApiKeyStore"
import { getErrorMessage } from "@/utils/api-error"

export type NewReferenceData = {
  amount: number
  customer_name: string
  customer_phone: string
  customer_email: string
  description: string
  payment_method: string
  transaction_id: string
}

type ReferenceResult = {
  entity: string
  referenceNumber: string
} | null

export function useGenerateReference(tenantId?: string, userToken?: string) {
  const queryClient = useQueryClient()
  const { getFirstKey } = useApiKeyStore()
  const [referenceResult, setReferenceResult] = useState<ReferenceResult>(null)

  const mutation = useMutation({
    mutationFn: async (data: NewReferenceData) => {
      const apiKey = getFirstKey()
      const payload = {
        amount: data.amount,
        redirect_url: "gpay-dashboard",
        customer: {
          name: data.customer_name,
          phone: data.customer_phone || "000000000",
          email: data.customer_email || "cliente@exemplo.com",
        },
        description: data.description || "Pagamento",
        payment_method: data.payment_method || "reference",
        transaction_type: "payment" as const,
        transaction_id:
          data.transaction_id ||
          Math.random().toString(36).substr(2, 12).toUpperCase(),
      }
      return TransactionsService.generateReference(payload, apiKey, userToken)
    },
    onSuccess: (data) => {
      const ref = data.data?.responseStatus?.reference
      if (ref?.entity && ref?.referenceNumber) {
        setReferenceResult({
          entity: ref.entity,
          referenceNumber: ref.referenceNumber,
        })
      } else {
        toast.error("Erro: Dados de referência não encontrados")
      }
      queryClient.invalidateQueries({ queryKey: ["transactions", tenantId] })
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Erro ao gerar referência"))
    },
  })

  const validate = (data: NewReferenceData): string | null => {
    if (!tenantId) return "Usuário não autenticado"
    if (data.amount <= 0) return "Insira um montante válido"
    if (!data.customer_name.trim()) return "Insira o nome do cliente"
    return null
  }

  const generate = (data: NewReferenceData) => {
    const error = validate(data)
    if (error) {
      toast.error(error)
      return
    }
    mutation.mutate(data)
  }

  return {
    generate,
    referenceResult,
    setReferenceResult,
    isPending: mutation.isPending,
  }
}
