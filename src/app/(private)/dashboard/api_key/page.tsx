"use client"

import { useState } from "react"
import { ApiKeysHeader } from "@/components/api-keys/ApiKeysHeader"
import { ApiKeysTable } from "@/components/api-keys/ApiKeysTable"
import { AddApiKeyButton } from "@/components/api-keys/AddApiKeyButton"
import { ApiKeyModal } from "@/components/api-keys/AddApiKeyModal"
import { useApiKeys } from "@/hooks/useApiKeys"

export default function ApiKeysPage() {
  const { data: apiKeys = [], isLoading: loading, refetch: fetchData } = useApiKeys({ syncStore: true });
  const [isOpen, setIsOpen] = useState(false)

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
          title="Chaves de API"
          description="Gerencie as chaves de integração com o sistema"
        />

        <AddApiKeyButton title="Nova Chave" onClick={() => setIsOpen(true)} />
        <ApiKeyModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          mode="create"
          onSuccess={fetchData}
        />
      </div>

      <div className="space-y-4">
        <ApiKeysTable data={apiKeys} onRefresh={fetchData} />
      </div>
    </div>
  )
}
