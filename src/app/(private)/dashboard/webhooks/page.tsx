"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { ApiKeysHeader } from "@/components/webhooks/webhookHeader"
import { AddApiKeyButton } from "@/components/api-keys/AddApiKeyButton"
import { getWebhooks} from "@/lib/webhook"
import { WebhookModal } from "@/components/webhooks/webhookModal"
import { WebhooksTable } from "@/components/webhooks/webhookTable"
import { AuthContext } from "@/contexts/AuthContext"


export default function WebhooksPage() {
  const [loading, setLoading] = useState(true)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [sortKey, setSortKey] = useState<"name" | "created_at">("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const tenantId = user?.tenant_id || user?.tenant?.tenant_id
      if (!tenantId) {
        setLoading(false)
        return
      }
      //setLoading(true)
      const data = await getWebhooks(tenantId)
      setApiKeys(data)
    } catch (error) {
      console.error("Erro ao buscar webhooks:", error)
      setApiKeys([]) // evita null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user === null) return
    fetchData()
  }, [user])

  const sortedKeys = useMemo(() => {
    return [...apiKeys].sort((a, b) => {
      let valueA: string | number = a[sortKey]
      let valueB: string | number = b[sortKey]

      if (sortKey === "created_at") {
        valueA = new Date(a.created_at).getTime()
        valueB = new Date(b.created_at).getTime()
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [apiKeys, sortKey, sortOrder])

  const handleSort = (key: "name" | "created_at") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortOrder("asc")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#111827]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">

      <div className="flex justify-between items-start">
        <ApiKeysHeader
          title="WebHooks"
          description="Gerencie os seus andpoints"
        />

        <AddApiKeyButton onClick={() => setIsModalOpen(true)} title="Novo Hook" />

        {/* Modal controlada pela página */}
        <WebhookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="create"
          onSuccess={() => {
            // Recarregar dados ou fazer algo após sucesso
      }}
    />
      </div>

      <div className="space-y-4">
  
    <WebhooksTable data={apiKeys} onRefresh={fetchData} />
 
</div>
    </div>
  )
}
