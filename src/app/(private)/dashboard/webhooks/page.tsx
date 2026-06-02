"use client"

import { useMemo, useState } from "react"
import { ApiKeysHeader } from "@/components/webhooks/webhookHeader"
import { AddApiKeyButton } from "@/components/api-keys/AddApiKeyButton"
import { WebhookModal } from "@/components/webhooks/webhookModal"
import { WebhooksTable } from "@/components/webhooks/webhookTable"
import { useWebhooks } from "@/hooks/useWebhooks"

export default function WebhooksPage() {
  const { data: webhooks = [], isLoading: loading, refetch: fetchData } = useWebhooks();
  const [sortKey, setSortKey] = useState<"name" | "created_at">("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sortedKeys = useMemo(() => {
    return [...webhooks].sort((a, b) => {
      let valueA: string | number = a[sortKey] ?? ""
      let valueB: string | number = b[sortKey] ?? ""

      if (sortKey === "created_at") {
        valueA = new Date(a.created_at ?? "").getTime()
        valueB = new Date(b.created_at ?? "").getTime()
      }

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [webhooks, sortKey, sortOrder])

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
        <WebhookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode="create"
          onSuccess={() => {
            fetchData()
          }}
        />
      </div>

      <div className="space-y-4">
        <WebhooksTable data={sortedKeys} onRefresh={fetchData} />

      </div>
    </div>
  )
}
