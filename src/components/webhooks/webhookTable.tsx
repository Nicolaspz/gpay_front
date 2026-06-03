'use client'

import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Copy, Edit2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { toast } from "react-toastify"
import { useContext, useMemo, useState } from "react"
import { DeleteAlert } from "../deteleteconfirm"
import { WebhookModal } from "./webhookModal" 
import { deleteWebhooks } from "@/lib/webhook"
import { useAuth } from "@/hooks/useAuth";
import type { Webhook } from "@/types/global"
import { getErrorMessage } from "@/utils/api-error"

interface WebhooksTableProps {
  data: Webhook[]
  onRefresh: () => void
}

export function WebhooksTable({ data, onRefresh }: WebhooksTableProps) {
  const [editing, setEditing] = useState<Webhook | null>(null)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Webhook; direction: "asc" | "desc" } | null>(null)
  const { user } = useAuth()
  const tenantId = user?.tenant_id || user?.tenant?.tenant_id

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Endpoint copiado para a área de transferência!")
  }

  const handleDelete = async (id: string) => {
    try {
      if (!tenantId) {
        return
      } 

      await deleteWebhooks(id, tenantId)
      toast.success("Webhook deletado com sucesso!")
      onRefresh()
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Erro ao deletar webhook"))
    }
  }

  const requestSort = (key: keyof Webhook) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") direction = "desc"
    setSortConfig({ key, direction })
  }

  const sortedData = useMemo(() => {
    if (!sortConfig) return data
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal == null || bVal == null) return 0

      if (sortConfig.key === "secret_key") {
        return sortConfig.direction === "asc"
          ? new Date(aVal as string).getTime() - new Date(bVal as string).getTime()
          : new Date(bVal as string).getTime() - new Date(aVal as string).getTime()
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [data, sortConfig])

  const getSortIcon = (key: keyof Webhook) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 opacity-60" />
    }
    return sortConfig.direction === "asc"
      ? <ArrowUp className="h-4 w-4" />
      : <ArrowDown className="h-4 w-4" />
  }

  const SortableHead = ({ label, column }: { label: string; column: keyof Webhook }) => (
    <TableHead
      onClick={() => requestSort(column)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          requestSort(column)
        }
      }}
      role="button"
      tabIndex={0}
      aria-sort={
        sortConfig?.key === column ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"
      }
      title="Clique para ordenar"
      className="cursor-pointer select-none"
    >
      <div className="flex items-center gap-1">
        {label}
        {getSortIcon(column)}
      </div>
    </TableHead>
  )

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead label="Nome" column="name" />
            <TableHead>Endpoint</TableHead>
            <TableHead>Secret Key</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedData.map((webhook) => (
            <TableRow key={webhook.id}>
              <TableCell className="font-medium">{webhook.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm truncate max-w-[250px]">
                    {webhook.endpoint}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(webhook.endpoint)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm truncate max-w-[150px]">
                    {webhook.secret_key}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(webhook.secret_key)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(webhook)} className="cursor-pointer">
                    <Edit2 className="h-4 w-4 text-blue-600" />
                  </Button>
                  <DeleteAlert onConfirm={() => handleDelete(webhook.id)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editing && (
        <WebhookModal
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          mode="edit"
          initialData={{ 
            id: editing.id, 
            name: editing.name, 
            endpoint: editing.endpoint,
            tenant_id: editing.tenant_id 
          }}
          onSuccess={() => {
            setEditing(null)
            onRefresh()
          }}
        />
      )}
    </Card>
  )
}
