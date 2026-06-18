import { useState, useMemo } from "react"
import type { Transaction } from "@/types/global"

type SortConfig = {
  key: keyof Transaction
  direction: "asc" | "desc"
} | null

export function useTransactionFilters(transactions: Transaction[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [groupByTenant, setGroupByTenant] = useState(false)
  const itemsPerPage = 10

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!startDate && !endDate) return true
      const txDate = new Date(t.created_at).getTime()
      const start = startDate ? new Date(startDate).getTime() : 0
      const end = endDate ? new Date(endDate).getTime() + 86400000 : Infinity
      return txDate >= start && txDate <= end
    })
  }, [transactions, startDate, endDate])

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (!sortConfig) return 0
      const { key, direction } = sortConfig
      const valA = a[key]
      const valB = b[key]
      if (valA === undefined || valB === undefined || typeof valA === "object" || typeof valB === "object") return 0

      if (key === "created_at") {
        const dateA = new Date(valA as string).getTime()
        const dateB = new Date(valB as string).getTime()
        return direction === "asc" ? dateA - dateB : dateB - dateA
      }
      if (valA < valB) return direction === "asc" ? -1 : 1
      if (valA > valB) return direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredTransactions, sortConfig])

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage)
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const groupedData = useMemo(() => {
    if (!groupByTenant) return null
    return paginatedTransactions.reduce(
      (acc, tx) => {
        const name = tx.tenant?.legal_name || tx.tenant_id || "Desconhecido"
        if (!acc[name]) acc[name] = []
        acc[name].push(tx)
        return acc
      },
      {} as Record<string, Transaction[]>
    )
  }, [paginatedTransactions, groupByTenant])

  const stats = useMemo(() => {
    const total = filteredTransactions.length
    const pendentes = filteredTransactions.filter((t) => t.status?.toLowerCase() === "pending").length
    const concluidas = filteredTransactions.filter((t) => t.status?.toLowerCase() === "success").length
    const falha = filteredTransactions.filter((t) => t.status?.toLowerCase() === "failed").length
    const totalRecebido = filteredTransactions
      .filter((t) => t.status?.toLowerCase() === "success")
      .reduce((acc, t) => acc + Number(t.amount || 0), 0)
    return { total, pendentes, concluidas, falha, totalRecebido }
  }, [filteredTransactions])

  const clearFilters = () => {
    setStartDate("")
    setEndDate("")
    setCurrentPage(1)
  }

  return {
    sortConfig,
    setSortConfig,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    groupByTenant,
    setGroupByTenant,
    itemsPerPage,
    filteredTransactions,
    sortedTransactions,
    paginatedTransactions,
    groupedData,
    totalPages,
    stats,
    clearFilters,
  }
}
