"use client"

import { useContext, useEffect, useMemo, useState } from "react"
import { ApiKeysHeader } from "@/components/api-keys/ApiKeysHeader"
import { ApiKeysTable } from "@/components/api-keys/ApiKeysTable"
import { AddApiKeyButton } from "@/components/api-keys/AddApiKeyButton"
import { getApiKeys } from "@/lib/api-keys"
import { ApiKeyModal } from "@/components/api-keys/AddApiKeyModal"
import { AuthContext } from "@/contexts/AuthContext"



export default function ApiKeysPage() {
  const [loading, setLoading] = useState(true)
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [sortKey, setSortKey] = useState<"name" | "created_at">("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const { user } = useContext(AuthContext);
  
  

  const fetchData = async () => {
    try {
      const tenantId = user?.tenant_id || user?.tenant?.tenant_id
      if (!tenantId) {
        setLoading(false)
        return
      }

      //setLoading(true)
      const data = await getApiKeys(tenantId)
      setApiKeys(data)
      setLoading(false)
    } catch (error) {
      console.error("Erro ao buscar chaves:", error)
      setApiKeys([]) // evita null
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
          title="Chaves de API"
          description="Gerencie as chaves de integração com o sistema"
        />
        
         <AddApiKeyButton title="Nova Chave" onClick={() => setIsOpen(true)} />

{/* Modal controlada pela página */}
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
